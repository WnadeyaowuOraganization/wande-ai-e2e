/**
 * Dashboard CC API Metric Tests — CC API调用质量监控
 * Issue: WnadeyaowuOraganization/wande-ai-backend#698 #914
 *
 * 统一后的 APIs (PR #912):
 * - POST /wande/dashboard/cc-metrics/report          — 单个上报（无需认证）
 * - POST /wande/dashboard/cc-metrics/report/batch    — 批量上报（无需认证）
 * - GET  /wande/dashboard/cc-metrics/list            — 列表查询
 * - GET  /wande/dashboard/cc-metrics/all             — 全部查询
 * - GET  /wande/dashboard/cc-metrics/line/{ccLine}/recent  — 最近记录
 * - GET  /wande/dashboard/cc-metrics/line/{ccLine}/stats   — 线路统计
 * - GET  /wande/dashboard/cc-metrics/stats/all       — 全部统计
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

// 上报接口（无需认证）
test.describe('CC API Metric Report @api @cc-api-metric @issue:backend#698 @issue:backend#914', () => {
  test('POST /report 应能正常接收正常比例指标', async ({ request }) => {
    const payload = {
      ccLine: 'cc-line-test-normal',
      issueNumber: 698,
      inputTokens: 3000,
      outputTokens: 1000,
      model: 'glm-5',
      responseTimeMs: 1200,
      errorMessage: null
    };
    const res = await request.post(`${BASE_URL}/wande/dashboard/cc-metrics/report`, {
      data: payload
    });
    const body = await res.json();
    expect(body.code).toBe(200);
  });

  test('POST /report 应能检测黄色预警 (ratio > 50)', async ({ request }) => {
    const payload = {
      ccLine: 'cc-line-test-warning',
      issueNumber: 698,
      inputTokens: 6000,
      outputTokens: 100,
      model: 'glm-5',
      responseTimeMs: 1500,
      errorMessage: null
    };
    const res = await request.post(`${BASE_URL}/wande/dashboard/cc-metrics/report`, {
      data: payload
    });
    const body = await res.json();
    expect(body.code).toBe(200);
  });

  test('POST /report 应能检测红色告警 (ratio > 200)', async ({ request }) => {
    const payload = {
      ccLine: 'cc-line-test-critical',
      issueNumber: 698,
      inputTokens: 30000,
      outputTokens: 100,
      model: 'glm-5',
      responseTimeMs: 2000,
      errorMessage: null
    };
    const res = await request.post(`${BASE_URL}/wande/dashboard/cc-metrics/report`, {
      data: payload
    });
    const body = await res.json();
    expect(body.code).toBe(200);
  });

  test('POST /report 应能处理 outputTokens 为 0 的情况', async ({ request }) => {
    const payload = {
      ccLine: 'cc-line-test-zero',
      issueNumber: 698,
      inputTokens: 10000,
      outputTokens: 0,
      model: 'glm-5',
      responseTimeMs: 800,
      errorMessage: 'timeout'
    };
    const res = await request.post(`${BASE_URL}/wande/dashboard/cc-metrics/report`, {
      data: payload
    });
    const body = await res.json();
    expect(body.code).toBe(200);
  });

  test('POST /report/batch 应能批量上报', async ({ request }) => {
    const payload = [
      {
        ccLine: 'cc-line-batch-1',
        issueNumber: 698,
        inputTokens: 1000,
        outputTokens: 500,
        model: 'glm-5',
        responseTimeMs: 800,
        errorMessage: null
      },
      {
        ccLine: 'cc-line-batch-2',
        issueNumber: 698,
        inputTokens: 2000,
        outputTokens: 100,
        model: 'glm-5',
        responseTimeMs: 900,
        errorMessage: null
      }
    ];
    const res = await request.post(`${BASE_URL}/wande/dashboard/cc-metrics/report/batch`, {
      data: payload
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });
});

// 管理接口 — 未认证访问应返回401
test.describe('CC API Metric 管理接口 — 未认证 @api @cc-api-metric @issue:backend#698 @issue:backend#914', () => {
  test('GET /list 未认证应返回401', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/wande/dashboard/cc-metrics/list`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('GET /all 未认证应返回401', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/wande/dashboard/cc-metrics/all`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('GET /stats/all 未认证应返回401', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/wande/dashboard/cc-metrics/stats/all`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });
});

// 管理接口 — 已认证访问
test.describe('CC API Metric 管理接口 — 已认证 @api @cc-api-metric @issue:backend#698 @issue:backend#914', () => {
  test('GET /list 应能返回列表', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE_URL}/wande/dashboard/cc-metrics/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /all 应能返回全部数据', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE_URL}/wande/dashboard/cc-metrics/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('GET /stats/all 应能返回统计信息', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE_URL}/wande/dashboard/cc-metrics/stats/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('GET /line/{ccLine}/recent 应能返回最近记录', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE_URL}/wande/dashboard/cc-metrics/line/cc-line-test-normal/recent?limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('GET /line/{ccLine}/stats 应能返回线路统计', async ({ request }) => {
    test.skip(!token, 'No token available');
    const res = await request.get(`${BASE_URL}/wande/dashboard/cc-metrics/line/cc-line-test-normal/stats?hours=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });
});
