'use client'

export default function ListingsError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white border border-brand-border/40 p-12 rounded-sm">
                    <h2 className="text-xl font-display text-brand-text mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-brand-text-muted mb-6">
                        We couldn't load the listings right now. This is usually temporary.
                    </p>
                    <button
                        onClick={reset}
                        className="bg-brand-accent hover:bg-brand-accent-light text-white font-medium px-8 py-3 transition-colors uppercase tracking-wider text-sm"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    )
}
