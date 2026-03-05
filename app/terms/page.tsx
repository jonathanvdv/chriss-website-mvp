import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms of service for Abdul Basharmal Real Estate website.',
}

export default function TermsPage() {
    return (
        <div className="bg-brand-bg min-h-screen pt-32 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-display text-4xl md:text-5xl text-brand-text mb-10">Terms of Service</h1>
                <div className="prose prose-lg text-brand-text-muted font-light leading-relaxed space-y-6">
                    <p><strong className="text-brand-text">Last updated:</strong> March 2026</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">Use of This Website</h2>
                    <p>This website is operated by Abdul Basharmal, a licensed REALTOR® with RE/MAX Twin City Realty Inc., Brokerage, in Kitchener, Ontario. By using this website, you agree to these terms.</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">Listing Information</h2>
                    <p>Property listings displayed on this website are provided through the Canadian Real Estate Association&apos;s Data Distribution Facility (DDF) and IDX Broker. While we strive to ensure accuracy, listing information may not be completely up to date. All listings are subject to change without notice. Always verify details directly before making any decisions.</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">Mortgage Calculator</h2>
                    <p>The mortgage payment calculator on this website is provided for estimation purposes only and uses the standard Canadian mortgage formula with semi-annual compounding. Results are approximate and should not be relied upon for financial decisions. Always consult directly with a mortgage broker or your financial institution for accurate qualification and rates.</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">Trademarks</h2>
                    <p>The trademarks REALTOR®, REALTORS®, and the REALTOR® logo are controlled by The Canadian Real Estate Association (CREA) and identify real estate professionals who are members of CREA. The trademarks MLS®, Multiple Listing Service® and the associated logos are owned by CREA and identify the quality of services provided by real estate professionals who are members of CREA.</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">Limitation of Liability</h2>
                    <p>This website and its content are provided &ldquo;as is&rdquo; without warranty of any kind. Abdul Basharmal and RE/MAX Twin City Realty Inc. are not liable for any damages arising from the use of this website or reliance on its content.</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">Contact</h2>
                    <p>Questions about these terms can be directed to <a href="mailto:abdulbashrealtor@gmail.com" className="text-brand-accent hover:underline">abdulbashrealtor@gmail.com</a>.</p>
                </div>
            </div>
        </div>
    )
}
