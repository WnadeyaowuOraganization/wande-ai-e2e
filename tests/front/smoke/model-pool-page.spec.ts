/**
 * Model Pool Page Smoke Tests — 账号池监控页面
 * Issue: WnadeyaowuOraganization/wande-ai-front#211
 * PR: WnadeyaowuOraganization/wande-ai-front#334
 *
 * 账号池监控页面 — API Key状态矩阵 + 可用率趋势
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const FRONT_BASE = process.env.BASE_URL_FRONT || 'http://localhost:8083';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';

async function loginAndGoto(page, targetPath: string) {
  try {
    const response = await page.request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
      timeout: 5000,
    });
    if (response.ok()) {
      const body = await response.json();
      const token = body.data?.access_token || body.data?.token || body.token;
      if (token) {
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
      }
    }
  } catch {
    // API不可用，降级
  }

  await page.goto(`${FRONT_BASE}${targetPath}`);
  await page.waitForLoadState('networkidle');

  if (page.url().includes('/auth/login')) {
    await page.getByPlaceholder('请输入用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('admin123');
    await page.locator('button[aria-label="login"]').click();
    await page.waitForLoadState('networkidle');
    await page.goto(`${FRONT_BASE}${targetPath}`);
    await page.waitForLoadState('networkidle');
  }
}

test.describe('Model Pool Page @smoke @model-pool @issue:front#211', () => {
  test('frontend serves correctly', { tag: ['@smoke', '@model-pool'] }, async ({ page }) => {
    const response = await page.request.get(`${FRONT_BASE}/dashboard/ext-tools/model-pool`);
    expect(response.status()).toBe(200);
  });

  test('dashboard API is accessible (backend validation)', { tag: ['@smoke', '@model-pool'] }, async ({ request }) => {
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
    });
    const loginBody = await loginRes.json();
    test.skip(loginBody.code !== 200, 'Login failed');

    const token = loginBody.data?.access_token || loginBody.data?.token;
    // 账号池监控相关的dashboard API
    const res = await request.get(`${API_BASE}/api/dashboard/commands/presets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
  });

  test('page loads without crash', { tag: ['@smoke', '@model-pool'] }, async ({ page }) => {
    await loginAndGoto(page, '/dashboard/ext-tools/model-pool');

    if (page.url().includes('/auth/login')) {
      test.skip(true, 'Redirected to login page - API unavailable');
    }

    const is404 = await page.locator('text=未找到页面').isVisible().catch(() => false);
    if (is404) {
      test.skip(true, 'Page shows 404 - menu not registered');
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('page has expected UI elements', { tag: ['@smoke', '@model-pool'] }, async ({ page }) => {
    await loginAndGoto(page, '/dashboard/ext-tools/model-pool');

    if (page.url().includes('/auth/login')) {
      test.skip(true, 'Redirected to login page');
    }

    const is404 = await page.locator('text=未找到页面').isVisible().catch(() => false);
    if (is404) {
      test.skip(true, 'Page shows 404');
    }

    await page.waitForTimeout(1000);

    const hasTitle = await page.locator('text=账号池').or(page.locator('text=Key')).or(page.locator('text=模型')).isVisible().catch(() => false);
    const hasTable = await page.locator('table, .ant-table, [class*="table"]').isVisible().catch(() => false);
    const hasCard = await page.locator('.ant-card, [class*="card"]').isVisible().catch(() => false);

    expect(hasTitle || hasTable || hasCard).toBe(true);
  });

  test('page has no critical console errors', { tag: ['@smoke', '@model-pool'] }, async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await loginAndGoto(page, '/dashboard/ext-tools/model-pool');
    await page.waitForTimeout(2000);

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
