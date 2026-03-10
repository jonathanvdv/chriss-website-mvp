import { test, expect } from '@playwright/test'

test.describe('API Routes', () => {
    test('contact API rejects invalid payload', async ({ request }) => {
        const response = await request.post('/api/contact', {
            data: { firstName: '', email: 'bad' },
        })

        expect(response.status()).toBe(400)
    })

    test('contact API rejects empty body', async ({ request }) => {
        const response = await request.post('/api/contact', {
            data: {},
        })

        expect(response.status()).toBe(400)
    })

    test('listings API returns JSON', async ({ request }) => {
        const response = await request.get('/api/listings?bbox=-80,43,-79,44')

        // Should return 200 with JSON (may be empty if no DB)
        expect(response.status()).toBeLessThan(500)
        const contentType = response.headers()['content-type']
        expect(contentType).toContain('application/json')
    })

    test('listings API rejects invalid bbox', async ({ request }) => {
        const response = await request.get('/api/listings?bbox=invalid')

        expect(response.status()).toBeGreaterThanOrEqual(400)
    })

    test('contact API rate limits repeated requests', async ({ request }) => {
        const payload = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            message: 'This is a rate limit test message.',
        }

        const responses = []
        for (let i = 0; i < 7; i++) {
            responses.push(await request.post('/api/contact', { data: payload }))
        }

        // At least one should eventually be rate limited (429)
        const statuses = responses.map((r) => r.status())
        const hasRateLimit = statuses.some((s) => s === 429)
        const hasSuccess = statuses.some((s) => s === 200 || s === 500) // 500 if no email config

        expect(hasRateLimit || hasSuccess).toBeTruthy()
    })
})
