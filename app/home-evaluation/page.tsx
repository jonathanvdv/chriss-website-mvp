import { Metadata } from 'next'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
    title: 'Free Home Evaluation | Abdul Basharmal — RE/MAX Twin City',
    description: 'Find out what your home is worth. Get a free, no-obligation home evaluation from Abdul Basharmal — your local Kitchener-Waterloo real estate expert.',
}

const testimonials = [
    {
        id: 1,
        quote: "Abdul found us our place in Williamsburg before it was even listed publicly. He just knew. First-time buyers and we never felt lost. He explained everything twice if we needed it.",
        author: "Omar & Nadia K., Kitchener",
        stars: 5,
    },
    {
        id: 2,
        quote: "I was nervous about selling my parents' home after they passed. Abdul handled it with so much care. We got great value and the whole process felt human, not transactional.",
        author: "Ramona T., Cambridge",
        stars: 5,
    },
    {
        id: 3,
        quote: "کار کردن با عبدالبشارمل خیلی آسان بود. او به زبان دری صحبت میکند و همه چیز را کاملاً توضیح داد. خانه رویاهای ما را پیدا کردیم.",
        translation: "Working with Abdul was so easy. He speaks Dari and explained everything clearly. We found our dream home.",
        author: "Khalid & Maryam F., Waterloo",
        stars: 5,
    },
]

const credentials = [
    {
        title: 'RE/MAX Twin City',
        description: 'Backed by the most recognized real estate brand in the world',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
        ),
    },
    {
        title: 'Born & Raised in KW',
        description: 'Deep roots in the Kitchener-Waterloo community since childhood',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
        ),
    },
    {
        title: '6 Languages Spoken',
        description: 'English, Farsi, Dari, Persian, Hindi & Urdu',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
            </svg>
        ),
    },
]

const steps = [
    { number: '01', title: 'Fill Out the Form', description: 'Share a few details about your property below.' },
    { number: '02', title: 'Abdul Reviews Your Property', description: 'He analyzes recent comparable sales, market trends, and your neighbourhood.' },
    { number: '03', title: 'Receive Your Evaluation', description: 'Get a detailed evaluation within 24 hours — no strings attached.' },
]

