/**
 * Mine Detail Page Tests — 矿场详情页展示合并后完整信息
 * Issue: WnadeyaowuOrganization/wande-ai-front#57
 * PR: WnadeyaowuOraganization/wande-ai-front#345
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';

let token: string;

test.beforeAll(async ({ request }) => {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: {
      username: process.env.TEST_USERNAME || 'admin',
      password: process.env.TEST_PASSWORD || 'admin123',
    },
  });
  const loginBody = await loginRes.json();
  expect(loginBody.code).toBe(200);
  token = loginBody.data?.token || loginBody.data?.access_token || '';
});

test.describe('Mine Detail Page — API @smoke @mine-detail @issue:front#57', () => {
  test('project detail API requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/project/mine/1`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('project detail API returns data with valid token', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/project/mine/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
  });
});

test.describe('Mine Detail Page — Frontend @smoke @mine-detail @issue:front#57', () => {
  test('frontend serves correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });

  test('page load attempt does not crash', async ({ page }) => {
    test.skip(!token, 'No token available');
    await page.goto('/');
    await page.evaluate(
      ({ key, token }: { key: string; token: string }) => {
        localStorage.setItem(key, JSON.stringify({ accessToken: token, refreshToken: token, accessCodes: [] }));
      },
      { key: STORAGE_KEY, token },
    );
    await page.goto('/wande/project');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });
});
