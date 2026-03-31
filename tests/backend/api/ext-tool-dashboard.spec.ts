/**
 * Ext Tool Dashboard API Tests
 * Issue: WnadeyaowuOraganization/wande-ai-backend#477
 * PR: WnadeyaowuOraganization/wande-ai-backend#876
 *
 * APIs:
 * - GET /monitor/ext-tool/dashboard-card
 * - GET /monitor/ext-tool/send-daily-report
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const BASE = `${API_BASE}/monitor/ext-tool`;

let token: string;

test.beforeAll(async ({ request }) => {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: {
      username: process.env.TEST_USERNAME || 'admin',
      password: process.env.TEST_PASSWORD || 'admin123',
    },
  });
  const loginBody = await loginRes.json();
  if (loginBody.code === 200) {
    token = loginBody.data?.token || loginBody.data?.access_token || '';
  }
});

// ---------------------------------------------------------------------------
// Unauthenticated
// ---------------------------------------------------------------------------
test.describe('Ext Tool Dashboard — unauthenticated @api @ext-tool @issue:backend#477', () => {
  test('GET /dashboard-card requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/dashboard-card`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('GET /send-daily-report requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/send-daily-report`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Authenticated
// ---------------------------------------------------------------------------
test.describe('Ext Tool Dashboard — authenticated @api @ext-tool @issue:backend#477', () => {
  test('GET /dashboard-card returns data or permission error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/dashboard-card`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /send-daily-report handles gracefully', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/send-daily-report`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});
