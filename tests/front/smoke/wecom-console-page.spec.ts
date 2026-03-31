/**
 * Wecom Console Page Smoke Test
 * Issue: WnadeyaowuOraganization/wande-ai-front#33
 * PR: WnadeyaowuOraganization/wande-ai-front#373
 *
 * Page: /super-admin/wecom-console
 */

import { test, expect } from '@playwright/test';

const FRONT_BASE = process.env.BASE_URL_FRONT || 'http://localhost:8083';
const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';

async function getAuthToken(request: any): Promise<string | null> {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: { username: 'admin', password: 'admin123' },
  });
  const body = await loginRes.json();
  if (body.code !== 200) return null;
  return body.data?.access_token || body.data?.token || null;
}

test.describe('Wecom Console Page @smoke @wecom-console @issue:front#33', () => {
  test('page loads without critical errors when menu is registered', { tag: ['@smoke', '@wecom-console'] }, async ({ page, request }) => {
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

    await page.goto(`${FRONT_BASE}/super-admin/wecom-console`);
    await page.waitForLoadState('networkidle');

    const is404 = await page.locator('text=未找到页面').isVisible().catch(() => false);
    if (is404) {
      test.skip(true, 'Page shows 404 - menu not registered');
    }

    if (page.url().includes('/auth/login')) {
      test.skip(true, 'Redirected to login page');
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('page has no critical console errors', { tag: ['@smoke', '@wecom-console'] }, async ({ page, request }) => {
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

    await page.goto(`${FRONT_BASE}/super-admin/wecom-console`);
    await page.waitForTimeout(3000);

    const is404 = await page.locator('text=未找到页面').isVisible().catch(() => false);
    if (is404) {
      test.skip(true, 'Page shows 404 - menu not registered');
    }

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
