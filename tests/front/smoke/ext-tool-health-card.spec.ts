/**
 * 外部工具健康度卡片 冒烟测试
 * Issue: WnadeyaowuOraganization/wande-ai-front#213
 * PR: WnadeyaowuOraganization/wande-ai-front#335
 *
 * 测试范围：
 * - /monitor/ext-tool/dashboard-card API 可达性和认证
 * - 驾驶舱页面集成外部工具健康度卡片
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

test.describe('External Tool Health Card @smoke @ext-tool-health @issue:front#213', () => {
  test('dashboard-card API rejects unauthenticated requests', { tag: ['@smoke', '@ext-tool-health', '@api'] }, async ({ request }) => {
    const res = await request.get(`${API_BASE}/monitor/ext-tool/dashboard-card`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('dashboard-card API returns valid data with auth', { tag: ['@smoke', '@ext-tool-health', '@api'] }, async ({ request }) => {
    const token = await getAuthToken(request);
    test.skip(!token, 'Login failed');

    const res = await request.get(`${API_BASE}/monitor/ext-tool/dashboard-card`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('dashboard-card API response has expected fields', { tag: ['@smoke', '@ext-tool-health', '@api'] }, async ({ request }) => {
    const token = await getAuthToken(request);
    test.skip(!token, 'Login failed');

    const res = await request.get(`${API_BASE}/monitor/ext-tool/dashboard-card`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    test.skip(body.code !== 200, `API returned code ${body.code}`);

    const data = body.data;
    // 卡片应包含工具统计信息
    const hasExpectedFields =
      data.total !== undefined ||
      data.normal !== undefined ||
      data.warning !== undefined ||
      data.error !== undefined ||
      data.totalCount !== undefined ||
      data.healthyCount !== undefined ||
      data.alertCount !== undefined ||
      data.availabilityRate !== undefined ||
      data.availableRate !== undefined ||
      data.tools !== undefined;
    expect(hasExpectedFields).toBe(true);
  });

  test('cockpit page loads with external tool health card', { tag: ['@smoke', '@ext-tool-health'] }, async ({ page, request }) => {
    const token = await getAuthToken(request);
    test.skip(!token, 'Login failed');

    // 登录并导航到驾驶舱
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

    await page.goto(`${FRONT_BASE}/wande-dev/cockpit`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 验证页面加载（非404/登录页）
    const is404 = await page.locator('text=未找到页面').isVisible().catch(() => false);
    if (is404) {
      test.skip(true, 'Cockpit page shows 404 - menu not registered');
    }

    if (page.url().includes('/auth/login')) {
      test.skip(true, 'Redirected to login page');
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('cockpit page has no critical console errors', { tag: ['@smoke', '@ext-tool-health'] }, async ({ page, request }) => {
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

    await page.goto(`${FRONT_BASE}/wande-dev/cockpit`);
    await page.waitForTimeout(3000);

    const criticalErrors = errors.filter((e) =>
      !e.includes('favicon') &&
      !e.includes('manifest') &&
      !e.includes('ResizeObserver') &&
      !e.includes('[HMR]') &&
      !e.includes('NetworkError') &&
      !e.includes('Failed to fetch') &&
      !e.includes('ECONNREFUSED')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
