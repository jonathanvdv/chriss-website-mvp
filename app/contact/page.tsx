import { Metadata } from 'next'
import Image from 'next/image'
import { ContactForm } from '@/components/ContactForm'
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Contact Abdul Basharmal | RE/MAX Twin City Realty',
    description: 'Get in touch with Abdul Basharmal to buy or sell a home in Kitchener, Waterloo, or Cambridge. No pressure, no obligation.',
}

export default async function ContactPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string }>
}) {
    const { type } = await searchParams
    const isEvaluation = type === 'evaluation'

    return (
        <div className="bg-brand-bg min-h-screen pt-[124px] lg:pt-[136px] pb-20">

            {/* Header */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 md:mb-16">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-accent font-semibold mb-4">Get in Touch</p>
                <h1 className="font-display text-4xl md:text-5xl text-brand-text mb-4">
                    {isEvaluation ? 'Free Home ' : "Let's "}
                    <span className="italic text-brand-accent">{isEvaluation ? 'Evaluation' : 'Chat'}</span>
                </h1>
                <p className="text-brand-text-muted text-lg leading-relaxed font-light max-w-2xl mx-auto">
                    Real estate decisions are big. You shouldn't have to figure them out alone. Reach out and we'll talk through what you're thinking, no strings attached.
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Left Column — Contact Info */}
                    <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">

                        {/* Abdul Card */}
                        <div className="bg-white border border-brand-border/40 rounded-sm p-8">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-accent/20 shrink-0">
                                    <Image
                                        src="https://cdn.realtor.ca/individual/TS637750507800000000/highres/1403257.jpg"
                                        alt="Abdul Basharmal"
                                        fill
                                        className="object-cover object-top"
                                    />
                                </div>
                                <div>
                                    <h2 className="font-display text-2xl text-brand-text">Abdul Basharmal</h2>
                                    <p className="text-xs uppercase tracking-widest text-brand-text-muted mt-0.5">REALTOR®</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <a href="tel:905-906-0045" className="flex items-center gap-4 group">
                                    <span className="w-10 h-10 rounded-full bg-brand-bg border border-brand-border/50 flex items-center justify-center shrink-0 group-hover:border-brand-accent/30 transition-colors">
                                        <Phone className="w-4 h-4 text-brand-accent" />
                                    </span>
                                    <div>
                                        <span className="block font-medium text-brand-text group-hover:text-brand-accent transition-colors">(905) 906-0045</span>
                                        <span className="text-[10px] text-brand-text-muted uppercase tracking-widest">Call or text anytime</span>
                                    </div>
                                </a>

                                <a href="mailto:abdulbashrealtor@gmail.com" className="flex items-center gap-4 group">
                                    <span className="w-10 h-10 rounded-full bg-brand-bg border border-brand-border/50 flex items-center justify-center shrink-0 group-hover:border-brand-accent/30 transition-colors">
                                        <Mail className="w-4 h-4 text-brand-accent" />
                                    </span>
                                    <div>
                                        <span className="block font-medium text-brand-text group-hover:text-brand-accent transition-colors text-sm">abdulbashrealtor@gmail.com</span>
                                        <span className="text-[10px] text-brand-text-muted uppercase tracking-widest">Typical response: same day</span>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-full bg-brand-bg border border-brand-border/50 flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-brand-accent" />
                                    </span>
                                    <div>
                                        <span className="block text-sm text-brand-text font-medium">RE/MAX Twin City Realty Inc.</span>
                                        <span className="block text-xs text-brand-text-muted">901 Victoria St N, Kitchener, ON</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Languages & Social */}
                        <div className="bg-white border border-brand-border/40 rounded-sm p-8">
                            <p className="text-sm text-brand-text-muted italic mb-6 border-l-2 border-brand-accent/30 pl-4">
                                Happy to connect in English, Farsi, Dari, Persian, Hindi, or Urdu.
                            </p>

                            <p className="text-xs uppercase tracking-widest text-brand-text-muted font-semibold mb-3">Follow Along</p>
                            <div className="flex gap-3">
                                <a href="https://www.instagram.com/realtor.519/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-sm bg-brand-bg border border-brand-border/50 flex items-center justify-center text-brand-text hover:text-brand-accent hover:border-brand-accent/30 transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="https://www.facebook.com/abdulbasharmal.remaxtwincity/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-sm bg-brand-bg border border-brand-border/50 flex items-center justify-center text-brand-text hover:text-brand-accent hover:border-brand-accent/30 transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="https://www.linkedin.com/in/abdul-basharmal-797b06104/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-sm bg-brand-bg border border-brand-border/50 flex items-center justify-center text-brand-text hover:text-brand-accent hover:border-brand-accent/30 transition-colors">
                                    <span className="sr-only">LinkedIn</span>
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Right Column — Form */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <div className="bg-white border border-brand-border/40 rounded-sm p-8 md:p-10 lg:p-12">
                            <h2 className="font-display text-2xl text-brand-text mb-1">
                                {isEvaluation ? 'Tell Us About Your Home' : 'Send a Message'}
                            </h2>
                            <p className="text-sm text-brand-text-muted mb-8">
                                {isEvaluation ? 'Find out what your home is worth today.' : 'Fill out the form and Abdul will get back to you personally.'}
                            </p>

                            <ContactForm
                                defaultIntent={isEvaluation ? 'Sell' : undefined}
                                defaultMessage={isEvaluation ? "Hi Abdul, I'm interested in getting a free evaluation of my home. My address is [Address]." : ""}
                                showLanguage={true}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
