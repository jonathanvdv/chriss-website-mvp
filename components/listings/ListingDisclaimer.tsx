export function ListingDisclaimer({ lastUpdated }: { lastUpdated?: string }) {
    return (
        <div className="mt-8 border-t border-brand-border/30 pt-8 text-center">
            <a
                href="https://www.realtor.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-4"
            >
                <img
                    src="https://www.realtor.ca/images/logo.svg"
                    alt="Powered by REALTOR.ca"
                    className="h-8 mx-auto opacity-60 hover:opacity-100 transition-opacity"
                />
            </a>
            <p className="text-xs text-brand-text-muted leading-relaxed max-w-3xl mx-auto font-light">
                Listing data provided through the CREA Data Distribution Facility (DDF®). The
                trademarks REALTOR®, REALTORS®, and the REALTOR® logo are controlled by The
                Canadian Real Estate Association (CREA) and identify real estate professionals who
                are members of CREA. The trademarks MLS®, Multiple Listing Service® and the
                associated logos are owned by CREA and identify the quality of services provided by
                real estate professionals who are members of CREA. All information deemed reliable
                but not guaranteed and should be independently verified.
                {lastUpdated && ` Data last updated: ${lastUpdated}.`}
            </p>
        </div>
    )
}
