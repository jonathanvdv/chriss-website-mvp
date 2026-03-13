import Image from 'next/image'
import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function HeroSection() {
    return (
        <section className="relative w-full bg-white pt-[80px] lg:pt-[90px] overflow-hidden lg:h-screen">
            <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 w-full h-full">
                <div className="flex flex-col lg:flex-row items-end h-full">
                    {/* Main Content Area */}
                    <div className="w-full lg:w-1/2 flex flex-col z-10 lg:pr-8 pt-4 lg:pt-14 lg:pb-0 lg:justify-start lg:self-stretch">
                        {/* Mobile: side-by-side heading + image */}
                        <div className="flex flex-row items-stretch lg:block w-full mb-6 lg:mb-0">
                            {/* Text */}
                            <AnimatedSection className="w-[60%] lg:w-full pr-2 lg:pr-0 self-center z-10">
                                <p className="text-brand-accent tracking-[0.2em] text-[10px] lg:text-xs font-semibold uppercase mb-3 lg:mb-5 leading-tight">
                                    Cambridge · Kitchener · Waterloo · Guelph · Paris
                                </p>

                                <h1 className="font-display text-[2.5rem] leading-[1.05] sm:text-5xl lg:text-6xl 2xl:text-7xl text-brand-text mb-4 lg:mb-5 text-balance">
                                    Your Next Home Is <br className="hidden md:block" />
                                    <span className="italic">Already Listed.</span>
                                </h1>

                                <div className="text-brand-text-muted text-[13px] sm:text-sm lg:text-lg 2xl:text-xl leading-relaxed font-light text-pretty space-y-4 lg:space-y-5">
                                    <p>
                                        I&apos;m Chris Pimentel, a REALTOR® with RE/MAX Twin City. For 16 years,
                                        I&apos;ve helped families across the Waterloo Region find homes they love and
                                        sell for prices they didn&apos;t expect.
                                    </p>
                                    <p className="hidden lg:block">
                                        New listings hit this site every day and the best ones move fast. Whether
                                        you&apos;re buying your first home or selling to move up, I&apos;ll make sure
                                        you never miss an opportunity.
                                    </p>
                                </div>
                            </AnimatedSection>

                            {/* Mobile Image */}
                            <div className="w-[40%] relative lg:hidden h-[40vh] min-h-[250px] self-end z-0">
                                <Image
                                    src="/images/chris3.png"
                                    alt="Chris Pimentel - Cambridge & Waterloo Region REALTOR"
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 40vw"
                                    className="object-contain object-bottom"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-5 lg:mb-6 mt-0 lg:mt-8 relative z-20">
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
                                What&apos;s My Home Worth?
                            </Link>
                        </div>

                        {/* Trust badge */}
                        <div className="flex justify-center sm:justify-start text-[9px] sm:text-[10px] lg:text-xs font-medium text-brand-text-muted uppercase tracking-wider lg:mb-0 mb-4">
                            <span className="flex items-center gap-1.5 lg:gap-3">
                                <span className="text-brand-accent">✓</span> 16 Years Experience · 150+ Families Served
                                · RE/MAX Twin City
                            </span>
                        </div>
                    </div>

                    {/* Desktop Image — large, bottom-aligned */}
                    <div className="hidden lg:flex w-1/2 justify-center items-end relative h-full">
                        <div className="relative w-full max-w-[580px] 2xl:max-w-[660px] h-[calc(100vh-90px)]">
                            <Image
                                src="/images/chris3.png"
                                alt="Chris Pimentel - Cambridge & Waterloo Region REALTOR"
                                fill
                                priority
                                sizes="50vw"
                                className="object-contain object-bottom"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
