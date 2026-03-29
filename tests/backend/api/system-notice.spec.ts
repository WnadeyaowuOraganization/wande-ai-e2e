import { test, expect } from '@playwright/test';

/**
 * 系统通知API安全测试
 * 验证 SysNoticeController 的权限修复 (Issue #44)
 * PR #622: 修复未授权访问漏洞
 */

const TEST_USER = {
  username: process.env.TEST_USERNAME || 'admin',
  password: process.env.TEST_PASSWORD || 'admin123',
};

test.describe('System Notice API Security @api @system @issue:backend#44', () => {
  test('notice list API requires authentication', { tag: ['@api', '@system', '@issue:backend#44'] }, async ({ request }) => {
    const response = await request.get('/system/notice/list');
    // HTTP 状态码始终为 200 (Sa-Token 特性)
    expect(response.status()).toBe(200);
    const body = await response.json();
    // 认证失败在 body.code 中
    expect(body.code).toBe(401);
  });

  test('notice detail API requires authentication', { tag: ['@api', '@system', '@issue:backend#44'] }, async ({ request }) => {
    const response = await request.get('/system/notice/1');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });
});

test.describe('System Notice API Authenticated Access @api @system', () => {
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

  test('notice list API works with valid token', { tag: ['@api', '@system'] }, async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get('/system/notice/list', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(200);
  });
});
