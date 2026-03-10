'use client'

import { useState } from 'react'
import { X, Phone } from 'lucide-react'
import Image from 'next/image'
import { ContactForm } from '@/components/ContactForm'

interface MobileContactSheetProps {
    defaultMessage: string
    listingAddress: string
}

export function MobileContactSheet({ defaultMessage, listingAddress }: MobileContactSheetProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Floating trigger button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-5 left-4 right-4 z-40 lg:hidden py-3 text-sm font-semibold rounded-full bg-brand-accent text-white shadow-lg text-center"
            >
                Book a Showing
            </button>

            {/* Bottom sheet overlay */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        {/* Handle bar */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-gray-300 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                    <Image
                                        src="https://cdn.realtor.ca/individual/TS637750507800000000/highres/1403257.jpg"
                                        alt="Abdul Basharmal"
                                        fill
                                        className="object-cover object-top"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">Abdul Basharmal</p>
                                    <a href="tel:905-906-0045" className="text-brand-accent text-xs font-medium flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> (905) 906-0045
                                    </a>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-2 -mr-2 text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="px-5 py-4 pb-8">
                            <ContactForm
                                defaultMessage={defaultMessage}
                                defaultIntent="Buy"
                                listingAddress={listingAddress}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
