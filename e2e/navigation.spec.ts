import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
    test('all main pages are reachable', async ({ page }) => {
        const routes = [
            { path: '/', heading: /./ },
            { path: '/about', heading: /abdul/i },
            { path: '/contact', heading: /chat/i },
            { path: '/mortgage-calculator', heading: /mortgage/i },
            { path: '/neighbourhoods', heading: /neighbourhood/i },
        ]

        for (const route of routes) {
            const response = await page.goto(route.path)
            expect(response?.status()).toBeLessThan(400)
            await expect(page.getByRole('heading', { name: route.heading }).first()).toBeVisible()
        }
    })

    test('nav bar is present on all pages', async ({ page }) => {
        const pages = ['/', '/about', '/contact', '/mortgage-calculator']

        for (const path of pages) {
            await page.goto(path)
            await expect(page.locator('nav').first()).toBeVisible()
        }
    })

    test('footer is present on all pages', async ({ page }) => {
        const pages = ['/', '/about', '/contact', '/mortgage-calculator']

        for (const path of pages) {
            await page.goto(path)
            await expect(page.locator('footer')).toBeVisible()
        }
    })

    test('404 page returns for unknown routes', async ({ page }) => {
        const response = await page.goto('/nonexistent-page-xyz')
        expect(response?.status()).toBe(404)
    })
})
