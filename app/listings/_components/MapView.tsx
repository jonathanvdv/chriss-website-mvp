'use client'

import { useState, useCallback, useEffect, useRef, useMemo, useSyncExternalStore } from 'react'
import { ListingMap, type MapBounds } from './ListingMap'
import { MapPinCard } from './MapPinCard'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { MapPin } from '@/lib/listings'
import { filterPins } from '@/lib/filter-pins'
import { SERVICE_AREA_BBOX_STRING } from '@/lib/constants'

interface MapViewProps {
    filterParams: Record<string, string>
}

const PER_PAGE = 20

function appendFilterParams(params: URLSearchParams, filterParams: Record<string, string>): void {
    if (filterParams.tt) params.set('tt', filterParams.tt)
    if (filterParams.lp) params.set('lp', filterParams.lp)
    if (filterParams.hp) params.set('hp', filterParams.hp)
    if (filterParams.bd) params.set('bd', filterParams.bd)
    if (filterParams.ba) params.set('ba', filterParams.ba)
    if (filterParams.pt) params.set('pt', filterParams.pt)
    if (filterParams.agent_key) params.set('agent_key', filterParams.agent_key)
    if (filterParams.office_key) params.set('office_key', filterParams.office_key)
}

const DESKTOP_QUERY = '(min-width: 1024px)'

function subscribeDesktop(callback: () => void) {
    const mq = window.matchMedia(DESKTOP_QUERY)
    mq.addEventListener('change', callback)
    return () => mq.removeEventListener('change', callback)
}

function getDesktopSnapshot() {
    return window.matchMedia(DESKTOP_QUERY).matches
}

function getDesktopServerSnapshot() {
    return false
}

function bboxString(b: MapBounds): string {
    const r = (n: number) => n.toFixed(4)
    return `${r(b.west)},${r(b.south)},${r(b.east)},${r(b.north)}`
}

