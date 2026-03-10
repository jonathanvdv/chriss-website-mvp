import { describe, it, expect } from 'vitest'
import { escapeHtml, contactSchema } from '../contact-utils'

// ─── escapeHtml ─────────────────────────────────────────────────────────

describe('escapeHtml', () => {
    it('escapes ampersands', () => {
        expect(escapeHtml('a & b')).toBe('a &amp; b')
    })

    it('escapes angle brackets', () => {
        expect(escapeHtml('<script>alert("xss")</script>')).toBe(
            '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
        )
    })

    it('escapes double quotes', () => {
        expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;')
    })

    it('escapes single quotes', () => {
        expect(escapeHtml("it's")).toBe('it&#39;s')
    })

    it('returns empty string unchanged', () => {
        expect(escapeHtml('')).toBe('')
    })

    it('handles all special chars together', () => {
        expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
            '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;'
        )
    })
})

// ─── contactSchema ──────────────────────────────────────────────────────

describe('contactSchema', () => {
    const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'I am interested in buying a home in Kitchener.',
    }

    it('accepts valid minimal data', () => {
        const result = contactSchema.safeParse(validData)
        expect(result.success).toBe(true)
    })

    it('accepts valid data with all optional fields', () => {
        const result = contactSchema.safeParse({
            ...validData,
            phone: '519-555-0123',
            intent: 'Buy',
            language: 'English',
            listingAddress: '123 Main St',
        })
        expect(result.success).toBe(true)
    })

    it('rejects missing firstName', () => {
        const result = contactSchema.safeParse({ ...validData, firstName: '' })
        expect(result.success).toBe(false)
    })

    it('rejects missing lastName', () => {
        const result = contactSchema.safeParse({ ...validData, lastName: '' })
        expect(result.success).toBe(false)
    })

    it('rejects invalid email', () => {
        const result = contactSchema.safeParse({ ...validData, email: 'not-an-email' })
        expect(result.success).toBe(false)
    })

    it('rejects message shorter than 10 characters', () => {
        const result = contactSchema.safeParse({ ...validData, message: 'Hi' })
        expect(result.success).toBe(false)
    })

    it('rejects message longer than 5000 characters', () => {
        const result = contactSchema.safeParse({ ...validData, message: 'a'.repeat(5001) })
        expect(result.success).toBe(false)
    })

    it('rejects invalid intent value', () => {
        const result = contactSchema.safeParse({ ...validData, intent: 'Hack' })
        expect(result.success).toBe(false)
    })

    it('rejects invalid language value', () => {
        const result = contactSchema.safeParse({ ...validData, language: 'Klingon' })
        expect(result.success).toBe(false)
    })

    it('rejects firstName longer than 100 characters', () => {
        const result = contactSchema.safeParse({ ...validData, firstName: 'a'.repeat(101) })
        expect(result.success).toBe(false)
    })

    it('accepts valid phone numbers', () => {
        const validPhones = ['519-555-0123', '+1 (519) 555-0123', '5195550123', '+1.519.555.0123']
        for (const phone of validPhones) {
            const result = contactSchema.safeParse({ ...validData, phone })
            expect(result.success).toBe(true)
        }
    })

    it('rejects phone with non-phone characters', () => {
        const invalidPhones = ['<script>alert(1)</script>', 'abc123', 'call me!']
        for (const phone of invalidPhones) {
            const result = contactSchema.safeParse({ ...validData, phone })
            expect(result.success).toBe(false)
        }
    })
})
