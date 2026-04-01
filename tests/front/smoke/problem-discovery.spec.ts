import { test, expect } from '@playwright/test';

const FRONT_BASE = process.env.BASE_URL_FRONT || 'http://localhost:8083';

test('问题发现页面可正常加载且无白屏', async ({ page }) => {
  await page.goto(`${FRONT_BASE}/super-admin/problems`);
  await page.waitForLoadState('domcontentloaded');

  // 验证页面标题和关键区域渲染
  await expect(page.locator('text=问题发现')).toBeVisible();

  // 验证统计卡片区域存在
  await expect(page.locator('text=P0 问题数')).toBeVisible();
  await expect(page.locator('text=待处理数')).toBeVisible();

  // 验证表格和趋势图容器存在（避免白屏）
  await expect(page.locator('.basic-table, .vxe-table, [id^="wande-problem-discovery"]')).toHaveCount(1);
  await expect(page.locator('.trend-chart')).toBeVisible();
});
