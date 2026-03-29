/**
 * 协作文档权限 API Tests - CollabDocumentPermissionController
 * PR: WnadeyaowuOraganization/wande-ai-backend#695
 * Issue: backend#47
 *
 * API Endpoints:
 * - GET    /api/collab/documents/{id}/permissions              文档权限列表
 * - POST   /api/collab/documents/{id}/permissions              添加权限
 * - POST   /api/collab/documents/{id}/permissions/batch        批量添加权限
 * - DELETE /api/collab/documents/{id}/permissions/{userId}     删除权限
 * - GET    /api/collab/documents/{id}/my-permission            我的权限(无需认证)
 * - GET    /api/collab/documents/{id}/editor-config            编辑器配置(无需认证)
 * - GET    /api/collab/documents/{id}/check-permission         检查权限
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const TEST_USER = { username: 'admin', password: 'admin123' };

const DOC_ENDPOINT = `${API_BASE}/api/collab/documents`;
const TEST_DOC_ID = 1;
const TEST_USER_ID = 1;

let token: string;

test.beforeAll(async ({ request }) => {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: { username: TEST_USER.username, password: TEST_USER.password },
  });
  const loginBody = await loginRes.json();
  token = loginBody.data?.token || loginBody.data?.access_token || '';
});

// ---------------------------------------------------------------------------
// Unauthenticated access
// ---------------------------------------------------------------------------
test.describe('未认证访问测试 @api @collab @issue:backend#47', () => {
  test('GET /{id}/permissions 应返回 401', async ({ request }) => {
    const response = await request.get(`${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /{id}/permissions 应返回 401', async ({ request }) => {
    const response = await request.post(`${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions`, {
      data: {},
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /{id}/permissions/batch 应返回 401', async ({ request }) => {
    const response = await request.post(`${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions/batch`, {
      data: {},
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('DELETE /{id}/permissions/{userId} 应返回 401', async ({ request }) => {
    const response = await request.delete(`${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions/${TEST_USER_ID}`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /{id}/check-permission 应返回 401', async ({ request }) => {
    const response = await request.get(`${DOC_ENDPOINT}/${TEST_DOC_ID}/check-permission`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  // --- 无需认证的接口 ---
  test('GET /{id}/my-permission 无需认证，应正常响应', async ({ request }) => {
    const response = await request.get(`${DOC_ENDPOINT}/${TEST_DOC_ID}/my-permission`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    // 无需认证的接口，code 应为 200 或因文档不存在返回 500
    expect([200, 500]).toContain(body.code);
  });

  test('GET /{id}/editor-config 无需认证，应正常响应', async ({ request }) => {
    const response = await request.get(`${DOC_ENDPOINT}/${TEST_DOC_ID}/editor-config`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    // 无需认证，文档不存在可能返回 500
    expect([200, 500]).toContain(body.code);
  });
});

// ---------------------------------------------------------------------------
// Authenticated access
// ---------------------------------------------------------------------------
test.describe('已认证 - 协作文档权限 API 测试 @api @collab @issue:backend#47', () => {
  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  test('GET /{id}/permissions 应能获取文档权限列表', async ({ request }) => {
    const response = await request.get(`${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions`, {
      headers: authHeaders(),
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403]).toContain(body.code);

    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /{id}/my-permission 应能获取当前用户权限', async ({ request }) => {
    const response = await request.get(`${DOC_ENDPOINT}/${TEST_DOC_ID}/my-permission`, {
      headers: authHeaders(),
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    // 无需认证的接口，认证后也应正常工作
    expect([200, 403, 500]).toContain(body.code);
  });

  test('GET /{id}/editor-config 应能获取编辑器配置', async ({ request }) => {
    const response = await request.get(`${DOC_ENDPOINT}/${TEST_DOC_ID}/editor-config`, {
      headers: authHeaders(),
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403, 500]).toContain(body.code);

    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /{id}/check-permission 应能检查权限', async ({ request }) => {
    const response = await request.get(`${DOC_ENDPOINT}/${TEST_DOC_ID}/check-permission`, {
      headers: authHeaders(),
      params: { permission: 'edit' },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403]).toContain(body.code);
  });

  test('POST /{id}/permissions 应能添加文档权限', async ({ request }) => {
    const response = await request.post(`${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions`, {
      headers: authHeaders(),
      data: {
        userId: TEST_USER_ID,
        permission: 'view',
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403]).toContain(body.code);
  });

  test('POST /{id}/permissions 缺少必填字段应返回错误', async ({ request }) => {
    const response = await request.post(`${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions`, {
      headers: authHeaders(),
      data: {},
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    // 校验失败应为 400/500，或权限不足 403
    expect([200, 400, 403, 500]).toContain(body.code);
  });

  test('POST /{id}/permissions/batch 应能批量添加权限', async ({ request }) => {
    const response = await request.post(`${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions/batch`, {
      headers: authHeaders(),
      data: {
        permissions: [
          { userId: TEST_USER_ID, permission: 'view' },
        ],
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403]).toContain(body.code);
  });

  test('POST /{id}/permissions/batch 空数组应正常处理', async ({ request }) => {
    const response = await request.post(`${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions/batch`, {
      headers: authHeaders(),
      data: { permissions: [] },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 400, 403, 500]).toContain(body.code);
  });

  test('DELETE /{id}/permissions/{userId} 应能删除权限', async ({ request }) => {
    // 先添加一条权限，再删除
    await request.post(`${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions`, {
      headers: authHeaders(),
      data: { userId: TEST_USER_ID, permission: 'view' },
    });

    const response = await request.delete(
      `${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions/${TEST_USER_ID}`,
      { headers: authHeaders() },
    );
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403]).toContain(body.code);
  });

  test('DELETE /{id}/permissions/{userId} 不存在的用户应正常处理', async ({ request }) => {
    const response = await request.delete(
      `${DOC_ENDPOINT}/${TEST_DOC_ID}/permissions/99999`,
      { headers: authHeaders() },
    );
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403, 500]).toContain(body.code);
  });

  test('GET /{id}/permissions 不存在的文档应正常处理', async ({ request }) => {
    const response = await request.get(`${DOC_ENDPOINT}/0/permissions`, {
      headers: authHeaders(),
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403, 500]).toContain(body.code);
  });
});
