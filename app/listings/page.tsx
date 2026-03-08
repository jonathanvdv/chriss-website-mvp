import { Metadata } from 'next'
import { getListings, getListingCount, ListingFilters } from '@/lib/listings'
import { ListingSearch } from '@/components/listings/ListingSearch'
import { ListingCard } from '@/components/listings/ListingCard'
import { ListingDisclaimer } from '@/components/listings/ListingDisclaimer'
import { Pagination } from '@/components/listings/Pagination'
import { MapView } from './MapView'
import { ListingsTermsGate } from '@/components/listings/ListingsTermsGate'

export const metadata: Metadata = {
    title: 'Search Listings | Kitchener, Waterloo & Cambridge',
    description: 'Browse homes for sale in Kitchener, Waterloo, Cambridge and surrounding Waterloo Region. Filter by price, bedrooms, and property type.',
}

const PAGE_SIZE = 24

export default async function ListingsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const unresolvedSearchParams = await searchParams;

    const page = Math.max(1, Number(unresolvedSearchParams.page) || 1)
    const view = (unresolvedSearchParams.view as string) || 'map'

    // Parse search params into filters
    const filters: ListingFilters = {
        minPrice: unresolvedSearchParams.lp ? Number(unresolvedSearchParams.lp) : undefined,
        maxPrice: unresolvedSearchParams.hp ? Number(unresolvedSearchParams.hp) : undefined,
        beds: unresolvedSearchParams.bd ? Number(unresolvedSearchParams.bd) : undefined,
        baths: unresolvedSearchParams.ba ? Number(unresolvedSearchParams.ba) : undefined,
        propertyType: unresolvedSearchParams.pt as string | undefined,
        buildingType: unresolvedSearchParams.bt as string | undefined,
        city: unresolvedSearchParams.city as string | undefined,
        transactionType: unresolvedSearchParams.tt as 'sale' | 'rent' | undefined,
        storeys: unresolvedSearchParams.storeys ? Number(unresolvedSearchParams.storeys) : undefined,
        yearBuilt: unresolvedSearchParams.yb ? Number(unresolvedSearchParams.yb) : undefined,
        sortField: unresolvedSearchParams.sortField as 'listingPrice' | 'listingDate' | undefined,
        sortDirection: unresolvedSearchParams.sortDirection as 'asc' | 'desc' | undefined,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
    }

    // Build flat filter params string for client-side API calls
    const filterParams: Record<string, string> = {}
    Object.keys(unresolvedSearchParams).forEach(key => {
        if (typeof unresolvedSearchParams[key] === 'string') {
            filterParams[key] = unresolvedSearchParams[key] as string
        }
    })

    if (view === 'map') {
        // Map view: fast count + client-side pin fetching
        const totalCount = await getListingCount(filters)

        return (
            <ListingsTermsGate>
                <div className="bg-gray-50 min-h-screen pt-24 pb-16">
                    <div className="px-4 sm:px-6">
                        <ListingSearch initialFilters={filterParams} totalCount={totalCount} />
                        <MapView filterParams={filterParams} totalCount={totalCount} />
                        <ListingDisclaimer lastUpdated={new Date().toLocaleDateString('en-CA')} />
                    </div>
                </div>
            </ListingsTermsGate>
        )
    }

    // List view: paginated fetch
    const { listings, totalCount } = await getListings(filters)
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return (
        <ListingsTermsGate>
        <div className="bg-gray-50 min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ListingSearch initialFilters={filterParams} resultCount={listings.length} totalCount={totalCount} />

                {listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                <Pagination currentPage={page} totalPages={totalPages} />

                <div className="mt-12 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-6 pb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Service Area</h2>
                        <p className="text-sm text-gray-500 mt-1">Kitchener · Waterloo · Cambridge · Guelph · Brampton · Mississauga · Toronto</p>
                    </div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d370726.5!2d-80.2!3d43.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sca"
                        width="100%"
                        height="350"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Abdul Basharmal service area map"
                    />
                </div>

                <ListingDisclaimer lastUpdated={new Date().toLocaleDateString('en-CA')} />
            </div>
        </div>
        </ListingsTermsGate>
    )
}
