import { test, expect } from '@playwright/test';

/**
 * CC API调用质量监控API测试
 * Issue: backend#913
 * PR: #921 - 协调统一CC API监控API路径
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

  test('GET /wande/dashboard/cc-metrics/list - 获取CC API指标列表', async ({ request }) => {
    const response = await request.get(`${baseURL}/wande/dashboard/cc-metrics/list?pageNum=1&pageSize=10`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /wande/dashboard/cc-metrics/all - 获取全部CC API指标', async ({ request }) => {
    const response = await request.get(`${baseURL}/wande/dashboard/cc-metrics/all`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('POST /wande/dashboard/cc-metrics/report - 上报CC API调用指标', async ({ request }) => {
    const response = await request.post(`${baseURL}/wande/dashboard/cc-metrics/report`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: {
        ccLineId: 'test-line-001',
        ccLineName: 'Test Line',
        totalCalls: 100,
        successCalls: 95,
        failedCalls: 5,
        avgInputTokens: 500,
        avgOutputTokens: 1000,
        totalCostUsd: 0.5
      }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
  });

  test('POST /wande/dashboard/cc-metrics/report/batch - 批量上报CC API调用指标', async ({ request }) => {
    const response = await request.post(`${baseURL}/wande/dashboard/cc-metrics/report/batch`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: [
        {
          ccLineId: 'test-line-001',
          ccLineName: 'Test Line 1',
          totalCalls: 100,
          successCalls: 95,
          failedCalls: 5
        },
        {
          ccLineId: 'test-line-002',
          ccLineName: 'Test Line 2',
          totalCalls: 200,
          successCalls: 190,
          failedCalls: 10
        }
      ]
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /wande/dashboard/cc-metrics/alerts - 获取告警列表', async ({ request }) => {
    const response = await request.get(`${baseURL}/wande/dashboard/cc-metrics/alerts`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /wande/dashboard/cc-metrics/stats/summary - 获取统计摘要', async ({ request }) => {
    const response = await request.get(`${baseURL}/wande/dashboard/cc-metrics/stats/summary`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });
});
