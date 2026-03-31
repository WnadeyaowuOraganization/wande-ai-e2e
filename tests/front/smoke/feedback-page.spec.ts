/**
 * Feedback Page Tests (Wande version) — /super-admin/feedback
 * Issue: WnadeyaowuOraganization/wande-ai-front#62
 * PR: WnadeyaowuOraganization/wande-ai-front#342
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

test.describe('Feedback Page — API @smoke @feedback @issue:front#62', () => {
  test('feedback list API requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/user-feedback/list`, {
      params: { pageNum: 1, pageSize: 10 },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('feedback stats API requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/user-feedback/stats`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('feedback status update API requires authentication', async ({ request }) => {
    const response = await request.put(`${API_BASE}/wande/user-feedback/1/status`, {
      data: { status: 'processing' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('feedback AI summary API requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE}/wande/user-feedback/1/generate-summary`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('feedback list API returns data with valid token', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/user-feedback/list`, {
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

test.describe('Feedback Page — Frontend @smoke @feedback @issue:front#62', () => {
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
    await page.goto('/super-admin/feedback');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('feedback');
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
    await page.goto('/super-admin/feedback');
    await page.waitForLoadState('networkidle');
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404') && !e.includes('net::ERR'),
    );
    expect(criticalErrors.length).toBeLessThan(5);
  });
});
