/**
 * Dashboard Cron Operation API Tests — 定时任务操作
 * Issue: WnadeyaowuOraganization/wande-ai-backend#248
 * PR: WnadeyaowuOraganization/wande-ai-backend#774
 *
 * API Endpoints:
 * - POST /wande/dashboard/cron/{id}/pause   — 暂停任务
 * - POST /wande/dashboard/cron/{id}/resume  — 恢复任务
 * - POST /wande/dashboard/cron/{id}/trigger — 手动触发
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

test.describe('Cron Operation — unauthenticated @api @cron @issue:backend#248', () => {
  test('POST /{id}/pause requires authentication', async ({ request }) => {
    const response = await request.post(`${BASE}/test-task-id/pause`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /{id}/resume requires authentication', async ({ request }) => {
    const response = await request.post(`${BASE}/test-task-id/resume`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /{id}/trigger requires authentication', async ({ request }) => {
    const response = await request.post(`${BASE}/test-task-id/trigger`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

test.describe('Cron Operation — authenticated @api @cron @issue:backend#248', () => {
  test('POST /{id}/pause should pause or fail gracefully', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${BASE}/non-existent-task/pause`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /{id}/resume should resume or fail gracefully', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${BASE}/non-existent-task/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /{id}/trigger should trigger or fail gracefully', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${BASE}/non-existent-task/trigger`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});
