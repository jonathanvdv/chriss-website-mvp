export function getCmhcRate(downPaymentPercent: number): number {
    if (downPaymentPercent >= 20) return 0
    if (downPaymentPercent >= 15) return 0.028
    if (downPaymentPercent >= 10) return 0.031
    return 0.04
}

export function getPeriodsPerYear(freq: string): number {
    if (freq === 'Semi-monthly') return 24
    if (freq === 'Bi-weekly') return 26
    if (freq === 'Weekly') return 52
    return 12
}

export interface MortgageParams {
    price: number
    downPayment: number
    rate: number
    amortizationYears: number
    frequency: string
}

export function calculatePayment(params: MortgageParams): number {
    const { price, downPayment, rate, amortizationYears, frequency } = params
    const principal = price - downPayment
    if (principal <= 0 || price > 100_000_000) return 0

    const dpPercent = price > 0 ? (downPayment / price) * 100 : 0
    const needsInsurance = dpPercent < 20 && price < 1_500_000 && price > 0
    const cmhc = needsInsurance ? principal * getCmhcRate(dpPercent) : 0
    const mortgage = principal + cmhc

    if (rate <= 0 || rate > 25) return 0
    const annualRate = rate / 100
    const semiAnnual = annualRate / 2
    const effectiveAnnual = Math.pow(1 + semiAnnual, 2) - 1
    const periods = getPeriodsPerYear(frequency)
    const periodRate = Math.pow(1 + effectiveAnnual, 1 / periods) - 1
    const totalPeriods = amortizationYears * periods

    if (periodRate === 0) return mortgage / totalPeriods

    return (mortgage * periodRate) / (1 - Math.pow(1 + periodRate, -totalPeriods))
}
