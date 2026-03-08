import Link from 'next/link'
import { getFeaturedListings } from '@/lib/listings'
import { ListingCard } from '@/components/listings/ListingCard'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { SectionLabel } from '@/components/shared/SectionLabel'

export async function FeaturedListings() {
    const listings = await getFeaturedListings(6)

    // Empty state if API is down or nothing featured
    if (!listings || listings.length === 0) {
        return null
    }

    return (
        <section className="py-12 md:py-20 bg-brand-bg relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <AnimatedSection className="mb-16">
                    <SectionLabel text="Featured Listings" />
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h2 className="font-display text-4xl md:text-5xl text-brand-text mb-6">
                                Homes Available in the Area
                            </h2>
                            <p className="text-brand-text-muted text-lg leading-relaxed font-light">
                                Browse current listings across Kitchener, Waterloo, Cambridge, Breslau, & GTA. New properties added daily.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <Link
                                href="/listings"
                                className="text-brand-accent text-sm font-semibold uppercase tracking-wider hover:text-brand-accent-light flex items-center gap-2 group"
                            >
                                View All Listings
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                        </div>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((listing, index) => (
                        <AnimatedSection
                            key={listing.id}
                            className={index > 0 ? `hidden sm:block` : ''}
                        >
                            <ListingCard listing={listing} />
                        </AnimatedSection>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/listings"
                        className="inline-block bg-brand-accent hover:bg-brand-accent-light text-white font-medium px-8 py-4 transition-colors text-center uppercase tracking-wider text-sm shadow-sm hover:shadow"
                    >
                        View All Listings →
                    </Link>
                </div>
            </div>
        </section>
    )
}
