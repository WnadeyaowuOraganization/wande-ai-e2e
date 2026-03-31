import { test, expect } from '@playwright/test';

/**
 * 审计日志API测试
 * Issue: backend#886
 * PR: #909
 */

test.describe('审计日志API', () => {
  const baseURL = 'http://localhost:6040';
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // 登录获取token
    const loginRes = await request.post(`${baseURL}/auth/login`, {
      data: {
        username: 'admin',
        password: 'admin123'
      }
    });
    const loginBody = await loginRes.json();
    authToken = loginBody.data?.token || loginBody.token;
  });

  test('GET /audit-log/list - 获取审计日志列表', async ({ request }) => {
    const response = await request.get(`${baseURL}/audit-log/list?pageNum=1&pageSize=10`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data.list || body.data.rows)).toBeTruthy();
  });

  test('GET /audit-log/stats - 获取审计统计', async ({ request }) => {
    const response = await request.get(`${baseURL}/audit-log/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /audit-log/timeline - 获取审计时间线', async ({ request }) => {
    const response = await request.get(`${baseURL}/audit-log/timeline?days=7`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('POST /audit-log/export - 导出审计日志', async ({ request }) => {
    const response = await request.post(`${baseURL}/audit-log/export`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: { startDate: '2025-01-01', endDate: '2025-12-31' }
    });

    expect(response.status()).toBe(200);
  });
});

test.describe('Token Pool API', () => {
  const baseURL = 'http://localhost:6040';
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${baseURL}/auth/login`, {
      data: { username: 'admin', password: 'admin123' }
    });
    const loginBody = await loginRes.json();
    authToken = loginBody.data?.token || loginBody.token;
  });

  test('GET /token-pool/list - 获取Token Pool列表', async ({ request }) => {
    const response = await request.get(`${baseURL}/token-pool/list`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /token-pool/usage - 获取Token使用统计', async ({ request }) => {
    const response = await request.get(`${baseURL}/token-pool/usage`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /token-pool/alert-rules - 获取告警规则', async ({ request }) => {
    const response = await request.get(`${baseURL}/token-pool/alert-rules`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('POST /token-pool/sync - G7e同步Token数据', async ({ request }) => {
    const response = await request.post(`${baseURL}/token-pool/sync`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: { source: 'g7e' }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
  });
});
