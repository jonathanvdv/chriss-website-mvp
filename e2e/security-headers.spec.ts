import { test, expect } from '@playwright/test'

test.describe('Security Headers', () => {
    test('CSP and security headers are present', async ({ request }) => {
        const response = await request.get('/')
        const headers = response.headers()

        expect(headers['content-security-policy']).toBeDefined()
        expect(headers['x-content-type-options']).toBe('nosniff')
        expect(headers['x-frame-options']).toBe('DENY')
        expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
        expect(headers['permissions-policy']).toBeDefined()
        expect(headers['strict-transport-security']).toBeDefined()
    })

    test('CSP allows required external sources', async ({ request }) => {
        const response = await request.get('/')
        const csp = response.headers()['content-security-policy']

        // Google Fonts allowed
        expect(csp).toContain('fonts.googleapis.com')
        expect(csp).toContain('fonts.gstatic.com')

        // CartoDB tiles allowed
        expect(csp).toContain('cartocdn.com')

        // Google Maps iframe allowed
        expect(csp).toContain('google.com')
    })
})
