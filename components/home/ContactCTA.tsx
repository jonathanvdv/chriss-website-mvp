import Link from 'next/link'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

export function ContactCTA() {
    return (
        <section className="bg-brand-bg-dark text-white py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <AnimatedSection>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
                        Curious What Your Home <br className="hidden md:block" /> Is Worth Right Now?
                    </h2>

                    <p className="text-brand-text-muted text-lg md:text-xl leading-relaxed font-light mb-12 max-w-2xl mx-auto">
                        The Waterloo Region market moves fast. Get a free, no-obligation evaluation from someone who actually knows your street, not just the algorithm.
                    </p>

                    <Link
                        href="/contact?type=evaluation"
                        className="inline-block bg-brand-accent hover:bg-brand-accent-light text-white px-10 py-5 uppercase tracking-wider text-sm font-medium transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
                    >
                        Get My Free Home Evaluation →
                    </Link>

                    <p className="mt-6 text-brand-text-muted text-sm italic">
                        Most evaluations delivered within 24 hours. No commitment, no cold calls.
                    </p>
                </AnimatedSection>
            </div>
        </section>
    )
}
