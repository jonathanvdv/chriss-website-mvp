import Link from 'next/link'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { MapPin } from 'lucide-react'

export function NeighbourhoodGuide({ showHeader = true }: { showHeader?: boolean }) {
    const neighbourhoods = [
        {
            name: "Williamsburg",
            city: "Kitchener",
            desc: "Family-friendly streets, great schools, and some of the most sought-after homes in the city.",
            tags: ["Families", "Top Schools", "Move-Up Buyers"],
            link: "/listings"
        },
        {
            name: "Doon",
            city: "Kitchener",
            desc: "Established, quiet, and close to the 401. A favourite for families and move-up buyers.",
            tags: ["Quiet", "Highway Access", "Families"],
            link: "/listings"
        },
        {
            name: "Uptown Waterloo",
            city: "Waterloo",
            desc: "Vibrant, walkable, and growing fast. Perfect for young professionals and condo buyers.",
            tags: ["Walkable", "LRT Access", "Condos"],
            link: "/listings"
        },
        {
            name: "Forest Heights",
            city: "Kitchener",
            desc: "Affordable, well-connected, and close to everything. A smart choice for first-time buyers.",
            tags: ["Affordable", "First-Time Buyers", "Central"],
            link: "/listings"
        },
        {
            name: "Galt",
            city: "Cambridge",
            desc: "Historic charm, lower price points, and a community that's quietly becoming one of Ontario's best-kept secrets.",
            tags: ["Character Homes", "Value", "Grand River"],
            link: "/listings"
        },
        {
            name: "Waterloo North",
            city: "Waterloo",
            desc: "Close to both universities, strong rental income potential, and a diverse, energetic community.",
            tags: ["Investment", "Universities", "Diverse"],
            link: "/listings"
        },
    ]

    return (
        <section className={`${showHeader ? 'py-12 md:py-20' : 'py-8 md:py-12'} bg-white relative`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {showHeader && (
                    <AnimatedSection className="mb-16 md:mb-20 text-center">
                        <SectionLabel text="Explore the Region" />
                        <h2 className="font-display text-4xl md:text-5xl text-brand-text mb-6">
                            Find Your <span className="italic text-brand-accent">Neighbourhood</span>
                        </h2>
                        <p className="text-brand-text-muted text-lg leading-relaxed font-light">
                            Waterloo Region has a neighbourhood for every lifestyle. Here are the areas Abdul knows best.
                        </p>
                    </AnimatedSection>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {neighbourhoods.map((n, index) => (
                        <AnimatedSection key={index}>
                            <Link
                                href={n.link}
                                className="group block bg-brand-bg border border-brand-border hover:border-brand-accent/30 rounded-sm p-8 h-full transition-all duration-300 hover:shadow-lg relative"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-display text-2xl text-brand-text group-hover:text-brand-accent transition-colors">
                                            {n.name}
                                        </h3>
                                        <p className="text-xs uppercase tracking-widest text-brand-text-muted mt-1 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {n.city}
                                        </p>
                                    </div>
                                    <span className="text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity text-lg mt-1">→</span>
                                </div>

                                <p className="text-brand-text-muted text-sm leading-relaxed font-light mb-6">
                                    {n.desc}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {n.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold text-brand-accent/80 bg-brand-accent/5 border border-brand-accent/10 px-2.5 py-1 rounded-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        </AnimatedSection>
                    ))}
                </div>

                <AnimatedSection className="mt-12 text-center">
                    <Link
                        href="/listings"
                        className="inline-block border border-brand-border hover:border-brand-accent text-brand-text hover:text-brand-accent font-medium px-8 py-4 uppercase tracking-wider text-sm transition-colors"
                    >
                        Explore All Neighbourhoods →
                    </Link>
                </AnimatedSection>
            </div>
        </section>
    )
}
