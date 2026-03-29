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
    const response = await request.get(`${BASE_URL}/wande/sample/auto-generate/demand/1`);
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.code).toBe(401);
  });
});

// 已认证访问测试
test.describe('样品自动生成 API 测试', () => {
  test('应能提取样品需求', async ({ request }) => {
    // 使用一个有效的项目 ID，如果不存在可能返回空列表
    const response = await request.get(`${BASE_URL}/wande/sample/auto-generate/demand/1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).not.toBe(401);
    expect(response.status()).not.toBe(403);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能提取并合并样品需求', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wande/sample/auto-generate/demand/merge/1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).not.toBe(401);
    expect(response.status()).not.toBe(403);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能按类型提取样品需求', async ({ request }) => {
    // selectionType: 1=色卡/2=材料
    const response = await request.get(`${BASE_URL}/wande/sample/auto-generate/demand/by-type/1/1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).not.toBe(401);
    expect(response.status()).not.toBe(403);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能进行样品库存匹配', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/wande/sample/auto-generate/match`, {
      headers: { Authorization: `Bearer ${token}` },
      data: []
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能检查库存是否充足', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/wande/sample/auto-generate/check-stock`, {
      headers: { Authorization: `Bearer ${token}` },
      data: []
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能处理项目样品需求全流程', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/wande/sample/auto-generate/process/1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).not.toBe(401);
    expect(response.status()).not.toBe(403);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });
});
