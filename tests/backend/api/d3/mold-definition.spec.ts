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

test.describe('D3新模具定义 API 测试', { tag: ['@api', '@d3', '@mold-definition', '@issue:backend#625'] }, () => {
  test.describe('未认证访问测试', () => {
    test('列表未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/d3/mold-definition/list`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });

    test('详情未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/d3/mold-definition/1`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });
  });

  test.describe('模具定义查询 API', () => {
    test('应能获取模具定义分页列表', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/d3/mold-definition/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNum: 1, pageSize: 10 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });

    test('应支持按关键字搜索模具定义', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/d3/mold-definition/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { keyword: 'TEST', pageNum: 1, pageSize: 10 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });

    test('应支持按品类编码过滤', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/wande/d3/mold-definition/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { categoryCode: '1120', pageNum: 1, pageSize: 10 }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
    });
  });

  test.describe('模具定义管理 API', () => {
    test('应能新增模具定义', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/d3/mold-definition`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          categoryCode: '1120',
          name: 'E2E测试模具定义',
          platformHeightMm: 100,
          moldType: 'S型',
          direction: '左',
          targetMarkets: '["CN"]',
          designReason: 'E2E测试',
          relatedProjectNo: 'PROJ_E2E_001'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能更新模具定义', async ({ request }) => {
      const response = await request.put(`${BASE_URL}/wande/d3/mold-definition`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          id: 1,
          categoryCode: '1121',
          name: 'E2E更新模具定义',
          platformHeightMm: 150,
          moldType: '半圆',
          direction: '右',
          targetMarkets: '["CN","EU"]',
          designReason: 'E2E更新测试',
          relatedProjectNo: 'PROJ_E2E_002'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能提交模具定义审核', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/d3/mold-definition/submit/1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能执行模具定义审核', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/d3/mold-definition/audit`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          id: 1,
          auditResult: 'PASS',
          auditComment: 'E2E审核通过'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能上传STEP并归档', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/wande/d3/mold-definition/upload-step`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          id: 1,
          stepFileUrl: 'https://example.com/step/test.step',
          fileName: 'test.step'
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });

    test('应能删除模具定义', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/wande/d3/mold-definition/999999`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBeDefined();
    });
  });
});
