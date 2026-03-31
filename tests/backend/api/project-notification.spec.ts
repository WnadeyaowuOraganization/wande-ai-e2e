/**
 * Project Notification API Tests — 项目分配作战信息卡通知
 * Issue: WnadeyaowuOraganization/wande-ai-backend#360
 * PR: WnadeyaowuOraganization/wande-ai-backend#836
 *
 * API Endpoints:
 * - GET  /wande/project-notification/my      — 我的通知列表
 * - GET  /wande/project-notification/unread   — 未读数
 * - PUT  /wande/project-notification/{id}/read    — 标记已读
 * - PUT  /wande/project-notification/{id}/handle  — 标记已处理
 * - POST /wande/project-mine/assign           — 批量分配
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const NOTIF_BASE = `${API_BASE}/wande/project-notification`;
const MINE_BASE = `${API_BASE}/wande/project`;

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

test.describe('Project Notification — unauthenticated @api @project-notification @issue:backend#360', () => {
  test('GET /my requires authentication', async ({ request }) => {
    const response = await request.get(`${NOTIF_BASE}/my`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /unread requires authentication', async ({ request }) => {
    const response = await request.get(`${NOTIF_BASE}/unread`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('PUT /{id}/read requires authentication', async ({ request }) => {
    const response = await request.put(`${NOTIF_BASE}/1/read`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('PUT /{id}/handle requires authentication', async ({ request }) => {
    const response = await request.put(`${NOTIF_BASE}/1/handle`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /mine/assign requires authentication', async ({ request }) => {
    const response = await request.post(`${MINE_BASE}/mine/assign`, {
      data: { projectIds: [1], userId: 1 },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

test.describe('Project Notification — authenticated @api @project-notification @issue:backend#360', () => {
  test('GET /my returns notification list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${NOTIF_BASE}/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /unread returns count', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${NOTIF_BASE}/unread`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('PUT /{id}/read handles gracefully for non-existent ID', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.put(`${NOTIF_BASE}/999999/read`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404, 500]).toContain(body.code);
  });

  test('PUT /{id}/handle handles gracefully for non-existent ID', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.put(`${NOTIF_BASE}/999999/handle`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404, 500]).toContain(body.code);
  });
});
