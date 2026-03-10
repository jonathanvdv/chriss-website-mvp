import { z } from 'zod'

export function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export const contactSchema = z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email().max(320),
    phone: z.string().max(30).regex(/^[+\d\s\-().]*$/, 'Invalid phone number format').optional(),
    message: z.string().min(10).max(5000),
    intent: z.enum(['Buy', 'Sell', 'Both', 'Just Curious']).optional(),
    language: z.enum(['English', 'Farsi', 'Dari', 'Persian', 'Hindi', 'Urdu']).optional(),
    listingAddress: z.string().max(500).optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
