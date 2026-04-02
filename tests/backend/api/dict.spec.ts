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

test.describe('字典类型 API 测试', { tag: ['@api', '@dict', '@issue:backend#171'] }, () => {
  test.describe('未认证访问测试', () => {
    test('字典类型 /all 未认证应返回401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/system/dict/type/all`);
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.code).toBe(401);
    });
  });

  test.describe('字典类型查询 API', () => {
    test('应能获取全部字典类型列表', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/system/dict/type/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);
      // /all 端点可能直接返回 { total, rows } 在顶层，而不是包裹在 data 中
      const rows = data.data?.rows ?? data.rows;
      expect(Array.isArray(rows)).toBeTruthy();
    });

    test('返回的字典类型应包含基本字段', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/system/dict/type/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.code).toBe(200);

      const rows = data.data?.rows ?? data.rows;
      if (Array.isArray(rows) && rows.length > 0) {
        const first = rows[0];
        expect(first).toHaveProperty('dictId');
        expect(first).toHaveProperty('dictName');
        expect(first).toHaveProperty('dictType');
      }
    });
  });
});
