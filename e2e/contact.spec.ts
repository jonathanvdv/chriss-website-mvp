import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
    test('page renders with contact info and form', async ({ page }) => {
        await page.goto('/contact')

        await expect(page.getByRole('heading', { name: /chat/i })).toBeVisible()

        // Contact details present
        await expect(page.getByRole('main').getByRole('heading', { name: 'Abdul Basharmal' })).toBeVisible()
        await expect(page.getByRole('main').locator('a[href="tel:905-906-0045"]')).toBeVisible()
        await expect(page.getByRole('main').locator('a[href="mailto:abdulbashrealtor@gmail.com"]')).toBeVisible()

        // Form fields present
        await expect(page.locator('input[name="firstName"]')).toBeVisible()
        await expect(page.locator('input[name="lastName"]')).toBeVisible()
        await expect(page.locator('input[name="email"]')).toBeVisible()
        await expect(page.locator('textarea[name="message"]')).toBeVisible()
    })

    test('shows validation errors on empty submit', async ({ page }) => {
        await page.goto('/contact')

        await page.getByRole('button', { name: /send message/i }).click()

        // Should show required field errors
        await expect(page.getByText(/required/i).first()).toBeVisible()
    })

    test('shows validation error for invalid email', async ({ page }) => {
        await page.goto('/contact')

        const form = page.getByRole('main').locator('form')
        await form.locator('input[name="firstName"]').fill('John')
        await form.locator('input[name="lastName"]').fill('Smith')
        // Use a value that passes HTML5 email validation but fails Zod
        // or check that browser native validation fires
        const emailInput = form.locator('input[name="email"]')
        await emailInput.fill('not-an-email')
        await form.locator('textarea[name="message"]').fill('This is a test message for validation.')

        await form.getByRole('button', { name: /send message/i }).click()

        // Browser native validation or Zod validation should prevent submission
        const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage)
        expect(validationMessage.length).toBeGreaterThan(0)
    })

    test('shows validation error for short message', async ({ page }) => {
        await page.goto('/contact')

        await page.locator('input[name="firstName"]').fill('John')
        await page.locator('input[name="lastName"]').fill('Smith')
        await page.locator('input[name="email"]').fill('john@example.com')
        await page.locator('textarea[name="message"]').fill('Short')

        await page.getByRole('button', { name: /send message/i }).click()

        await expect(page.getByText(/10/i).first()).toBeVisible()
    })

    test('evaluation query param changes heading and intent', async ({ page }) => {
        await page.goto('/contact?type=evaluation')

        await expect(page.getByRole('heading', { name: /home evaluation/i })).toBeVisible()
    })

    test('intent radio buttons render on contact page', async ({ page }) => {
        await page.goto('/contact')

        const form = page.getByRole('main').locator('form')

        // Intent radios should be visible (Buy, Sell, Both, Just Curious)
        await expect(form.getByLabel('Buy')).toBeVisible()
        await expect(form.getByLabel('Sell')).toBeVisible()
        await expect(form.getByLabel('Both')).toBeVisible()
        await expect(form.getByLabel('Just Curious')).toBeVisible()

        // Language select should be visible on contact page
        await expect(form.locator('#language')).toBeVisible()
    })
})
