import { test, expect } from '@playwright/test';

test.describe('Master User Flow', () => {
  test('should allow a user to discover products via search and chat', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('requestfailed', request => console.log('FAILED:', request.url(), request.failure()?.errorText));

    // 1. Landing on Homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/ElectronicsEcom/);

    // 2. Navigation to Shop
    const shopLink = page.getByRole('link', { name: 'Shop' }).first();
    await shopLink.click({ force: true });
    await expect(page).toHaveURL(/\/shop/);

    // 3. Search for a product
    const searchInput = page.getByPlaceholder(/Search for electronics/i);
    await searchInput.fill('Sony');

    // Wait for debounce and Algolia API response
    console.log('HTML Dump:', await page.content());
    const productLocator = page.getByText(/Sony WH-1000XM5/i).first();
    await productLocator.waitFor({ state: 'visible', timeout: 10000 });
    await expect(productLocator).toBeVisible();

    // 4. Interaction with AI Chatbot
    const chatToggle = page.getByLabel(/Toggle chat/i);
    await chatToggle.click();
    await expect(page.getByText(/AI Assistant/i)).toBeVisible();

    const chatInput = page.getByPlaceholder(/Ask about a product/i);
    await chatInput.fill('Do you have headphones?');
    await chatInput.press('Enter');

    // Wait for AI response (this might take time depending on mock/real API)
    // In E2E we verify the UI handles the flow
    await expect(page.getByText('Do you have headphones?')).toBeVisible();

    // 5. Navigate to PDP from Search Results
    await page.getByRole('link', { name: /Sony WH-1000XM5/i }).first().click();
    await expect(page).toHaveURL(/\/product\/1/);
    await expect(page.getByText(/Sony WH-1000XM5/i).first()).toBeVisible();

    // 6. Verify PDP details
    await expect(page.getByText(/30-hour battery life/i)).toBeVisible();
    await expect(page.getByText(/\$398/)).toBeVisible();
  });
});
