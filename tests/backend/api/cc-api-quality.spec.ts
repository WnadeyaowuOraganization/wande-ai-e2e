import { test, expect } from '@playwright/test';

/**
 * CC API调用质量监控API测试
 * Issue: backend#698
 * PR: #906 - CC API调用质量监控
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

  test('GET /monitor/cc-api-metric/list - 获取CC API指标列表', async ({ request }) => {
    const response = await request.get(`${baseURL}/monitor/cc-api-metric/list?pageNum=1&pageSize=10`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /monitor/cc-api-metric/{id} - 获取CC API指标详情', async ({ request }) => {
    const response = await request.get(`${baseURL}/monitor/cc-api-metric/1`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    // 返回200或404都是可接受的（数据可能不存在）
    expect([200, 404]).toContain(body.code);
  });

  test('GET /monitor/cc-api-metric/overview - 获取CC API概览', async ({ request }) => {
    const response = await request.get(`${baseURL}/monitor/cc-api-metric/overview`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /monitor/cc-api-metric/trend - 获取CC API趋势', async ({ request }) => {
    const response = await request.get(`${baseURL}/monitor/cc-api-metric/trend`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('POST /monitor/cc-api-metric/webhook/report - Webhook上报CC API指标', async ({ request }) => {
    const response = await request.post(`${baseURL}/monitor/cc-api-metric/webhook/report`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: {
        ccLine: 'test-line-001',
        ccLineName: 'Test Line',
        totalCalls: 100,
        successCalls: 95,
        failedCalls: 5,
        avgInputTokens: 500,
        avgOutputTokens: 1000,
        totalCostUsd: 0.5,
        issueNumber: '123'
      }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
  });
});
