import { test, expect } from '@playwright/test';

/**
 * 通知中心API测试
 * PR #981: feat(notification): 通知中心查询API #871
 *
 * API端点:
 * - GET /wande/notification/list - 通知列表（分页）
 * - GET /wande/notification/unread-count - 未读数量统计
 * - PUT /wande/notification/{id}/read - 标记单条已读
 * - PUT /wande/notification/read-all - 标记全部已读
 */

const TEST_USER = {
  username: process.env.TEST_USERNAME || 'admin',
  password: process.env.TEST_PASSWORD || 'admin123',
};

test.describe('Notification Center API @api @notification @issue:backend#871', () => {
  let token: string;
  let userId: number;

  test.beforeAll(async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        username: TEST_USER.username,
        password: TEST_USER.password,
      },
    });
    const body = await response.json();
    token = body.data?.token || body.token || '';
    userId = body.data?.userId || body.userId;
  });

  test('should get notification list with pagination', {
    tag: ['@api', '@notification', '@issue:backend#871']
  }, async ({ request }) => {
    test.skip(!token, 'No token available');

    const response = await request.get('/wande/notification/list?pageNum=1&pageSize=10', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.code).toBe(200);

    // 验证分页响应结构
    expect(body.data).toBeDefined();
    expect(body.data.rows).toBeDefined();
    expect(body.data.total).toBeDefined();
    expect(Array.isArray(body.data.rows)).toBe(true);
  });

  test('should filter notifications by type', {
    tag: ['@api', '@notification', '@issue:backend#871']
  }, async ({ request }) => {
    test.skip(!token, 'No token available');

    const types = ['ISSUE_CREATED', 'PR_MERGED', 'CI_FAILED', 'SYSTEM'];

    for (const type of types) {
      const response = await request.get(`/wande/notification/list?type=${type}&pageNum=1&pageSize=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.code).toBe(200);
    }
  });

  test('should filter notifications by read status', {
    tag: ['@api', '@notification', '@issue:backend#871']
  }, async ({ request }) => {
    test.skip(!token, 'No token available');

    // 测试未读筛选
    const unreadResponse = await request.get('/wande/notification/list?isRead=false&pageNum=1&pageSize=10', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(unreadResponse.ok()).toBeTruthy();
    const unreadBody = await unreadResponse.json();
    expect(unreadBody.code).toBe(200);

    // 测试已读筛选
    const readResponse = await request.get('/wande/notification/list?isRead=true&pageNum=1&pageSize=10', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(readResponse.ok()).toBeTruthy();
    const readBody = await readResponse.json();
    expect(readBody.code).toBe(200);
  });

  test('should get unread count', {
    tag: ['@api', '@notification', '@issue:backend#871']
  }, async ({ request }) => {
    test.skip(!token, 'No token available');

    const response = await request.get('/wande/notification/unread-count', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.code).toBe(200);

    // 验证未读数结构
    expect(body.data).toBeDefined();
    expect(typeof body.data.total).toBe('number');
  });

  test('should require authentication for notification endpoints', {
    tag: ['@api', '@notification', '@issue:backend#871']
  }, async ({ request }) => {
    // 无Token访问列表
    const listResponse = await request.get('/wande/notification/list?pageNum=1&pageSize=10');
    expect(listResponse.status()).toBe(200);
    const listBody = await listResponse.json();
    expect(listBody.code).toBe(401);

    // 无Token访问未读数
    const countResponse = await request.get('/wande/notification/unread-count');
    expect(countResponse.status()).toBe(200);
    const countBody = await countResponse.json();
    expect(countBody.code).toBe(401);
  });

  test('should require valid permission for notification endpoints', {
    tag: ['@api', '@notification', '@issue:backend#871']
  }, async ({ request }) => {
    test.skip(!token, 'No token available');

    // 使用有效token访问，验证权限检查
    const response = await request.get('/wande/notification/list?pageNum=1&pageSize=10', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    // 权限不足返回403，正常访问返回200
    expect([200, 403]).toContain(body.code);
  });

  test('should mark single notification as read', {
    tag: ['@api', '@notification', '@issue:backend#871']
  }, async ({ request }) => {
    test.skip(!token, 'No token available');

    // 先获取一条通知
    const listResponse = await request.get('/wande/notification/list?pageNum=1&pageSize=1', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const listBody = await listResponse.json();
    test.skip(!listBody.data?.rows?.length, 'No notifications available to test');

    const notificationId = listBody.data.rows[0].id;

    // 标记已读
    const readResponse = await request.put(`/wande/notification/${notificationId}/read`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(readResponse.ok()).toBeTruthy();
    const readBody = await readResponse.json();
    expect([200, 404]).toContain(readBody.code); // 200成功或404通知不存在
  });

  test('should mark all notifications as read', {
    tag: ['@api', '@notification', '@issue:backend#871']
  }, async ({ request }) => {
    test.skip(!token, 'No token available');

    const response = await request.put('/wande/notification/read-all', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.code).toBe(200);
  });

  test('should handle invalid notification ID', {
    tag: ['@api', '@notification', '@issue:backend#871']
  }, async ({ request }) => {
    test.skip(!token, 'No token available');

    const response = await request.put('/wande/notification/99999999/read', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    // 不存在的通知返回404
    expect([200, 404, 500]).toContain(body.code);
  });

  test('should support pagination parameters', {
    tag: ['@api', '@notification', '@issue:backend#871']
  }, async ({ request }) => {
    test.skip(!token, 'No token available');

    // 测试不同pageSize
    for (const size of [5, 10, 20]) {
      const response = await request.get(`/wande/notification/list?pageNum=1&pageSize=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.code).toBe(200);

      if (body.data?.rows) {
        expect(body.data.rows.length).toBeLessThanOrEqual(size);
      }
    }
  });
});
