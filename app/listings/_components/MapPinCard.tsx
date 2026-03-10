import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Maximize } from 'lucide-react'
import type { MapPin } from '@/lib/listings'

function formatDaysAgo(listDate: string): string {
    if (!listDate) return ''
    const ms = Date.now() - new Date(listDate).getTime()
    const mins = Math.floor(ms / 60000)
    if (mins < 60) return `${mins} min ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    if (days === 1) return '1 day ago'
    return `${days} days ago`
}

export const MapPinCard = React.memo(function MapPinCard({ pin }: { pin: MapPin }) {
    return (
        <Link href={`/listings/${pin.id}`} className="group block border-b border-gray-200 last:border-b-0">
            <article className="flex gap-3 p-3 hover:bg-gray-50 transition-colors">
                {/* Thumbnail */}
                <div className="w-[140px] h-[100px] flex-shrink-0 rounded overflow-hidden bg-gray-100 relative">
                    {pin.photo ? (
                        <Image
                            src={pin.photo}
                            alt={pin.address}
                            fill
                            sizes="140px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                            No photo
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <p className="text-base font-bold text-brand-accent">
                            ${pin.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 leading-snug line-clamp-2">
                            {pin.address}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1.5">
                            <span className="flex items-center gap-1">
                                <Bed className="w-3 h-3" /> {pin.beds}
                            </span>
                            <span className="flex items-center gap-1">
                                <Bath className="w-3 h-3" /> {pin.baths}
                            </span>
                            {pin.sqft && (
                                <span className="flex items-center gap-1">
                                    <Maximize className="w-3 h-3" /> {pin.sqft.toLocaleString()} sqft
                                </span>
                            )}
                        </div>
                    </div>
                    {pin.listDate && (
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                            {formatDaysAgo(pin.listDate)}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    )
})
