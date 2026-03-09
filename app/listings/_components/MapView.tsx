'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { ListingMap, type MapBounds } from './ListingMap'
import { MapPinCard } from './MapPinCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { MapPin } from '@/lib/listings'

interface MapViewProps {
    filterParams: Record<string, string>
}

const PER_PAGE = 20

export function MapView({ filterParams }: MapViewProps) {
    const [pins, setPins] = useState<MapPin[] | null>(null)
    const [bounds, setBounds] = useState<MapBounds | null>(null)
    const [page, setPage] = useState(0)
    const [isDesktop, setIsDesktop] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)
    const abortRef = useRef<AbortController | null>(null)

    // Detect desktop (lg breakpoint = 1024px)
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')
        setIsDesktop(mq.matches)
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    // Fetch pins from API when bounds or filters change (bbox query)
    useEffect(() => {
        if (!bounds) return

        // Cancel previous in-flight request
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        const bbox = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`
        const params = new URLSearchParams({ bbox })

        // Forward filter params to API
        if (filterParams.tt) params.set('tt', filterParams.tt)
        if (filterParams.lp) params.set('lp', filterParams.lp)
        if (filterParams.hp) params.set('hp', filterParams.hp)
        if (filterParams.bd) params.set('bd', filterParams.bd)
        if (filterParams.ba) params.set('ba', filterParams.ba)
        if (filterParams.pt) params.set('pt', filterParams.pt)

        // Multi-tenant: pass agent_key or office_key if configured
        if (filterParams.agent_key) params.set('agent_key', filterParams.agent_key)
        if (filterParams.office_key) params.set('office_key', filterParams.office_key)

        fetch(`/api/listings?${params.toString()}`, {
            signal: controller.signal,
            priority: 'low' as any,
        })
            .then(r => r.json())
            .then(data => {
                if (!controller.signal.aborted) {
                    setPins(data.pins || [])
                }
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    console.error('Failed to fetch listings:', err)
                    setPins([])
                }
            })

        return () => controller.abort()
    }, [bounds, filterParams])

    // For mobile (no map), fetch without bbox on mount
    useEffect(() => {
        if (isDesktop) return // Desktop uses bbox-based fetch above

        const params = new URLSearchParams()
        // Use a large default bbox covering the service area
        params.set('bbox', '-81.0,43.0,-79.5,44.0')
        if (filterParams.tt) params.set('tt', filterParams.tt)
        if (filterParams.lp) params.set('lp', filterParams.lp)
        if (filterParams.hp) params.set('hp', filterParams.hp)
        if (filterParams.bd) params.set('bd', filterParams.bd)
        if (filterParams.ba) params.set('ba', filterParams.ba)
        if (filterParams.pt) params.set('pt', filterParams.pt)
        if (filterParams.agent_key) params.set('agent_key', filterParams.agent_key)
        if (filterParams.office_key) params.set('office_key', filterParams.office_key)

        fetch(`/api/listings?${params.toString()}`, { priority: 'low' as any })
            .then(r => r.json())
            .then(data => setPins(data.pins || []))
            .catch(() => setPins([]))
    }, [isDesktop, filterParams])

    // Reset page when filters change
    useEffect(() => { setPage(0) }, [filterParams])

    // Debounced bounds change
    const boundsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const handleBoundsChange = useCallback((b: MapBounds) => {
        if (boundsTimerRef.current) clearTimeout(boundsTimerRef.current)
        boundsTimerRef.current = setTimeout(() => {
            setBounds(b)
            setPage(0)
        }, 300)
    }, [])

    // Sort pins client-side
    const sortedPins = useMemo(() => {
        if (!pins) return []
        const sorted = [...pins]
        const sortField = filterParams.sortField
        const sortDir = filterParams.sortDirection || 'desc'
        if (sortField === 'listingPrice') {
            sorted.sort((a, b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price)
        } else {
            sorted.sort((a, b) => {
                const da = a.listDate ? new Date(a.listDate).getTime() : 0
                const db = b.listDate ? new Date(b.listDate).getTime() : 0
                return sortDir === 'asc' ? da - db : db - da
            })
        }
        return sorted
    }, [pins, filterParams.sortField, filterParams.sortDirection])

    const totalPages = Math.max(1, Math.ceil(sortedPins.length / PER_PAGE))
    const sidebarPins = useMemo(
        () => sortedPins.slice(page * PER_PAGE, (page + 1) * PER_PAGE),
        [sortedPins, page]
    )

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
                                Results: <strong className="text-gray-900">{sortedPins.length.toLocaleString()} Listings</strong>
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
                        sidebarPins.map(pin => (
                            <MapPinCard key={pin.id} pin={pin} />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4 text-center">
                            No listings in the current map area. Try zooming out or panning.
                        </div>
                    )}
                </div>

                {!loading && sortedPins.length > PER_PAGE && (
                    <div className="flex items-center justify-center gap-3 px-3 py-2.5 border-t border-gray-200 flex-shrink-0 bg-white">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-accent text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-gray-600">
                            {page + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
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
                <div className="flex-1">
                    {loading ? (
                        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 text-sm">
                            Loading map...
                        </div>
                    ) : (
                        <ListingMap pins={sortedPins} onBoundsChange={handleBoundsChange} />
                    )}
                </div>
            )}
        </div>
    )
}
