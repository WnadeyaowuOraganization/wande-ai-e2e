import { test, expect } from '@playwright/test';

test('DORA metrics page loads without white screen', async ({ page }) => {
  await page.goto('/#/super-admin/dora-metrics');
  await page.waitForLoadState('networkidle');
  const body = await page.$('body');
  expect(body).toBeTruthy();
  const text = await page.textContent('body');
  expect(text).toContain('DORA');
});
