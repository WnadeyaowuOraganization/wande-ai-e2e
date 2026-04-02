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

test.describe('开发效率统计 API 测试', { tag: ['@api', '@dashboard', '@efficiency', '@issue:backend#252'] }, () => {
  test.describe('未认证访问测试', () => {
    test('产出统计未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/output`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('质量统计未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/quality`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('趋势分析未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/trend`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('概览汇总未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/overview`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });
  });

  test.describe('产出统计 API', () => {
    test('应能获取产出统计（默认参数）', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/output`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
      expect(data.data).toBeDefined();
    });

    test('应支持按仓库筛选产出统计', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/output`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { repo: 'wande-ai-backend', period: 'week', range: 4 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });
  });

  test.describe('质量统计 API', () => {
    test('应能获取质量统计（默认参数）', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/quality`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
      expect(data.data).toBeDefined();
    });

    test('应支持多月范围质量统计', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/quality`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { period: 'month', range: 3 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });
  });

  test.describe('趋势分析 API', () => {
    test('应能获取趋势分析（默认参数）', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/trend`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
      expect(data.data).toBeDefined();
    });

    test('应支持自定义趋势范围', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/trend`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { period: 'week', range: 8 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });
  });

  test.describe('概览汇总 API', () => {
    test('应能获取概览汇总', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
      expect(data.data).toBeDefined();
    });

    test('应支持按仓库筛选概览', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dashboard/efficiency/overview`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { repo: 'wande-ai-backend' }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });
  });
});
