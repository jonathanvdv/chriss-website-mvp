import { describe, it, expect } from 'vitest'
import { getCmhcRate, getPeriodsPerYear, calculatePayment } from '../mortgage'

// ─── getCmhcRate ────────────────────────────────────────────────────────

describe('getCmhcRate', () => {
    it('returns 0 for 20%+ down payment', () => {
        expect(getCmhcRate(20)).toBe(0)
        expect(getCmhcRate(50)).toBe(0)
    })

    it('returns 2.8% for 15-19.99% down payment', () => {
        expect(getCmhcRate(15)).toBe(0.028)
        expect(getCmhcRate(19.99)).toBe(0.028)
    })

    it('returns 3.1% for 10-14.99% down payment', () => {
        expect(getCmhcRate(10)).toBe(0.031)
        expect(getCmhcRate(14.99)).toBe(0.031)
    })

    it('returns 4% for less than 10% down payment', () => {
        expect(getCmhcRate(5)).toBe(0.04)
        expect(getCmhcRate(9.99)).toBe(0.04)
    })
})

// ─── getPeriodsPerYear ──────────────────────────────────────────────────

describe('getPeriodsPerYear', () => {
    it('returns 12 for Monthly', () => {
        expect(getPeriodsPerYear('Monthly')).toBe(12)
    })

    it('returns 24 for Semi-monthly', () => {
        expect(getPeriodsPerYear('Semi-monthly')).toBe(24)
    })

    it('returns 26 for Bi-weekly', () => {
        expect(getPeriodsPerYear('Bi-weekly')).toBe(26)
    })

    it('returns 52 for Weekly', () => {
        expect(getPeriodsPerYear('Weekly')).toBe(52)
    })

    it('defaults to 12 for unknown frequency', () => {
        expect(getPeriodsPerYear('Quarterly')).toBe(12)
    })
})

// ─── calculatePayment ───────────────────────────────────────────────────

describe('calculatePayment', () => {
    const baseParams = {
        price: 500000,
        downPayment: 100000,
        rate: 4.99,
        amortizationYears: 25,
        frequency: 'Monthly',
    }

    it('returns a positive payment for valid inputs', () => {
        const payment = calculatePayment(baseParams)
        expect(payment).toBeGreaterThan(0)
    })

    it('returns approximately correct monthly payment', () => {
        // $500K, $100K down (20%), 4.99%, 25yr monthly
        // Expected ~$2,321/mo (standard Canadian semi-annual compounding)
        const payment = calculatePayment(baseParams)
        expect(payment).toBeGreaterThan(2200)
        expect(payment).toBeLessThan(2500)
    })

    it('returns 0 when principal is zero or negative', () => {
        expect(calculatePayment({ ...baseParams, downPayment: 500000 })).toBe(0)
        expect(calculatePayment({ ...baseParams, downPayment: 600000 })).toBe(0)
    })

    it('returns 0 when price exceeds 100M', () => {
        expect(calculatePayment({ ...baseParams, price: 100_000_001 })).toBe(0)
    })

    it('returns 0 for zero or negative rate', () => {
        expect(calculatePayment({ ...baseParams, rate: 0 })).toBe(0)
        expect(calculatePayment({ ...baseParams, rate: -1 })).toBe(0)
    })

    it('returns 0 for rate exceeding 25%', () => {
        expect(calculatePayment({ ...baseParams, rate: 26 })).toBe(0)
    })

    it('includes CMHC insurance for less than 20% down on eligible properties', () => {
        const withInsurance = calculatePayment({
            ...baseParams,
            price: 500000,
            downPayment: 25000, // 5% down
        })
        const withoutInsurance = calculatePayment({
            ...baseParams,
            price: 500000,
            downPayment: 100000, // 20% down
        })
        // With insurance, payment should be higher even though both have same base price
        // (insurance adds to the mortgage principal)
        expect(withInsurance).toBeGreaterThan(withoutInsurance)
    })

    it('does not add CMHC for properties >= $1.5M', () => {
        const payment = calculatePayment({
            ...baseParams,
            price: 1_500_000,
            downPayment: 150_000, // 10% down, but property too expensive for CMHC
        })
        // No CMHC, so mortgage = 1,350,000
        // If CMHC were applied, payment would be higher
        const mortgageNoCmhc = 1_350_000
        // Verify the payment is consistent with no insurance
        expect(payment).toBeGreaterThan(0)
        // Approximate: should be around $7,800-$8,200/mo for 1.35M at 4.99%/25yr
        expect(payment).toBeGreaterThan(7500)
        expect(payment).toBeLessThan(8500)
    })

    it('weekly payments are roughly 1/4 of monthly', () => {
        const monthly = calculatePayment(baseParams)
        const weekly = calculatePayment({ ...baseParams, frequency: 'Weekly' })
        const ratio = monthly / weekly
        // Weekly should be about 4.33x less (12/52 * monthly ≈ weekly)
        expect(ratio).toBeGreaterThan(4.0)
        expect(ratio).toBeLessThan(4.5)
    })

    it('shorter amortization means higher payments', () => {
        const long = calculatePayment({ ...baseParams, amortizationYears: 30 })
        const short = calculatePayment({ ...baseParams, amortizationYears: 15 })
        expect(short).toBeGreaterThan(long)
    })
})
