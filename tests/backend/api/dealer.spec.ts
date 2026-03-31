/**
 * Dealer API Tests — 经销商工作台
 * Issue: WnadeyaowuOraganization/wande-ai-backend#309 (Phase 3 模块间数据打通)
 *
 * Phase 3 APIs:
 * - POST /wande/dealer/candidate/import-from-tender/{tenderId} — 招标导入代理商
 * - POST /wande/dealer/candidate/{id}/sync-to-crm             — 同步到CRM
 * - GET  /wande/dealer/candidate/{id}/related-project          — 关联项目矿场
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:6040';
const USERNAME = process.env.API_USERNAME || 'admin';
const PASSWORD = process.env.API_PASSWORD || 'admin123';

let token: string;

test.beforeAll(async ({ request }) => {
  const loginResponse = await request.post(`${BASE_URL}/auth/login`, {
    data: { username: USERNAME, password: PASSWORD }
  });
  const loginData = await loginResponse.json();
  if (loginData.code === 200) {
    token = loginData.data.token;
  }
});

// 未认证访问测试
test.describe('未认证访问测试 @api @dealer @issue:backend#309', () => {
  test('候选列表应返回 401 未授权', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wande/dealer/candidate/list`);
    const data = await response.json();
    expect(data.code).toBe(401);
  });

  test('Phase3: import-from-tender 应返回 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/wande/dealer/candidate/import-from-tender/1`);
    const data = await response.json();
    expect(data.code).toBe(401);
  });

  test('Phase3: sync-to-crm 应返回 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/wande/dealer/candidate/1/sync-to-crm`);
    const data = await response.json();
    expect(data.code).toBe(401);
  });

  test('Phase3: related-project 应返回 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wande/dealer/candidate/1/related-project`);
    const data = await response.json();
    expect(data.code).toBe(401);
  });
});

// 已认证访问测试
test.describe('经销商 API 测试 @api @dealer @issue:backend#309', () => {
  test('应能访问经销商候选人列表', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE_URL}/wande/dealer/candidate/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能访问经销商候选人详情', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listResponse = await request.get(`${BASE_URL}/wande/dealer/candidate/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResponse.json();

    if (listData.data && listData.data.rows && listData.data.rows.length > 0) {
      const id = listData.data.rows[0].id;
      const response = await request.get(`${BASE_URL}/wande/dealer/candidate/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      expect(data.code).toBe(200);
      expect(data.data).toBeDefined();
    } else {
      test.skip();
    }
  });

  test('应能访问中标记录列表', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE_URL}/wande/dealer/bid/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能访问跟进记录列表', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${BASE_URL}/wande/dealer/followup/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });
});

// Phase 3: 模块间数据打通
test.describe('Dealer Phase3 — 模块间数据打通 @api @dealer @issue:backend#309', () => {
  test('POST /import-from-tender/{tenderId} handles non-existent tender gracefully', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.post(`${BASE_URL}/wande/dealer/candidate/import-from-tender/99999`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect([200, 500]).toContain(body.code);
    // non-existent tender should return error or null
    if (body.code === 200) {
      expect(body.data).toBeNull();
    }
  });

  test('POST /sync-to-crm/{id} handles non-existent dealer gracefully', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.post(`${BASE_URL}/wande/dealer/candidate/99999/sync-to-crm`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect([200, 500]).toContain(body.code);
  });

  test('GET /related-project/{id} returns null for non-existent dealer', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE_URL}/wande/dealer/candidate/99999/related-project`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect([200, 500]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeNull();
    }
  });
});
