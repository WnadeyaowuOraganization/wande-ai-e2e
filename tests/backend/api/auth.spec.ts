import { test, expect } from '@playwright/test';

/**
 * 认证API测试
 * 验证登录、Token、权限等核心认证逻辑
 */

const TEST_USER = {
  username: process.env.TEST_USERNAME || 'admin',
  password: process.env.TEST_PASSWORD || 'admin123',
};

test.describe('Authentication API @api @auth', () => {
  test('should login with valid credentials', { tag: ['@api', '@auth'] }, async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        username: TEST_USER.username,
        password: TEST_USER.password,
      },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    // RuoYi框架返回 {code: 200, msg: "...", data: {token: "..."}} 或 {code: 200, token: "..."}
    expect(body.code).toBe(200);
  });

  test('should reject invalid credentials', { tag: ['@api', '@auth'] }, async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        username: 'nonexistent_user_test',
        password: 'wrong_password_test',
      },
    });
    const body = await response.json();
    // 应返回错误码（RuoYi框架code!=200表示失败）
    expect(body.code).not.toBe(200);
  });

  test('should reject empty credentials', { tag: ['@api', '@auth'] }, async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { username: '', password: '' },
    });
    const body = await response.json();
    expect(body.code).not.toBe(200);
  });
});

test.describe('Authenticated API Access @api @auth', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        username: TEST_USER.username,
        password: TEST_USER.password,
      },
    });
    const body = await response.json();
    token = body.data?.token || body.token || '';
  });

  test('should access protected endpoint with token', { tag: ['@api', '@auth'] }, async ({ request }) => {
    test.skip(!token, 'No token available — login may have failed');
    const response = await request.get('/system/user/getInfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.code).toBe(200);
  });

  test('should reject expired/invalid token', { tag: ['@api', '@auth'] }, async ({ request }) => {
    const response = await request.get('/system/user/getInfo', {
      headers: { Authorization: 'Bearer invalid_token_12345' },
    });
    // HTTP 状态码为 200，认证失败在 JSON body code 中
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([401, 403]).toContain(body.code);
  });
});