export function MapView({ filterParams }: MapViewProps) {
    const [pins, setPins] = useState<MapPin[] | null>(null)
    const [page, setPage] = useState(0)
    const [showSearchButton, setShowSearchButton] = useState(false)
    const [fetching, setFetching] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)
    const abortRef = useRef<AbortController | null>(null)
    const fetchedBboxRef = useRef<string>('')
    const currentBoundsRef = useRef<MapBounds | null>(null)
    const initialFetchDone = useRef(false)

    // Stabilize filterParams reference to prevent unnecessary re-fetches
    const filterKey = useMemo(() => JSON.stringify(filterParams), [filterParams])
    const stableFilterParams = useMemo(() => filterParams, [filterKey]) // eslint-disable-line react-hooks/exhaustive-deps

    // Detect desktop (lg breakpoint = 1024px)
    const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getDesktopServerSnapshot)

    // Reset page when filters change (React-approved "set state during render" pattern)
    const [prevFilterKey, setPrevFilterKey] = useState(filterKey)
    if (filterKey !== prevFilterKey) {
        setPrevFilterKey(filterKey)
        setPage(0)
    }

    // Fetch pins for a given bbox
    const fetchPins = useCallback(
        (bbox: string) => {
            abortRef.current?.abort()
            const controller = new AbortController()
            abortRef.current = controller

            const params = new URLSearchParams({ bbox })
            appendFilterParams(params, stableFilterParams)

            setFetching(true)
            fetch(`/api/listings?${params.toString()}`, { signal: controller.signal })
                .then((r) => {
                    if (!r.ok) throw new Error(`API error: ${r.status}`)
                    return r.json()
                })
                .then((data) => {
                    if (!controller.signal.aborted) {
                        setPins(data.pins || [])
                        fetchedBboxRef.current = bbox
                        setShowSearchButton(false)
                        setPage(0)
                        setFetching(false)
                    }
                })
                .catch((err) => {
                    if (err.name !== 'AbortError') {
                        console.error('Failed to fetch listings:', err)
                        setPins([])
                        setFetching(false)
                    }
                })

            return () => controller.abort()
        },
        [stableFilterParams]
    )

    // Re-fetch when filters change
    useEffect(() => {
        if (!currentBoundsRef.current) return
        const bbox = bboxString(currentBoundsRef.current)
        fetchPins(bbox)
    }, [stableFilterParams, fetchPins])

    // Track bounds changes — initial load auto-fetches, subsequent moves show button
    const handleBoundsChange = useCallback(
        (b: MapBounds) => {
            currentBoundsRef.current = b
            const bbox = bboxString(b)

            if (!initialFetchDone.current) {
                initialFetchDone.current = true
                fetchPins(bbox)
                return
            }

            if (bbox !== fetchedBboxRef.current) {
                setShowSearchButton(true)
            }
        },
        [fetchPins]
    )

    const handleSearchThisArea = useCallback(() => {
        if (!currentBoundsRef.current) return
        fetchPins(bboxString(currentBoundsRef.current))
    }, [fetchPins])

    // For mobile (no map), fetch without bbox on mount
    useEffect(() => {
        if (isDesktop) return

        const params = new URLSearchParams()
        params.set('bbox', SERVICE_AREA_BBOX_STRING)
        appendFilterParams(params, stableFilterParams)

        fetch(`/api/listings?${params.toString()}`)
            .then((r) => {
                if (!r.ok) throw new Error(`API error: ${r.status}`)
                return r.json()
            })
            .then((data) => setPins(data.pins || []))
            .catch(() => setPins([]))
    }, [isDesktop, stableFilterParams])

    // Sort and re-apply filters client-side
    const sortedPins = useMemo(() => {
        if (!pins) return []
        return filterPins(pins, stableFilterParams)
    }, [pins, stableFilterParams])

    const totalPages = Math.max(1, Math.ceil(sortedPins.length / PER_PAGE))
    const sidebarPins = useMemo(() => sortedPins.slice(page * PER_PAGE, (page + 1) * PER_PAGE), [sortedPins, page])

    // Scroll sidebar to top on page change
    useEffect(() => {
        sidebarRef.current?.scrollTo({ top: 0 })
    }, [page])

    const loading = pins === null

    return (
        <div className="flex h-[calc(100vh-180px)] min-h-[500px]">
            {/* Sidebar */}
            <div className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 flex flex-col bg-white border-r border-gray-200">
                <div className="px-3 py-2 border-b border-gray-200 flex-shrink-0">
                    <p className="text-sm text-gray-600">
                        {loading ? (
                            <span className="text-gray-400">Loading...</span>
                        ) : (
                            <>
                                Results:{' '}
                                <strong className="text-gray-900">{sortedPins.length.toLocaleString()} Listings</strong>
                            </>
                        )}
                    </p>
                </div>

                <div ref={sidebarRef} className="flex-1 overflow-y-auto">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex gap-3 p-3 border-b border-gray-200 animate-pulse">
                                <div className="w-[140px] h-[100px] bg-gray-200 rounded flex-shrink-0" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : sidebarPins.length > 0 ? (
                        sidebarPins.map((pin) => <MapPinCard key={pin.id} pin={pin} />)
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4 text-center">
                            No listings in the current map area. Try zooming out or panning.
                        </div>
                    )}
                </div>

                {!loading && sortedPins.length > PER_PAGE && (
                    <div className="flex items-center justify-center gap-3 px-3 py-2.5 border-t border-gray-200 flex-shrink-0 bg-white">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-accent text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-gray-600">
                            {page + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-accent text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Map — only mounted on desktop */}
            {isDesktop && (
                <div className="flex-1 relative">
                    <ListingMap pins={sortedPins} onBoundsChange={handleBoundsChange} />

                    {showSearchButton && (
                        <button
                            onClick={handleSearchThisArea}
                            disabled={fetching}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white border border-gray-300 shadow-lg rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-60"
                        >
                            <Search className="w-4 h-4" />
                            {fetching ? 'Searching...' : 'Search this area'}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
