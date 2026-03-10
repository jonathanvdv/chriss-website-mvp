import { Metadata } from 'next'
import { MortgageCalculatorLoader } from '@/components/MortgageCalculatorLoader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionLabel } from '@/components/ui/SectionLabel'
import Link from 'next/link'
import { DollarSign, ShieldCheck, Clock, TrendingUp, Home, Landmark, BookOpen, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Mortgage Guide | Waterloo Region Real Estate',
    description: 'Your complete guide to Canadian mortgages. Calculate payments, learn about first-time buyer programs, mortgage types, down payments, and more with Abdul Basharmal.',
}

const sections = [
    { id: 'calculator', label: 'Calculator' },
    { id: 'first-time-buyers', label: 'First-Time Buyers' },
    { id: 'mortgage-types', label: 'Mortgage Types' },
    { id: 'down-payment', label: 'Down Payment' },
    { id: 'pre-approval', label: 'Pre-Approval' },
    { id: 'glossary', label: 'Glossary' },
]

const firstTimeTips = [
    {
        icon: Home,
        title: 'First Home Savings Account (FHSA)',
        description: 'Save up to $8,000/year (lifetime max $40,000) in a tax-free account specifically for your first home. Contributions are tax-deductible and withdrawals for a home purchase are tax-free.',
    },
    {
        icon: Landmark,
        title: 'RRSP Home Buyers\u2019 Plan',
        description: 'Withdraw up to $60,000 from your RRSP tax-free for a down payment. You have 15 years to repay it, starting the second year after withdrawal.',
    },
    {
        icon: DollarSign,
        title: 'First-Time Home Buyer Incentive',
        description: 'The federal government offers a shared-equity mortgage of 5\u201310% of the purchase price to reduce your monthly payments. Eligibility and repayment terms apply.',
    },
    {
        icon: ShieldCheck,
        title: 'Ontario Land Transfer Tax Rebate',
        description: 'First-time buyers in Ontario can receive a rebate of up to $4,000 on the provincial land transfer tax, which can offset a significant closing cost.',
    },
    {
        icon: BookOpen,
        title: 'Get Pre-Approved Early',
        description: 'A mortgage pre-approval locks in a rate for 90\u2013120 days and shows sellers you\u2019re serious. It also helps you understand exactly what you can afford before you start looking.',
    },
    {
        icon: Lightbulb,
        title: 'Budget Beyond the Mortgage',
        description: 'Remember to account for property tax, home insurance, utilities, maintenance (budget ~1% of home value/year), and closing costs (typically 1.5\u20134% of purchase price).',
    },
]

const mortgageTypes = [
    {
        title: 'Fixed vs. Variable Rate',
        description: 'A fixed rate stays the same for your entire term, giving you predictable payments. A variable rate fluctuates with the Bank of Canada\u2019s prime rate \u2014 it can save you money when rates drop but costs more when they rise.',
    },
    {
        title: 'Open vs. Closed',
        description: 'An open mortgage lets you pay it off anytime without penalty, but comes with a higher rate. A closed mortgage has lower rates but charges a penalty for early payoff or extra payments beyond your prepayment privileges.',
    },
    {
        title: 'Term vs. Amortization',
        description: 'Your term (typically 1\u20135 years) is how long your current rate and conditions last. Your amortization (typically 25\u201330 years) is how long it would take to pay off the entire mortgage. At the end of each term, you renew.',
    },
]

const downPaymentTiers = [
    { range: 'Under $500,000', minimum: '5% of purchase price', example: 'e.g. $25,000 on a $500K home' },
    { range: '$500,000 \u2013 $999,999', minimum: '5% on the first $500K + 10% on the remainder', example: 'e.g. $50,000 on a $750K home' },
    { range: '$1,000,000+', minimum: '20% of purchase price', example: 'e.g. $200,000 on a $1M home' },
]

const preApprovalPoints = [
    {
        icon: BookOpen,
        title: 'What Lenders Look At',
        description: 'Your income, employment history, credit score, existing debts, and the property itself. They\u2019ll calculate your Gross Debt Service (GDS) and Total Debt Service (TDS) ratios.',
    },
    {
        icon: ShieldCheck,
        title: 'Pre-Approval vs. Pre-Qualification',
        description: 'Pre-qualification is an estimate. Pre-approval is a commitment from the lender at a specific rate, subject to finding a suitable property. Always get a full pre-approval.',
    },
    {
        icon: Clock,
        title: 'How Long It Lasts',
        description: 'A typical pre-approval is valid for 90\u2013120 days. If rates drop during that period, you may be able to get the lower rate. If rates rise, your locked rate is protected.',
    },
    {
        icon: TrendingUp,
        title: 'Competitive Advantage',
        description: 'In a competitive market like Waterloo Region, a pre-approval letter tells sellers you\u2019re a serious, qualified buyer. It can make the difference when multiple offers come in.',
    },
]

