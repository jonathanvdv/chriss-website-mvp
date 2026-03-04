import Image from 'next/image'
import Link from 'next/link'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

export function AboutPreview() {
    return (
        <section className="py-20 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image Side */}
                    <AnimatedSection className="relative aspect-[3/4] md:aspect-auto md:h-[600px] lg:h-[700px] w-full order-2 md:order-1">
                        <Image
                            src="/images/abdulnewphoto1.jpg"
                            alt="Abdul Basharmal - Real Estate Professional"
                            fill
                            className="object-contain object-bottom"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </AnimatedSection>

                    {/* Content Side */}
                    <AnimatedSection className="order-1 md:order-2">
                        <SectionLabel text="About Abdul" />
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-text mb-8 leading-[1.1]">
                            I'm Not Just Your Agent. <span className="italic">I'm Your Neighbour.</span>
                        </h2>

                        <div className="space-y-6 text-brand-text-muted text-base md:text-lg leading-relaxed font-light mb-10">
                            <p>
                                I've lived and worked in this region long enough to know which neighbourhoods are undervalued right now, which schools are the best-kept secrets, and which streets sell before they even hit the market. I know the neighbourhoods, the schools, the market trends, and what makes each area unique.
                            </p>
                            <p>
                                Before real estate, I spent years at Rogers in data analytics and sales management. That background means I come to every transaction with a clear head and real numbers, not hunches. I'll tell you what your home is actually worth, and I'll tell you honestly if I think an offer is too high.
                            </p>
                            <p>
                                Real estate is more than just a transaction to me. It is about helping people build their lives and put down roots in a place they can truly call home. I also serve the English, Hindi, Persian, Urdu, Dari, and Farsi-speaking communities across Waterloo Region. If you or your family are more comfortable navigating this process in any of these languages, that's exactly how we'll do it.
                            </p>
                        </div>

                        <Link
                            href="/about"
                            className="inline-block bg-brand-bg-dark hover:bg-black text-white px-8 py-4 uppercase tracking-wider text-sm font-medium transition-colors"
                        >
                            Get to Know Abdul →
                        </Link>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    )
}
