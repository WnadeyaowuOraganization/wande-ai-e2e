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

test.describe('D3模具库数据化 API 测试', { tag: ['@api', '@d3', '@mold-library', '@issue:backend#623'] }, () => {
  test.describe('未认证访问测试', () => {
    test('模具库列表未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/d3/molds`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('模具库详情未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/d3/molds/1`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });
  });

  test.describe('模具库查询 API', () => {
    test('应能获取模具库分页列表', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/d3/molds`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: 1, pageSize: 10 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
      expect(data.data).toBeDefined();
    });

    test('应支持按关键字搜索模具库', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/d3/molds`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { keyword: 'MOLD', pageNum: 1, pageSize: 10 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });

    test('应支持按品类编码过滤', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/d3/molds`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { categoryCode: 'MOLD_001', pageNum: 1, pageSize: 10 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });

    test('应能按模具编号查询', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/d3/molds/by-mold-no/MOLD_TEST_001`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });

    test('应能按市场筛选模具库', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/d3/molds/by-market/CN`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: 1, pageSize: 10 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });
  });

  test.describe('模具库管理 API', () => {
    test('应能新增模具库记录', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/d3/molds`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          moldNo: 'MOLD_E2E_001',
          moldName: 'E2E测试模具',
          categoryCode: 'MOLD_001',
          platformHeight: 100,
          direction: 'UP',
          market: 'CN'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能更新模具库记录', async ({ request }) => {
      const response = await request.put(`${BASE_URL}/api/d3/molds/1`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          id: 1,
          moldNo: 'MOLD_E2E_UPDATED',
          moldName: 'E2E更新测试模具',
          categoryCode: 'MOLD_001'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能删除模具库记录', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/api/d3/molds/999999`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });
});
