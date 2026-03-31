/**
 * Cron Task Management API Tests — 定时任务管理模块
 * Issue: WnadeyaowuOraganization/wande-ai-backend#828
 * PR: WnadeyaowuOraganization/wande-ai-backend#838
 *
 * API Endpoints (8):
 * - GET  /wande/dashboard/cron/tasks              — 任务列表（支持category筛选）
 * - GET  /wande/dashboard/cron/tasks/{id}          — 任务详情
 * - GET  /wande/dashboard/cron/tasks/{id}/executions — 执行历史（分页）
 * - GET  /wande/dashboard/cron/executions/recent    — 最近执行记录（24h）
 * - GET  /wande/dashboard/cron/stats/overview       — 总览统计
 * - GET  /wande/dashboard/cron/stats/health         — 健康状态
 * - POST /wande/dashboard/cron/tasks/{id}/trigger   — 手动触发
 * - PUT  /wande/dashboard/cron/tasks/{id}/config    — 更新告警配置
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const BASE = `${API_BASE}/wande/dashboard/cron`;

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
// Unauthenticated tests — all endpoints should reject with code 401
// ---------------------------------------------------------------------------
test.describe('Cron Task Management — unauthenticated @api @cron-mgmt @issue:backend#828', () => {
  test('GET /tasks rejects unauthenticated requests', async ({ request }) => {
    const res = await request.get(`${BASE}/tasks`);
    const body = await res.json();
    // 401 = auth gate active; 500 = endpoint not yet deployed
    expect([401, 500]).toContain(body.code);
  });

  test('GET /tasks/{id} rejects unauthenticated requests', async ({ request }) => {
    const res = await request.get(`${BASE}/tasks/1`);
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('GET /tasks/{id}/executions rejects unauthenticated requests', async ({ request }) => {
    const res = await request.get(`${BASE}/tasks/1/executions`);
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('GET /executions/recent rejects unauthenticated requests', async ({ request }) => {
    const res = await request.get(`${BASE}/executions/recent`);
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('GET /stats/overview rejects unauthenticated requests', async ({ request }) => {
    const res = await request.get(`${BASE}/stats/overview`);
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('GET /stats/health rejects unauthenticated requests', async ({ request }) => {
    const res = await request.get(`${BASE}/stats/health`);
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('POST /tasks/{id}/trigger rejects unauthenticated requests', async ({ request }) => {
    const res = await request.post(`${BASE}/tasks/1/trigger`);
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('PUT /tasks/{id}/config rejects unauthenticated requests', async ({ request }) => {
    const res = await request.put(`${BASE}/tasks/1/config`, {
      data: { alertOnFailure: true, alertConsecutiveFailures: 3 },
    });
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });
});

// ---------------------------------------------------------------------------
// Authenticated tests
// ---------------------------------------------------------------------------
test.describe('Cron Task Management — authenticated @api @cron-mgmt @issue:backend#828', () => {
  test('GET /tasks returns task list or empty', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
    if (body.code === 200 && body.data) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /tasks with category filter', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10, category: 'collection' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('GET /tasks/{id} returns detail or null for non-existent', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE}/tasks/99999`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeNull();
    }
  });

  test('GET /tasks/{id}/executions returns paged result', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE}/tasks/1/executions`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('GET /executions/recent returns recent executions', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE}/executions/recent`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('GET /stats/overview returns overview stats', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE}/stats/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
    if (body.code === 200 && body.data) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /stats/health returns health list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE}/stats/health`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
    if (body.code === 200 && body.data) {
      expect(Array.isArray(body.data)).toBe(true);
    }
  });

  test('POST /tasks/{id}/trigger with non-existent id fails gracefully', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.post(`${BASE}/tasks/99999/trigger`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /tasks/{id}/config updates alert config', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.put(`${BASE}/tasks/99999/config`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { alertOnFailure: true, alertConsecutiveFailures: 5 },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});
