import { test, expect } from '@playwright/test';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:6040';
const USERNAME = process.env.API_USERNAME || 'admin';
const PASSWORD = process.env.API_PASSWORD || 'admin123';

let token: string;

// 登录获取 token
test.beforeAll(async ({ request }) => {
  const loginResponse = await request.post(`${BASE_URL}/auth/login`, {
    data: { username: USERNAME, password: PASSWORD }
  });
  expect(loginResponse.status()).toBe(200);
  const loginData = await loginResponse.json();
  token = loginData.data.token;
});

// 未认证访问测试
test.describe('未认证访问测试', () => {
  test('应返回 401 未授权', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/wande/quote-cost/calculate`, {
      headers: { 'Content-Type': 'application/json' },
      data: {}
    });
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.code).toBe(401);
  });
});

// 已认证访问测试
test.describe('报价成本计算 API 测试', () => {
  test('应能计算报价成本', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/wande/quote-cost/calculate`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: {
        materialCost: 1000,
        totalWeight: 50,
        totalVolume: 1,
        destinationProvince: '广东省',
        productCount: 10,
        installType: 'SELF_INSTALL',
        designCost: 200,
        otherCost: 100,
        targetMarginRate: 0.2,
        businessMode: 'DIRECT',
        tariffRate: 0.1
      }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
    expect(data.data.total_cost).toBeDefined();
    expect(data.data.suggested_price).toBeDefined();
  });

  test('应能获取成本明细', async ({ request }) => {
    // 使用一个可能的报价 ID，如果不存在可能返回 404 或空数据
    const response = await request.get(`${BASE_URL}/wande/quote-cost/breakdown/1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // 可能返回 404（数据不存在），但不应返回 401/403
    expect(response.status()).not.toBe(401);
    expect(response.status()).not.toBe(403);
  });

  test('应能获取运费系数配置', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wande/quote-cost/logistics-coefficient/广东省`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能获取安装费系数配置', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wande/quote-cost/install-coefficient/广东省`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });
});
