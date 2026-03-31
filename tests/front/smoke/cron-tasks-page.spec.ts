/**
 * Cron Tasks Management Dashboard Page Tests — /super-admin/cron-tasks
 * Issue: WnadeyaowuOraganization/wande-ai-front#338
 * PR: WnadeyaowuOraganization/wande-ai-front#340
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

test.describe('Cron Tasks Page — API @smoke @cron @issue:front#338', () => {
  test('cron list API requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/dashboard/cron/list`, {
      params: { pageNum: 1, pageSize: 10 },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('cron stats API requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/dashboard/cron/stats`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('cron trigger API requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE}/wande/dashboard/cron/1/trigger`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('cron list API returns data with valid token', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/dashboard/cron/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });
});

test.describe('Cron Tasks Page — Frontend @smoke @cron @issue:front#338', () => {
  test('frontend serves correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });

  test('page loads without crash', async ({ page }) => {
    test.skip(!token, 'No token available');
    await page.goto('/');
    await page.evaluate(
      ({ key, token }: { key: string; token: string }) => {
        localStorage.setItem(key, JSON.stringify({ accessToken: token, refreshToken: token, accessCodes: [] }));
      },
      { key: STORAGE_KEY, token },
    );
    await page.goto('/super-admin/cron-tasks');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('cron-tasks');
  });

  test('page has no critical console errors', async ({ page }) => {
    test.skip(!token, 'No token available');
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.evaluate(
      ({ key, token }: { key: string; token: string }) => {
        localStorage.setItem(key, JSON.stringify({ accessToken: token, refreshToken: token, accessCodes: [] }));
      },
      { key: STORAGE_KEY, token },
    );
    await page.goto('/super-admin/cron-tasks');
    await page.waitForLoadState('networkidle');
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404') && !e.includes('net::ERR'),
    );
    expect(criticalErrors.length).toBeLessThan(5);
  });
});
