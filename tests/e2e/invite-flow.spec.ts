import { test, expect } from '@playwright/test';

test.describe('Invite / Reset flow UI', () => {
  test('shows friendly UI when token is missing', async ({ page }) => {
    await page.goto('/reset-password');

    await expect(page.locator('text=Missing token')).toBeVisible();
  });

  test('shows invalid token message for fake token', async ({ page }) => {
    await page.route('**/api/validate-token**', route => {
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid' }) });
    });

    await page.goto('/reset-password?token=fake-token&mode=invite');

    await expect(page.getByRole('heading', { name: /Invalid token/i })).toBeVisible();
  });

  test('shows expired token message when API returns 410 (mocked)', async ({ page }) => {
    // This test assumes the API can be mocked or a fixture created. We'll simulate by
    // navigating to the page and intercepting the validation request to return 410.
    await page.route('**/api/validate-token**', route => {
      route.fulfill({ status: 410, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'expired' }) });
    });

    await page.goto('/reset-password?token=will-expire&mode=invite');

    await expect(page.locator('text=Invite expired')).toBeVisible();
  });

  test('placeholder: full invite -> password -> profile -> ACTIVE e2e', async () => {
    test.skip(true, 'Requires a deterministic DB seeding helper or fixture; kept out of the push to avoid dev-only routes.');
  });
});
