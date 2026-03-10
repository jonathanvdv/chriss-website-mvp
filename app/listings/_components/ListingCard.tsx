import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bed, Bath, Maximize } from 'lucide-react'
import type { Listing } from '@/lib/listings'

export const ListingCard = React.memo(function ListingCard({ listing }: { listing: Listing }) {
    const listTime = listing.listDate ? new Date(listing.listDate).getTime() : NaN
    const isNew = !isNaN(listTime) && (Date.now() - listTime) / (1000 * 3600 * 24) <= 7

    return (
        <Link href={`/listings/${listing.id}`} className="group block">
            <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">

                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <Image
                        src={listing.photos[0] || '/images/listing-placeholder.webp'}
                        alt={listing.address.full}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                        {listing.isRental && (
                            <span className="bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">
                                For Rent
                            </span>
                        )}
                        {isNew && (
                            <span className="bg-green-600 text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">
                                New
                            </span>
                        )}
                        {listing.status === 'Sold' && (
                            <span className="bg-red-600 text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">
                                Sold
                            </span>
                        )}
                        {listing.status === 'Pending' && (
                            <span className="bg-amber-500 text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">
                                Pending
                            </span>
                        )}
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded">
                            {listing.propertyType}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-[22px] font-semibold text-gray-900 mb-2">
                        ${listing.price.toLocaleString()}
                        {listing.isRental && listing.rentFrequency && (
                            <span className="text-sm font-normal text-gray-500"> /{listing.rentFrequency.toLowerCase()}</span>
                        )}
                    </p>
                    <p className="text-[15px] font-medium text-gray-900 leading-snug">
                        {listing.address.streetNumber} {listing.address.streetName}
                        {listing.address.unitNumber ? ` Unit ${listing.address.unitNumber}` : ''}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {listing.address.city}, {listing.address.province}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-5 text-sm text-gray-600 mt-4 pt-3 border-t border-gray-100">
                        <span className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{listing.beds}</span> Beds
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{listing.baths}</span> Baths
                        </span>
                        {listing.sqft && (
                            <span className="flex items-center gap-1.5 ml-auto">
                                <Maximize className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{listing.sqft.toLocaleString()}</span> sqft
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    )
})
