import { test, expect } from '@playwright/test';

/**
 * Online (在线用户) 页面冒烟测试
 * 对应 Issue: wande-ai-front#236
 *
 * 前端路由：/monitor/online
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

test.describe('Online Page @smoke @online @issue:front#236', () => {
  test('online API endpoints are functional (backend validation)', { tag: ['@smoke', '@online'] }, async ({ request }) => {
    // 登录获取 token
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
    });
    const loginBody = await loginRes.json();
    const token = loginBody.data.access_token;

    // 验证在线用户列表 API
    const onlineListRes = await request.get(`${API_BASE}/monitor/online/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(onlineListRes.status()).toBe(200);
  });

  test('frontend serves correctly', { tag: ['@smoke', '@online'] }, async ({ page }) => {
    // 验证前端应用能正常加载
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });

  test('page loads successfully', { tag: ['@smoke', '@online'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/monitor/online');
    await page.waitForTimeout(3000);

    // 验证页面内容区域存在 (Page 组件使用 .p-4 作为内容区域)
    const container = page.locator('.p-4');
    await expect(container).toBeVisible({ timeout: 10000 });
  });

  test('page displays online user table', { tag: ['@smoke', '@online'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/monitor/online');
    await page.waitForTimeout(3000);

    // 验证在线用户列表标题
    await expect(page.locator('text=在线用户列表')).toBeVisible();
    // 验证表格存在
    await expect(page.locator('.vxe-table')).toBeVisible({ timeout: 10000 });
  });
});
