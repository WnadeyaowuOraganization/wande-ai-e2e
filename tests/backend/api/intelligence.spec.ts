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

test.describe('信息质量API系统 测试', { tag: ['@api', '@intelligence', '@issue:backend#636', '@issue:backend#635'] }, () => {
  test.describe('未认证访问测试', () => {
    test('客户情报评分未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/clients/1/score`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('商机情报评分未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/opportunities/1/score`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('统计信息未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/stats`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('质量验证未认证应返回401', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/intelligence/verify`, { data: {} });
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('告警列表未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/alerts`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('规则列表未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/rules`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('验证历史未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/verify/history`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });
  });

  test.describe('情报评分 API', () => {
    test('应能获取客户情报评分', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/clients/1/score`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能获取商机情报评分', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/opportunities/1/score`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });

  test.describe('情报统计与告警 API', () => {
    test('应能获取情报统计', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能获取告警列表', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: 1, pageSize: 10 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });

  test.describe('情报验证 API', () => {
    test('应能执行情报验证', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/intelligence/verify`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          intelligenceId: 1,
          content: 'E2E验证内容',
          sourceType: 'MANUAL'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能获取验证历史', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/verify/history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { intelligenceId: 1 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });

  test.describe('情报规则 API', () => {
    test('应能获取规则列表', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/intelligence/rules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能更新规则', async ({ request }) => {
      const response = await request.put(`${BASE_URL}/wande/intelligence/rules`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          id: 1,
          ruleName: 'E2E规则',
          ruleValue: 80,
          enabled: true
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });
});
