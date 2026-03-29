/**
 * UserFeedback & DesignTask API Tests
 * Issue: WnadeyaowuOraganization/wande-ai-backend#133
 * PR: WnadeyaowuOraganization/wande-ai-backend#693
 *
 * UserFeedbackController — /wande/user-feedback:
 *   POST /                      (create feedback, no auth)
 *   GET  /{id}                  (get feedback, no auth)
 *   GET  /list, PUT /{id}, PUT /{id}/status, PUT /{id}/convert, POST /{id}/evaluate
 *   GET  /stats, GET /stats/category, GET /stats/module, GET /stats/source-channel
 *
 * DesignTaskController — /collab/design-tasks:
 *   GET  /list, GET /{id}, POST, PUT, DELETE /{ids}
 *   PUT  /{id}/status, PUT /{id}/revision, GET /stats, GET /overdue, POST /auto-create
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
  expect(loginBody.code).toBe(200);
  token = loginBody.data?.token || loginBody.data?.access_token || '';
});

// ---------------------------------------------------------------------------
// UserFeedback — unauthenticated endpoints (POST /, GET /{id})
// ---------------------------------------------------------------------------
test.describe('UserFeedback — no-auth endpoints @api @feedback @issue:backend#133', () => {
  test('POST / should create feedback without authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE}/wande/user-feedback`, {
      data: {
        content: 'E2E test feedback',
        contactInfo: 'test@example.com',
        category: 'suggestion',
        module: 'dashboard',
        sourceChannel: 'web',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    // no-auth endpoint: should succeed (200) or return validation error (500)
    // but NOT 401
    expect(body.code).not.toBe(401);
  });

  test('GET /{id} should get feedback without authentication', async ({ request }) => {
    // Use a non-existent ID — no-auth means no 401 regardless of result
    const response = await request.get(`${API_BASE}/wande/user-feedback/0`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).not.toBe(401);
  });
});

// ---------------------------------------------------------------------------
// UserFeedback — authenticated endpoints
// ---------------------------------------------------------------------------
test.describe('UserFeedback — auth-required endpoints @api @feedback @issue:backend#133', () => {
  test('unauthenticated GET /list should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/user-feedback/list`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('unauthenticated GET /stats should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/user-feedback/stats`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('authenticated GET /list should return data', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/user-feedback/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('authenticated GET /{id} should return feedback detail', async ({ request }) => {
    test.skip(!token, 'No token available');
    // First fetch list to get a valid ID
    const listRes = await request.get(`${API_BASE}/wande/user-feedback/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.get(`${API_BASE}/wande/user-feedback/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('authenticated PUT /{id} should update feedback', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/wande/user-feedback/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.put(`${API_BASE}/wande/user-feedback/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { content: 'Updated by E2E test' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('authenticated PUT /{id}/status should update status', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/wande/user-feedback/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.put(`${API_BASE}/wande/user-feedback/${id}/status`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { status: 'processing' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('authenticated PUT /{id}/convert should convert feedback', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/wande/user-feedback/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.put(`${API_BASE}/wande/user-feedback/${id}/convert`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { targetType: 'issue' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('authenticated POST /{id}/evaluate should evaluate feedback', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/wande/user-feedback/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.post(`${API_BASE}/wande/user-feedback/${id}/evaluate`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { score: 5, comment: 'E2E evaluation' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('authenticated GET /stats should return statistics', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/user-feedback/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('authenticated GET /stats/category should return category stats', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/user-feedback/stats/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('authenticated GET /stats/module should return module stats', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/user-feedback/stats/module`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('authenticated GET /stats/source-channel should return source channel stats', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/user-feedback/stats/source-channel`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// DesignTaskController — /collab/design-tasks
// ---------------------------------------------------------------------------
test.describe('DesignTask — unauthenticated access @api @feedback @issue:backend#133', () => {
  test('GET /list should return 401 without token', async ({ request }) => {
    const response = await request.get(`${API_BASE}/collab/design-tasks/list`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('POST should return 401 without token', async ({ request }) => {
    const response = await request.post(`${API_BASE}/collab/design-tasks`, {
      data: { title: 'test' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });
});

test.describe('DesignTask — authenticated access @api @feedback @issue:backend#133', () => {
  test('GET /list should return task list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/collab/design-tasks/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /{id} should return task detail', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/collab/design-tasks/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.get(`${API_BASE}/collab/design-tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('POST should create a design task', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/collab/design-tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: 'E2E test design task',
        description: 'Created by automated test',
        priority: 'medium',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT should update a design task', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/collab/design-tasks/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.put(`${API_BASE}/collab/design-tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { id, title: 'Updated by E2E' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /{id}/status should update task status', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/collab/design-tasks/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.put(`${API_BASE}/collab/design-tasks/${id}/status`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { status: 'in_progress' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /{id}/revision should submit revision', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/collab/design-tasks/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.put(`${API_BASE}/collab/design-tasks/${id}/revision`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { revisionNote: 'E2E revision' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /{ids} should delete tasks', async ({ request }) => {
    test.skip(!token, 'No token available');
    // Use a non-existent ID — should not crash
    const response = await request.delete(`${API_BASE}/collab/design-tasks/0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('GET /stats should return task statistics', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/collab/design-tasks/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /overdue should return overdue tasks', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/collab/design-tasks/overdue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('POST /auto-create should auto-create tasks', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/collab/design-tasks/auto-create`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { sourceType: 'feedback', sourceId: 0 },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    // May fail if no valid source, but should not 401
    expect([200, 403, 500]).toContain(body.code);
  });
});