const glossaryTerms = [
    { term: 'Amortization', definition: 'The total number of years it will take to pay off your mortgage in full. Most common in Canada is 25 years, though 30-year amortizations are available with 20%+ down.' },
    { term: 'Term', definition: 'The length of your current mortgage contract (usually 1\u20135 years). At the end of each term, you renew your mortgage, potentially at a different rate.' },
    { term: 'Principal', definition: 'The amount of money you actually borrowed. Each payment covers some principal and some interest. Over time, more of each payment goes toward principal.' },
    { term: 'Equity', definition: 'The portion of your home you actually own \u2014 the difference between your home\u2019s value and what you owe. Equity grows as you pay down your mortgage and as your home appreciates.' },
    { term: 'Closing Costs', definition: 'Fees due when you finalize your purchase: land transfer tax, legal fees, title insurance, home inspection, and adjustments. Budget 1.5\u20134% of the purchase price.' },
    { term: 'Stress Test', definition: 'To qualify for a mortgage in Canada, you must prove you can afford payments at the higher of your contract rate + 2% or 5.25%. This protects you if rates rise.' },
    { term: 'CMHC Insurance', definition: 'If your down payment is less than 20%, you must pay mortgage default insurance (through CMHC, Sagen, or Canada Guaranty). The premium is added to your mortgage balance.' },
    { term: 'Portability', definition: 'Some mortgages let you transfer your existing mortgage to a new property without penalty. Useful if you sell and buy within your current term.' },
]

