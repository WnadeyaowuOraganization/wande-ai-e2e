import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';

async function loginAndGoto(page: any, request: any, targetPath: string) {
  const response = await request.post(`${API_BASE}/auth/login`, {
    data: {
      username: process.env.TEST_USERNAME || 'admin',
      password: process.env.TEST_PASSWORD || 'admin123',
    },
  });
  const body = await response.json();
  const token = body.data.access_token;

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(
    ({ key, token }: { key: string; token: string }) => {
      localStorage.setItem(key, JSON.stringify({ accessToken: token, refreshToken: token, accessCodes: [], roles: ['admin'] }));
    },
    { key: STORAGE_KEY, token },
  );

  await page.goto(targetPath);
  await page.waitForLoadState('networkidle');
}

// 当前 dev 环境下 /super-admin/home 菜单尚未注册，页面测试跳过
test.describe.skip('Cockpit Dashboard @smoke @cockpit @issue:front#447', () => {
  test('驾驶舱首页可正常加载且无白屏', { tag: ['@smoke', '@cockpit'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/super-admin/home');
    await page.waitForTimeout(3000);

    // 验证主要区域渲染
    await expect(page.locator('text=超管驾驶舱')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=平台系统')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=开发者协同')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=业务板块')).toBeVisible({ timeout: 10000 });

    // 验证至少存在 KPI 卡片
    const cards = page.locator('.kpi-card');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });
});
