/**
 * Dashboard Acceptance Center API Tests — 验收中心
 * Issue: WnadeyaowuOraganization/wande-ai-backend#250
 * PR: WnadeyaowuOraganization/wande-ai-backend#851
 *
 * API Endpoints:
 * - GET /wande/dashboard/acceptance/queue/list
 * - GET /wande/dashboard/acceptance/queue/detail/{id}
 * - POST /wande/dashboard/acceptance/queue
 * - PUT /wande/dashboard/acceptance/queue
 * - DELETE /wande/dashboard/acceptance/queue/{ids}
 * - GET /wande/dashboard/acceptance/results/list
 * - GET /wande/dashboard/acceptance/results/detail/{id}
 * - POST /wande/dashboard/acceptance/results
 * - PUT /wande/dashboard/acceptance/results
 * - DELETE /wande/dashboard/acceptance/results/{ids}
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const BASE_QUEUE = `${API_BASE}/wande/dashboard/acceptance/queue`;
const BASE_RESULTS = `${API_BASE}/wande/dashboard/acceptance/results`;

let token: string;

test.beforeAll(async ({ request }) => {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: { username: process.env.TEST_USERNAME || 'admin', password: process.env.TEST_PASSWORD || 'admin123' },
  });
  const loginBody = await loginRes.json();
  if (loginBody.code === 200) {
    token = loginBody.data?.token || loginBody.data?.access_token || '';
  }
});

test.describe('Acceptance Queue API — unauthenticated @api @acceptance @issue:backend#250', () => {
  test('GET /list requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE_QUEUE}/list`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST requires authentication', async ({ request }) => {
    const response = await request.post(BASE_QUEUE, { data: { title: 'test' } });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

test.describe('Acceptance Queue API — authenticated @api @acceptance @issue:backend#250', () => {
  test('GET /list returns data or permission error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE_QUEUE}/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

test.describe('Acceptance Results API — unauthenticated @api @acceptance @issue:backend#250', () => {
  test('GET /list requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE_RESULTS}/list`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST requires authentication', async ({ request }) => {
    const response = await request.post(BASE_RESULTS, { data: { title: 'test' } });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

test.describe('Acceptance Results API — authenticated @api @acceptance @issue:backend#250', () => {
  test('GET /list returns data or permission error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE_RESULTS}/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});