export default function HomeEvaluationPage() {
    return (
        <main>
            {/* Hero */}
            <section className="relative bg-white pt-[90px] lg:pt-32 pb-16 md:pb-24 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-accent/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-accent/[0.03] to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <AnimatedSection>
                        <SectionLabel text="Free Home Evaluation" />
                        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-brand-text mb-6">
                            What Is Your Home <span className="italic text-brand-accent">Worth?</span>
                        </h1>
                        <p className="text-brand-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                            Get a free, no-obligation evaluation from Abdul Basharmal — your local Kitchener-Waterloo expert who knows these neighbourhoods inside and out.
                        </p>
                        <a
                            href="#form"
                            className="inline-block bg-brand-accent hover:bg-brand-accent-light text-white font-medium px-10 py-4 transition-all uppercase tracking-wider text-sm shadow-lg shadow-brand-accent/20 hover:shadow-xl hover:shadow-brand-accent/30 hover:-translate-y-0.5"
                        >
                            Get Your Free Evaluation →
                        </a>
                    </AnimatedSection>
                </div>
            </section>

            {/* Credentials Bar */}
            <section className="bg-brand-accent py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {credentials.map((c) => (
                            <AnimatedSection key={c.title} className="text-center flex flex-col items-center">
                                <div className="text-white/80 mb-3">
                                    {c.icon}
                                </div>
                                <h3 className="font-display text-lg md:text-xl text-white mb-1">{c.title}</h3>
                                <p className="text-white/70 text-sm">{c.description}</p>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Props + Form */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        <AnimatedSection className="order-2 lg:order-1">
                            <SectionLabel text="Why Request an Evaluation" />
                            <h2 className="font-display text-3xl md:text-4xl text-brand-text mb-4">
                                No pressure. No spam.<br />
                                <span className="italic text-brand-accent">Just the value.</span>
                            </h2>
                            <p className="text-brand-text-muted mb-10 text-lg leading-relaxed font-light">
                                Whether you're thinking about selling or just curious, knowing your home's value puts you in control.
                            </p>

                            <div className="space-y-6">
                                {[
                                    {
                                        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
                                        title: 'Fast 24-Hour Response',
                                        desc: 'Abdul personally reviews every request and responds within one business day.',
                                    },
                                    {
                                        icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></>,
                                        title: 'Local Market Expertise',
                                        desc: 'Born and raised in KW — Abdul knows every neighbourhood, street, and market shift.',
                                    },
                                    {
                                        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />,
                                        title: 'No Obligation',
                                        desc: 'This is about giving you information, not a sales pitch. Zero pressure, always.',
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="flex gap-4 p-4 rounded-sm border border-brand-border/40 bg-brand-bg/50 hover:border-brand-accent/30 hover:shadow-sm transition-all">
                                        <div className="flex-shrink-0 w-11 h-11 bg-brand-accent/10 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-brand-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                {item.icon}
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-base text-brand-text mb-0.5">{item.title}</h3>
                                            <p className="text-brand-text-muted text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedSection>

                        <AnimatedSection className="order-1 lg:order-2">
                            <div id="form" className="scroll-mt-24 bg-white border border-brand-border/60 p-8 md:p-10 shadow-xl shadow-black/[0.04] relative">
                                {/* Green accent top bar */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-accent" />
                                <h3 className="font-display text-2xl text-brand-text mb-2">Request Your Free Evaluation</h3>
                                <p className="text-brand-text-muted text-sm mb-6">Fill out the form and Abdul will get back to you within 24 hours.</p>
                                <ContactForm
                                    defaultIntent="Sell"
                                    defaultMessage="Hi Abdul. I'd like to get a free home evaluation for my property located at [Your Address]."
                                />
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 md:py-24 bg-brand-bg border-y border-brand-border/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16">
                        <SectionLabel text="How It Works" />
                        <h2 className="font-display text-3xl md:text-4xl text-brand-text">
                            Three Simple <span className="italic text-brand-accent">Steps</span>
                        </h2>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                        {steps.map((s, i) => (
                            <AnimatedSection key={s.number} className="relative text-center bg-white border border-brand-border/40 p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
                                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-accent text-white font-display text-lg mb-5">{i + 1}</span>
                                <h3 className="font-display text-xl text-brand-text mb-2">{s.title}</h3>
                                <p className="text-brand-text-muted text-sm leading-relaxed">{s.description}</p>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
                        <SectionLabel text="What Clients Say" />
                        <h2 className="font-display text-3xl md:text-4xl text-brand-text">
                            Real Stories from <span className="italic text-brand-accent">Real Families</span>
                        </h2>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <AnimatedSection key={t.id} className="bg-brand-bg border border-brand-border/40 p-8 md:p-10 flex flex-col relative shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-brand-accent/15 font-display text-9xl absolute -top-8 left-4 select-none">&ldquo;</span>
                                <div className="flex gap-1 mb-5 mt-4 relative z-10">
                                    {[...Array(t.stars)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <div className="flex-1 text-brand-text mb-8 relative z-10 leading-relaxed font-light text-lg">
                                    <p>&ldquo;{t.quote}&rdquo;</p>
                                    {t.translation && (
                                        <p className="mt-4 text-sm text-brand-text-muted italic leading-relaxed">{t.translation}</p>
                                    )}
                                </div>
                                <p className="text-brand-text font-medium text-sm tracking-wider uppercase">— {t.author}</p>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-brand-accent py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <AnimatedSection>
                        <h2 className="font-display text-3xl md:text-5xl text-white mb-6">
                            Ready to Find <span className="italic text-white/80">Out?</span>
                        </h2>
                        <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                            It takes two minutes to fill out the form. Abdul will handle the rest.
                        </p>
                        <a
                            href="#form"
                            className="inline-block bg-white text-brand-accent hover:bg-brand-bg font-medium px-10 py-4 transition-all uppercase tracking-wider text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Get Your Free Evaluation →
                        </a>
                    </AnimatedSection>
                </div>
            </section>
        </main>
    )
}
