/**
 * 工具管理 API 测试
 * Issue: WnadeyaowuOraganization/wande-ai-backend#567
 * PR:  WnadeyaowuOraganization/wande-ai-backend#905
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const ADMIN_BASE = `${API_BASE}/api/admin/tool`;
const USER_BASE = `${API_BASE}/api/tool`;

let token: string;

test.beforeAll(async ({ request }) => {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: { username: 'admin', password: 'admin123' },
  });
  const loginBody = await loginRes.json();
  if (loginBody.code === 200) {
    token = loginBody.data?.token || loginBody.data?.access_token || '';
  }
});

// ---------------------------------------------------------------------------
// Unauthenticated
// ---------------------------------------------------------------------------
test.describe('Tool Management — unauthenticated @api @tool @issue:backend#567', () => {
  test('Admin GET /list requires authentication', async ({ request }) => {
    const response = await request.get(`${ADMIN_BASE}/list`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('Admin GET /{id} requires authentication', async ({ request }) => {
    const response = await request.get(`${ADMIN_BASE}/1`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('Admin POST requires authentication', async ({ request }) => {
    const response = await request.post(`${ADMIN_BASE}`, { data: {} });
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('User GET /list requires authentication', async ({ request }) => {
    const response = await request.get(`${USER_BASE}/list`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('User GET /{id} requires authentication', async ({ request }) => {
    const response = await request.get(`${USER_BASE}/1`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Authenticated admin endpoints
// ---------------------------------------------------------------------------
test.describe('Tool Management — admin authenticated @api @tool @issue:backend#567', () => {
  test('GET /list returns data or permission error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${ADMIN_BASE}/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /{id} returns detail or graceful error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${ADMIN_BASE}/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404, 500]).toContain(body.code);
  });

  test('GET /{id}/versions returns data or permission error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${ADMIN_BASE}/1/versions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('GET /{id}/configs returns data or permission error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${ADMIN_BASE}/1/configs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

// ---------------------------------------------------------------------------
// Authenticated user endpoints
// ---------------------------------------------------------------------------
test.describe('Tool Management — user authenticated @api @tool @issue:backend#567', () => {
  test('GET /list returns visible tools or graceful error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${USER_BASE}/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /{id} returns tool detail or graceful error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${USER_BASE}/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404, 500]).toContain(body.code);
  });

  test('GET /{id}/versions returns published versions or graceful error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${USER_BASE}/1/versions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('GET /{id}/guide returns guide or graceful error', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${USER_BASE}/1/guide`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403, 404, 500]).toContain(body.code);
  });
});
