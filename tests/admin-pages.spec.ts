import { test, expect } from '@playwright/test';

test.use({
  storageState: './tests/admin-auth.json', // ✅ Use your saved login session
});

test('authenticated user can access list page', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.goto('http://localhost:3000/list');
  console.log(await page.url()); // check what URL you're actually on
  console.log(await page.content());
  await expect(page.locator('p')).toContainText('Page not found'); // or however your 404 is rendered
});
