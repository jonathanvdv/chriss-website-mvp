'use client'

import Link from 'next/link'

export default function ListingError({ error, reset }: { error: Error; reset: () => void }) {
    const isNotFound = error.message?.includes('not found') || error.message?.includes('Invalid listing')

    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center pt-24 px-4 text-center">
            <h1 className="font-display text-2xl text-brand-text mb-4">
                {isNotFound ? 'Listing Not Found' : 'Something went wrong'}
            </h1>
            <p className="text-gray-500 mb-6 max-w-md">
                {isNotFound
                    ? 'This listing may have been removed or the link may be incorrect.'
                    : 'We had trouble loading this listing. Please try again.'}
            </p>
            <div className="flex gap-4">
                {!isNotFound && (
                    <button
                        onClick={reset}
                        className="px-5 py-2.5 bg-brand-accent text-white text-sm font-semibold rounded-lg hover:bg-brand-accent-light transition-colors"
                    >
                        Try Again
                    </button>
                )}
                <Link
                    href="/listings"
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Browse Listings
                </Link>
            </div>
        </div>
    )
}
