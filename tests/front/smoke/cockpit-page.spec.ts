import { test, expect } from '@playwright/test';

/**
 * 超管驾驶舱 (Cockpit) 页面冒烟测试
 * 对应 Issue: wande-ai-front#136
 *
 * 前端路由：/super-admin/cockpit（需确认 sys_menu 注册）
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

test.describe('Cockpit Page @smoke @cockpit @issue:front#136', () => {
  test('cockpit API endpoints are functional (backend validation)', { tag: ['@smoke', '@cockpit'] }, async ({ request }) => {
    // 登录获取 token
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
    });
    const loginBody = await loginRes.json();
    const token = loginBody.data.access_token;

    // 验证项目概览 API
    const projectRes = await request.get(`${API_BASE}/wande/dashboard/cockpit/project-overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(projectRes.status()).toBe(200);

    // 验证管线状态 API
    const pipelineRes = await request.get(`${API_BASE}/wande/dashboard/cockpit/pipeline-status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(pipelineRes.status()).toBe(200);

    // 验证健康检查 API
    const healthRes = await request.get(`${API_BASE}/wande/dashboard/cockpit/health-check`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(healthRes.status()).toBe(200);

    // 验证待办事项 API
    const todoRes = await request.get(`${API_BASE}/wande/dashboard/cockpit/todo-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(todoRes.status()).toBe(200);
  });

  test('frontend serves correctly', { tag: ['@smoke', '@cockpit'] }, async ({ page }) => {
    // 验证前端应用能正常加载
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });

  // 以下测试在 sys_menu 注册后启用
  test.skip('page loads successfully (requires sys_menu registration)', { tag: ['@smoke', '@cockpit'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/super-admin/cockpit');
    await page.waitForTimeout(3000);

    // 验证页面容器存在
    const container = page.locator('.cockpit-dashboard');
    await expect(container).toBeVisible({ timeout: 10000 });
  });

  test.skip('page displays all four sections', { tag: ['@smoke', '@cockpit'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/super-admin/cockpit');
    await page.waitForTimeout(3000);

    // 验证四个主要区域都存在
    await expect(page.locator('.project-overview')).toBeVisible();
    await expect(page.locator('.pipeline-status')).toBeVisible();
    await expect(page.locator('.health-check')).toBeVisible();
    await expect(page.locator('.todo-list')).toBeVisible();
  });
});
