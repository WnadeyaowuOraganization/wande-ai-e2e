import { test, expect } from '@playwright/test';

/**
 * GPU Monitor API 测试
 * 验证 GPU 性能监控接口的正确性
 *
 * 关联 Issue: backend#255
 * PR: WnadeyaowuOraganization/wande-ai-backend#256
 */

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

test.describe('GPU Monitor API @api @gpu-monitor @issue:backend#255', () => {
  let globalToken: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: {
        username: 'admin',
        password: 'admin123',
      },
    });
    const body = await response.json();
    expect(body.code).toBe(200);
    globalToken = body.data?.access_token || body.data?.token || '';
  });

  test('should get GPU realtime data', { tag: ['@api', '@gpu-monitor', '@issue:backend#255'] }, async ({ request }) => {
    test.skip(!globalToken, 'No token available');

    const response = await request.get('/api/monitor/gpu/realtime', {
      headers: { Authorization: `Bearer ${globalToken}` },
    });

    // HTTP 200 表示接口存在
    expect(response.status()).toBe(200);

    const body = await response.json();
    // code 200 = GPU 服务正常，code 500 = GPU 服务不可达（dev环境预期行为）
    // 绝不应该是 401（认证问题）或 404（接口不存在）
    expect([200, 500]).toContain(body.code);
    expect(body.code).not.toBe(401);
    expect(body.code).not.toBe(404);

    if (body.code === 200) {
      expect(body.data).toBeDefined();
      // 验证返回数据结构
      const data = body.data;
      // 应包含 GPU 列表
      expect(Array.isArray(data.gpuList) || Array.isArray(data)).toBeTruthy();

      // 如果返回 GPU 数据，验证关键字段
      if (data.gpuList && data.gpuList.length > 0) {
        const gpu = data.gpuList[0];
        expect(gpu).toHaveProperty('gpuIndex');
        expect(gpu).toHaveProperty('memoryUsed');
        expect(gpu).toHaveProperty('memoryTotal');
        expect(gpu).toHaveProperty('utilRate');
        expect(gpu).toHaveProperty('temperature');
        expect(gpu).toHaveProperty('powerWatts');
      }
    } else {
      // 服务不可用时应有错误消息
      expect(body.msg).toBeDefined();
    }
  });

  test('should get GPU summary data', { tag: ['@api', '@gpu-monitor', '@issue:backend#255'] }, async ({ request }) => {
    test.skip(!globalToken, 'No token available');

    const response = await request.get('/api/monitor/gpu/summary', {
      headers: { Authorization: `Bearer ${globalToken}` },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    // code 200 = 正常，code 500 = GPU 服务不可达（dev环境预期）
    expect([200, 500]).toContain(body.code);
    expect(body.code).not.toBe(401);
    // 服务不可用时可能没有 data 字段
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('should get GPU alerts', { tag: ['@api', '@gpu-monitor', '@issue:backend#255'] }, async ({ request }) => {
    test.skip(!globalToken, 'No token available');

    const response = await request.get('/api/monitor/gpu/alerts', {
      headers: { Authorization: `Bearer ${globalToken}` },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    // code 200 = 正常，code 500 = GPU 服务不可达（dev环境预期）
    expect([200, 500]).toContain(body.code);
    expect(body.code).not.toBe(401);
    // 返回的应该是告警列表（可能为空）
    // 服务不可用时可能没有 data 字段
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('should get GPU health status', { tag: ['@api', '@gpu-monitor', '@issue:backend#255'] }, async ({ request }) => {
    test.skip(!globalToken, 'No token available');

    const response = await request.get('/api/monitor/gpu/health', {
      headers: { Authorization: `Bearer ${globalToken}` },
    });

    // 健康检查接口应始终可用
    expect(response.status()).toBe(200);

    if (response.status() === 200) {
      const body = await response.json();
      // 健康检查返回 code 200 表示 GPU 监控服务正常
      expect(body.code).toBe(200);
      expect(body.data).toBeDefined();
    }
  });

  test('should reject unauthenticated requests', { tag: ['@api', '@gpu-monitor', '@issue:backend#255'] }, async ({ request }) => {
    const response = await request.get('/api/monitor/gpu/realtime');
    // 未认证应返回 401 或 code 401
    const status = response.status();
    const body = await response.json();
    expect(status).toBe(200);
    // 如果返回 200，body 中应有 code 401
    if (status === 200) {
      expect(body.code).toBe(401);
    }
  });
});
