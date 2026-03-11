import { z } from 'zod'

export const contactSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Please write a brief message (min 10 characters)'),
    intent: z.enum(['Buy', 'Sell', 'Both', 'Just Curious']).optional(),
    language: z.enum(['English', 'Farsi', 'Dari', 'Persian', 'Hindi', 'Urdu']).optional(),
    listingAddress: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
