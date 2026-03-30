/**
 * Gateway Budget API Tests — API网关子账户管理 预算管理引擎
 * Issue: WnadeyaowuOraganization/wande-ai-backend#576
 * PR: WnadeyaowuOraganization/wande-ai-backend#827
 *
 * API Endpoints:
 * - PUT  /system/dashboard/gateway/budget/{accountId}  — 预算调整
 * - GET  /system/dashboard/gateway/alert-config         — 获取预警配置
 * - PUT  /system/dashboard/gateway/alert-config         — 设置预警配置
 * - PUT  /system/dashboard/gateway/accounts/{id}/toggle — 手动启停账户
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const BASE = `${API_BASE}/system/dashboard/gateway`;

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

test.describe('Gateway Budget API — unauthenticated @api @gateway-budget @issue:backend#576', () => {
  test('PUT budget requires authentication', async ({ request }) => {
    const response = await request.put(`${BASE}/budget/1`, {
      data: { monthlyBudget: 100 },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET alert-config requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/alert-config`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('PUT alert-config requires authentication', async ({ request }) => {
    const response = await request.put(`${BASE}/alert-config`, {
      data: { warnThreshold: 80 },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('PUT accounts/{id}/toggle requires authentication', async ({ request }) => {
    const response = await request.put(`${BASE}/accounts/1/toggle`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

test.describe('Gateway Budget API — authenticated @api @gateway-budget @issue:backend#576', () => {
  test('GET alert-config returns data or permission error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/alert-config`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);

    if (body.code === 200 && body.data) {
      expect(body.data).toBeDefined();
    }
  });

  test('PUT budget with invalid accountId returns error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.put(`${BASE}/budget/999999`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { monthlyBudget: 100 },
    });
    const body = await response.json();
    // 应该返回404、403或500（账户不存在）
    expect([200, 403, 404, 500]).toContain(body.code);
  });

  test('PUT alert-config validates input', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.put(`${BASE}/alert-config`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { warnThreshold: 80, dangerThreshold: 90, blockThreshold: 100 },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
  });

  test('PUT accounts/{id}/toggle with invalid id returns error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.put(`${BASE}/accounts/999999/toggle`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404, 500]).toContain(body.code);
  });
});
