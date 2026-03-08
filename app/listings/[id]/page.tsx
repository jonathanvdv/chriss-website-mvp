import { Metadata } from 'next'
import { getListing } from '@/lib/listings'
import { ImageGallery } from '../_components/ImageGallery'
import { ListingDisclaimer } from '../_components/ListingDisclaimer'
import { ContactForm } from '@/components/ContactForm'
import { Bed, Bath, Maximize, Car, Calendar, MapPin, ExternalLink, Home } from 'lucide-react'
import { MobileContactSheet } from '../_components/MobileContactSheet'
import Image from 'next/image'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const unresolvedParams = await params
    const listing = await getListing(unresolvedParams.id)
    return {
        title: `${listing.address.full} - $${listing.price.toLocaleString()}`,
        description: `${listing.beds} bed, ${listing.baths} bath home at ${listing.address.full}. Listed at $${listing.price.toLocaleString()}. Contact Abdul Basharmal to book a showing.`,
    }
}

// Helper component for detail rows
function DetailRow({ label, value, className = '' }: { label: string; value: string | number | null | undefined; className?: string }) {
    if (!value && value !== 0) return null
    return (
        <div className={`flex justify-between py-2.5 border-b border-gray-100 text-sm ${className}`}>
            <span className="text-gray-500">{label}</span>
            <span className="text-gray-900 font-medium text-right max-w-[60%]">{value}</span>
        </div>
    )
}

