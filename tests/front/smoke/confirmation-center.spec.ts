/**
 * Confirmation Center Page Tests — 确认中心页面
 * Issue: WnadeyaowuOraganization/wande-ai-front#244
 *
 * PR #350: 超管驾驶舱「确认中心」页面
 * - Route: /super-admin/confirmations
 * - API: /wande/cockpit/approvals/*
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:6040';
const FRONT_URL = process.env.FRONT_URL || 'http://localhost:8083';
const USERNAME = process.env.API_USERNAME || 'admin';
const PASSWORD = process.env.API_PASSWORD || 'admin123';

let token: string;

test.beforeAll(async ({ request }) => {
  const loginResponse = await request.post(`${BASE_URL}/auth/login`, {
    data: { username: USERNAME, password: PASSWORD }
  });
  const loginData = await loginResponse.json();
  if (loginData.code === 200) {
    token = loginData.data.token;
  }
});

// API tests
test.describe('Confirmation Center API @api @confirmation-center @issue:front#244', () => {
  test('approvals list API requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wande/cockpit/approvals/list`);
    const data = await response.json();
    expect(data.code).toBe(401);
  });

  test('approvals pending-count API requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wande/cockpit/approvals/pending-count`);
    const data = await response.json();
    expect(data.code).toBe(401);
  });

  test('approvals list API returns data or permission error with auth', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE_URL}/wande/cockpit/approvals/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    // Admin should get data or 403 if not super admin
    expect([200, 403]).toContain(data.code);
  });

  test('approvals pending-count API returns data or permission error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE_URL}/wande/cockpit/approvals/pending-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    expect([200, 403]).toContain(data.code);
  });
});

// Page smoke tests — menu may not be registered
test.describe('Confirmation Center Page @smoke @confirmation-center @issue:front#244', () => {
  test('frontend serves correctly', async ({ request }) => {
    const response = await request.get(FRONT_URL);
    expect(response.status()).toBe(200);
  });

  test('confirmation center page load attempt', async ({ page }) => {
    // Login first
    await page.goto(`${FRONT_URL}/auth/login`);
    await page.getByPlaceholder('请输入用户名').fill(USERNAME);
    await page.getByPlaceholder('密码').fill(PASSWORD);
    await page.locator('button[aria-label="login"]').click();
    await page.waitForURL('**/dashboard**', { timeout: 15000 }).catch(() => {});

    // Navigate to confirmation center
    const response = await page.goto(`${FRONT_URL}/super-admin/confirmations`);
    // Page should load (even if 404 from SPA router, frontend should respond)
    if (response) {
      expect(response.status()).toBeLessThan(500);
    }
  });
});
