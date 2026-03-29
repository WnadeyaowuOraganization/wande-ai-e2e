import { test, expect } from '@playwright/test';

/**
 * Snailjob (Snail Job 定时任务) 页面冒烟测试
 * 对应 Issue: wande-ai-front#236
 *
 * 前端路由：/monitor/snailjob
 */

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

test.describe('Snailjob Page @smoke @snailjob @issue:front#236', () => {
  test('frontend serves correctly', { tag: ['@smoke', '@snailjob'] }, async ({ page }) => {
    // 验证前端应用能正常加载
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });

  test('page loads successfully', { tag: ['@smoke', '@snailjob'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/monitor/snailjob');
    await page.waitForTimeout(3000);

    // 验证页面内容区域存在 (Page 组件使用 .p-4 作为内容区域)
    const container = page.locator('.p-4');
    await expect(container).toBeVisible({ timeout: 10000 });
  });

  test('page displays iframe for Snail Job', { tag: ['@smoke', '@snailjob'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/monitor/snailjob');
    await page.waitForTimeout(3000);

    // 验证 iframe 元素存在
    const iframe = page.locator('iframe');
    await expect(iframe).toBeVisible({ timeout: 10000 });
    // 验证 iframe src 包含 snail-job
    await expect(iframe).toHaveAttribute('src', 'http://localhost:8800/snail-job');
  });
});
