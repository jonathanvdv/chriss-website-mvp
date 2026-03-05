import { Metadata } from 'next'
import { getListing } from '@/lib/listings'
import { ImageGallery } from '@/components/listings/ImageGallery'
import { ListingDisclaimer } from '@/components/listings/ListingDisclaimer'
import { ContactForm } from '@/components/shared/ContactForm'
import { Bed, Bath, Square, MapPin } from 'lucide-react'
import Image from 'next/image'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const unresolvedParams = await params
    const listing = await getListing(unresolvedParams.id)
    return {
        title: `${listing.address.full} - $${listing.price.toLocaleString()}`,
        description: `${listing.beds} bed, ${listing.baths} bath home at ${listing.address.full}. Listed at $${listing.price.toLocaleString()}. Contact Abdul Basharmal to book a showing.`,
    }
}

export default async function ListingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const unresolvedParams = await params
    const listing = await getListing(unresolvedParams.id)

    // Basic fallback
    if (!listing) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center pt-24">
                <h1 className="font-display text-2xl text-brand-text">Listing not found</h1>
            </div>
        )
    }

    // Generate address for Google Maps embed (simple iframe version)
    const mapQuery = encodeURIComponent(listing.address.full)

    return (
        <div className="bg-brand-bg relative min-h-screen pt-[72px] lg:pt-[84px] pb-16">

            {/* Top Gallery Section */}
            <div className="w-full bg-brand-bg-dark border-b border-brand-border/20 overflow-hidden relative">
                <ImageGallery photos={listing.photos} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative">

                    {/* Main Content (Left Column) */}
                    <div className="w-full lg:w-2/3 space-y-12 shrink-0">

                        {/* Header / Intro */}
                        <div className="border-b border-brand-border/40 pb-8">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-brand-bg-dark text-brand-gold text-xs font-semibold uppercase tracking-wider px-3 py-1 shadow-sm border border-brand-border/20">
                                    {listing.propertyType}
                                </span>

                                <span className="text-xs font-semibold uppercase tracking-widest text-brand-text-muted">
                                    MLS® #{listing.mlsNumber}
                                </span>
                            </div>

                            <h1 className="font-display font-medium text-4xl md:text-5xl lg:text-6xl text-brand-text mb-4 leading-tight">
                                ${listing.price.toLocaleString()}
                            </h1>

                            <p className="text-xl md:text-2xl text-brand-text-muted font-light flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-brand-accent shrink-0" />
                                {listing.address.full}
                            </p>
                        </div>

                        {/* Highlights Bar */}
                        <div className="bg-white border border-brand-border/50 shadow-sm p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                            <div className="flex flex-col border-r border-brand-border/50 lg:border-r">
                                <Bed className="w-6 h-6 text-brand-accent mx-auto mb-2" />
                                <span className="font-display text-2xl text-brand-text leading-none">{listing.beds}</span>
                                <span className="text-xs uppercase tracking-wider font-semibold text-brand-text-muted mt-2">Beds</span>
                            </div>

                            <div className="flex flex-col lg:border-r border-brand-border/50">
                                <Bath className="w-6 h-6 text-brand-accent mx-auto mb-2" />
                                <span className="font-display text-2xl text-brand-text leading-none">{listing.baths}</span>
                                <span className="text-xs uppercase tracking-wider font-semibold text-brand-text-muted mt-2">Baths</span>
                            </div>

                            <div className="flex flex-col border-r border-brand-border/50 lg:border-r">
                                <Square className="w-6 h-6 text-brand-accent mx-auto mb-2" />
                                <span className="font-display text-2xl text-brand-text leading-none">{listing.sqft ? listing.sqft.toLocaleString() : 'N/A'}</span>
                                <span className="text-xs uppercase tracking-wider font-semibold text-brand-text-muted mt-2">SqFt</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="font-display text-2xl text-brand-text leading-none mt-1">{listing.daysOnMarket}</span>
                                <span className="text-xs uppercase tracking-wider font-semibold text-brand-text-muted mt-3">Days on Market</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="font-display text-3xl text-brand-text mb-6">About This Property</h2>
                            <div className="text-brand-text-muted text-base lg:text-lg leading-relaxed font-light space-y-4 whitespace-pre-line">
                                {listing.description}
                            </div>
                        </div>

                        {/* Property Details */}
                        <div>
                            <h2 className="font-display text-3xl text-brand-text mb-6">Property Details</h2>
                            <div className="bg-white border border-brand-border/50 shadow-sm overflow-hidden">
                                <dl className="divide-y divide-brand-border/40">
                                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 flex items-center">
                                        <dt className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">Status</dt>
                                        <dd className="mt-1 text-sm font-medium text-brand-text sm:mt-0 sm:col-span-2">
                                            <span className={`inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${listing.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-brand-bg-dark text-white'}`}>
                                                {listing.status}
                                            </span>
                                        </dd>
                                    </div>
                                    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 flex items-center bg-brand-bg/50">
                                        <dt className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">Property Type</dt>
                                        <dd className="mt-1 text-sm text-brand-text sm:mt-0 sm:col-span-2">{listing.propertyType}</dd>
                                    </div>
                                    {listing.yearBuilt && (
                                        <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 flex items-center">
                                            <dt className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">Year Built</dt>
                                            <dd className="mt-1 text-sm text-brand-text sm:mt-0 sm:col-span-2">{listing.yearBuilt}</dd>
                                        </div>
                                    )}
                                    {listing.lotSize && (
                                        <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 flex items-center bg-brand-bg/50">
                                            <dt className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">Lot Size</dt>
                                            <dd className="mt-1 text-sm text-brand-text sm:mt-0 sm:col-span-2">{listing.lotSize}</dd>
                                        </div>
                                    )}
                                    {Object.entries(listing.features).map(([key, value], idx) => value && (
                                        <div key={key} className={`p-4 sm:grid sm:grid-cols-3 sm:gap-4 flex items-center ${idx % 2 === (listing.yearBuilt && listing.lotSize ? 1 : 0) ? 'bg-brand-bg/50' : ''}`}>
                                            <dt className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">{key}</dt>
                                            <dd className="mt-1 text-sm text-brand-text capitalize sm:mt-0 sm:col-span-2">{value}</dd>
                                        </div>
                                    ))}

                                    {listing.realtorCaUrl && listing.realtorCaUrl !== '#' && (
                                        <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4 flex items-center">
                                            <dt className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">View on REALTOR.ca</dt>
                                            <dd className="mt-1 text-sm text-brand-text sm:mt-0 sm:col-span-2">
                                                <a href={listing.realtorCaUrl} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">
                                                    View on REALTOR.ca →
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="mt-12 h-96 w-full relative border border-brand-border/40 overflow-hidden bg-brand-border/10">
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

                    </div>

                    {/* Sidebar / Sticky Contact (Right Column) */}
                    <div className="w-full lg:w-1/3 relative z-10 shrink-0">
                        {/* The sticky container */}
                        <div className="sticky top-28 bg-white border border-brand-border/50 shadow-xl p-6 sm:p-8 rounded-sm">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-border/40">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-brand-border/30 shadow-sm">
                                    <Image
                                        src="https://cdn.realtor.ca/individual/TS637750507800000000/highres/1403257.jpg"
                                        alt="Abdul Basharmal"
                                        fill
                                        className="object-cover object-top"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-display text-xl text-brand-text leading-tight">Abdul Basharmal</h3>
                                    <p className="text-brand-text-muted text-xs font-medium uppercase tracking-wider mt-1">REALTOR®</p>
                                    <a href="tel:905-906-0045" className="text-brand-accent text-sm font-semibold mt-1 block hover:underline">(905) 906-0045</a>
                                </div>
                            </div>

                            <h4 className="font-display text-2xl text-brand-text mb-6">Interested in this property?</h4>

                            <ContactForm
                                defaultMessage={`Hi Abdul, I'm interested in the property at ${listing.address.full} (MLS: ${listing.mlsNumber}). I'd like to book a showing or get more information.`}
                                defaultIntent="Buy"
                                listingAddress={listing.address.full}
                                className="[&>div>label]:text-[10px]"
                            />
                        </div>
                    </div>

                </div>

                <ListingDisclaimer lastUpdated={new Date().toLocaleDateString('en-CA')} />
            </div>
        </div>
    )
}
