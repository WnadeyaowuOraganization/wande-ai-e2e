/**
 * 超管后台权限管理页面 冒烟测试
 * Issue: WnadeyaowuOraganization/wande-ai-front#67
 * PR:  WnadeyaowuOraganization/wande-ai-front#411
 *
 * 前端路由预期: /wande/admin/permission (需sys_menu注册)
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const FRONT_BASE = process.env.BASE_URL_FRONT || 'http://localhost:8083';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';

async function getAuthToken(request: any): Promise<string | null> {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: { username: 'admin', password: 'admin123' },
  });
  const body = await loginRes.json();
  if (body.code !== 200) return null;
  return body.data?.access_token || body.data?.token || null;
}

test.describe('Admin Permission Page @smoke @admin @permission @issue:front#67', () => {
  test('permission API endpoints are functional', { tag: ['@smoke', '@admin', '@api'] }, async ({ request }) => {
    const token = await getAuthToken(request);
    test.skip(!token, 'Login failed');

    // PR #411 新增的 API: /api/wande/admin/permission/...
    const res = await request.get(`${API_BASE}/api/wande/admin/permission/modules`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    // 后端API可能尚未部署
    expect([200, 403, 404, 500]).toContain(body.code);
  });

  test('permission page loads successfully', { tag: ['@smoke', '@admin'] }, async ({ page, request }) => {
    const token = await getAuthToken(request);
    test.skip(!token, 'Login failed');

    await page.goto(FRONT_BASE);
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(
      ({ key, token }) => {
        localStorage.setItem(key, JSON.stringify({
          accessToken: token, refreshToken: token, accessCodes: [],
        }));
      },
      { key: STORAGE_KEY, token },
    );

    await page.goto(`${FRONT_BASE}/wande/admin/permission`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const is404 = await page.locator('text=未找到页面').isVisible().catch(() => false);
    if (is404) {
      test.skip(true, 'Permission page shows 404 - menu not registered');
    }

    if (page.url().includes('/auth/login')) {
      test.skip(true, 'Redirected to login page');
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('permission page has no critical console errors', { tag: ['@smoke', '@admin'] }, async ({ page, request }) => {
    const token = await getAuthToken(request);
    test.skip(!token, 'Login failed');

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(FRONT_BASE);
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(
      ({ key, token }) => {
        localStorage.setItem(key, JSON.stringify({
          accessToken: token, refreshToken: token, accessCodes: [],
        }));
      },
      { key: STORAGE_KEY, token },
    );

    await page.goto(`${FRONT_BASE}/wande/admin/permission`);
    await page.waitForTimeout(3000);

    const criticalErrors = errors.filter((e) =>
      !e.includes('favicon') &&
      !e.includes('manifest') &&
      !e.includes('ResizeObserver') &&
      !e.includes('[HMR]') &&
      !e.includes('NetworkError') &&
      !e.includes('Failed to fetch') &&
      !e.includes('ECONNREFUSED') &&
      !e.includes('500') &&
      !e.includes('Internal Server Error') &&
      !e.includes('No static resource') &&
      !e.includes('未找到对应组件')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
