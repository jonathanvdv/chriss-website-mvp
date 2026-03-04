import Link from 'next/link'
import { Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-brand-bg-dark text-white pt-16 pb-8 border-t border-brand-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Left Column */}
          <div>
            <h2 className="font-display text-3xl mb-1 text-white">Abdul Basharmal</h2>
            <p className="text-brand-text-muted text-sm tracking-widest uppercase mb-6">REALTOR®</p>
            <p className="text-brand-border/80 text-sm italic">
              Serving Kitchener, Waterloo, Cambridge, Breslau & the Greater Toronto Area
            </p>
            <div className="mt-6 flex gap-4">
              {/* TODO: Update with real social links */}
              <Link href="#" className="p-2 border border-brand-border/20 rounded-full hover:bg-brand-border/10 transition">
                <span className="sr-only">Instagram</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </Link>
              <Link href="#" className="p-2 border border-brand-border/20 rounded-full hover:bg-brand-border/10 transition">
                <span className="sr-only">Facebook</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
              </Link>
              <Link href="#" className="p-2 border border-brand-border/20 rounded-full hover:bg-brand-border/10 transition">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>
              </Link>
            </div>
          </div>

          {/* Center Column: Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4 text-sm text-brand-border/80">
              <li><Link href="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
              <li><Link href="/listings" className="hover:text-brand-gold transition-colors">Search Listings</Link></li>
              <li><Link href="/neighbourhoods" className="hover:text-brand-gold transition-colors">Neighbourhoods</Link></li>
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Abdul</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
              <li><Link href="/mortgage-calculator" className="hover:text-brand-gold transition-colors">Mortgage Calculator</Link></li>
            </ul>
          </div>

          {/* Right Column: Contact */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-6 uppercase tracking-wider">Contact</h3>
            <div className="space-y-4 text-sm text-brand-border/80">
              {/* TODO: Update phone number */}
              <p className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-gold" />
                <a href="tel:905-906-0045" className="hover:text-white transition-colors">
                  (905) 906-0045 <span className="text-brand-text-muted text-xs ml-2 uppercase tracking-widest">Call or Text</span>
                </a>
              </p>
              <p>
                <a href="mailto:abdulbashrealtor@gmail.com" className="hover:text-white transition-colors">abdulbashrealtor@gmail.com</a>
              </p>
              <address className="not-italic text-brand-text-muted leading-relaxed mt-4">
                <strong className="text-white font-medium">RE/MAX Twin City Realty Inc., Brokerage</strong><br />
                901 Victoria St N<br />
                Kitchener, ON N2B 3C3
              </address>
              <p className="mt-4 text-brand-text-muted italic border-l border-brand-gold/30 pl-4">
                Happy to connect in English, Hindi, Persian, Urdu, Dari, or Farsi.
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Bottom Bar */}
        <div className="pt-8 border-t border-brand-border/20 text-xs text-brand-text-muted flex flex-col items-center text-center space-y-4">
          <div className="flex flex-col md:flex-row justify-between w-full">
            <p>&copy; {new Date().getFullYear()} Abdul Basharmal. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            </div>
          </div>

          <div className="max-w-4xl pt-4 space-y-2">
            <p>
              The trademarks REALTOR®, REALTORS®, and the REALTOR® logo are controlled by The Canadian Real Estate Association (CREA) and identify real estate professionals who are members of CREA.
            </p>
            <p>
              The trademarks MLS®, Multiple Listing Service® and the associated logos are owned by The Canadian Real Estate Association (CREA) and identify the quality of services provided by real estate professionals who are members of CREA.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
