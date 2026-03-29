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
    const response = await request.get(`${BASE_URL}/wande/quote/history?opportunityId=1`);
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.code).toBe(401);
  });
});

// 已认证访问测试
test.describe('报价版本 API 测试', () => {
  test('应能访问报价历史', async ({ request }) => {
    // 使用一个有效的商机 ID，如果不存在则返回空列表
    const response = await request.get(`${BASE_URL}/wande/quote/history?opportunityId=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能访问版本对比接口（参数验证）', async ({ request }) => {
    // 这个接口需要有效的报价 ID 和版本号，主要测试接口可达性
    const response = await request.get(`${BASE_URL}/wande/quote/1/compare?version1=1&version2=2`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // 可能返回 404 或 400（数据不存在），但不应返回 401/403
    expect(response.status()).not.toBe(401);
    expect(response.status()).not.toBe(403);
  });
});
