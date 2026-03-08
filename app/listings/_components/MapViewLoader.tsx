'use client'

import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('./MapView').then(m => m.MapView), { ssr: false })

export function MapViewLoader({ filterParams }: { filterParams: Record<string, string> }) {
    return <MapView filterParams={filterParams} />
}
