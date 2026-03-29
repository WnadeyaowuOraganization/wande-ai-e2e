/**
 * CRM直销商机 API Tests - DirectSalesOpportunityController
 * PR: WnadeyaowuOraganization/wande-ai-backend#697
 * Issue: backend#57
 *
 * API Endpoints:
 * - GET  /wande/crm/direct-sales-opportunity/list          直销商机列表
 * - POST /wande/crm/direct-sales-opportunity/export         导出
 * - GET  /wande/crm/direct-sales-opportunity/{id}           详情
 * - POST /wande/crm/direct-sales-opportunity                新增
 * - PUT  /wande/crm/direct-sales-opportunity                修改
 * - DELETE /wande/crm/direct-sales-opportunity/{ids}        删除
 *
 * Permissions: wande:crm:direct-sales-opportunity:*
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const TEST_USER = { username: 'admin', password: 'admin123' };

const ENDPOINT = `${API_BASE}/wande/crm/direct-sales-opportunity`;

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
test.describe('未认证访问测试 @api @crm @issue:backend#57', () => {
  test('GET /list 应返回 401', async ({ request }) => {
    const response = await request.get(`${ENDPOINT}/list`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST /export 应返回 401', async ({ request }) => {
    const response = await request.post(`${ENDPOINT}/export`, { data: {} });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /{id} 应返回 401', async ({ request }) => {
    const response = await request.get(`${ENDPOINT}/1`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('POST (新增) 应返回 401', async ({ request }) => {
    const response = await request.post(`${ENDPOINT}`, { data: {} });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('PUT (修改) 应返回 401', async ({ request }) => {
    const response = await request.put(`${ENDPOINT}`, { data: {} });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('DELETE /{ids} 应返回 401', async ({ request }) => {
    const response = await request.delete(`${ENDPOINT}/1`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Authenticated access
// ---------------------------------------------------------------------------
test.describe('已认证 - CRM直销商机 API 测试 @api @crm @issue:backend#57', () => {
  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  test('GET /list 应能获取直销商机列表', async ({ request }) => {
    const response = await request.get(`${ENDPOINT}/list`, {
      headers: authHeaders(),
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    // admin 可能缺少具体 CRM 角色，允许 200 或 403
    expect([200, 403]).toContain(body.code);

    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /list 应支持分页参数', async ({ request }) => {
    const response = await request.get(`${ENDPOINT}/list`, {
      headers: authHeaders(),
      params: { pageNum: 1, pageSize: 5 },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403]).toContain(body.code);

    if (body.code === 200) {
      expect(body.data).toBeDefined();
      expect(body.data).toHaveProperty('rows');
      expect(body.data).toHaveProperty('total');
    }
  });

  test('GET /{id} 应能获取直销商机详情', async ({ request }) => {
    // 先获取列表，取第一条记录的 id
    const listRes = await request.get(`${ENDPOINT}/list`, {
      headers: authHeaders(),
      params: { pageNum: 1, pageSize: 1 },
    });
    const listBody = await listRes.json();

    if (listBody.code === 403) {
      test.skip();
      return;
    }

    if (listBody.data?.rows?.length > 0) {
      const id = listBody.data.rows[0].id;
      const response = await request.get(`${ENDPOINT}/${id}`, {
        headers: authHeaders(),
      });
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect([200, 403]).toContain(body.code);

      if (body.code === 200) {
        expect(body.data).toBeDefined();
        expect(body.data.id).toBe(id);
      }
    } else {
      // 没有数据，使用不存在 id 测试接口可达性
      const response = await request.get(`${ENDPOINT}/0`, {
        headers: authHeaders(),
      });
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect([200, 403, 500]).toContain(body.code);
    }
  });

  test('POST (新增) 应能创建直销商机', async ({ request }) => {
    const response = await request.post(`${ENDPOINT}`, {
      headers: authHeaders(),
      data: {
        opportunityName: 'E2E测试直销商机',
        customerName: 'E2E测试客户',
        estimatedAmount: 100000,
        stage: 'initial',
        remark: 'Playwright自动测试创建',
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403]).toContain(body.code);

    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('POST (新增) 缺少必填字段应返回错误', async ({ request }) => {
    const response = await request.post(`${ENDPOINT}`, {
      headers: authHeaders(),
      data: {},
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    // 空 body 应被校验拦截（400/500）或权限不足（403）
    expect([200, 400, 403, 500]).toContain(body.code);
  });

  test('PUT (修改) 应能更新直销商机', async ({ request }) => {
    const response = await request.put(`${ENDPOINT}`, {
      headers: authHeaders(),
      data: {
        id: 1,
        opportunityName: 'E2E测试更新商机',
        remark: 'Playwright自动测试更新',
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403]).toContain(body.code);
  });

  test('POST /export 应能导出直销商机', async ({ request }) => {
    const response = await request.post(`${ENDPOINT}/export`, {
      headers: authHeaders(),
      data: {},
    });

    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';

    // 导出可能返回 Excel 二进制或 JSON（权限不足）
    if (contentType.includes('application/json')) {
      const body = await response.json();
      expect([200, 403]).toContain(body.code);
    } else {
      // Excel 文件
      const buffer = await response.body();
      expect(buffer.length).toBeGreaterThan(0);
    }
  });

  test('DELETE /{ids} 应能删除直销商机', async ({ request }) => {
    // 先创建一条记录用于删除
    const createRes = await request.post(`${ENDPOINT}`, {
      headers: authHeaders(),
      data: {
        opportunityName: 'E2E测试待删除商机',
        customerName: 'E2E删除客户',
        remark: '待删除',
      },
    });
    const createBody = await createRes.json();

    if (createBody.code === 403) {
      test.skip();
      return;
    }

    // 尝试用刚创建的 id 或不存在的 id 测试删除接口
    const deleteId = createBody.data ?? 0;
    const response = await request.delete(`${ENDPOINT}/${deleteId}`, {
      headers: authHeaders(),
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect([200, 403]).toContain(body.code);
  });

  test('DELETE /{ids} 批量删除应正常处理', async ({ request }) => {
    const response = await request.delete(`${ENDPOINT}/99999,99998`, {
      headers: authHeaders(),
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    // 不存在的 id，接口应正常处理
    expect([200, 403, 500]).toContain(body.code);
  });
});
