import { Metadata } from 'next'
import Link from 'next/link'
import { NeighbourhoodGuide } from '@/app/_components/NeighbourhoodGuide'

export const metadata: Metadata = {
    title: 'Neighbourhoods Guide | Kitchener, Waterloo & Cambridge',
    description: 'Explore the different communities across the Waterloo Region. From family-friendly Kitchener suburbs to walkable Uptown Waterloo.',
}

export default function NeighbourhoodsPage() {
    return (
        <div className="bg-brand-bg min-h-screen pt-[124px] lg:pt-[136px] pb-16 border-t border-brand-border/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-8 md:mb-12">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-text mb-6">
                        <span className="italic text-brand-accent">Neighbourhoods</span> of <br className="hidden md:block" />Waterloo Region
                    </h1>
                    <p className="text-brand-text-muted text-lg leading-relaxed font-light max-w-2xl mx-auto">
                        From historic downtowns to quiet suburban cul-de-sacs, the Tri-Cities offer a diverse range of communities. Where you live dictates your lifestyle just as much as the house itself.
                    </p>
                </div>

            </div>

            <NeighbourhoodGuide showHeader={false} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="prose prose-lg prose-brand max-w-none text-brand-text-muted font-light leading-relaxed my-16">
                    <h2 className="font-display text-3xl">Choosing the Right Area</h2>
                    <p>
                        The Waterloo Region is composed of three primary cities (Kitchener, Waterloo, and Cambridge) and several surrounding townships. While they operate as one interconnected metropolitan area, each city, and each neighbourhood within them, has its own distinct character, property values, and pace of life.
                    </p>
                    <p>
                        If you're relocating for work in the tech sector, you might gravitate towards Uptown Waterloo or the Innovation District in downtown Kitchener. If you're looking for larger lots, mature trees, and excellent family schools, you might look at Beechwood (Waterloo), Colonial Acres (Waterloo), or Williamsburg (Kitchener).
                    </p>

                    <h3 className="font-display text-2xl mt-12 mb-6 text-brand-text">Kitchener: Growth and Energy</h3>
                    <p>
                        Kitchener is the largest of the three cities and arguably the most rapidly transforming. Downtown has seen heavy investment with the LRT bringing new condo developments, while the outer rings offer established, diverse, family-friendly neighbourhoods with great parks and highway access. Areas like <strong>Doon</strong> and <strong>Pioneer Park</strong> are deeply popular with families looking for space and easy commuting.
                    </p>

                    <h3 className="font-display text-2xl mt-12 mb-6 text-brand-text">Waterloo: Academic & Tech Hub</h3>
                    <p>
                        Home to two major universities and leading tech companies, Waterloo tends to carry a slight price premium over Kitchener and Cambridge. The uptown core is highly walkable, filled with independent restaurants, and surrounded by older, prestigious neighbourhoods like <strong>Westmount</strong>. Further out, areas like <strong>Eastbridge</strong> and <strong>Laurelwood</strong> are known for some of the best-rated public schools in the region.
                    </p>

                    <h3 className="font-display text-2xl mt-12 mb-6 text-brand-text">Cambridge: Historic Charm and Value</h3>
                    <p>
                        Cambridge is actually the amalgamation of three historic towns: Galt, Preston, and Hespeler. It sits right on the 401, making it a very strong choice for commuters heading towards the GTA or London. The limestone architecture along the Grand River in downtown Galt gives it a unique aesthetic that draws many buyers who want character homes or loft spaces at a relatively more accessible price point than Waterloo.
                    </p>
                </div>

                <div className="bg-brand-bg-dark text-white p-12 text-center mt-20 rounded-sm">
                    <h3 className="font-display text-3xl mb-4 italic text-brand-gold">Not sure where to start?</h3>
                    <p className="text-white/80 font-light mb-8 max-w-lg mx-auto">
                        Tell me what's important to you: schools, walkability, lot size, commute, and I can tell you exactly which streets to watch.
                    </p>
                    <Link href="/contact" className="inline-block bg-brand-accent hover:bg-brand-accent-light px-8 py-4 uppercase tracking-wider text-sm font-semibold transition-colors">
                        Ask Abdul for a Recommendation →
                    </Link>
                </div>

            </div>
        </div>
    )
}
