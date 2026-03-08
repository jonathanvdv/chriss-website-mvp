import { HeroSection } from './_components/HeroSection'
import { StatsSection } from './_components/StatsSection'
import { FeaturedListings } from './_components/FeaturedListings'
import { AboutPreview } from './_components/AboutPreview'
import { WhyChooseAbdul } from './_components/WhyChooseAbdul'
import { NeighbourhoodGuide } from './_components/NeighbourhoodGuide'
import { TestimonialsSection } from './_components/TestimonialsSection'
import { ContactCTA } from './_components/ContactCTA'
import { ContactForm } from '@/components/ContactForm'
import { Facebook, Instagram, Linkedin } from 'lucide-react'

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />

      {/* Featured Listings - wrapped in Suspense for async data */}
      <FeaturedListings />

      <WhyChooseAbdul />
      <AboutPreview />

      <NeighbourhoodGuide />

      <TestimonialsSection />
      <ContactCTA />

      <section className="bg-white py-24 md:py-32 border-t border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            <div className="flex flex-col text-left">
              <h2 className="font-display text-4xl md:text-5xl text-brand-text mb-6 text-balance">
                Let's Chat
              </h2>
              <p className="text-brand-text-muted text-lg leading-relaxed font-light mb-12 max-w-lg">
                Real estate decisions are big. You shouldn't have to figure them out alone, and you shouldn't feel pressured into anything. Reach out, we'll talk through what you're thinking, no strings attached.
              </p>

              <div className="bg-brand-bg p-8 border border-brand-border/50 rounded-sm">
                <p className="text-sm font-semibold tracking-wider uppercase text-brand-text mb-8 border-b border-brand-border pb-4">
                  Real people call and text back. No bots, no assistants, just Abdul.
                </p>

                <div className="space-y-6">
                  <a href="tel:905-906-0045" className="flex items-center gap-4 text-brand-text group">
                    <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-brand-border shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <span className="font-display text-xl">📞</span>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xl">(905) 906-0045</span>
                      <span className="text-xs text-brand-text-muted uppercase tracking-[0.2em] mt-1">Call or text anytime</span>
                    </div>
                  </a>

                  <a href="mailto:abdulbashrealtor@gmail.com" className="flex items-center gap-4 text-brand-text group">
                    <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-brand-border shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <span className="font-display text-xl">✉️</span>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-lg">abdulbashrealtor@gmail.com</span>
                      <span className="text-xs text-brand-text-muted uppercase tracking-wider mt-1">Typical response time: same day</span>
                    </div>
                  </a>
                </div>

                <div className="mt-10 pt-8 border-t border-brand-border">
                  <p className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Follow for Market Updates</p>
                  <div className="flex gap-4">
                    <a href="https://www.instagram.com/realtor.519/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-sm bg-white border border-brand-border flex items-center justify-center text-brand-text hover:text-brand-accent hover:border-brand-accent transition-colors shadow-sm">
                      <span className="sr-only">Instagram</span>
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href="https://www.facebook.com/abdulbasharmal.remaxtwincity/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-sm bg-white border border-brand-border flex items-center justify-center text-brand-text hover:text-brand-accent hover:border-brand-accent transition-colors shadow-sm">
                      <span className="sr-only">Facebook</span>
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="https://www.linkedin.com/in/abdul-basharmal-797b06104/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-sm bg-white border border-brand-border flex items-center justify-center text-brand-text hover:text-brand-accent hover:border-brand-accent transition-colors shadow-sm">
                      <span className="sr-only">LinkedIn</span>
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 shadow-2xl border border-brand-border/30 rounded-sm lg:-mt-10 lg:mb-10">
              <h3 className="font-display text-2xl text-brand-text mb-6">Send a Message</h3>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
