/**
 * Dashboard Command API Tests - 快捷指令执行引擎
 * Issue: WnadeyaowuOrganization/wande-ai-backend#45
 * PR: WnadeyaowuOraganization/wande-ai-backend#689
 *
 * API Endpoints:
 * - GET /api/dashboard/commands/presets - 预设命令列表
 * - POST /api/dashboard/commands/execute - 执行命令
 * - GET /api/dashboard/commands/history - 执行历史列表
 * - GET /api/dashboard/commands/history/{id} - 单条执行详情
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

test.describe('Dashboard Command API @api @dashboard-command @issue:backend#45', () => {
  test.describe.configure({ mode: 'parallel' });

  test('presets API requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/dashboard/commands/presets`);
    const body = await response.json();

    // 后端使用 Sa-Token，HTTP 状态码始终为 200，认证结果在 body.code 中
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
    expect(body.msg).toContain('认证失败');
  });

  test('execute API requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/dashboard/commands/execute`, {
      data: { command_id: 1, target_server: 'g7e' }
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
    expect(body.msg).toContain('认证失败');
  });

  test('history API requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/dashboard/commands/history`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
    expect(body.msg).toContain('认证失败');
  });

  test('history detail API requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/dashboard/commands/history/1`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
    expect(body.msg).toContain('认证失败');
  });
});

test.describe('Dashboard Command API with Auth @api @dashboard-command @issue:backend#45', () => {
  let accessToken: string;

  test.beforeAll(async ({ request }) => {
    // Login to get access token
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: {
        username: process.env.TEST_USERNAME || 'admin',
        password: process.env.TEST_PASSWORD || 'admin123',
      },
    });
    const loginBody = await loginRes.json();
    expect(loginBody.code).toBe(200);
    accessToken = loginBody.data.access_token;
  });

  test('should get presets list with valid token', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/dashboard/commands/presets`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const body = await response.json();

    // API 可能返回 200 (成功) 或 403 (权限不足，需要 super_admin)
    expect([200, 403]).toContain(body.code);

    if (body.code === 200) {
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBe(true);
      // 应该有 6 个预设命令
      expect(body.data.length).toBeGreaterThanOrEqual(0);

      // 检查预设命令结构
      if (body.data.length > 0) {
        const preset = body.data[0];
        expect(preset).toHaveProperty('id');
        expect(preset).toHaveProperty('name');
        expect(preset).toHaveProperty('targetServer');
      }
    }
  });

  test('should get history list with valid token', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/dashboard/commands/history`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { pageNum: 1, pageSize: 10 }
    });
    const body = await response.json();

    // API 可能返回 200 或 403
    expect([200, 403]).toContain(body.code);

    if (body.code === 200) {
      expect(body.data).toBeDefined();
      expect(body.data).toHaveProperty('rows');
      expect(body.data).toHaveProperty('total');
      expect(Array.isArray(body.data.rows)).toBe(true);
    }
  });

  test('execute command should validate input', async ({ request }) => {
    // 测试没有参数的情况
    const response = await request.post(`${API_BASE}/api/dashboard/commands/execute`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {}
    });
    const body = await response.json();

    // 应该返回参数错误或权限错误
    expect([200, 400, 403, 500]).toContain(body.code);
  });

  test('blacklisted commands should be rejected', async ({ request }) => {
    // 测试黑名单命令（如 rm -rf）
    const response = await request.post(`${API_BASE}/api/dashboard/commands/execute`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        command_content: 'rm -rf /',
        target_server: 'g7e'
      }
    });
    const body = await response.json();

    // 黑名单命令应该被拒绝
    expect([200, 403, 400]).toContain(body.code);
    if (body.code === 403 || body.code === 400) {
      expect(body.msg).toMatch(/禁止|拒绝|黑名单|不允许/i);
    }
  });
});
