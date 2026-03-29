import { test, expect } from '@playwright/test';

/**
 * API健康检查测试
 * 验证后端服务可达性和核心接口基本可用
 *
 * 注意：本项目后端（Spring Boot + Sa-Token）的认证拦截返回 HTTP 200，
 * 错误信息在 JSON body 的 code 字段中（如 {"code":401,"msg":"认证失败..."}）。
 * 因此测试中检查 body.code 而非 response.status()。
 */

test.describe('Backend Health Check @api @smoke @health', () => {
  test('backend service is reachable', { tag: ['@api', '@health'] }, async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
  });

  test('backend returns valid JSON on error', { tag: ['@api', '@health'] }, async ({ request }) => {
    const response = await request.get('/nonexistent-endpoint-test');
    expect(response.status()).toBe(200);
    const body = await response.json();
    // 不存在的路径应返回 code 404 或 500
    expect([404, 500]).toContain(body.code);
  });
});

test.describe('Core API Endpoints Reachable @api @smoke', () => {
  test('auth login endpoint exists', { tag: ['@api', '@auth'] }, async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { username: '', password: '' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    // 空凭据应被拒绝（非 200 成功码）
    expect(body.code).not.toBe(200);
  });

  test('tender list API requires auth', { tag: ['@api', '@tender'] }, async ({ request }) => {
    const response = await request.get('/wande/tender/list');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('system user list API requires auth', { tag: ['@api', '@system'] }, async ({ request }) => {
    const response = await request.get('/system/user/list');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });
});
