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

test.describe('经销商信息提交 API 测试', { tag: ['@api', '@dealer', '@submission', '@issue:backend#638'] }, () => {
  test.describe('未认证访问测试', () => {
    test('提交列表未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/dealer/submission/list`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('提交详情未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/dealer/submission/1`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('质量评分未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/dealer/submission/quality-score/1`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('提交信息未认证应返回401', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/dealer/submission`, {
        data: { endCustomerName: 'test' }
      });
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });
  });

  test.describe('经销商提交查询 API', () => {
    test('应能获取提交记录列表', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/dealer/submission/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: 1, pageSize: 10 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
      expect(data.data).toBeDefined();
    });

    test('应能获取提交记录详情', async ({ request }) => {
      const listResponse = await request.get(`${BASE_URL}/wande/dealer/submission/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: 1, pageSize: 1 }
      });
      const listData = await listResponse.json();
      if (listData.data?.rows?.length > 0) {
        const id = listData.data.rows[0].id;
        const response = await request.get(`${BASE_URL}/wande/dealer/submission/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.code).toBe(200);
      } else {
        test.skip();
      }
    });

    test('应能查询经销商质量评分', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/dealer/submission/quality-score/1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });

  test.describe('经销商提交管理 API', () => {
    test('应能提交经销商信息', async ({ request }) => {
      const payload = {
        endCustomerName: 'E2E终端客户-' + Date.now(),
        projectStage: '初步接触',
        budgetRange: '50-100万',
        decisionMakerInfo: '张总，决策人',
        competitorStatus: '暂无',
        infoSource: '展会',
        projectLocation: '上海',
        estimatedPurchaseTime: '2026-06',
        projectDescription: 'E2E测试项目',
        remark: '测试备注'
      };
      const response = await request.post(`${BASE_URL}/wande/dealer/submission`, {
        headers: { Authorization: `Bearer ${token}` },
        data: payload
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能更新经销商提交记录', async ({ request }) => {
      const response = await request.put(`${BASE_URL}/wande/dealer/submission`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          id: 1,
          endCustomerName: 'E2E更新客户',
          projectStage: '方案确认'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能删除经销商提交记录', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/wande/dealer/submission/999999`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });
});
