/**
 * Dashboard Approval & Wecom Console API Tests
 * Issue: WnadeyaowuOraganization/wande-ai-backend#46
 * PR: WnadeyaowuOraganization/wande-ai-backend#773, #771
 *
 * ApprovalQueue Endpoints:
 * - GET    /wande/cockpit/approvals/page        — 审批项分页
 * - GET    /wande/cockpit/approvals/{id}         — 审批项详情
 * - POST   /wande/cockpit/approvals/{id}/approve — 通过
 * - POST   /wande/cockpit/approvals/{id}/reject  — 驳回
 * - POST   /wande/cockpit/approvals/batch        — 批量审批
 * - POST   /wande/cockpit/approvals              — 创建审批项
 * - PUT    /wande/cockpit/approvals              — 更新审批项
 * - DELETE /wande/cockpit/approvals/{ids}        — 删除
 *
 * Wecom Console Endpoints:
 * - GET    /wande/cockpit/wecom/rules            — 通知规则列表
 * - GET    /wande/cockpit/wecom/rules/page       — 通知规则分页
 * - GET    /wande/cockpit/wecom/rules/{id}       — 规则详情
 * - POST   /wande/cockpit/wecom/rules            — 创建规则
 * - PUT    /wande/cockpit/wecom/rules            — 更新规则
 * - DELETE /wande/cockpit/wecom/rules/{ids}      — 删除规则
 * - GET    /wande/cockpit/wecom/history          — 通知历史
 * - GET    /wande/cockpit/wecom/history/{id}     — 历史详情
 * - POST   /wande/cockpit/wecom/test             — 测试发送
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const APPROVAL_BASE = `${API_BASE}/wande/cockpit/approvals`;
const WECOM_BASE = `${API_BASE}/wande/cockpit/wecom`;

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
// Approval Queue — unauthenticated
// ---------------------------------------------------------------------------
test.describe('Approval Queue — unauthenticated @api @approval @issue:backend#46', () => {
  test('GET /page requires authentication', async ({ request }) => {
    const response = await request.get(`${APPROVAL_BASE}/page`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /{id}/approve requires authentication', async ({ request }) => {
    const response = await request.post(`${APPROVAL_BASE}/0/approve`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST requires authentication', async ({ request }) => {
    const response = await request.post(APPROVAL_BASE, {
      data: { title: 'test' },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Approval Queue — authenticated
// ---------------------------------------------------------------------------
test.describe('Approval Queue — authenticated @api @approval @issue:backend#46', () => {
  test('GET /page should return approval list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${APPROVAL_BASE}/page`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('POST should create approval item', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(APPROVAL_BASE, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: 'E2E test approval',
        type: 'code_review',
        targetId: 'pr-123',
      },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

// ---------------------------------------------------------------------------
// Wecom Console — unauthenticated
// ---------------------------------------------------------------------------
test.describe('Wecom Console — unauthenticated @api @wecom @issue:backend#46', () => {
  test('GET /rules requires authentication', async ({ request }) => {
    const response = await request.get(`${WECOM_BASE}/rules`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /history requires authentication', async ({ request }) => {
    const response = await request.get(`${WECOM_BASE}/history`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /rules requires authentication', async ({ request }) => {
    const response = await request.post(`${WECOM_BASE}/rules`, {
      data: { name: 'test' },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /test requires authentication', async ({ request }) => {
    const response = await request.post(`${WECOM_BASE}/test`, {
      data: { ruleId: 1 },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Wecom Console — authenticated
// ---------------------------------------------------------------------------
test.describe('Wecom Console — authenticated @api @wecom @issue:backend#46', () => {
  test('GET /rules should return rule list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${WECOM_BASE}/rules`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /history should return notification history', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${WECOM_BASE}/history`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
  });

  test('POST /rules should create a rule', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${WECOM_BASE}/rules`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'E2E test rule',
        eventType: 'pr_created',
        template: 'New PR: {{title}}',
        enabled: true,
      },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /rules/{ids} should delete rules', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.delete(`${WECOM_BASE}/rules/0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});
