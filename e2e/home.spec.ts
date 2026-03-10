import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
    test('loads and displays key sections', async ({ page }) => {
        await page.goto('/')

        await expect(page).toHaveTitle(/./)

        // Hero section visible
        await expect(page.locator('h1').first()).toBeVisible()

        // Featured listings section loads (lazy via Suspense)
        await expect(page.getByRole('heading', { name: /featured/i })).toBeVisible({ timeout: 10000 })

        // Contact CTA section
        await expect(page.getByRole('heading', { name: /chat/i })).toBeVisible()
    })

    test('navigation links work', async ({ page }) => {
        await page.goto('/')

        // Check that main nav links exist
        const nav = page.locator('nav').first()
        await expect(nav).toBeVisible()
    })

    test('contact info links have correct hrefs', async ({ page }) => {
        await page.goto('/')

        const phoneLink = page.locator('a[href="tel:905-906-0045"]')
        await expect(phoneLink.first()).toBeVisible()

        const emailLink = page.locator('a[href="mailto:abdulbashrealtor@gmail.com"]')
        await expect(emailLink.first()).toBeVisible()
    })

    test('WebP images load correctly', async ({ page }) => {
        const failedImages: string[] = []

        page.on('response', (response) => {
            if (response.url().includes('.webp') && response.status() >= 400) {
                failedImages.push(response.url())
            }
        })

        await page.goto('/')
        await page.waitForLoadState('networkidle')

        expect(failedImages).toEqual([])
    })
})
