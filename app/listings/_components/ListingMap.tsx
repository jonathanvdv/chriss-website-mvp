'use client'

import React, { useState, useCallback, useMemo, useRef } from 'react'
import Map, { Source, Layer, Popup, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { MapPin } from '@/lib/listings'
import Link from 'next/link'
import type { MapRef } from 'react-map-gl/mapbox'
import type { GeoJSONSource, MapLayerMouseEvent } from 'mapbox-gl'
import { Bed, Bath, Maximize, ChevronLeft, ChevronRight } from 'lucide-react'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

const DEFAULT_CENTER = { latitude: 43.45, longitude: -80.49 }
const DEFAULT_ZOOM = 10
const ACCENT = '#1B4332'

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
const OVERLAY_H = 340 // approximate height of overlay

function formatPrice(price: number): string {
    return `$${price.toLocaleString()}`
}

function formatDaysAgo(listDate: string): string {
    if (!listDate) return ''
    const days = Math.floor((Date.now() - new Date(listDate).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
}

// ─── Create pin marker images ───────────────────────────────────────────

function drawPinMarker(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
    const cx = w / 2
    const headR = w / 2 - 1
    const headCy = headR + 1
    const tipY = h - 1

    ctx.beginPath()
    ctx.arc(cx, headCy, headR, Math.PI * 0.82, Math.PI * 0.18, false)
    ctx.lineTo(cx, tipY)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1.5
    ctx.stroke()
}

function addMapImages(map: any) {
    if (map.hasImage('pin-single')) return
    const ratio = window.devicePixelRatio || 1

    // Single listing pin
    {
        const w = 28, h = 38
        const canvas = document.createElement('canvas')
        canvas.width = w * ratio; canvas.height = h * ratio
        const ctx = canvas.getContext('2d')!
        ctx.scale(ratio, ratio)
        drawPinMarker(ctx, w, h, ACCENT)
        ctx.beginPath(); ctx.arc(w / 2, w / 2, 4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill()
        map.addImage('pin-single', { width: canvas.width, height: canvas.height, data: ctx.getImageData(0, 0, canvas.width, canvas.height).data }, { pixelRatio: ratio })
    }

    // Cluster pin
    {
        const w = 36, h = 46
        const canvas = document.createElement('canvas')
        canvas.width = w * ratio; canvas.height = h * ratio
        const ctx = canvas.getContext('2d')!
        ctx.scale(ratio, ratio)
        drawPinMarker(ctx, w, h, ACCENT)
        map.addImage('pin-cluster', { width: canvas.width, height: canvas.height, data: ctx.getImageData(0, 0, canvas.width, canvas.height).data }, { pixelRatio: ratio })
    }
}

// ─── Cluster Overlay Content (positioned via CSS, not Mapbox Popup) ─────

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

    // Get the map container dimensions from the parent
    const parentEl = containerRef.current?.parentElement
    const mapW = parentEl?.clientWidth || 1000
    const mapH = parentEl?.clientHeight || 600

    // 4-quadrant positioning: place overlay so it stays within the map
    const style: React.CSSProperties = { position: 'absolute', width: OVERLAY_W, zIndex: 50 }
    const pinX = data.screenX
    const pinY = data.screenY
    const GAP = 12

    // Horizontal: if pin is in right half, place overlay to the left; otherwise to the right
    if (pinX > mapW / 2) {
        style.right = mapW - pinX + GAP
    } else {
        style.left = pinX + GAP
    }

    // Vertical: if pin is in bottom half, grow upward; otherwise grow downward
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
            {/* Header */}
            <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                <span className="text-sm font-semibold text-gray-900">
                    {data.totalCount.toLocaleString()} Listings
                </span>
            </div>

            {/* Scrollable listing cards — ~2 visible, scroll for more */}
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
                            <p className="text-sm font-bold text-brand-accent">{formatPrice(pin.price)}</p>
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

            {/* Pagination */}
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

// ─── Layer Styles ───────────────────────────────────────────────────────

const clusterIconLayer: any = {
    id: 'clusters',
    type: 'symbol',
    source: 'listings',
    filter: ['has', 'point_count'],
    layout: {
        'icon-image': 'pin-cluster',
        'icon-size': 1,
        'icon-anchor': 'bottom',
        'icon-allow-overlap': true,
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-anchor': 'center',
        'text-offset': [0, -2.3],
        'text-allow-overlap': true,
        'icon-text-fit': 'none',
    },
    paint: { 'text-color': '#ffffff' },
}

const unclusteredPointLayer: any = {
    id: 'unclustered-point',
    type: 'symbol',
    source: 'listings',
    filter: ['!', ['has', 'point_count']],
    layout: {
        'icon-image': 'pin-single',
        'icon-size': 1,
        'icon-anchor': 'bottom',
        'icon-allow-overlap': true,
    },
}

const unclusteredLabelLayer: any = {
    id: 'unclustered-label',
    type: 'symbol',
    source: 'listings',
    filter: ['!', ['has', 'point_count']],
    layout: {
        'text-field': ['get', 'priceLabel'],
        'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 11,
        'text-offset': [0, -3.8],
        'text-anchor': 'bottom',
        'text-allow-overlap': false,
    },
    paint: {
        'text-color': '#1f2937',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
    },
}

// ─── Main Component ─────────────────────────────────────────────────────

export function ListingMap({ pins, onBoundsChange }: ListingMapProps) {
    const mapRef = useRef<MapRef>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [selectedPin, setSelectedPin] = useState<MapPin | null>(null)
    const [clusterOverlay, setClusterOverlay] = useState<ClusterOverlayData | null>(null)
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isOverOverlayRef = useRef(false)

    const pinMap = useMemo(() => {
        const m: Record<string, MapPin> = {}
        for (const p of pins) m[p.id] = p
        return m
    }, [pins])

    const geojson = useMemo(() => ({
        type: 'FeatureCollection' as const,
        features: pins.map(p => ({
            type: 'Feature' as const,
            properties: {
                id: p.id,
                price: p.price,
                priceLabel: formatPrice(p.price),
                address: p.address,
                beds: p.beds,
                baths: p.baths,
                sqft: p.sqft,
                photo: p.photo,
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [p.lng, p.lat],
            },
        })),
    }), [pins])

    const fireBounds = useCallback((map: any) => {
        if (!onBoundsChange) return
        const bounds = map.getBounds()
        onBoundsChange({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
        })
    }, [onBoundsChange])

    const handleMoveEnd = useCallback((evt: any) => {
        fireBounds(evt.target)
        setClusterOverlay(null)
        activeClusterIdRef.current = null
    }, [fireBounds])

    const activeClusterIdRef = useRef<number | null>(null)

    const showClusterOverlay = useCallback((feature: any, point: { x: number; y: number }) => {
        const map = mapRef.current?.getMap()
        if (!map) return

        const clusterId = feature.properties?.cluster_id
        const pointCount = feature.properties?.point_count || 0

        // If already showing this cluster, don't update position (prevents flickering)
        if (activeClusterIdRef.current === clusterId) return
        activeClusterIdRef.current = clusterId

        const source = map.getSource('listings') as GeoJSONSource

        source.getClusterLeaves(clusterId, Math.min(pointCount, MAX_LEAVES), 0, (err: any, leaves: any) => {
            if (err || !leaves) return
            const leafPins: MapPin[] = leaves.map((l: any) => pinMap[l.properties?.id]).filter(Boolean)
            if (leafPins.length === 0) return

            setClusterOverlay({
                screenX: point.x,
                screenY: point.y,
                leaves: leafPins,
                totalCount: pointCount,
            })
            setSelectedPin(null)
        })
    }, [pinMap])

    const clearClusterOverlay = useCallback(() => {
        hoverTimerRef.current = setTimeout(() => {
            if (!isOverOverlayRef.current) {
                setClusterOverlay(null)
                activeClusterIdRef.current = null
            }
        }, 250)
    }, [])

    const handleMouseMove = useCallback((evt: MapLayerMouseEvent) => {
        const map = mapRef.current?.getMap()
        if (!map || !map.getLayer('clusters')) return

        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current)
            hoverTimerRef.current = null
        }

        const clusterFeatures = map.queryRenderedFeatures(evt.point, { layers: ['clusters'] })
        if (clusterFeatures.length > 0) {
            showClusterOverlay(clusterFeatures[0], evt.point)
        } else {
            clearClusterOverlay()
        }
    }, [showClusterOverlay, clearClusterOverlay])

    const handleClick = useCallback((evt: MapLayerMouseEvent) => {
        const map = mapRef.current?.getMap()
        if (!map || !map.getLayer('clusters')) return

        const clusterFeatures = map.queryRenderedFeatures(evt.point, { layers: ['clusters'] })
        if (clusterFeatures.length > 0) {
            const feature = clusterFeatures[0]
            const clusterId = feature.properties?.cluster_id
            const source = map.getSource('listings') as GeoJSONSource
            source.getClusterExpansionZoom(clusterId, (err: any, zoom: number | null | undefined) => {
                if (err || zoom == null) return
                map.easeTo({ center: (feature.geometry as any).coordinates, zoom })
            })
            setClusterOverlay(null)
            activeClusterIdRef.current = null
            return
        }

        const pointFeatures = map.getLayer('unclustered-point') ? map.queryRenderedFeatures(evt.point, { layers: ['unclustered-point'] }) : []
        if (pointFeatures.length > 0) {
            const props = pointFeatures[0].properties
            if (!props) return
            const pin = pinMap[props.id]
            if (pin) {
                setSelectedPin(pin)
                setClusterOverlay(null)
            }
        }
    }, [pinMap])

    const handleMapLoad = useCallback((evt: any) => {
        addMapImages(evt.target)
        fireBounds(evt.target)
    }, [fireBounds])

    if (!MAPBOX_TOKEN) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                Map requires NEXT_PUBLIC_MAPBOX_TOKEN
            </div>
        )
    }

    return (
        <div ref={mapContainerRef} className="relative w-full h-full">
            <Map
                ref={mapRef}
                initialViewState={{ ...DEFAULT_CENTER, zoom: DEFAULT_ZOOM }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                onMoveEnd={handleMoveEnd}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                onLoad={handleMapLoad}
                interactiveLayerIds={['clusters', 'unclustered-point']}
                cursor="pointer"
            >
                <NavigationControl position="top-right" />

                <Source
                    id="listings"
                    type="geojson"
                    data={geojson}
                    cluster={true}
                    clusterMaxZoom={14}
                    clusterRadius={50}
                >
                    <Layer {...clusterIconLayer} />
                    <Layer {...unclusteredPointLayer} />
                    <Layer {...unclusteredLabelLayer} />
                </Source>

                {/* Single pin popup — still uses Mapbox Popup */}
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
                            <p className="font-bold text-sm text-brand-accent">{formatPrice(selectedPin.price)}</p>
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

            {/* Cluster overlay — positioned via CSS quadrant logic, always within map bounds */}
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
