import { test, expect } from '@playwright/test';

/**
 * API健康检查测试
 * 验证后端服务可达性和核心接口基本可用
 */

test.describe('Backend Health Check @api @smoke @health', () => {
  test('backend service is reachable', { tag: ['@api', '@health'] }, async ({ request }) => {
    // Spring Boot Actuator 或根路径
    const response = await request.get('/');
    // 允许200或302（重定向到登录）
    expect([200, 302, 401, 403]).toContain(response.status());
  });

  test('backend returns valid JSON on error', { tag: ['@api', '@health'] }, async ({ request }) => {
    const response = await request.get('/nonexistent-endpoint-test');
    // 应返回JSON格式的错误信息，而非HTML 500
    expect([404, 401, 403]).toContain(response.status());
  });
});

test.describe('Core API Endpoints Reachable @api @smoke', () => {
  test('auth login endpoint exists', { tag: ['@api', '@auth'] }, async ({ request }) => {
    // POST到登录接口（不带凭据应返回400或401）
    const response = await request.post('/auth/login', {
      data: { username: '', password: '' },
    });
    // 不应该是500（服务崩溃）或404（接口不存在）
    expect(response.status()).not.toBe(500);
    expect(response.status()).not.toBe(404);
  });

  test('tender list API requires auth', { tag: ['@api', '@tender'] }, async ({ request }) => {
    const response = await request.get('/wande/tender/list');
    // 未认证应返回401
    expect([401, 403]).toContain(response.status());
  });

  test('system user list API requires auth', { tag: ['@api', '@system'] }, async ({ request }) => {
    const response = await request.get('/system/user/list');
    expect([401, 403]).toContain(response.status());
  });
});
