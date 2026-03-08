import { MapPin, MessageCircle, ShieldCheck, TrendingUp, User, Home } from 'lucide-react'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

export function WhyChooseAbdul() {
    const reasons = [
        {
            icon: MapPin,
            title: "He Knows the Neighbourhood",
            description: "I'm not pulling comps from a database. I know Williamsburg, Doon, Forest Heights, and Beechwood. I know which blocks hold value and which don't. That local knowledge is the difference between a good deal and a great one."
        },
        {
            icon: MessageCircle,
            title: "He Speaks Your Language - Literally",
            description: "I serve clients in English, Farsi, Dari, Persian, Hindi, and Urdu. For many families in our community, being able to navigate a mortgage, an offer, or a closing in your own language isn't just convenient, it's essential."
        },
        {
            icon: ShieldCheck,
            title: "He'll Tell You The Truth",
            description: "If a house is overpriced, I'll tell you. If it's a great deal, I'll tell you that too. I'd rather give you honest advice that builds a long-term relationship than tell you what you want to hear for a quick commission."
        },
        {
            icon: TrendingUp,
            title: "He Comes With a Data Background",
            description: "Before real estate I spent years analyzing markets and managing sales teams at Rogers. I bring that same rigor to pricing, timing, and negotiation. Emotion has its place, but so does the math."
        },
        {
            icon: User,
            title: "You Get Abdul, Not an Assistant",
            description: "You won't be handed off. When you call or text, you're reaching me directly. I keep my client list intentionally manageable because I'd rather do a great job for fewer people than a mediocre job for many."
        },
        {
            icon: Home,
            title: "Free Evaluation, No Pressure",
            description: "Start with a conversation. Get a home evaluation. There's no obligation and no sales pitch. If we're a good fit, great. If not, I'll still point you in the right direction."
        },
    ]

    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <AnimatedSection className="text-center max-w-2xl mx-auto mb-20 md:mb-24">
                    <SectionLabel text="Why Clients Choose Abdul" />
                    <h2 className="font-display text-4xl md:text-5xl text-brand-text mb-6">
                        Real Estate the <span className="italic text-brand-accent">Way It Should Feel</span>
                    </h2>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-16">
                    {reasons.map((reason, index) => {
                        const Icon = reason.icon
                        return (
                            <AnimatedSection
                                key={index}
                                className="flex flex-col text-left group"
                            >
                                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-bg text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-display font-medium text-2xl text-brand-text mb-4">
                                    {reason.title}
                                </h3>
                                <p className="text-brand-text-muted leading-relaxed font-light">
                                    {reason.description}
                                </p>
                            </AnimatedSection>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
