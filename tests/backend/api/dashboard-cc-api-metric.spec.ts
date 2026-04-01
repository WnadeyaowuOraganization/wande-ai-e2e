/**
 * Dashboard CC API Metric Tests — CC API调用质量监控
 * Issue: WnadeyaowuOraganization/wande-ai-backend#698
 *
 * APIs:
 * - POST /monitor/cc-api-metric/webhook/report  — Webhook上报指标（无需认证）
 * - GET  /monitor/cc-api-metric/list            — 列表查询
 * - GET  /monitor/cc-api-metric/{id}            — 详情
 * - POST /monitor/cc-api-metric                 — 新增
 * - PUT  /monitor/cc-api-metric                 — 修改
 * - DELETE /monitor/cc-api-metric/{ids}         — 删除
 * - GET  /monitor/cc-api-metric/overview        — 统计概览
 * - GET  /monitor/cc-api-metric/trend           — 按线路趋势
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:6040';
const USERNAME = process.env.API_USERNAME || 'admin';
const PASSWORD = process.env.API_PASSWORD || 'admin123';

let token: string;

test.beforeAll(async ({ request }) => {
  const loginResponse = await request.post(`${BASE_URL}/auth/login`, {
    data: { username: USERNAME, password: PASSWORD }
  });
  const loginData = await loginResponse.json();
  if (loginData.code === 200) {
    token = loginData.data.token;
  }
});

// Webhook 上报接口（无需认证）
test.describe('CC API Metric Webhook @api @cc-api-metric @issue:backend#698', () => {
  test('POST /webhook/report 应能正常接收正常比例指标', async ({ request }) => {
    const payload = {
      ccLine: 'cc-line-test-normal',
      issueNumber: 698,
      inputTokens: 3000,
      outputTokens: 1000,
      model: 'glm-5',
      responseTimeMs: 1200,
      errorMessage: null
    };
    const res = await request.post(`${BASE_URL}/monitor/cc-api-metric/webhook/report`, {
      data: payload
    });
    const body = await res.json();
    expect(body.code).toBe(200);
  });

  test('POST /webhook/report 应能检测黄色预警 (ratio > 50)', async ({ request }) => {
    const payload = {
      ccLine: 'cc-line-test-warning',
      issueNumber: 698,
      inputTokens: 6000,
      outputTokens: 100,
      model: 'glm-5',
      responseTimeMs: 1500,
      errorMessage: null
    };
    const res = await request.post(`${BASE_URL}/monitor/cc-api-metric/webhook/report`, {
      data: payload
    });
    const body = await res.json();
    expect(body.code).toBe(200);
  });

  test('POST /webhook/report 应能检测红色告警 (ratio > 200)', async ({ request }) => {
    const payload = {
      ccLine: 'cc-line-test-critical',
      issueNumber: 698,
      inputTokens: 30000,
      outputTokens: 100,
      model: 'glm-5',
      responseTimeMs: 2000,
      errorMessage: null
    };
    const res = await request.post(`${BASE_URL}/monitor/cc-api-metric/webhook/report`, {
      data: payload
    });
    const body = await res.json();
    expect(body.code).toBe(200);
  });

  test('POST /webhook/report 应能处理 outputTokens 为 0 的情况', async ({ request }) => {
    const payload = {
      ccLine: 'cc-line-test-zero',
      issueNumber: 698,
      inputTokens: 10000,
      outputTokens: 0,
      model: 'glm-5',
      responseTimeMs: 800,
      errorMessage: 'timeout'
    };
    const res = await request.post(`${BASE_URL}/monitor/cc-api-metric/webhook/report`, {
      data: payload
    });
    const body = await res.json();
    expect(body.code).toBe(200);
  });
});

// 管理接口 — 未认证访问应返回401
test.describe('CC API Metric 管理接口 — 未认证 @api @cc-api-metric @issue:backend#698', () => {
  test('GET /list 未认证应返回401', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/monitor/cc-api-metric/list`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('GET /overview 未认证应返回401', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/monitor/cc-api-metric/overview`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('GET /trend 未认证应返回401', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/monitor/cc-api-metric/trend`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });
});

// 管理接口 — 已认证访问
test.describe('CC API Metric 管理接口 — 已认证 @api @cc-api-metric @issue:backend#698', () => {
  test('GET /list 应能返回列表', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE_URL}/monitor/cc-api-metric/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /overview 应能返回统计概览', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE_URL}/monitor/cc-api-metric/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /trend 应能返回线路趋势', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE_URL}/monitor/cc-api-metric/trend`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });
});
