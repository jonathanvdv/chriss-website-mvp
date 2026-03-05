import { Metadata } from 'next'
import Image from 'next/image'
import { ContactForm } from '@/components/shared/ContactForm'
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
        <div className="bg-brand-bg min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="bg-white border border-brand-border/40 shadow-xl overflow-hidden rounded-sm flex flex-col lg:flex-row">

                    {/* Left Column (Info) */}
                    <div className="w-full lg:w-5/12 bg-brand-bg-dark text-white p-8 md:p-12 lg:p-16 flex flex-col relative z-0 order-2 lg:order-1">
                        {/* Subtle background pattern/gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 to-transparent opacity-30 z-[-1]"></div>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight text-balance">
                            Let's Chat
                        </h1>

                        <p className="text-brand-border/80 text-lg leading-relaxed font-light mb-12">
                            Real estate decisions are big. You shouldn't have to figure them out alone, and you shouldn't feel pressured into anything. Reach out, we'll talk through what you're thinking, no strings attached.
                        </p>

                        <div className="space-y-8 flex-1">

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-full border border-brand-border/20 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-accent transition-colors">
                                    <Phone className="w-5 h-5 text-brand-gold group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex flex-col">
                                    <a href="tel:905-906-0045" className="block font-medium text-xl hover:text-brand-gold transition-colors">(905) 906-0045</a>
                                    <span className="text-xs text-brand-border/60 uppercase tracking-[0.2em] mt-1 block">Direct · Call or text</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-full border border-brand-border/20 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-accent transition-colors">
                                    <Mail className="w-5 h-5 text-brand-gold group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <a href="mailto:abdulbashrealtor@gmail.com" className="block font-medium text-lg hover:text-brand-gold transition-colors break-all">abdulbashrealtor@gmail.com</a>
                                    <span className="text-xs text-brand-border/60 uppercase tracking-widest mt-1 block">Response within 24 hours</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-full border border-brand-border/20 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-accent transition-colors">
                                    <MapPin className="w-5 h-5 text-brand-gold group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="font-medium text-base leading-relaxed">
                                        RE/MAX Twin City Realty Inc.<br />
                                        901 Victoria St N<br />
                                        Kitchener, ON N2B 3C3
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-brand-border/20">
                            <p className="text-brand-border/80 text-sm italic mb-8">
                                I'm happy to connect in English, Farsi, Dari, Persian, Hindi, or Urdu.
                            </p>

                            <div className="flex gap-4">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-border/20 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-colors text-white">
                                    <span className="sr-only">Instagram</span>
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-border/20 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-colors text-white">
                                    <span className="sr-only">Facebook</span>
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-border/20 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-colors text-white">
                                    <span className="sr-only">LinkedIn</span>
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Small circular photo tucked into the layout */}
                        <div className="absolute top-12 right-12 w-24 h-24 rounded-full overflow-hidden border-2 border-brand-gold/50 shadow-lg hidden md:block lg:hidden xl:block">
                            <Image
                                src="https://cdn.realtor.ca/individual/TS637750507800000000/highres/1403257.jpg"
                                alt="Abdul Basharmal"
                                fill
                                className="object-cover object-top"
                            />
                        </div>
                    </div>

                    {/* Right Column (Form) */}
                    <div className="w-full lg:w-7/12 p-8 md:p-12 xl:p-16 bg-white flex flex-col justify-center order-1 lg:order-2">

                        <div className="mb-10 border-b border-brand-border/40 pb-6 flex items-center gap-6">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-brand-border/50 shrink-0 md:hidden lg:block xl:hidden">
                                <Image
                                    src="https://cdn.realtor.ca/individual/TS637750507800000000/highres/1403257.jpg"
                                    alt="Abdul Basharmal"
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                            <div>
                                <h2 className="font-display text-3xl text-brand-text mb-2 text-balance">
                                    {isEvaluation ? 'Free Home Evaluation' : 'Send a Message'}
                                </h2>
                                <p className="text-brand-text-muted text-sm uppercase tracking-wider font-semibold">
                                    {isEvaluation ? 'Find out what your home is worth today.' : 'Fill out the form below to get started.'}
                                </p>
                            </div>
                        </div>

                        <ContactForm
                            defaultIntent={isEvaluation ? 'Sell' : undefined}
                            defaultMessage={isEvaluation ? "Hi Abdul, I'm interested in getting a free evaluation of my home. My address is [Address]." : ""}
                            showLanguage={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
