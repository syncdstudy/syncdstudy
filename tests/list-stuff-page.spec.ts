import { test, expect } from '@playwright/test';

test.use({
  storageState: 'john-auth.json',
});
test('List Stuff Page', async ({ page }) => {
  await page.goto('http://localhost:3000/list');
});
