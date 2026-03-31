import { test, expect } from '@playwright/test';

/**
 * CC API调用质量监控API测试
 * Issue: backend#698
 * PR: #906
 */

test.describe('CC API调用质量监控API', () => {
  const baseURL = 'http://localhost:6040';
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${baseURL}/auth/login`, {
      data: { username: 'admin', password: 'admin123' }
    });
    const loginBody = await loginRes.json();
    authToken = loginBody.data?.token || loginBody.token;
  });

  test('GET /dashboard/cc-api-quality/summary - 获取API质量汇总', async ({ request }) => {
    const response = await request.get(`${baseURL}/dashboard/cc-api-quality/summary`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /dashboard/cc-api-quality/metrics - 获取API指标详情', async ({ request }) => {
    const response = await request.get(`${baseURL}/dashboard/cc-api-quality/metrics`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /dashboard/cc-api-quality/errors - 获取API错误统计', async ({ request }) => {
    const response = await request.get(`${baseURL}/dashboard/cc-api-quality/errors`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /dashboard/cc-api-quality/latency - 获取API延迟分布', async ({ request }) => {
    const response = await request.get(`${baseURL}/dashboard/cc-api-quality/latency`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });
});
