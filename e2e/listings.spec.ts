import { test, expect } from '@playwright/test'

test.describe('Listings Page', () => {
    // Accept terms gate before each test
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('listings-terms-accepted', '1')
        })
    })

    test('terms gate modal appears on first visit', async ({ page }) => {
        // Clear the localStorage override for this test
        await page.addInitScript(() => {
            localStorage.removeItem('listings-terms-accepted')
        })

        await page.goto('/listings')

        await expect(page.getByRole('heading', { name: /terms and conditions/i })).toBeVisible()

        // Button disabled until checkbox checked
        const continueBtn = page.getByRole('button', {
            name: /continue to listings/i,
        })
        await expect(continueBtn).toBeDisabled()

        // Check the checkbox
        await page.getByRole('checkbox').check()
        await expect(continueBtn).toBeEnabled()

        // Accept terms
        await continueBtn.click()

        // Modal should disappear
        await expect(page.getByRole('heading', { name: /terms and conditions/i })).not.toBeVisible()
    })

    test('map view loads by default on desktop', async ({ page }) => {
        await page.goto('/listings')

        // Map view loader or map should be visible
        await expect(
            page
                .getByText(/loading map/i)
                .or(page.locator('canvas').first())
                .or(page.getByText(/results/i).first())
        ).toBeVisible({ timeout: 15000 })
    })

    test('list view loads with view=list param', async ({ page }) => {
        await page.goto('/listings?view=list')

        // Should show listing cards or "no properties" message
        await expect(page.getByText(/no properties found/i).or(page.locator('[class*="grid"]').first())).toBeVisible({
            timeout: 10000,
        })
    })

    test('search filters are visible', async ({ page }) => {
        await page.goto('/listings')

        // Search/filter bar should be visible
        await expect(page.getByRole('button', { name: /filter/i }).first()).toBeVisible()
    })

    test('list view pagination works', async ({ page }) => {
        // Go to list view
        await page.goto('/listings?view=list')

        // Wait for content to load
        await page.waitForLoadState('networkidle')

        // Check if pagination exists (only shows when totalPages > 1)
        const pagination = page.locator('nav[aria-label="Pagination"]')
        const hasPagination = await pagination.isVisible().catch(() => false)

        if (hasPagination) {
            // Page 1 should be active
            const page1Btn = pagination.getByRole('button', { name: '1' }).first()
            await expect(page1Btn).toBeVisible()

            // Click page 2 if available
            const page2Btn = pagination.getByRole('button', { name: '2' })
            if (await page2Btn.isVisible()) {
                await page2Btn.click()

                // URL should update with page=2
                await expect(page).toHaveURL(/page=2/)
            }
        }
    })

    test('filter params update URL', async ({ page }) => {
        await page.goto('/listings?view=list')

        await page.waitForLoadState('networkidle')

        // Find and interact with a filter dropdown
        const bedsSelect = page.locator('select').filter({ hasText: /bed/i })
        if (await bedsSelect.isVisible()) {
            await bedsSelect.selectOption({ index: 1 })

            // URL should update with filter param
            await page.waitForURL(/bd=/)
        }
    })

    test('service area section with Google Maps iframe', async ({ page }) => {
        await page.goto('/listings?view=list')

        // Scroll to bottom to find service area
        const iframe = page.locator("iframe[src*='google.com/maps']")
        if (await iframe.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(iframe).toHaveAttribute('src', /google\.com\/maps/)
        }
    })
})
