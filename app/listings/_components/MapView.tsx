'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { ListingMap, type MapBounds } from './ListingMap'
import { MapPinCard } from './MapPinCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { MapPin } from '@/lib/listings'

interface MapViewProps {
    filterParams: Record<string, string>
    totalCount: number
}

const PER_PAGE = 20

// Client-side filter: apply transaction type, price, beds, baths, property type
function filterPins(pins: MapPin[], params: Record<string, string>): MapPin[] {
    let result = pins

    const tt = params.tt
    if (tt === 'sale') result = result.filter(p => !p.isRental)
    else if (tt === 'rent') result = result.filter(p => p.isRental)

    const lp = params.lp ? Number(params.lp) : 0
    const hp = params.hp ? Number(params.hp) : 0
    if (lp) result = result.filter(p => p.price >= lp)
    if (hp) result = result.filter(p => p.price <= hp)

    const bd = params.bd ? Number(params.bd) : 0
    if (bd) result = result.filter(p => p.beds >= bd)

    const ba = params.ba ? Number(params.ba) : 0
    if (ba) result = result.filter(p => p.baths >= ba)

    const pt = params.pt
    if (pt) result = result.filter(p => p.propertyType === pt)

    // Sort
    const sortField = params.sortField
    const sortDir = params.sortDirection || 'desc'
    if (sortField === 'listingPrice') {
        result = [...result].sort((a, b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price)
    } else {
        // Default: newest first (by listDate)
        result = [...result].sort((a, b) => {
            const da = a.listDate ? new Date(a.listDate).getTime() : 0
            const db = b.listDate ? new Date(b.listDate).getTime() : 0
            return sortDir === 'asc' ? da - db : db - da
        })
    }

    return result
}

export function MapView({ filterParams, totalCount }: MapViewProps) {
    const [allPins, setAllPins] = useState<MapPin[] | null>(null)
    const [bounds, setBounds] = useState<MapBounds | null>(null)
    const [page, setPage] = useState(0)
    const [isDesktop, setIsDesktop] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)

    // Detect desktop (lg breakpoint = 1024px)
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')
        setIsDesktop(mq.matches)
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    // Fetch ALL pins once on mount (no filters) — subsequent filter changes are instant
    useEffect(() => {
        let cancelled = false
        setAllPins(null)

        fetch('/api/listings/map-pins', { priority: 'low' as any })
            .then(r => r.json())
            .then(data => {
                if (!cancelled) setAllPins(data.pins)
            })
            .catch(() => {
                if (!cancelled) setAllPins([])
            })

        return () => { cancelled = true }
    }, []) // fetch once on mount

    // Apply filters client-side — instant, no network call
    const filteredPins = useMemo(() => {
        if (!allPins) return null
        return filterPins(allPins, filterParams)
    }, [allPins, filterParams])

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

    // Filter pins to visible bounds client-side
    // On mobile (no map), skip bounds filtering and show all filtered pins
    const visiblePins = useMemo(() => {
        if (!filteredPins) return []
        if (!isDesktop || !bounds) return filteredPins
        return filteredPins.filter(p =>
            p.lat >= bounds.south && p.lat <= bounds.north &&
            p.lng >= bounds.west && p.lng <= bounds.east
        )
    }, [filteredPins, bounds, isDesktop])

    const totalPages = Math.max(1, Math.ceil(visiblePins.length / PER_PAGE))
    const sidebarPins = useMemo(
        () => visiblePins.slice(page * PER_PAGE, (page + 1) * PER_PAGE),
        [visiblePins, page]
    )

    // Scroll sidebar to top on page change
    useEffect(() => {
        sidebarRef.current?.scrollTo({ top: 0 })
    }, [page])

    const loading = allPins === null

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
                                Results: <strong className="text-gray-900">{visiblePins.length.toLocaleString()} Listings</strong>
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

                {!loading && visiblePins.length > PER_PAGE && (
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

            {/* Map — only mounted on desktop to avoid Mapbox loading on mobile */}
            {isDesktop && (
                <div className="flex-1">
                    {loading ? (
                        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 text-sm">
                            Loading map...
                        </div>
                    ) : (
                        <ListingMap pins={filteredPins || []} onBoundsChange={handleBoundsChange} />
                    )}
                </div>
            )}
        </div>
    )
}
