'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Please write a brief message (min 10 characters)'),
    intent: z.enum(['Buy', 'Sell', 'Both', 'Just Curious']).optional(),
    language: z.enum(['English', 'Farsi', 'Dari', 'Persian', 'Hindi', 'Urdu']).optional(),
    listingAddress: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function ContactForm({ className = '', defaultMessage = '', defaultIntent, showLanguage = false, listingAddress }: { className?: string, defaultMessage?: string, defaultIntent?: FormData['intent'], showLanguage?: boolean, listingAddress?: string }) {
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            message: defaultMessage,
            intent: defaultIntent,
            listingAddress: listingAddress,
        }
    })

    const onSubmit = async (data: FormData) => {
        setIsError(false)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error('Submission failed')
            setIsSuccess(true)
            reset()
        } catch (err) {
            console.error(err)
            setIsError(true)
        }
    }

    if (isSuccess) {
        return (
            <div className={`bg-brand-bg p-8 text-center rounded-sm border border-brand-border/50 ${className}`}>
                <h3 className="text-xl font-display font-medium text-brand-text mb-2">Got it!</h3>
                <p className="text-brand-text-muted">Thanks, Abdul will reach out personally within one business day. If it's urgent, feel free to call or text directly.</p>
                <button onClick={() => setIsSuccess(false)} className="mt-6 text-brand-accent text-sm font-medium hover:underline">
                    Send another message
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${className}`} suppressHydrationWarning>
            {isError && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-sm mb-4">
                    There was an error sending your message. Please try again or contact Abdul directly.
                </div>
            )}

            {listingAddress && (
                <input type="hidden" {...register('listingAddress')} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div suppressHydrationWarning>
                    <label htmlFor="firstName" className="block text-xs font-semibold text-brand-text mb-1 uppercase tracking-wider">First Name *</label>
                    <input
                        {...register('firstName')}
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="w-full border border-brand-border px-4 py-3 bg-brand-bg focus:outline-none focus:border-brand-accent transition-colors"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-xs font-semibold text-brand-text mb-1 uppercase tracking-wider">Last Name *</label>
                    <input
                        {...register('lastName')}
                        id="lastName"
                        type="text"
                        placeholder="Smith"
                        className="w-full border border-brand-border px-4 py-3 bg-brand-bg focus:outline-none focus:border-brand-accent transition-colors"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-brand-text mb-1 uppercase tracking-wider">Email *</label>
                    <input
                        {...register('email')}
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="w-full border border-brand-border px-4 py-3 bg-brand-bg focus:outline-none focus:border-brand-accent transition-colors"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-brand-text mb-1 uppercase tracking-wider">Phone</label>
                    <input
                        {...register('phone')}
                        id="phone"
                        type="tel"
                        placeholder="(519) 555-0123"
                        className="w-full border border-brand-border px-4 py-3 bg-brand-bg focus:outline-none focus:border-brand-accent transition-colors"
                    />
                </div>
            </div>

            {!defaultIntent && !listingAddress && (
                <div>
                    <label className="block text-xs font-semibold text-brand-text mb-2 uppercase tracking-wider">I'm looking to:</label>
                    <div className="flex flex-wrap gap-4">
                        {['Buy', 'Sell', 'Both', 'Just Curious'].map(intent => (
                            <label key={intent} className="flex items-center gap-2 cursor-pointer text-sm text-brand-text-muted hover:text-brand-text">
                                <input type="radio" value={intent} {...register('intent')} className="accent-brand-accent" />
                                <span>{intent}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {showLanguage && (
                <div>
                    <label htmlFor="language" className="block text-xs font-semibold text-brand-text mb-1 uppercase tracking-wider">Preferred Language</label>
                    <select
                        {...register('language')}
                        id="language"
                        className="w-full border border-brand-border px-4 py-3 bg-brand-bg focus:outline-none focus:border-brand-accent transition-colors text-brand-text"
                    >
                        <option value="English">English</option>
                        <option value="Farsi">Farsi</option>
                        <option value="Dari">Dari</option>
                        <option value="Persian">Persian</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Urdu">Urdu</option>
                    </select>
                </div>
            )}

            <div>
                <label htmlFor="message" className="block text-xs font-semibold text-brand-text mb-1 uppercase tracking-wider">Message *</label>
                <textarea
                    {...register('message')}
                    id="message"
                    rows={4}
                    placeholder="Tell me a bit about what you're thinking. There are no wrong answers here."
                    className="w-full border border-brand-border px-4 py-3 bg-brand-bg focus:outline-none focus:border-brand-accent transition-colors resize-y"
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-accent hover:bg-brand-accent-light text-white font-medium px-8 py-4 transition-colors w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
            >
                {isSubmitting ? 'Sending...' : 'Send Message →'}
            </button>
        </form>
    )
}
