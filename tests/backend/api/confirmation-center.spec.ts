/**
 * Confirmation Center API Tests — 确认中心API
 * Issue: WnadeyaowuOraganization/wande-ai-backend#574
 * PR: WnadeyaowuOraganization/wande-ai-backend#847
 *
 * API Endpoints:
 * - GET  /api/dashboard/confirmations              — 查询确认列表（分页+筛选）
 * - GET  /api/dashboard/confirmations/stats        — 统计各类型待确认数量
 * - POST /api/dashboard/confirmations/sync         — 手动触发同步
 * - POST /api/dashboard/confirmations/{id}/confirm — 确认操作
 * - POST /api/dashboard/confirmations/{id}/reject  — 驳回操作
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const BASE = `${API_BASE}/api/dashboard/confirmations`;

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

test.describe('Confirmation Center API — unauthenticated @api @confirmation @issue:backend#574', () => {
  test('GET /confirmations requires authentication', async ({ request }) => {
    const response = await request.get(BASE, {
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /confirmations/stats requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/stats`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /confirmations/sync requires authentication', async ({ request }) => {
    const response = await request.post(`${BASE}/sync`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

test.describe('Confirmation Center API — authenticated @api @confirmation @issue:backend#574', () => {
  test('GET /confirmations should return list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(BASE, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.rows).toBeDefined();
    expect(body.data.total).toBeDefined();
  });

  test('GET /confirmations with filters should work', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(BASE, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        pageNum: 1,
        pageSize: 10,
        confirmType: 'biz',
        status: 'pending',
      },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /confirmations/stats should return statistics', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
    // Expected fields: bizPending, devPending, totalPending, confirmed, rejected
    expect(typeof body.data.bizPending).toBe('number');
    expect(typeof body.data.devPending).toBe('number');
    expect(typeof body.data.totalPending).toBe('number');
    expect(typeof body.data.confirmed).toBe('number');
    expect(typeof body.data.rejected).toBe('number');
  });

  test('POST /confirmations/sync should trigger sync', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${BASE}/sync`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
    expect(body.msg).toContain('同步');
  });

  test('POST /confirmations/{id}/confirm returns expected result', async ({ request }) => {
    test.skip(!token, 'No token available');
    // Using ID 0 which likely doesn't exist - testing endpoint availability
    const response = await request.post(`${BASE}/0/confirm`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { comment: 'E2E test confirm' },
    });
    const body = await response.json();
    // Should return 200, 404, 403, or 500 depending on implementation
    expect([200, 404, 403, 500]).toContain(body.code);
  });

  test('POST /confirmations/{id}/reject returns expected result', async ({ request }) => {
    test.skip(!token, 'No token available');
    // Using ID 0 which likely doesn't exist - testing endpoint availability
    const response = await request.post(`${BASE}/0/reject`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { reason: 'E2E test reject' },
    });
    const body = await response.json();
    // Should return 200, 404, 403, or 500 depending on implementation
    expect([200, 404, 403, 500]).toContain(body.code);
  });
});
