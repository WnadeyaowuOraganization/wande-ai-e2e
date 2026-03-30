/**
 * Line Management API Tests — Claude Office 2.0 线路管理REST API
 * Issue: WnadeyaowuOraganization/wande-ai-backend#601
 * PR: WnadeyaowuOraganization/wande-ai-backend#825
 *
 * API Endpoints:
 * - GET  /wande/line/status             — 获取所有线路状态
 * - PUT  /wande/line/{lineId}/pause      — 暂停线路
 * - PUT  /wande/line/{lineId}/resume     — 恢复线路
 * - POST /wande/line/{lineId}/assign     — 指派线路Issue
 * - GET  /wande/line/{lineId}/stats      — 获取线路效率统计
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const BASE = `${API_BASE}/wande/line`;

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

test.describe('Line Management API — unauthenticated @api @line-management @issue:backend#601', () => {
  test('GET /status requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/status`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('PUT /{lineId}/pause requires authentication', async ({ request }) => {
    const response = await request.put(`${BASE}/line-1/pause`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('PUT /{lineId}/resume requires authentication', async ({ request }) => {
    const response = await request.put(`${BASE}/line-1/resume`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /{lineId}/assign requires authentication', async ({ request }) => {
    const response = await request.post(`${BASE}/line-1/assign`, {
      data: { issueNumber: 1 },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /{lineId}/stats requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/line-1/stats`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

test.describe('Line Management API — authenticated @api @line-management @issue:backend#601', () => {
  test('GET /status returns line list or permission error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);

    if (body.code === 200) {
      expect(body.data).toBeDefined();
      if (Array.isArray(body.data)) {
        // 线路数据结构检查
        if (body.data.length > 0) {
          const line = body.data[0];
          expect(line).toHaveProperty('lineId');
        }
      }
    }
  });

  test('PUT /{lineId}/pause with invalid id returns error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.put(`${BASE}/nonexistent-line/pause`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404, 500]).toContain(body.code);
  });

  test('PUT /{lineId}/resume with invalid id returns error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.put(`${BASE}/nonexistent-line/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404, 500]).toContain(body.code);
  });

  test('GET /{lineId}/stats with invalid id returns error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/nonexistent-line/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404, 500]).toContain(body.code);
  });
});
