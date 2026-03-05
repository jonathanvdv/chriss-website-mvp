import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy policy for Abdul Basharmal Real Estate.',
}

export default function PrivacyPage() {
    return (
        <div className="bg-brand-bg min-h-screen pt-32 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-display text-4xl md:text-5xl text-brand-text mb-10">Privacy Policy</h1>
                <div className="prose prose-lg text-brand-text-muted font-light leading-relaxed space-y-6">
                    <p><strong className="text-brand-text">Last updated:</strong> March 2026</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">Information We Collect</h2>
                    <p>When you use our contact form, we collect the information you voluntarily provide: your name, email address, phone number (optional), and message. We do not collect any information automatically beyond standard web server logs.</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">How We Use Your Information</h2>
                    <p>Your contact information is used solely to respond to your inquiry about real estate services. We do not sell, trade, or share your personal information with third parties for marketing purposes.</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">Third-Party Services</h2>
                    <p>We use Resend for email delivery when you submit the contact form. Your information is processed in accordance with their privacy policy. Listing data is provided through IDX Broker in compliance with the Canadian Real Estate Association (CREA) Data Distribution Facility (DDF) guidelines.</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">Data Retention</h2>
                    <p>We retain your contact information only as long as necessary to respond to your inquiry and provide ongoing real estate services. You may request deletion of your data at any time by contacting us.</p>

                    <h2 className="font-display text-2xl text-brand-text mt-10">Contact</h2>
                    <p>If you have questions about this privacy policy, please contact Abdul Basharmal at <a href="mailto:abdulbashrealtor@gmail.com" className="text-brand-accent hover:underline">abdulbashrealtor@gmail.com</a> or call <a href="tel:905-906-0045" className="text-brand-accent hover:underline">(905) 906-0045</a>.</p>
                </div>
            </div>
        </div>
    )
}
