import { test, expect } from '@playwright/test'

test.describe('About Page', () => {
    test('renders with profile info', async ({ page }) => {
        await page.goto('/about')

        await expect(page.getByRole('heading', { name: /abdul/i }).first()).toBeVisible()

        // Profile image loads
        const profileImages = page.locator('img[src*="abdul"]')
        if ((await profileImages.count()) > 0) {
            await expect(profileImages.first()).toBeVisible()
        }
    })

    test('has a CTA linking to contact', async ({ page }) => {
        await page.goto('/about')

        const contactLink = page.getByRole('link', { name: /contact|reach out|get in touch/i }).first()
        await expect(contactLink).toBeVisible()
    })
})
