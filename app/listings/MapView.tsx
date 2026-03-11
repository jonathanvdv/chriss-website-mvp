'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { ListingMap, type MapBounds } from '@/components/listings/ListingMap'
import { MapPinCard } from '@/components/listings/MapPinCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { MapPin } from '@/lib/listings'

interface MapViewProps {
    filterParams: Record<string, string>
    totalCount: number
}

const PER_PAGE = 20

export function MapView({ filterParams, totalCount }: MapViewProps) {
    const [pins, setPins] = useState<MapPin[] | null>(null)
    const [bounds, setBounds] = useState<MapBounds | null>(null)
    const [page, setPage] = useState(0)
    const [isDesktop, setIsDesktop] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)
    const abortRef = useRef<AbortController | null>(null)
    const prevFilterKey = useRef(JSON.stringify(filterParams))

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
        for (const key of ['tt', 'lp', 'hp', 'bd', 'ba', 'pt', 'q', 'agent_key', 'office_key']) {
            if (filterParams[key]) params.set(key, filterParams[key])
        }

        const currentKey = JSON.stringify(filterParams)
        const filtersChanged = prevFilterKey.current !== currentKey
        prevFilterKey.current = currentKey
        if (filtersChanged && pins !== null) setIsSearching(true)

        fetch(`/api/listings?${params.toString()}`, {
            signal: controller.signal,
            priority: 'low' as any,
        })
            .then(r => r.json())
            .then(data => {
                if (!controller.signal.aborted) {
                    setPins(data.pins || [])
                    setIsSearching(false)
                }
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    console.error('Failed to fetch listings:', err)
                    setPins([])
                    setIsSearching(false)
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
        for (const key of ['tt', 'lp', 'hp', 'bd', 'ba', 'pt', 'q', 'agent_key', 'office_key']) {
            if (filterParams[key]) params.set(key, filterParams[key])
        }

        if (pins !== null) setIsSearching(true)
        fetch(`/api/listings?${params.toString()}`, { priority: 'low' as any })
            .then(r => r.json())
            .then(data => { setPins(data.pins || []); setIsSearching(false) })
            .catch(() => { setPins([]); setIsSearching(false) })
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

    // Pins are already filtered by search query server-side in /api/listings
    const filteredPins = pins

    // Sort pins client-side
    const sortedPins = useMemo(() => {
        if (!filteredPins) return []
        const sorted = [...filteredPins]
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
    }, [filteredPins, filterParams.sortField, filterParams.sortDirection])

    const totalPages = Math.max(1, Math.ceil(sortedPins.length / PER_PAGE))
    const sidebarPins = useMemo(
        () => sortedPins.slice(page * PER_PAGE, (page + 1) * PER_PAGE),
        [sortedPins, page]
    )

    // Scroll sidebar to top on page change
    useEffect(() => {
        sidebarRef.current?.scrollTo({ top: 0 })
    }, [page])

    const loading = filteredPins === null
    const showLoading = loading || isSearching

    return (
        <div className="flex h-[calc(100vh-180px)] min-h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            {/* Sidebar */}
            <div className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 flex flex-col bg-white border-r border-gray-200">
                <div className="px-3 py-2 border-b border-gray-200 flex-shrink-0">
                    <p className="text-sm text-gray-600">
                        {showLoading ? (
                            <span className="text-gray-400">Searching...</span>
                        ) : (
                            <>
                                Results: <strong className="text-gray-900">{sortedPins.length.toLocaleString()} Listings</strong>
                            </>
                        )}
                    </p>
                </div>

                <div ref={sidebarRef} className="flex-1 overflow-y-auto relative">
                    {showLoading ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 gap-5 pt-8">
                            {/* Animated house with scanning effect */}
                            <div className="relative w-24 h-24 flex-shrink-0">
                                {/* Pulsing background circle */}
                                <div className="absolute inset-0 rounded-full bg-brand-accent/5 animate-ping" style={{ animationDuration: '2s' }} />
                                <div className="absolute inset-2 rounded-full bg-brand-accent/10 animate-pulse" />
                                {/* House icon */}
                                <svg viewBox="0 0 64 64" className="relative w-full h-full text-brand-accent/30" fill="currentColor">
                                    <path d="M32 6L4 30h8v24h16V40h8v14h16V30h8L32 6z" />
                                </svg>
                                {/* Animated magnifying glass orbiting */}
                                <div className="absolute bottom-0 right-0" style={{ animation: 'bounce 1s ease-in-out infinite' }}>
                                    <svg viewBox="0 0 24 24" className="w-9 h-9 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="10" cy="10" r="7" className="text-brand-accent" />
                                        <line x1="15" y1="15" x2="21" y2="21" className="text-brand-accent" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-center space-y-3">
                                <p className="text-base font-semibold text-gray-800">Finding your perfect home</p>
                                <p className="text-xs text-gray-400">Searching thousands of MLS® listings...</p>
                                {/* Animated progress bar */}
                                <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden mx-auto">
                                    <div className="h-full bg-brand-accent rounded-full" style={{ animation: 'shimmer 1.5s ease-in-out infinite', width: '40%' }} />
                                </div>
                            </div>
                            {/* Skeleton preview cards */}
                            <div className="w-full space-y-2 mt-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-gray-50 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
                                        <div className="w-20 h-14 bg-gray-200 rounded flex-shrink-0" />
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-3 bg-gray-200 rounded w-20" />
                                            <div className="h-2.5 bg-gray-200 rounded w-32" />
                                            <div className="h-2 bg-gray-200 rounded w-24" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <style jsx>{`
                                @keyframes shimmer {
                                    0% { transform: translateX(-100%); }
                                    100% { transform: translateX(350%); }
                                }
                            `}</style>
                        </div>
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
                        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                                <div className="absolute inset-0 rounded-full border-4 border-brand-accent border-t-transparent animate-spin" />
                            </div>
                            <p className="text-sm text-gray-400 font-medium">Loading map...</p>
                        </div>
                    ) : (
                        <ListingMap pins={sortedPins} onBoundsChange={handleBoundsChange} />
                    )}
                </div>
            )}
        </div>
    )
}
