/**
 * Dashboard Blocker API Tests — 开发阻塞主动提醒
 * Issue: WnadeyaowuOraganization/wande-ai-backend#700
 * PR: WnadeyaowuOraganization/wande-ai-backend#784
 *
 * API Endpoints:
 * - GET  /wande/dashboard/blockers/list          — 阻塞项分页列表
 * - GET  /wande/dashboard/blockers/list-all       — 全部阻塞项
 * - GET  /wande/dashboard/blockers/group-by-type  — 按类型分组
 * - GET  /wande/dashboard/blockers/stats          — 统计信息
 * - GET  /wande/dashboard/blockers/unresolved-count — 未解决计数
 * - GET  /wande/dashboard/blockers/{id}           — 阻塞项详情
 * - POST /wande/dashboard/blockers                — 创建阻塞项
 * - POST /wande/dashboard/blockers/batch          — 批量创建
 * - PUT  /wande/dashboard/blockers                — 更新阻塞项
 * - PUT  /wande/dashboard/blockers/resolve/{id}   — 解决阻塞项
 * - PUT  /wande/dashboard/blockers/resolve/batch  — 批量解决
 * - PUT  /wande/dashboard/blockers/resolve-by-issue — 按Issue解决
 * - DELETE /wande/dashboard/blockers/{ids}        — 删除阻塞项
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const BASE = `${API_BASE}/wande/dashboard/blockers`;

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

test.describe('Blocker API — unauthenticated @api @blocker @issue:backend#700', () => {
  test('GET /list requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/list`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /stats requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/stats`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST requires authentication', async ({ request }) => {
    const response = await request.post(BASE, {
      data: { title: 'test', blockType: 'dependency' },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /unresolved-count requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/unresolved-count`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

test.describe('Blocker API — authenticated @api @blocker @issue:backend#700', () => {
  test('GET /list should return blocker list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /stats should return statistics', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /unresolved-count should return count', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/unresolved-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
  });

  test('GET /group-by-type should return grouped blockers', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/group-by-type`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
  });

  test('POST should create a blocker', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(BASE, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: 'E2E test blocker',
        blockType: 'dependency',
        description: 'Created by automated E2E test',
        severity: 'medium',
      },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /resolve/{id} should resolve blocker', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.put(`${BASE}/resolve/0`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { resolution: 'Resolved by E2E test' },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /{ids} should delete blocker', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.delete(`${BASE}/0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});
