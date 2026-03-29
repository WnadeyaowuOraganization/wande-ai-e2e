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
    const response = await request.get(`${BASE_URL}/wande/expense-report/list`);
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.code).toBe(401);
  });
});

// 已认证访问测试
test.describe('报销管理 API 测试', () => {
  test('应能访问报销单列表', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/wande/expense-report/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能访问报销单详情', async ({ request }) => {
    // 先获取列表，然后用第一个 ID 查询详情
    const listResponse = await request.get(`${BASE_URL}/wande/expense-report/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResponse.json();

    if (listData.data && listData.data.rows && listData.data.rows.length > 0) {
      const id = listData.data.rows[0].id;
      const response = await request.get(`${BASE_URL}/wande/expense-report/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
      expect(data.data).toBeDefined();
    } else {
      // 如果没有数据，跳过详情测试
      test.skip();
    }
  });

  test('应能获取商机获客成本汇总', async ({ request }) => {
    // 使用一个有效的商机 ID，如果不存在可能返回空或错误，但不应返回 401/403
    const response = await request.get(`${BASE_URL}/wande/expense-report/opportunity/1/acquisition-cost`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // 可能返回 404 或空数据，但不应返回 401/403
    expect(response.status()).not.toBe(401);
    expect(response.status()).not.toBe(403);
  });
});
