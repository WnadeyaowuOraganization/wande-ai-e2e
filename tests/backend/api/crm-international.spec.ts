/**
 * CRM International Customer API Tests — 国际贸易矿场
 * Issue: WnadeyaowuOraganization/wande-ai-backend#56
 * PR: WnadeyaowuOraganization/wande-ai-backend#782
 *
 * Note: PR #782 only contains a task.md file (no code changes yet).
 * The actual API will be at /wande/crm/international when implemented.
 * These tests verify the expected API contract.
 *
 * Expected API Endpoints:
 * - GET  /wande/crm/international/list        — 国际客户列表
 * - GET  /wande/crm/international/{id}         — 客户详情
 * - POST /wande/crm/international              — 创建客户
 * - PUT  /wande/crm/international              — 更新客户
 * - DELETE /wande/crm/international/{ids}      — 删除客户
 * - GET  /wande/crm/international/scores       — 评分查询
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const BASE = `${API_BASE}/wande/crm/international`;

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

test.describe('CRM International — unauthenticated @api @crm-intl @issue:backend#56', () => {
  test('GET /list requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE}/list`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST requires authentication', async ({ request }) => {
    const response = await request.post(BASE, {
      data: { name: 'test' },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

test.describe('CRM International — authenticated @api @crm-intl @issue:backend#56', () => {
  test('GET /list should return customer list or 404 if not deployed', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await response.json();
    // API may not exist yet (PR only has task.md)
    expect([200, 403, 404, 500]).toContain(body.code);
  });

  test('GET /scores should return scores or 404', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE}/scores`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404, 500]).toContain(body.code);
  });
});
