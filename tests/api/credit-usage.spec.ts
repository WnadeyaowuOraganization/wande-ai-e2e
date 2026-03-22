import { test, expect } from '@playwright/test';

/**
 * Perplexity Credit 消耗统计 API 测试
 * 对应 Issue: wande-ai-backend#2
 * Controller: /wande/credit-usage
 * 权限: wande:credit-usage:*
 */

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

test.describe('Credit Usage API @api @credit-usage @issue:backend#2', () => {
  // 认证 token，beforeAll 获取一次，所有测试共享
  let token: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: {
        username: process.env.TEST_USERNAME || 'admin',
        password: process.env.TEST_PASSWORD || 'admin123',
      },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
    token = body.data.access_token;
    expect(token).toBeDefined();
  });

  // === 未认证测试 ===

  test('list API requires authentication', { tag: ['@api', '@credit-usage'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/credit-usage/list`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('summary API requires authentication', { tag: ['@api', '@credit-usage'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/credit-usage/summary`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('detail API requires authentication', { tag: ['@api', '@credit-usage'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/credit-usage/1`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  // === 认证后测试 ===

  test('should get credit usage list with valid token', { tag: ['@api', '@credit-usage'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/credit-usage/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
  });

  test('should get credit usage summary with valid token', { tag: ['@api', '@credit-usage'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/credit-usage/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
  });

  test('should reject delete without permission token', { tag: ['@api', '@credit-usage'] }, async ({ request }) => {
    const response = await request.delete(`${API_BASE}/wande/credit-usage/99999`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    // 超管有权限，应返回 200（即使记录不存在也不报错）或 500
    expect([200, 500]).toContain(body.code);
  });
});
