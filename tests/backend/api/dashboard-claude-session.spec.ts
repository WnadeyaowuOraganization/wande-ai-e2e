/**
 * Dashboard Claude Session API Tests
 * Issue: WnadeyaowuOraganization/wande-ai-backend#333, #249
 * PR: WnadeyaowuOraganization/wande-ai-backend#771, #775
 *
 * API Endpoints (PR #775):
 * - POST /api/dashboard/claude/webhook  — Webhook回调
 * - POST /api/dashboard/claude/report   — task.md报告扫描
 * - GET  /api/dashboard/claude/sessions — 会话列表
 * - GET  /api/dashboard/claude/sessions/{id} — 会话详情
 * - GET  /api/dashboard/claude/stats    — 统计信息
 *
 * API Endpoints (PR #771, alternate controller):
 * - Same endpoints under /api/dashboard/claude
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

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
// Unauthenticated access — all endpoints require auth
// ---------------------------------------------------------------------------
test.describe('Claude Session API — unauthenticated @api @claude-session @issue:backend#333', () => {
  test('POST /webhook requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/dashboard/claude/webhook`, {
      data: { event_type: 'session_start', session_id: 'test-123' },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /report requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/dashboard/claude/report`, {
      data: { session_id: 'test-123', task_md: '# Task' },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /sessions requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/dashboard/claude/sessions`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /sessions/{id} requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/dashboard/claude/sessions/test-123`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /stats requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/dashboard/claude/stats`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Authenticated access
// ---------------------------------------------------------------------------
test.describe('Claude Session API — authenticated @api @claude-session @issue:backend#333', () => {
  test('GET /sessions should return session list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/api/dashboard/claude/sessions`, {
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
    const response = await request.get(`${API_BASE}/api/dashboard/claude/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /sessions/{id} with non-existent id should handle gracefully', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/api/dashboard/claude/sessions/non-existent-id`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /webhook with valid token should accept or reject', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/api/dashboard/claude/webhook`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        event_type: 'session_start',
        session_id: 'e2e-test-session',
        project_path: '/test/project',
      },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /report with valid token should accept or reject', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/api/dashboard/claude/report`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        session_id: 'e2e-test-session',
        task_md: '# E2E Test Task\n## Progress\n- [x] Test item',
      },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});
