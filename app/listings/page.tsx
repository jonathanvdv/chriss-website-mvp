import { Metadata } from 'next'
import { getListings, ListingFilters } from '@/lib/listings'
import { ListingSearch } from '@/components/listings/ListingSearch'
import { ListingCard } from '@/components/listings/ListingCard'
import { ListingDisclaimer } from '@/components/listings/ListingDisclaimer'

export const metadata: Metadata = {
    title: 'Search Listings | Kitchener, Waterloo & Cambridge',
    description: 'Browse homes for sale in Kitchener, Waterloo, Cambridge and surrounding Waterloo Region. Filter by price, bedrooms, and property type.',
}

export default async function ListingsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const unresolvedSearchParams = await searchParams;

    // Parse search params into filters
    const filters: ListingFilters = {
        minPrice: unresolvedSearchParams.lp ? Number(unresolvedSearchParams.lp) : undefined,
        maxPrice: unresolvedSearchParams.hp ? Number(unresolvedSearchParams.hp) : undefined,
        beds: unresolvedSearchParams.bd ? Number(unresolvedSearchParams.bd) : undefined,
        baths: unresolvedSearchParams.ba ? Number(unresolvedSearchParams.ba) : undefined,
        propertyType: unresolvedSearchParams.pt as string | undefined,
        city: unresolvedSearchParams.city as string | undefined,
        sortField: unresolvedSearchParams.sortField as 'listingPrice' | 'listingDate' | undefined,
        sortDirection: unresolvedSearchParams.sortDirection as 'asc' | 'desc' | undefined,
        limit: 12,
    }

    const listings = await getListings(filters)

    // Pass flat record of string params to ListingSearch for initial state
    const initialFilters: Record<string, string> = {}
    Object.keys(unresolvedSearchParams).forEach(key => {
        if (typeof unresolvedSearchParams[key] === 'string') {
            initialFilters[key] = unresolvedSearchParams[key] as string
        }
    })

    return (
        <div className="bg-brand-bg min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-10 text-center md:text-left">
                    <h1 className="font-display text-4xl md:text-5xl text-brand-text mb-4">
                        Search <span className="italic text-brand-accent">Listings</span>
                    </h1>
                    <p className="text-brand-text-muted text-lg font-light">
                        {listings.length} properties found matching your criteria.
                    </p>
                </div>

                <ListingSearch initialFilters={initialFilters} />

                {listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map(listing => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-brand-border/40 p-12 text-center rounded-sm">
                        <h3 className="text-xl font-display text-brand-text mb-2">No properties found</h3>
                        <p className="text-brand-text-muted">
                            We couldn't find any listings matching your current filters. Try broadening your search or clearing some filters.
                        </p>
                    </div>
                )}

                <ListingDisclaimer lastUpdated={new Date().toLocaleDateString('en-CA')} />
            </div>
        </div>
    )
}
