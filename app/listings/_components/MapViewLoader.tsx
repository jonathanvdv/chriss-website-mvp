'use client'

import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('./MapView').then(m => m.MapView), {
    ssr: false,
    loading: () => (
        <div className="flex h-[calc(100vh-180px)] min-h-[500px] items-center justify-center bg-gray-50 text-gray-400 text-sm">
            Loading map view...
        </div>
    ),
})

export function MapViewLoader({ filterParams }: { filterParams: Record<string, string> }) {
    return <MapView filterParams={filterParams} />
}
