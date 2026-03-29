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
    const response = await request.get(`${BASE_URL}/ai/prompt-templates/list`);
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.code).toBe(401);
  });
});

// 已认证访问测试
test.describe('Prompt 模板管理 API 测试', () => {
  test('应能访问模板列表', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/ai/prompt-templates/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能访问模板详情', async ({ request }) => {
    // 先获取列表，然后用第一个 ID 查询详情
    const listResponse = await request.get(`${BASE_URL}/ai/prompt-templates/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResponse.json();

    if (listData.data && listData.data.rows && listData.data.rows.length > 0) {
      const id = listData.data.rows[0].id;
      const response = await request.get(`${BASE_URL}/ai/prompt-templates/${id}`, {
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

  test('应能按分类查询模板', async ({ request }) => {
    // 使用一个常见的分类，如果不存在可能返回空列表
    const response = await request.get(`${BASE_URL}/ai/prompt-templates/category/writing`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).not.toBe(401);
    expect(response.status()).not.toBe(403);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能按产品线查询模板', async ({ request }) => {
    // 使用一个常见产品线，如果不存在可能返回空列表
    const response = await request.get(`${BASE_URL}/ai/prompt-templates/product-line/furniture`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).not.toBe(401);
    expect(response.status()).not.toBe(403);
    const data = await response.json();
    expect(data.code).toBe(200);
    expect(data.data).toBeDefined();
  });

  test('应能增加模板使用次数', async ({ request }) => {
    // 先获取列表，然后用第一个 ID 测试
    const listResponse = await request.get(`${BASE_URL}/ai/prompt-templates/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResponse.json();

    if (listData.data && listData.data.rows && listData.data.rows.length > 0) {
      const id = listData.data.rows[0].id;
      const response = await request.post(`${BASE_URL}/ai/prompt-templates/${id}/increment-usage`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).not.toBe(401);
      expect(response.status()).not.toBe(403);
      const data = await response.json();
      expect(data.code).toBe(200);
    } else {
      test.skip();
    }
  });
});
