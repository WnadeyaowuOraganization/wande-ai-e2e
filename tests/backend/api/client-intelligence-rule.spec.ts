import { test, expect } from '@playwright/test';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:6040';
const USERNAME = process.env.API_USERNAME || 'admin';
const PASSWORD = process.env.API_PASSWORD || 'admin123';

let token: string;

test.beforeAll(async ({ request }) => {
  const loginResponse = await request.post(`${BASE_URL}/auth/login`, {
    data: { username: USERNAME, password: PASSWORD }
  });
  expect(loginResponse.status()).toBe(200);
  const loginData = await loginResponse.json();
  token = loginData.data.token;
});

test.describe('客户情报SOP规则 API 测试', { tag: ['@api', '@intelligence', '@sop-rules', '@issue:backend#637'] }, () => {
  test.describe('未认证访问测试', () => {
    test('规则列表未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/sop-rules/list`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('按模式查询未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/sop-rules/by-mode`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('规则详情未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/sop-rules/1`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('新增规则未认证应返回401', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/intelligence/sop-rules`, { data: {} });
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });
  });

  test.describe('SOP规则查询 API', () => {
    test('应能获取规则分页列表', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/sop-rules/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: 1, pageSize: 10 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
      expect(data.data).toBeDefined();
    });

    test('应能按销售模式查询规则', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/sop-rules/by-mode`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { salesMode: 'DIRECT' }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能获取规则详情', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/sop-rules/1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });

  test.describe('SOP规则管理 API', () => {
    test('应能新增SOP规则', async ({ request }) => {
      const payload = {
        ruleName: 'E2E测试规则-' + Date.now(),
        salesMode: 'DIRECT',
        category: '基本信息',
        required: true,
        sortOrder: 1,
        enabled: true
      };
      const response = await request.post(`${BASE_URL}/wande/intelligence/sop-rules`, {
        headers: { Authorization: `Bearer ${token}` },
        data: payload
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能更新SOP规则', async ({ request }) => {
      const response = await request.put(`${BASE_URL}/wande/intelligence/sop-rules`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          id: 1,
          ruleName: 'E2E更新规则',
          enabled: false
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能删除SOP规则', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/wande/intelligence/sop-rules/999999`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });
});
