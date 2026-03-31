/**
 * Module Health Audit Engine API Tests — 模块真实可用性审计引擎
 * Issue: WnadeyaowuOraganization/wande-ai-backend#829
 * PR: WnadeyaowuOraganization/wande-ai-backend#837
 *
 * API Endpoints:
 * - GET /wande/dashboard/module-health/list — 模块健康矩阵
 * - GET /wande/dashboard/module-health/registry — 模块注册表
 * - GET /wande/dashboard/module-health/{id} — 模块健康详情
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const BASE = `${API_BASE}/wande/dashboard/module-health`;

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

test.describe('Module Health — unauthenticated @api @module-health @issue:backend#829', () => {
  test('GET /list requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/list`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /registry requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/registry`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /{id} requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/1`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

test.describe('Module Health — authenticated @api @module-health @issue:backend#829', () => {
  test('GET /list returns health matrix data', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /registry returns module list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/registry`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /{id} returns detail or graceful error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });
});
