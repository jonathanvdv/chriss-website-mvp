'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { calculatePayment } from '@/lib/mortgage'

const frequencies = ['Monthly', 'Semi-monthly', 'Bi-weekly', 'Weekly'] as const

function formatInput(val: string) {
    const num = parseInt(val.replace(/[^0-9]/g, '')) || 0
    return num > 0 ? num.toLocaleString('en-CA') : ''
}

function parseInput(val: string) {
    return parseInt(val.replace(/[^0-9]/g, '')) || 0
}

export function MortgageCalculator() {
    const [priceInput, setPriceInput] = useState('500,000')
    const [dpInput, setDpInput] = useState('25,000')
    const [rate, setRate] = useState('4.99')
    const [amort, setAmort] = useState(25)
    const [freq, setFreq] = useState<string>('Monthly')
    const [payment, setPayment] = useState(0)

    const price = parseInput(priceInput)
    const dp = parseInput(dpInput)
    const dpPercent = price > 0 ? (dp / price) * 100 : 0
    const needsInsurance = dpPercent < 20 && price < 1500000 && price > 0

    useEffect(() => {
        const parsedRate = parseFloat(rate) || 0
        setPayment(calculatePayment({
            price,
            downPayment: dp,
            rate: parsedRate,
            amortizationYears: amort,
            frequency: freq,
        }))
    }, [price, dp, rate, amort, freq])

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 2 }).format(n)

    const inputClass = "w-full border border-brand-border px-4 py-3 bg-brand-bg focus:outline-none focus:border-brand-accent transition-colors text-brand-text rounded-sm"

    return (
        <div className="bg-white border border-brand-border shadow-xl rounded-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Inputs */}
                <div className="lg:col-span-3 p-8 md:p-10 space-y-5">
                    {/* Purchase Price & Down Payment side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1.5">
                                Purchase Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted">$</span>
                                <input id="price" type="text" inputMode="numeric" value={priceInput}
                                    onChange={(e) => setPriceInput(formatInput(e.target.value))}
                                    className={`${inputClass} pl-8`} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="dp" className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1.5">
                                Down Payment
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted">$</span>
                                <input id="dp" type="text" inputMode="numeric" value={dpInput}
                                    onChange={(e) => setDpInput(formatInput(e.target.value))}
                                    className={`${inputClass} pl-8`} />
                            </div>
                            <p className="text-xs text-brand-text-muted mt-1 font-light">
                                {dpPercent.toFixed(0)}% of purchase price
                                {needsInsurance && <span> · CMHC insurance applies</span>}
                            </p>
                        </div>
                    </div>

                    {/* Rate & Amortization */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="rate" className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1.5">
                                Interest Rate
                            </label>
                            <div className="relative">
                                <input id="rate" type="text" inputMode="decimal" value={rate}
                                    onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ''))}
                                    className={inputClass} />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted">%</span>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="amort" className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1.5">
                                Amortization
                            </label>
                            <select id="amort" value={amort} onChange={(e) => setAmort(Number(e.target.value))} className={inputClass}>
                                {[10, 15, 20, 25, 30].map(y => (
                                    <option key={y} value={y}>{y} Years</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Payment Frequency — pill selector */}
                    <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-2">Payment Frequency</span>
                        <div className="flex flex-wrap gap-2">
                            {frequencies.map(f => (
                                <button key={f} onClick={() => setFreq(f)}
                                    className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors ${freq === f
                                        ? 'bg-brand-bg-dark text-white'
                                        : 'bg-brand-bg text-brand-text-muted border border-brand-border hover:border-brand-accent/40'
                                    }`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="lg:col-span-2 bg-brand-bg-dark text-white p-8 md:p-10 flex flex-col justify-center items-center text-center">
                    <p className="text-xs uppercase tracking-widest text-brand-border/60 font-semibold mb-3">
                        Estimated {freq.toLowerCase()} payment
                    </p>
                    <div className="text-5xl md:text-6xl font-accent text-brand-gold mb-3 tabular-nums font-light">
                        {formatCurrency(payment)}
                    </div>
                    <p className="text-xs text-brand-border/50 font-light mb-10 max-w-[260px]">
                        Based on a {amort}-year amortization at {rate}%
                    </p>

                    <div className="w-full flex flex-col gap-3">
                        <Link href="/contact"
                            className="block text-center bg-brand-accent hover:bg-brand-accent-light text-white font-medium px-6 py-4 uppercase tracking-wide text-xs transition-colors">
                            Talk to Abdul About This →
                        </Link>
                        <Link href="/listings"
                            className="block text-center border border-brand-border/30 hover:bg-brand-border/10 text-white font-medium px-6 py-4 uppercase tracking-wide text-xs transition-colors">
                            Search Listings in This Budget →
                        </Link>
                    </div>
                </div>
            </div>

            <p className="text-xs text-brand-text-muted px-8 py-4 text-center font-light">
                For estimation purposes only. Uses standard Canadian semi-annual compounding. Consult a mortgage broker for accurate qualification.
            </p>
        </div>
    )
}
