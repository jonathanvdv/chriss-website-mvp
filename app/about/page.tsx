import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { TestimonialsSection } from '@/app/_components/TestimonialsSection'

export const metadata: Metadata = {
    title: 'About Chris Pimentel | REALTOR® Cambridge & Tri-Cities',
    description:
        'Learn about Chris Pimentel - a seasoned REALTOR® with 16 years of experience at RE/MAX Twin City Realty in Cambridge, Ontario, serving buyers and sellers across the Tri-Cities region.',
}

export default function AboutPage() {
    return (
        <div className="bg-brand-bg min-h-screen pt-20">
            {/* Hero */}
            <section className="relative h-[60vh] min-h-[500px] flex flex-col items-center justify-center">
                <Image
                    src="/images/chris3.png"
                    alt="Chris Pimentel"
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain object-bottom saturate-[1.15]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent"></div>

                <div
                    className="relative z-10 text-center px-4 flex items-end justify-center w-full"
                    style={{ marginTop: 'auto', paddingBottom: '4px' }}
                >
                    <h1 className="font-display text-5xl md:text-7xl text-brand-text">
                        Hi, I&apos;m <span className="italic text-brand-accent">Chris.</span>
                    </h1>
                </div>
            </section>

            <div className="flex justify-center py-12">
                <ChevronDown className="w-8 h-8 text-brand-text animate-bounce" />
            </div>

            {/* Story Section */}
            <section className="pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-brand-accent text-xs font-semibold uppercase tracking-widest mb-6">My Story</p>
                    <h2 className="font-display text-4xl md:text-5xl text-brand-text mb-10 leading-tight">
                        I Don&apos;t Just Sell Homes. <br className="hidden md:block" />I Help Families{' '}
                        <span className="italic text-brand-accent">Move Forward</span>
                    </h2>
                </div>

                <div className="prose prose-lg prose-brand max-w-none text-brand-text-muted font-light leading-relaxed space-y-6">
                    <p>
                        For the past 16 years, I have been helping families across Cambridge, Kitchener, Waterloo,
                        Guelph, and Paris buy and sell homes. Real estate is not just my career. It is my calling. There
                        is nothing more rewarding than handing someone the keys to a place where they will build their
                        life.
                    </p>
                    <p>
                        I grew up in this community and I have watched it evolve. I know the neighbourhoods, the
                        streets, and the subtle shifts in the market that make all the difference when it comes to
                        pricing a home right or finding the perfect property. That kind of local knowledge only comes
                        with time, and after 16 years, I have seen just about every scenario the market can throw at
                        you.
                    </p>
                    <p>
                        To me, real estate is about more than a transaction. It is about building futures, creating
                        stability, and helping people find a place where they truly feel at home. I take pride in
                        guiding my clients with honesty, transparency, and a strategy tailored to their specific goals.
                    </p>
                    <p>
                        Whether you are purchasing your first home, expanding your investment portfolio, selling to move
                        on to your next chapter, or seeking advice on residential financing and leasing, I am here to
                        support you every step of the way.
                    </p>
                    <p>
                        Based in Cambridge and working with RE/MAX Twin City Realty, I bring a professional and results
                        driven approach to every interaction. I look forward to helping you achieve your real estate
                        goals.
                    </p>
                </div>
            </section>

            {/* How I Work Section */}
            <section className="py-24 bg-white border-y border-brand-border/40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="font-display text-4xl md:text-5xl text-brand-text">
                            What You Can <span className="italic text-brand-accent">Expect From Me</span>
                        </h2>
                    </div>

                    <div className="space-y-16">
                        <div className="flex flex-col md:flex-row gap-8 items-start group">
                            <div className="w-16 h-16 shrink-0 rounded-full bg-brand-bg flex items-center justify-center text-3xl shadow-sm border border-brand-border/50 group-hover:bg-brand-accent transition-colors duration-300">
                                <span className="group-hover:grayscale group-hover:brightness-200 transition-all">
                                    🏡
                                </span>
                            </div>
                            <div>
                                <h3 className="font-display text-3xl text-brand-text mb-4">If You&apos;re Buying</h3>
                                <p className="text-brand-text-muted text-lg leading-relaxed font-light">
                                    You can expect honest guidance from day 1. If a property is overpriced, I will tell
                                    you. I review accurate comparables, break down what is happening in that specific
                                    neighbourhood, and help you structure a strong, strategic offer that makes sense for
                                    you. My goal is for you to feel confident in your decision, not stressed or second
                                    guessing it later.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start group">
                            <div className="w-16 h-16 shrink-0 rounded-full bg-brand-bg flex items-center justify-center text-3xl shadow-sm border border-brand-border/50 group-hover:bg-brand-accent transition-colors duration-300">
                                <span className="group-hover:grayscale group-hover:brightness-200 transition-all">
                                    📈
                                </span>
                            </div>
                            <div>
                                <h3 className="font-display text-3xl text-brand-text mb-4">If You&apos;re Selling</h3>
                                <p className="text-brand-text-muted text-lg leading-relaxed font-light">
                                    Pricing and presentation are critical. I provide a clear and realistic evaluation of
                                    your home&apos;s value in today&apos;s market, along with a detailed plan to
                                    showcase it properly. From professional marketing to a focused negotiation strategy,
                                    every step is designed to protect your bottom line and maximize your results.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start group">
                            <div className="w-16 h-16 shrink-0 rounded-full bg-brand-bg flex items-center justify-center text-3xl shadow-sm border border-brand-border/50 group-hover:bg-brand-accent transition-colors duration-300">
                                <span className="group-hover:grayscale group-hover:brightness-200 transition-all">
                                    🤝
                                </span>
                            </div>
                            <div>
                                <h3 className="font-display text-3xl text-brand-text mb-4">Either Way</h3>
                                <p className="text-brand-text-muted text-lg leading-relaxed font-light">
                                    You work directly with me. You have my personal number, and you can call or text
                                    anytime. I respond promptly and keep communication clear throughout the process. I
                                    intentionally keep my business focused and manageable so I can give each client the
                                    attention, strategy, and service they truly deserve.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Credentials Section */}
            <section className="py-24 bg-brand-bg">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                        {/* Background */}
                        <div>
                            <p className="text-brand-accent text-xs font-semibold uppercase tracking-widest mb-8 border-b border-brand-border pb-4">
                                Background
                            </p>
                            <ul className="space-y-6 text-brand-text-muted text-lg font-light">
                                <li className="flex gap-4">
                                    <span className="text-brand-accent mt-1">•</span>
                                    <span>
                                        <strong className="text-brand-text">16 Years of Real Estate Experience</strong>
                                        <br />
                                        <span className="text-sm">Helping families across the Tri-Cities region</span>
                                    </span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-brand-accent mt-1">•</span>
                                    <span>
                                        <strong className="text-brand-text">Deep Community Roots</strong>
                                        <br />
                                        <span className="text-sm">Cambridge and the surrounding Tri-Cities area</span>
                                    </span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-brand-accent mt-1">•</span>
                                    <span>
                                        <strong className="text-brand-text">Based in:</strong> Cambridge, Ontario
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Credentials */}
                        <div>
                            <p className="text-brand-accent text-xs font-semibold uppercase tracking-widest mb-8 border-b border-brand-border pb-4">
                                Credentials & Affiliations
                            </p>
                            <ul className="space-y-6 text-brand-text-muted text-lg font-light">
                                <li className="flex gap-4">
                                    <span className="text-brand-accent mt-1">•</span>
                                    <span>Licensed REALTOR® - Province of Ontario</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-brand-accent mt-1">•</span>
                                    <span>Member: Canadian Real Estate Association (CREA)</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-brand-accent mt-1">•</span>
                                    <span>Member: Waterloo Region Association of REALTORS® (WRAR)</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-brand-accent mt-1">•</span>
                                    <span>Brokerage: RE/MAX Twin City Realty Inc.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <TestimonialsSection />

            {/* CTA */}
            <section className="py-24 md:py-32 bg-white text-center px-4">
                <h2 className="font-display text-4xl md:text-5xl text-brand-text mb-6">
                    Let&apos;s Find Out If We&apos;re a <span className="italic text-brand-accent">Good Fit</span>
                </h2>
                <p className="text-brand-text-muted text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                    No pitch, no pressure. Just a conversation about what you&apos;re trying to do and whether I&apos;m
                    the right person to help.
                </p>
                <Link
                    href="/contact"
                    className="inline-block bg-brand-accent hover:bg-brand-accent-light text-white px-10 py-5 uppercase tracking-wider text-sm font-medium transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                    Reach Out to Chris &#8594;
                </Link>
            </section>
        </div>
    )
}
