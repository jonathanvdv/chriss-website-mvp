import Image from 'next/image'
import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function HeroSection() {
    return (
        <section className="relative w-full lg:min-h-[85vh] xl:min-h-[80vh] bg-white pt-[90px] pb-8 lg:pt-32 lg:pb-0 flex flex-col overflow-hidden">
            <div className="max-w-6xl 2xl:max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-12 2xl:px-20 w-full flex-1 flex flex-col relative justify-center">
                <div className="flex flex-col lg:flex-row flex-1 h-full w-full">

                    {/* Main Content Area */}
                    <div className="w-full lg:w-7/12 flex flex-col pt-0 lg:pt-4 pb-0 lg:pb-16 z-10 lg:pr-12 lg:justify-center">

                        {/* Heading & Image Row on Mobile */}
                        <div className="flex flex-row items-stretch lg:block w-full mb-6 lg:mb-0">
                            {/* Text (Left) */}
                            <AnimatedSection className="w-[60%] lg:w-full lg:max-w-3xl pr-2 lg:pr-0 self-center lg:self-auto z-10">
                                <p className="text-brand-accent tracking-[0.2em] text-[10px] lg:text-xs font-semibold uppercase mb-3 lg:mb-6 leading-tight">
                                    Kitchener · Waterloo · Cambridge
                                </p>

                                <h1 className="font-display text-[2.5rem] leading-[1.05] sm:text-5xl lg:text-6xl 2xl:text-7xl text-brand-text mb-4 lg:mb-6 text-balance">
                                    Real Estate That <br className="hidden lg:block md:block" />
                                    <span className="italic">Feels Like Home.</span>
                                </h1>

                                <div className="text-brand-text-muted text-[13px] sm:text-sm lg:text-lg 2xl:text-xl lg:max-w-none leading-relaxed font-light text-pretty space-y-4 lg:space-y-6">
                                    <p>
                                        I'm Abdul Basharmal, a REALTOR® with RE/MAX Twin City. Born and raised in the Waterloo Region, I bring deep local knowledge of the neighbourhoods, schools, and market trends to help you succeed.
                                    </p>
                                    <p className="hidden lg:block">
                                        Buying, selling, or renting — I'm here to guide you with clear advice and hands-on expertise every step of the way. Let's connect and talk about your goals.
                                    </p>
                                </div>
                            </AnimatedSection>

                            {/* Mobile Image (Right) */}
                            <div className="w-[40%] relative lg:hidden h-[40vh] min-h-[250px] self-end z-0">
                                <Image
                                    src="/images/abdul-photo-no-bg-v2.png"
                                    alt="Abdul Basharmal - Waterloo Region REALTOR"
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 40vw"
                                    className="object-contain object-bottom"
                                />
                                {/* Bottom fade to blend with buttons */}
                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Buttons (Stack on mobile, inline on desktop) */}
                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-5 lg:mb-16 mt-0 lg:mt-12 relative z-20">
                            <Link
                                href="/listings"
                                className="bg-brand-accent hover:bg-brand-accent-light text-white font-medium px-6 py-4 lg:px-8 transition-colors text-center uppercase tracking-wider text-xs lg:text-sm shadow-lg hover:shadow-xl w-full sm:w-auto"
                            >
                                Search Listings →
                            </Link>
                            <Link
                                href="/home-evaluation"
                                className="border border-brand-border bg-white lg:bg-transparent hover:bg-brand-border/10 text-brand-text font-medium px-6 py-4 lg:px-8 transition-colors text-center uppercase tracking-wider text-xs lg:text-sm shadow-sm hover:shadow-md lg:shadow-none w-full sm:w-auto"
                            >
                                What's My Home Worth?
                            </Link>
                        </div>

                        {/* Checkmark Features */}
                        <div className="flex justify-center sm:justify-start lg:justify-start text-[9px] sm:text-[10px] lg:text-xs font-medium text-brand-text-muted uppercase tracking-wider mb-0 lg:mb-0">
                            <span className="flex items-center gap-1.5 lg:gap-3">
                                <span className="text-brand-accent">✓</span> English · Farsi · Dari · Persian · Hindi · Urdu
                            </span>
                        </div>
                    </div>

                    {/* Desktop Image */}
                    <div className="hidden lg:block w-5/12 relative h-full min-h-[600px] 2xl:min-h-[700px] z-0">
                        <Image
                            src="/images/abdul-photo-no-bg-v2.png"
                            alt="Abdul Basharmal - Waterloo Region REALTOR"
                            fill
                            priority
                            sizes="50vw"
                            className="object-contain object-right-bottom"
                        />
                        {/* Subtle white overlay edge on desktop */}
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                    </div>

                </div>
            </div>
        </section>
    )
}
