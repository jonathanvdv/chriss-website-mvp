import { test, expect } from '@playwright/test'

test.describe('Mortgage Calculator', () => {
    test('page loads with all sections', async ({ page }) => {
        await page.goto('/mortgage-calculator')

        await expect(page.getByRole('heading', { name: /canadian mortgages/i })).toBeVisible()

        // Calculator loads (dynamic import)
        await expect(page.locator('#price')).toBeVisible({ timeout: 10000 })

        // Key sections exist
        await expect(page.getByRole('heading', { name: /first-time/i }).first()).toBeVisible()
        await expect(page.getByRole('heading', { name: /mortgage types/i }).first()).toBeVisible()
        await expect(page.getByRole('heading', { name: /down payment/i }).first()).toBeVisible()
        await expect(page.getByRole('heading', { name: /glossary/i }).first()).toBeVisible()
    })

    test('calculator shows default payment', async ({ page }) => {
        await page.goto('/mortgage-calculator')

        await expect(page.locator('#price')).toBeVisible({ timeout: 10000 })

        // Default values should produce a payment result
        const paymentText = page.getByText(/\$/)
        await expect(paymentText.first()).toBeVisible()
    })

    test('payment updates when price changes', async ({ page }) => {
        await page.goto('/mortgage-calculator')

        const priceInput = page.locator('#price')
        await expect(priceInput).toBeVisible({ timeout: 10000 })

        // Get initial payment text
        const paymentEl = page.locator('text=/\\$[\\d,]+\\.\\d{2}/').first()
        const initialPayment = await paymentEl.textContent()

        // Change price
        await priceInput.click()
        await priceInput.fill('800000')

        // Payment should change
        await expect(paymentEl).not.toHaveText(initialPayment!)
    })

    test('payment frequency buttons toggle correctly', async ({ page }) => {
        await page.goto('/mortgage-calculator')

        await expect(page.locator('#price')).toBeVisible({ timeout: 10000 })

        const frequencies = ['Monthly', 'Semi-monthly', 'Bi-weekly', 'Weekly']

        for (const freq of frequencies) {
            const button = page.getByRole('button', { name: freq, exact: true })
            await button.click()

            // Active button should have distinct styling
            await expect(button).toHaveClass(/bg-brand-bg-dark/)
        }
    })

    test('CMHC insurance notice shows for low down payment', async ({ page }) => {
        await page.goto('/mortgage-calculator')

        const dpInput = page.locator('#dp')
        await expect(dpInput).toBeVisible({ timeout: 10000 })

        // Set a low down payment (< 20%)
        await page.locator('#price').fill('500000')
        await dpInput.click()
        await dpInput.fill('25000')

        await expect(page.getByText('CMHC insurance applies')).toBeVisible()
    })

    test('glossary sections expand and collapse', async ({ page }) => {
        await page.goto('/mortgage-calculator')

        const glossaryDetails = page.locator('details').first()
        await glossaryDetails.scrollIntoViewIfNeeded()

        // Initially collapsed -- content not visible
        const summary = glossaryDetails.locator('summary')
        await summary.click()

        // Should now be open
        await expect(glossaryDetails).toHaveAttribute('open', '')

        // Click again to close
        await summary.click()
        await expect(glossaryDetails).not.toHaveAttribute('open', '')
    })

    test('CTA links to contact page', async ({ page }) => {
        await page.goto('/mortgage-calculator')

        const ctaLink = page.getByRole('link', { name: /reach out/i })
        await expect(ctaLink).toHaveAttribute('href', '/contact')
    })
})