export default function MortgageCalculatorPage() {
    return (
        <div className="relative min-h-screen pt-[124px] lg:pt-[136px]">
            {/* Hero */}
            <section className="bg-brand-bg border-t border-brand-border/30 py-20 md:py-28">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <AnimatedSection>
                        <SectionLabel text="MORTGAGE GUIDE" />
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-text mb-6">
                            Your Guide to Canadian <span className="italic text-brand-accent">Mortgages</span>
                        </h1>
                        <p className="text-brand-text-muted text-lg leading-relaxed font-light max-w-2xl mx-auto mb-10">
                            Everything you need to understand mortgage payments, first-time buyer programs, and the Canadian home financing process — so you can buy with confidence.
                        </p>
                    </AnimatedSection>

                    {/* Anchor Nav */}
                    <AnimatedSection>
                        <nav className="flex flex-wrap justify-center gap-3 md:gap-4">
                            {sections.map(s => (
                                <a
                                    key={s.id}
                                    href={`#${s.id}`}
                                    className="text-xs font-semibold uppercase tracking-widest text-brand-text-muted hover:text-brand-accent transition-colors px-3 py-2 border border-brand-border/40 hover:border-brand-accent/40 rounded-sm"
                                >
                                    {s.label}
                                </a>
                            ))}
                        </nav>
                    </AnimatedSection>
                </div>
            </section>

            {/* Calculator */}
            <section id="calculator" className="bg-white py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <SectionLabel text="CALCULATE YOUR PAYMENTS" />
                            <h2 className="font-display text-3xl md:text-4xl text-brand-text">
                                Mortgage <span className="italic">Calculator</span>
                            </h2>
                        </div>
                        <MortgageCalculatorLoader />
                    </AnimatedSection>
                </div>
            </section>

            {/* First-Time Buyers */}
            <section id="first-time-buyers" className="bg-brand-bg py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <SectionLabel text="FIRST-TIME BUYERS" />
                            <h2 className="font-display text-3xl md:text-4xl text-brand-text">
                                Programs & Tips for <span className="italic">New Buyers</span>
                            </h2>
                            <p className="text-brand-text-muted text-lg font-light mt-4 max-w-2xl mx-auto">
                                Canada has some excellent programs to help first-time buyers. Here are the ones you should know about.
                            </p>
                        </div>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {firstTimeTips.map((tip, i) => (
                            <AnimatedSection key={i}>
                                <div className="bg-white border border-brand-border shadow-sm p-8 rounded-sm h-full">
                                    <tip.icon className="w-6 h-6 text-brand-accent mb-4" />
                                    <h3 className="font-display text-lg text-brand-text mb-3">{tip.title}</h3>
                                    <p className="text-brand-text-muted text-sm leading-relaxed font-light">{tip.description}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mortgage Types */}
            <section id="mortgage-types" className="bg-white py-20 md:py-28">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <SectionLabel text="UNDERSTANDING YOUR OPTIONS" />
                            <h2 className="font-display text-3xl md:text-4xl text-brand-text">
                                Mortgage <span className="italic">Types</span>
                            </h2>
                        </div>
                    </AnimatedSection>
                    <div className="space-y-8">
                        {mortgageTypes.map((type, i) => (
                            <AnimatedSection key={i}>
                                <div className="bg-brand-bg border border-brand-border p-8 rounded-sm">
                                    <h3 className="font-display text-xl text-brand-text mb-3">{type.title}</h3>
                                    <p className="text-brand-text-muted leading-relaxed font-light">{type.description}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Down Payment */}
            <section id="down-payment" className="bg-brand-bg py-20 md:py-28">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <SectionLabel text="DOWN PAYMENT" />
                            <h2 className="font-display text-3xl md:text-4xl text-brand-text">
                                Canadian Down Payment <span className="italic">Requirements</span>
                            </h2>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection>
                        <div className="bg-white border border-brand-border shadow-sm rounded-sm overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-border">
                                {downPaymentTiers.map((tier, i) => (
                                    <div key={i} className="p-8 text-center">
                                        <h3 className="font-display text-lg text-brand-text mb-2">{tier.range}</h3>
                                        <p className="text-brand-accent font-semibold text-sm mb-2">{tier.minimum}</p>
                                        <p className="text-brand-text-muted text-xs font-light">{tier.example}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-center text-sm text-brand-text-muted font-light mt-6 max-w-3xl mx-auto">
                            If your down payment is less than 20%, you&apos;ll need CMHC mortgage default insurance, which is added to your mortgage balance. The premium ranges from 2.8% to 4% of the mortgage amount depending on your down payment size.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Pre-Approval */}
            <section id="pre-approval" className="bg-white py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <SectionLabel text="GETTING PRE-APPROVED" />
                            <h2 className="font-display text-3xl md:text-4xl text-brand-text">
                                Why Pre-Approval <span className="italic">Matters</span>
                            </h2>
                        </div>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {preApprovalPoints.map((point, i) => (
                            <AnimatedSection key={i}>
                                <div className="bg-brand-bg border border-brand-border p-8 rounded-sm h-full">
                                    <point.icon className="w-6 h-6 text-brand-accent mb-4" />
                                    <h3 className="font-display text-lg text-brand-text mb-3">{point.title}</h3>
                                    <p className="text-brand-text-muted text-sm leading-relaxed font-light">{point.description}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Glossary */}
            <section id="glossary" className="bg-brand-bg py-20 md:py-28">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <SectionLabel text="KEY TERMS" />
                            <h2 className="font-display text-3xl md:text-4xl text-brand-text">
                                Mortgage <span className="italic">Glossary</span>
                            </h2>
                        </div>
                    </AnimatedSection>
                    <div className="space-y-4">
                        {glossaryTerms.map((item, i) => (
                            <AnimatedSection key={i}>
                                <details className="group bg-white border border-brand-border rounded-sm">
                                    <summary className="cursor-pointer p-6 flex justify-between items-center font-display text-lg text-brand-text hover:text-brand-accent transition-colors">
                                        {item.term}
                                        <span className="text-brand-accent text-xl group-open:rotate-45 transition-transform duration-200">+</span>
                                    </summary>
                                    <div className="px-6 pb-6 text-brand-text-muted leading-relaxed font-light">
                                        {item.definition}
                                    </div>
                                </details>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-brand-bg-dark text-white py-24 md:py-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <AnimatedSection>
                        <SectionLabel text="GET STARTED" className="text-brand-gold" />
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-6">
                            Need a Mortgage Broker <span className="italic">Recommendation?</span>
                        </h2>
                        <p className="text-brand-text-muted text-lg leading-relaxed font-light mb-12 max-w-2xl mx-auto">
                            Abdul works with trusted local mortgage brokers in the Waterloo Region who can shop the market for you and often secure better rates than your home branch.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block bg-brand-accent hover:bg-brand-accent-light text-white px-10 py-5 uppercase tracking-wider text-sm font-medium transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
                        >
                            Reach Out to Abdul →
                        </Link>
                        <p className="mt-8 text-brand-text-muted/60 text-xs font-light max-w-2xl mx-auto leading-relaxed">
                            The calculator and information on this page are for educational purposes only and use the standard Canadian mortgage formula with semi-annual compounding. Your actual rate and payment will depend on your lender and financial situation. Always consult directly with a mortgage broker or your bank for a fully accurate qualification.
                        </p>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    )
}
