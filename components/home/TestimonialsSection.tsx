import { SectionLabel } from '@/components/shared/SectionLabel'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

export function TestimonialsSection() {
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

    return (
        <section className="py-12 md:py-20 bg-brand-bg-dark text-white relative border-y border-brand-border/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <AnimatedSection className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
                    <SectionLabel text="What Clients Say" className="text-brand-gold" />
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                        Real Stories from <span className="italic text-brand-gold">Real Families</span>
                    </h2>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <AnimatedSection
                            key={t.id}
                            className="bg-brand-card p-8 md:p-10 flex flex-col relative"
                        >
                            {/* Large quote mark */}
                            <span className="text-brand-accent/20 font-display text-9xl absolute -top-8 left-4 select-none">"</span>

                            <div className="flex gap-1 mb-6 mt-4 relative z-10">
                                {[...Array(t.stars)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <div className="flex-1 text-brand-text mb-8 relative z-10 leading-relaxed font-light text-lg">
                                <p>"{t.quote}"</p>
                                {t.translation && (
                                    <p className="mt-4 text-sm text-brand-text-muted italic leading-relaxed">
                                        {t.translation}
                                    </p>
                                )}
                            </div>

                            <p className="text-brand-text font-medium text-sm tracking-wider uppercase">
                                - {t.author}
                            </p>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    )
}
