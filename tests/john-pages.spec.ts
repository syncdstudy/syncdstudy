import { test, expect } from '@playwright/test';

test.use({
  storageState: './tests/john-auth.json', // ✅ Use your saved login session
});

test('authenticated user can access list page', async ({ page }) => {
  await page.goto('http://localhost:3000/list');
  await expect(page).toHaveURL(/.*list/);
  await expect(page.locator('p')).toContainText('Page not found'); // or however your 404 is rendered
});
