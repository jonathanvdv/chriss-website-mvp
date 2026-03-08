import { Metadata } from 'next'
import { getAgentListings } from '@/lib/listings'
import { ListingCard } from '../_components/ListingCard'
import { ListingDisclaimer } from '../_components/ListingDisclaimer'
import Image from 'next/image'

export const metadata: Metadata = {
    title: "Abdul's Listings | Abdul Basharmal REALTOR®",
    description: "View properties currently listed by Abdul Basharmal, REALTOR® with RE/MAX Twin City Realty in Kitchener-Waterloo.",
}

export default async function MyListingsPage() {
    const listings = await getAgentListings()

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Agent header */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-brand-accent/20">
                        <Image
                            src="https://cdn.realtor.ca/individual/TS637750507800000000/highres/1403257.jpg"
                            alt="Abdul Basharmal"
                            fill
                            className="object-cover object-top"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Abdul Basharmal's Listings</h1>
                        <p className="text-gray-500 mt-1">REALTOR® · RE/MAX Twin City Realty Inc., Brokerage</p>
                        <p className="text-sm text-gray-400 mt-1">{listings.length} active listing{listings.length !== 1 ? 's' : ''}</p>
                    </div>
                    <a
                        href="tel:905-906-0045"
                        className="md:ml-auto bg-brand-accent hover:bg-brand-accent/90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    >
                        Contact Abdul
                    </a>
                </div>

                {listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map(listing => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 p-12 text-center rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No active listings right now</h3>
                        <p className="text-gray-500 mb-6">
                            Abdul doesn't have any active listings at the moment. Check back soon or browse all available listings.
                        </p>
                        <a href="/listings" className="text-brand-accent font-medium hover:underline">
                            Browse all listings →
                        </a>
                    </div>
                )}

                <ListingDisclaimer lastUpdated={new Date().toLocaleDateString('en-CA')} />
            </div>
        </div>
    )
}
