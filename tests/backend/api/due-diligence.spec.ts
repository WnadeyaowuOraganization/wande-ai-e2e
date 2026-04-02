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

test.describe('国贸客户尽调清单 API 测试', { tag: ['@api', '@crm', '@due-diligence', '@issue:backend#639'] }, () => {
  test.describe('未认证访问测试', () => {
    test('尽调详情未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/client/due-diligence/1`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('创建尽调未认证应返回401', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/client/due-diligence/1`, { data: {} });
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('更新尽调未认证应返回401', async ({ request }) => {
      const response = await request.put(`${BASE_URL}/wande/client/due-diligence/1`, { data: {} });
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('尽调审批未认证应返回401', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/client/due-diligence/1/approval`, { data: {} });
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('计算评分未认证应返回401', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/client/due-diligence/calculate-score`, { data: {} });
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });
  });

  test.describe('尽调查询 API', () => {
    test('应能获取客户尽调详情', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/client/due-diligence/1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能计算尽调评分', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/client/due-diligence/calculate-score`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          clientId: 1,
          dimensions: [
            { name: '资质', score: 80, weight: 0.3 },
            { name: '信誉', score: 90, weight: 0.3 },
            { name: '财务', score: 85, weight: 0.4 }
          ]
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });

  test.describe('尽调管理 API', () => {
    test('应能创建客户尽调', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/client/due-diligence/1`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          checkItems: [
            { item: '营业执照', status: 'passed', remark: '有效' },
            { item: '税务登记', status: 'passed', remark: '正常' }
          ],
          riskLevel: 'LOW',
          overallComment: 'E2E测试尽调'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能更新客户尽调', async ({ request }) => {
      const response = await request.put(`${BASE_URL}/wande/client/due-diligence/1`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          checkItems: [
            { item: '营业执照', status: 'passed' }
          ],
          riskLevel: 'MEDIUM',
          overallComment: 'E2E更新尽调'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能提交尽调审批', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/client/due-diligence/1/approval`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          action: 'APPROVE',
          comment: 'E2E审批通过'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });
});
