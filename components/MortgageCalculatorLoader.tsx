'use client'

import dynamic from 'next/dynamic'

const MortgageCalculator = dynamic(
    () => import('@/components/MortgageCalculator').then(m => m.MortgageCalculator),
    {
        ssr: false,
        loading: () => (
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 text-sm">
                Loading calculator...
            </div>
        ),
    }
)

export function MortgageCalculatorLoader() {
    return <MortgageCalculator />
}
