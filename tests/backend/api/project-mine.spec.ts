import { test, expect } from '@playwright/test';

/**
 * 项目挖掘 (Project Mine) API 测试
 * 对应 Issue: wande-ai-backend#274
 * Controller: /wande/project-mine
 * 权限: wande:project-mine:*
 */

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

test.describe('Project Mine API @api @project-mine @issue:backend#274', () => {
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

  test('list API requires authentication', { tag: ['@api', '@project-mine'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/project/mine/list`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('stats API requires authentication', { tag: ['@api', '@project-mine'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/project/mine/stats`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('detail API requires authentication', { tag: ['@api', '@project-mine'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/project/mine/1`);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  // === 认证后测试 ===

  test('should get project mine list with valid token', { tag: ['@api', '@project-mine'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/project/mine/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
    expect(body.total).toBeDefined();
    expect(body.rows).toBeDefined();
  });

  test('should get project mine stats with valid token', { tag: ['@api', '@project-mine'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/project/mine/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('should get project mine detail with valid token', { tag: ['@api', '@project-mine'] }, async ({ request }) => {
    // 使用任意 ID 测试接口可达性（即使记录不存在也不应报错）
    const response = await request.get(`${API_BASE}/wande/project/mine/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
  });
});
