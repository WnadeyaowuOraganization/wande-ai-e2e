import { test, expect } from '@playwright/test';

/**
 * 管理费配置API测试
 * Issue: backend#225
 * PR: #922
 */

test.describe('管理费配置API', () => {
  const baseURL = 'http://localhost:6040';
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${baseURL}/auth/login`, {
      data: { username: 'admin', password: 'admin123' }
    });
    const loginBody = await loginRes.json();
    authToken = loginBody.data?.token || loginBody.token;
  });

  test('GET /wande/mgmt-fee/config/list - 获取管理费配置列表', async ({ request }) => {
    const response = await request.get(`${baseURL}/wande/mgmt-fee/config/list?pageNum=1&pageSize=10`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.rows).toBeDefined();
  });

  test('GET /wande/user-feedback/list - 用户反馈列表API', async ({ request }) => {
    const response = await request.get(`${baseURL}/wande/user-feedback/list?pageNum=1&pageSize=10`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('POST /wande/user-feedback - 创建用户反馈', async ({ request }) => {
    const timestamp = Date.now();
    const response = await request.post(`${baseURL}/wande/user-feedback`, {
      headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      data: {
        title: `Test Feedback ${timestamp}`,
        content: `Test feedback from E2E test ${timestamp}`,
        sourceChannel: 'web',
        feedbackType: 'BUG',
        module: 'test',
        priority: 'MEDIUM'
      }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
  });
});
