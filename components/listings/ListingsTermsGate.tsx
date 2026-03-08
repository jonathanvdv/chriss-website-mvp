'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'listings-terms-accepted'
const BROKER_NAME = 'RE/MAX Twin City Realty Inc.'

export function ListingsTermsGate({ children }: { children: React.ReactNode }) {
    const [accepted, setAccepted] = useState<boolean | null>(null)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setAccepted(localStorage.getItem(STORAGE_KEY) === '1')
    }, [])

    const handleAccept = () => {
        localStorage.setItem(STORAGE_KEY, '1')
        setAccepted(true)
    }

    // Still loading from localStorage
    if (accepted === null) return null
    // Already accepted
    if (accepted) return <>{children}</>

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Terms and Conditions</h2>
                    <p className="text-sm text-gray-500 mt-1">Please review and accept before viewing listings</p>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 text-xs text-gray-700 leading-relaxed space-y-4">
                    <p className="font-semibold text-sm text-gray-900">Do you agree to these Terms and Conditions?</p>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Website Terms of Use</h3>
                        <p>This website is operated by {BROKER_NAME}, a Brokerage who is a member of The Canadian Real Estate Association (CREA). The content on this website is owned or controlled by CREA. By accessing this website, the user agrees to be bound by these Terms of Use as amended from time to time, and agrees that these Terms of Use constitute a binding contract between the user, {BROKER_NAME}, and CREA.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Copyright</h3>
                        <p>The content on this website is protected by copyright and other laws, and is intended solely for the private, non-commercial use by individuals. Any other reproduction, distribution or use of the content, in whole or in part, is specifically prohibited. Prohibited uses include commercial use, &quot;screen scraping&quot;, &quot;database scraping&quot;, and any other activity intended to collect, store, reorganize or manipulate the content of this website.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Trademarks</h3>
                        <p>REALTOR&reg;, REALTORS&reg;, and the REALTOR&reg; logo are certification marks that are owned by REALTOR&reg; Canada Inc. and licensed exclusively to The Canadian Real Estate Association (CREA). These certification marks identify real estate professionals who are members of CREA and who must abide by CREA&apos;s By-Laws, Rules, and the REALTOR&reg; Code. The MLS&reg; trademark and the MLS&reg; logo are owned by CREA and identify the professional real estate services provided by members of CREA.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Liability and Warranty Disclaimer</h3>
                        <p>The information contained on this website is based in whole or in part on information that is provided by members of CREA, who are responsible for its accuracy. CREA reproduces and distributes this information as a service for its members, and assumes no responsibility for its completeness or accuracy.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Amendments</h3>
                        <p>{BROKER_NAME} may at any time amend these Terms of Use by updating this posting. All users of this site are bound by these amendments should they wish to continue accessing the website, and should therefore periodically visit this page to review any and all such amendments.</p>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200">
                    <label className="flex items-start gap-3 cursor-pointer mb-4">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
                        />
                        <span className="text-sm text-gray-700">
                            I have read and agree to the Terms and Conditions
                        </span>
                    </label>
                    <button
                        onClick={handleAccept}
                        disabled={!checked}
                        className="w-full py-2.5 text-sm font-medium rounded bg-brand-accent text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-accent/90 transition-colors"
                    >
                        Continue to Listings
                    </button>
                </div>
            </div>
        </div>
    )
}
