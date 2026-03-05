import Link from 'next/link'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

export function NeighbourhoodGuide() {
    const neighbourhoods = [
        {
            name: "Williamsburg, Kitchener",
            desc: "Family-friendly streets, great schools, and some of the most sought-after homes in the city.",
            link: "/listings?city=Kitchener"
        },
        {
            name: "Doon, Kitchener",
            desc: "Established, quiet, and close to the 401. A favourite for families and move-up buyers.",
            link: "/listings?city=Kitchener"
        },
        {
            name: "Uptown Waterloo",
            desc: "Vibrant, walkable, and growing fast. Perfect for young professionals and condo buyers.",
            link: "/listings?city=Waterloo"
        },
        {
            name: "Forest Heights",
            desc: "Affordable, well-connected, and close to everything. A smart choice for first-time buyers.",
            link: "/listings?city=Kitchener"
        },
        {
            name: "Galt, Cambridge",
            desc: "Historic charm, lower price points, and a community that's quietly becoming one of Ontario's best-kept secrets.",
            link: "/listings?city=Cambridge"
        },
        {
            name: "Waterloo North",
            desc: "Close to both universities, strong rental income potential, and a diverse, energetic community.",
            link: "/listings?city=Waterloo"
        },
    ]

    return (
        <section className="py-24 md:py-32 bg-brand-bg relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <AnimatedSection className="mb-16 md:mb-20">
                    <SectionLabel text="Explore the Region" />
                    <h2 className="font-display text-4xl md:text-5xl text-brand-text mb-6">
                        Find Your <span className="italic text-brand-accent">Neighbourhood</span>
                    </h2>
                    <p className="max-w-2xl text-brand-text-muted text-lg leading-relaxed font-light">
                        Waterloo Region (Kitchener, Waterloo, Cambridge, Breslau, & GTA) has a neighbourhood for every lifestyle. Here's where to start.
                    </p>
                </AnimatedSection>

                {/* Horizontal scroll container on mobile, grid on desktop */}
                <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 gap-6 lg:gap-8 snap-x lg:snap-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {neighbourhoods.map((n, index) => (
                        <AnimatedSection
                            key={index}
                            className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center relative group rounded-sm overflow-hidden aspect-[4/3] bg-brand-bg-dark border border-brand-border/20"
                        >
                            <Link href={n.link} className="block w-full h-full relative">
                                {/* Simulated background styling without real image needed yet */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-bg-dark via-brand-accent/40 to-brand-bg-dark/5 opacity-80 mix-blend-multiply group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none"></div>

                                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                                    <h3 className="font-display text-2xl lg:text-3xl font-medium text-white mb-3 group-hover:transform group-hover:-translate-y-2 transition-transform duration-300">
                                        {n.name}
                                    </h3>
                                    <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-sm font-light">
                                        {n.desc}
                                    </p>

                                    <span className="text-brand-gold text-xs font-semibold uppercase tracking-widest inline-flex items-center gap-2 group-hover:transform group-hover:translate-x-2 transition-transform duration-300 w-max">
                                        Explore <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </span>
                                </div>
                            </Link>
                        </AnimatedSection>
                    ))}
                </div>
            </div>

            {/* Hide scrollbar trick for webkit */}
            <style dangerouslySetInnerHTML={{
                __html: `
        ::-webkit-scrollbar { display: none; }
      `}} />
        </section>
    )
}
