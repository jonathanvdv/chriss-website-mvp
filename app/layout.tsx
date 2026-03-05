import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://abdulbasharmal.com'),
  title: {
    default: 'Abdul Basharmal | REALTOR® in Waterloo Region | RE/MAX Twin City',
    template: '%s | Abdul Basharmal Real Estate',
  },
  description: 'Abdul Basharmal is a REALTOR® with RE/MAX Twin City Realty in Kitchener, Ontario. Helping buyers and sellers in Kitchener, Waterloo, and Cambridge. Search listings, get a free home evaluation, or connect today.',
  keywords: 'Kitchener real estate agent, Waterloo REALTOR, Cambridge homes for sale, RE/MAX Twin City, Abdul Basharmal, Kitchener homes for sale, Waterloo Region real estate',
  openGraph: {
    type: 'website',
    siteName: 'Abdul Basharmal | RE/MAX Twin City Realty',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${outfit.variable} antialiased text-brand-text`} suppressHydrationWarning>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