export default async function ListingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const unresolvedParams = await params
    const listing = await getListing(unresolvedParams.id)

    if (!listing) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center pt-24">
                <h1 className="font-display text-2xl text-brand-text">Listing not found</h1>
            </div>
        )
    }

    const mapQuery = encodeURIComponent(listing.address.full)

    return (
        <>
        <div className="bg-white relative min-h-screen pt-[72px] lg:pt-[84px]">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb-style address header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-6 pb-4">
                    <h1 className="font-display text-xl md:text-2xl text-gray-900 uppercase tracking-wide">
                        {listing.address.unitNumber ? `${listing.address.unitNumber} - ` : ''}
                        {listing.address.streetNumber} {listing.address.streetName}
                    </h1>
                    <div className="flex items-center gap-4">
                        {listing.realtorCaUrl && (
                            <a
                                href={listing.realtorCaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-brand-accent hover:underline flex items-center gap-1 font-medium"
                            >
                                <ExternalLink className="w-3.5 h-3.5" /> REALTOR.ca
                            </a>
                        )}
                    </div>
                </div>

                {/* Photo Grid */}
                <ImageGallery photos={listing.photos} />

                {/* Quick Stats Bar — right below photos */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-5 border-b border-gray-200">
                    <div>
                        <span className="text-3xl md:text-4xl font-bold text-gray-900">${listing.price.toLocaleString()}</span>
                        {listing.isRental && listing.rentFrequency && (
                            <span className="text-base font-normal text-gray-500 ml-1">/{listing.rentFrequency.toLowerCase()}</span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">{listing.beds}</span> Beds
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">{listing.baths}</span> Baths
                        </span>
                        {listing.sqft && (
                            <span className="flex items-center gap-1.5">
                                <Maximize className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-900">{listing.sqft.toLocaleString()}</span> sqft
                            </span>
                        )}
                        {listing.parkingTotal != null && listing.parkingTotal > 0 && listing.parkingTotal <= 10 && (
                            <span className="flex items-center gap-1.5">
                                <Car className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-900">{listing.parkingTotal}</span> Parking
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4 ml-auto text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {listing.address.city}, {listing.address.province}
                        </span>
                        <span>MLS® #{listing.mlsNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${listing.status === 'Active' ? 'bg-green-100 text-green-700' : listing.status === 'Sold' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {listing.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* Left Column */}
                    <div className="w-full lg:w-2/3 space-y-8">

                        {/* Listing Description — first, like realtor.ca */}
                        {listing.description && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Listing Description</h2>
                                <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">
                                    {listing.description}
                                </p>
                            </section>
                        )}

                        {/* Property Summary */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Property Summary</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                                <DetailRow label="Property Type" value={listing.propertyType} />
                                <DetailRow label="Building Type" value={listing.buildingType} />
                                <DetailRow label="Storeys" value={listing.storeys} />
                                <DetailRow label="Year Built" value={listing.yearBuilt} />
                                <DetailRow label="Living Area" value={listing.sqft ? `${listing.sqft.toLocaleString()} sqft` : null} />
                                <DetailRow label="Lot Size" value={listing.lotSizeDimensions || listing.lotSize} />
                                <DetailRow label="Neighbourhood" value={listing.address.neighbourhood} />
                                <DetailRow label="Zoning" value={listing.zoning} />
                                <DetailRow label="Days on Market" value={listing.daysOnMarket} />
                                <DetailRow label="Listed" value={listing.listDate ? new Date(listing.listDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : null} />
                            </div>
                        </section>

                        {/* Bedrooms & Bathrooms */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Bedrooms & Bathrooms</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                                <DetailRow label="Bedrooms" value={listing.beds} />
                                <DetailRow label="Bedrooms (Above Grade)" value={listing.bedsAboveGrade} />
                                <DetailRow label="Bedrooms (Below Grade)" value={listing.bedsBelowGrade} />
                                <DetailRow label="Bathrooms" value={listing.baths} />
                                <DetailRow label="Full Bathrooms" value={listing.bathsFull} />
                                <DetailRow label="Half Bathrooms" value={listing.bathsHalf} />
                            </div>
                        </section>

                        {/* Building & Structure */}
                        {(listing.constructionMaterial || listing.foundation || listing.roof || listing.exteriorFeatures) && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Building</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                                    <DetailRow label="Construction" value={listing.constructionMaterial} />
                                    <DetailRow label="Foundation" value={listing.foundation} />
                                    <DetailRow label="Roof" value={listing.roof} />
                                    <DetailRow label="Exterior" value={listing.exteriorFeatures} />
                                </div>
                            </section>
                        )}

                        {/* Interior Features */}
                        {(listing.flooring || listing.interiorFeatures || listing.appliances || listing.basement) && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Interior</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                                    <DetailRow label="Flooring" value={listing.flooring} />
                                    <DetailRow label="Features" value={listing.interiorFeatures} />
                                    <DetailRow label="Appliances" value={listing.appliances} />
                                    <DetailRow label="Basement" value={listing.basement} />
                                </div>
                            </section>
                        )}

                        {/* Utilities */}
                        {(listing.heating || listing.cooling || listing.waterSource || listing.sewer) && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Utilities</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                                    <DetailRow label="Heating" value={listing.heating} />
                                    <DetailRow label="Heating Fuel" value={listing.heatingFuel} />
                                    <DetailRow label="Cooling" value={listing.cooling} />
                                    <DetailRow label="Water" value={listing.waterSource} />
                                    <DetailRow label="Sewer" value={listing.sewer} />
                                </div>
                            </section>
                        )}

                        {/* Parking */}
                        {(listing.parkingTotal || listing.garageSpaces || listing.parkingFeatures) && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Parking</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                                    <DetailRow label="Total Parking" value={listing.parkingTotal} />
                                    <DetailRow label="Garage Spaces" value={listing.garageSpaces} />
                                    <DetailRow label="Parking Features" value={listing.parkingFeatures} />
                                </div>
                            </section>
                        )}

                        {/* Financial */}
                        {(listing.taxAmount || listing.associationFee) && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Financial</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                                    {listing.taxAmount != null && (
                                        <DetailRow label={`Annual Taxes${listing.taxYear ? ` (${listing.taxYear})` : ''}`} value={`$${listing.taxAmount.toLocaleString()}`} />
                                    )}
                                    {listing.associationFee != null && (
                                        <DetailRow label="Condo / Strata Fee" value={`$${listing.associationFee.toLocaleString()}${listing.associationFeeFrequency ? ` / ${listing.associationFeeFrequency}` : ''}`} />
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Room Dimensions */}
                        {listing.rooms.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Room Dimensions</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-500 border-b border-gray-200">
                                                <th className="pb-2 font-medium">Room</th>
                                                <th className="pb-2 font-medium">Level</th>
                                                <th className="pb-2 font-medium">Dimensions</th>
                                                <th className="pb-2 font-medium">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listing.rooms.map((room, i) => (
                                                <tr key={i} className="border-b border-gray-50">
                                                    <td className="py-2 text-gray-900 font-medium">{room.type}</td>
                                                    <td className="py-2 text-gray-600">{room.level}</td>
                                                    <td className="py-2 text-gray-600">{room.dimensions}</td>
                                                    <td className="py-2 text-gray-600">{room.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* Community / Pool / Fencing */}
                        {(listing.communityFeatures || listing.poolFeatures || listing.fencing) && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Community & Outdoor</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                                    <DetailRow label="Community Features" value={listing.communityFeatures} />
                                    <DetailRow label="Pool" value={listing.poolFeatures} />
                                    <DetailRow label="Fencing" value={listing.fencing} />
                                </div>
                            </section>
                        )}

                        {/* Brokerage Attribution */}
                        {listing.listingBrokerage && (
                            <p className="text-xs text-gray-400">
                                Listed by {listing.listingBrokerage}
                            </p>
                        )}

                        {/* Map */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Location</h2>
                            <div className="h-80 w-full relative rounded-lg overflow-hidden border border-gray-200">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight={0}
                                    marginWidth={0}
                                    src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right Column — Sticky Contact Card */}
                    <div className="w-full lg:w-1/3 shrink-0">
                        <div className="space-y-6">

                            {/* CTA Banner */}
                            <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-lg p-5 text-center">
                                <Home className="w-8 h-8 text-brand-accent mx-auto mb-2" />
                                <p className="text-sm font-semibold text-gray-900 mb-1">Interested in touring this property?</p>
                                <p className="text-xs text-gray-500">Contact Abdul to schedule a private showing</p>
                            </div>

                            {/* Agent Card + Form */}
                            <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6">
                                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                        <Image
                                            src="https://cdn.realtor.ca/individual/TS637750507800000000/highres/1403257.jpg"
                                            alt="Abdul Basharmal"
                                            fill
                                            className="object-cover object-top"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 leading-tight">Abdul Basharmal</h3>
                                        <p className="text-gray-500 text-xs mt-0.5">REALTOR® · RE/MAX Twin City</p>
                                        <a href="tel:905-906-0045" className="text-brand-accent text-sm font-semibold mt-1 block hover:underline">(905) 906-0045</a>
                                    </div>
                                </div>

                                <ContactForm
                                    defaultMessage={`Hi Abdul, I'm interested in the property at ${listing.address.full} (MLS: ${listing.mlsNumber}). I'd like to book a showing or get more information.`}
                                    defaultIntent="Buy"
                                    listingAddress={listing.address.full}
                                    className="[&>div>label]:text-[10px]"
                                />
                            </div>

                            {/* Virtual Tour Link */}
                            {listing.virtualTour && (
                                <a
                                    href={listing.virtualTour}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center bg-gray-900 text-white text-sm font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    View Virtual Tour
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <ListingDisclaimer lastUpdated={new Date().toLocaleDateString('en-CA')} />
            </div>

        </div>
        {/* Floating mobile contact sheet */}
        <MobileContactSheet
            defaultMessage={`Hi Abdul, I'm interested in the property at ${listing.address.full} (MLS: ${listing.mlsNumber}). I'd like to book a showing or get more information.`}
            listingAddress={listing.address.full}
        />
        </>
    )
}
