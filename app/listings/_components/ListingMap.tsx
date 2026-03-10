'use client'

import React, { useState, useCallback, useMemo, useRef } from 'react'
import Map, { Popup, NavigationControl, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { MapPin } from '@/lib/listings'
import Link from 'next/link'
import type { MapRef } from 'react-map-gl/maplibre'
import { Bed, Bath, Maximize, ChevronLeft, ChevronRight } from 'lucide-react'
import Supercluster from 'supercluster'

const DEFAULT_CENTER = { latitude: 43.45, longitude: -80.49 }
const DEFAULT_ZOOM = 10
const ACCENT = '#1B4332'

// Clean, professional map style using free Carto tiles
const MAP_STYLE = {
    version: 8 as const,
    sources: {
        carto: {
            type: 'raster' as const,
            tiles: [
                'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        },
    },
    layers: [
        {
            id: 'carto-tiles',
            type: 'raster' as const,
            source: 'carto',
            minzoom: 0,
            maxzoom: 20,
        },
    ],
}

export interface MapBounds {
    north: number
    south: number
    east: number
    west: number
}

interface ListingMapProps {
    pins: MapPin[]
    onBoundsChange?: (bounds: MapBounds) => void
}

interface ClusterOverlayData {
    screenX: number
    screenY: number
    leaves: MapPin[]
    totalCount: number
}

const LEAVES_PER_PAGE = 10
const MAX_LEAVES = 200
const OVERLAY_W = 370

function formatPrice(price: number): string {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
    return `$${price.toLocaleString()}`
}

function formatPriceFull(price: number): string {
    return `$${price.toLocaleString()}`
}

function formatDaysAgo(listDate: string): string {
    if (!listDate) return ''
    const days = Math.floor((Date.now() - new Date(listDate).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
}

// ─── Cluster Overlay Content ────────────────────────────────────────────

function ClusterOverlay({
    data,
    onClose,
    onMouseEnter,
    onMouseLeave,
}: {
    data: ClusterOverlayData
    onClose: () => void
    onMouseEnter: () => void
    onMouseLeave: () => void
}) {
    const [page, setPage] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const totalPages = Math.ceil(data.leaves.length / LEAVES_PER_PAGE)
    const pageListings = data.leaves.slice(page * LEAVES_PER_PAGE, (page + 1) * LEAVES_PER_PAGE)

    const parentEl = containerRef.current?.parentElement
    const mapW = parentEl?.clientWidth || 1000
    const mapH = parentEl?.clientHeight || 600

    const style: React.CSSProperties = { position: 'absolute', width: OVERLAY_W, zIndex: 50 }
    const pinX = data.screenX
    const pinY = data.screenY
    const GAP = 12

    if (pinX > mapW / 2) {
        style.right = mapW - pinX + GAP
    } else {
        style.left = pinX + GAP
    }

    if (pinY > mapH / 2) {
        style.bottom = mapH - pinY + GAP
    } else {
        style.top = pinY + GAP
    }

    return (
        <div
            ref={containerRef}
            style={style}
            className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                <span className="text-sm font-semibold text-gray-900">
                    {data.totalCount.toLocaleString()} Listings
                </span>
            </div>

            <div className="max-h-[260px] overflow-y-auto">
                {pageListings.map((pin) => (
                    <Link
                        key={pin.id}
                        href={`/listings/${pin.id}`}
                        className="flex gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-[120px] h-[80px] flex-shrink-0 rounded overflow-hidden bg-gray-100">
                            {pin.photo ? (
                                <img src={pin.photo} alt={pin.address} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No photo</div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-brand-accent">{formatPriceFull(pin.price)}</p>
                            <p className="text-xs text-gray-600 mt-0.5 leading-snug truncate">{pin.address}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1.5">
                                <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {pin.beds}</span>
                                <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {pin.baths}</span>
                                {pin.sqft && <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {pin.sqft.toLocaleString()} sqft</span>}
                            </div>
                            {pin.listDate && (
                                <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                    {formatDaysAgo(pin.listDate)}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 px-3 py-2 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={(e) => { e.stopPropagation(); setPage(p => Math.max(0, p - 1)) }}
                        disabled={page === 0}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-accent text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-accent/90 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-medium text-gray-600">{page + 1} of {totalPages}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); setPage(p => Math.min(totalPages - 1, p + 1)) }}
                        disabled={page === totalPages - 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-accent text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-accent/90 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}

// ─── Pin Marker Component ───────────────────────────────────────────────

function PinMarker({ pin, onClick }: { pin: MapPin; onClick: (pin: MapPin) => void }) {
    return (
        <Marker
            latitude={pin.lat}
            longitude={pin.lng}
            anchor="bottom"
            onClick={(e) => { e.originalEvent.stopPropagation(); onClick(pin) }}
        >
            <div className="flex flex-col items-center cursor-pointer group">
                <div className="bg-brand-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap group-hover:bg-brand-accent-light transition-colors">
                    {formatPrice(pin.price)}
                </div>
                <div
                    className="w-0 h-0 -mt-[1px]"
                    style={{
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: `5px solid var(--color-accent)`,
                    }}
                />
            </div>
        </Marker>
    )
}

function ClusterMarker({
    count,
    lat,
    lng,
    onClick,
    onHover,
    onLeave,
}: {
    count: number
    lat: number
    lng: number
    onClick: () => void
    onHover: (e: React.MouseEvent) => void
    onLeave: () => void
}) {
    const size = count < 10 ? 36 : count < 100 ? 42 : 50
    return (
        <Marker latitude={lat} longitude={lng} anchor="center" onClick={(e) => { e.originalEvent.stopPropagation(); onClick() }}>
            <div
                className="rounded-full bg-brand-accent text-white flex items-center justify-center font-bold shadow-lg cursor-pointer hover:bg-brand-accent-light transition-colors border-2 border-white"
                style={{ width: size, height: size, fontSize: count < 100 ? 13 : 11 }}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
            >
                {count.toLocaleString()}
            </div>
        </Marker>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────

export function ListingMap({ pins, onBoundsChange }: ListingMapProps) {
    const mapRef = useRef<MapRef>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [selectedPin, setSelectedPin] = useState<MapPin | null>(null)
    const [clusterOverlay, setClusterOverlay] = useState<ClusterOverlayData | null>(null)
    const [zoom, setZoom] = useState(DEFAULT_ZOOM)
    const [mapBounds, setMapBounds] = useState<[number, number, number, number] | null>(null)
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isOverOverlayRef = useRef(false)
    const activeClusterIdRef = useRef<number | null>(null)

    // Build Supercluster index
    const supercluster = useMemo(() => {
        const sc = new Supercluster({
            radius: 60,
            maxZoom: 16,
        })
        const points = pins.map(p => ({
            type: 'Feature' as const,
            properties: { id: p.id },
            geometry: { type: 'Point' as const, coordinates: [p.lng, p.lat] },
        }))
        sc.load(points)
        return sc
    }, [pins])

    const pinMap = useMemo(() => {
        const m: Record<string, MapPin> = {}
        for (const p of pins) m[p.id] = p
        return m
    }, [pins])

    // Get clusters for current viewport
    const clusters = useMemo(() => {
        if (!mapBounds) return []
        try {
            return supercluster.getClusters(mapBounds, Math.floor(zoom))
        } catch {
            return []
        }
    }, [supercluster, mapBounds, zoom])

    const fireBounds = useCallback((map: any) => {
        const bounds = map.getBounds()
        const b = {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
        }
        setMapBounds([b.west, b.south, b.east, b.north])
        setZoom(map.getZoom())
        onBoundsChange?.(b)
    }, [onBoundsChange])

    const handleMoveEnd = useCallback((evt: any) => {
        fireBounds(evt.target)
        setClusterOverlay(null)
        activeClusterIdRef.current = null
    }, [fireBounds])

    const handleMapLoad = useCallback((evt: any) => {
        fireBounds(evt.target)
    }, [fireBounds])

    const clearClusterOverlay = useCallback(() => {
        hoverTimerRef.current = setTimeout(() => {
            if (!isOverOverlayRef.current) {
                setClusterOverlay(null)
                activeClusterIdRef.current = null
            }
        }, 250)
    }, [])

    const handleClusterClick = useCallback((clusterId: number, lat: number, lng: number) => {
        const expansionZoom = supercluster.getClusterExpansionZoom(clusterId)
        mapRef.current?.getMap()?.easeTo({ center: [lng, lat], zoom: expansionZoom })
        setClusterOverlay(null)
        activeClusterIdRef.current = null
    }, [supercluster])

    const handleClusterHover = useCallback((e: React.MouseEvent, clusterId: number, pointCount: number) => {
        if (activeClusterIdRef.current === clusterId) return
        activeClusterIdRef.current = clusterId

        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current)
            hoverTimerRef.current = null
        }

        const leaves = supercluster.getLeaves(clusterId, Math.min(pointCount, MAX_LEAVES), 0)
        const leafPins: MapPin[] = leaves.map((l: any) => pinMap[l.properties?.id]).filter(Boolean)
        if (leafPins.length === 0) return

        const rect = mapContainerRef.current?.getBoundingClientRect()
        const screenX = e.clientX - (rect?.left || 0)
        const screenY = e.clientY - (rect?.top || 0)

        setClusterOverlay({
            screenX,
            screenY,
            leaves: leafPins,
            totalCount: pointCount,
        })
        setSelectedPin(null)
    }, [supercluster, pinMap])

    return (
        <div ref={mapContainerRef} className="relative w-full h-full">
            <Map
                ref={mapRef}
                initialViewState={{ ...DEFAULT_CENTER, zoom: DEFAULT_ZOOM }}
                style={{ width: '100%', height: '100%' }}
                mapStyle={MAP_STYLE as any}
                onMoveEnd={handleMoveEnd}
                onLoad={handleMapLoad}
                onClick={() => { setSelectedPin(null); setClusterOverlay(null) }}
            >
                <NavigationControl position="top-right" />

                {clusters.map((feature) => {
                    const [lng, lat] = feature.geometry.coordinates
                    const props = feature.properties

                    if (props.cluster) {
                        return (
                            <ClusterMarker
                                key={`cluster-${props.cluster_id}`}
                                count={props.point_count}
                                lat={lat}
                                lng={lng}
                                onClick={() => handleClusterClick(props.cluster_id, lat, lng)}
                                onHover={(e) => handleClusterHover(e, props.cluster_id, props.point_count)}
                                onLeave={clearClusterOverlay}
                            />
                        )
                    }

                    const pin = pinMap[props.id]
                    if (!pin) return null

                    return (
                        <PinMarker
                            key={pin.id}
                            pin={pin}
                            onClick={setSelectedPin}
                        />
                    )
                })}

                {selectedPin && !clusterOverlay && (
                    <Popup
                        latitude={selectedPin.lat}
                        longitude={selectedPin.lng}
                        anchor="bottom"
                        offset={[0, -35]}
                        onClose={() => setSelectedPin(null)}
                        closeOnClick={false}
                        maxWidth="260px"
                    >
                        <div className="p-1">
                            {selectedPin.photo && (
                                <img src={selectedPin.photo} alt={selectedPin.address} className="w-full h-28 object-cover rounded mb-2" />
                            )}
                            <p className="font-bold text-sm text-brand-accent">{formatPriceFull(selectedPin.price)}</p>
                            <p className="text-xs text-gray-600 mt-0.5 leading-snug">{selectedPin.address}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {selectedPin.beds} bed · {selectedPin.baths} bath
                                {selectedPin.sqft ? ` · ${selectedPin.sqft} sqft` : ''}
                            </p>
                            <Link href={`/listings/${selectedPin.id}`} className="text-xs text-brand-accent font-medium mt-2 inline-block hover:underline">
                                View Details →
                            </Link>
                        </div>
                    </Popup>
                )}
            </Map>

            {clusterOverlay && (
                <ClusterOverlay
                    data={clusterOverlay}
                    onClose={() => { setClusterOverlay(null); activeClusterIdRef.current = null }}
                    onMouseEnter={() => {
                        isOverOverlayRef.current = true
                        if (hoverTimerRef.current) { clearTimeout(hoverTimerRef.current); hoverTimerRef.current = null }
                    }}
                    onMouseLeave={() => {
                        isOverOverlayRef.current = false
                        clearClusterOverlay()
                    }}
                />
            )}
        </div>
    )
}
