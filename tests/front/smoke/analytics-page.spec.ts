import { test, expect } from '@playwright/test';

/**
 * Analytics (数据分析) 页面冒烟测试
 * 对应 Issue: wande-ai-front#236
 *
 * 前端路由：/dashboard/analytics
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
      localStorage.setItem(key, JSON.stringify({ accessToken: token, refreshToken: token, accessCodes: [] }));
    },
    { key: STORAGE_KEY, token },
  );

  await page.goto(targetPath);
  await page.waitForLoadState('networkidle');
}

test.describe('Analytics Page @smoke @analytics @issue:front#236', () => {
  test('analytics API endpoints are functional (backend validation)', { tag: ['@smoke', '@analytics'] }, async ({ request }) => {
    // 登录获取 token
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
    });
    const loginBody = await loginRes.json();
    const token = loginBody.data.access_token;

    // 验证仪表盘概览 API
    const overviewRes = await request.get(`${API_BASE}/wande/dashboard/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(overviewRes.status()).toBe(200);

    // 验证统计数据 API
    const statsRes = await request.get(`${API_BASE}/wande/dashboard/quick-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(statsRes.status()).toBe(200);

    // 验证趋势数据 API
    const trendRes = await request.get(`${API_BASE}/wande/dashboard/trend?days=7`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(trendRes.status()).toBe(200);
  });

  test('frontend serves correctly', { tag: ['@smoke', '@analytics'] }, async ({ page }) => {
    // 验证前端应用能正常加载
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });

  test('page loads successfully', { tag: ['@smoke', '@analytics'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/dashboard/analytics');
    await page.waitForTimeout(3000);

    // 验证页面容器存在
    const container = page.locator('.p-5');
    await expect(container).toBeVisible({ timeout: 10000 });
  });

  test('page displays all sections', { tag: ['@smoke', '@analytics'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/dashboard/analytics');
    await page.waitForTimeout(3000);

    // 验证主要区域都存在
    await expect(page.locator('.analysis-overview')).toBeVisible();
    await expect(page.locator('.analysis-charts-tabs')).toBeVisible();
  });
});
