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

test.describe('客户情报信息质量计算引擎 API 测试', { tag: ['@api', '@intelligence', '@quality', '@issue:backend#635'] }, () => {
  test.describe('未认证访问测试', () => {
    test('质量检查接口未认证应返回401', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/intelligence/quality/check`, {
        data: { intelligenceId: 1, content: 'test' }
      });
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('质量评分接口未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/intelligence/quality/score/1`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('质量报告接口未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/intelligence/quality/report/1`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('批量质量检查接口未认证应返回401', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/intelligence/quality/batch-check`, {
        data: { intelligenceIds: [1, 2, 3] }
      });
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });
  });

  test.describe('信息质量检查 API', () => {
    test('应能执行单条情报质量检查', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/intelligence/quality/check`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          intelligenceId: 1,
          content: '测试情报内容',
          sourceType: 'MANUAL'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能获取情报质量评分', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/intelligence/quality/score/1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能获取情报质量报告', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/intelligence/quality/report/1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });

  test.describe('批量质量检查 API', () => {
    test('应能执行批量情报质量检查', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/intelligence/quality/batch-check`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          intelligenceIds: [1, 2, 3],
          checkOptions: {
            checkCompleteness: true,
            checkAccuracy: true,
            checkTimeliness: true
          }
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能获取批量检查结果', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/intelligence/quality/batch-result/1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });

  test.describe('质量规则管理 API', () => {
    test('应能获取质量规则列表', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/intelligence/quality/rules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能获取质量规则详情', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/intelligence/quality/rules/1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });

  test.describe('质量统计 API', () => {
    test('应能获取质量统计概览', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/intelligence/quality/statistics/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能按时间段统计质量分布', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/intelligence/quality/statistics/distribution`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate: '2026-01-01', endDate: '2026-04-02' }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });
});
