import { test, expect } from '@playwright/test';

/**
 * DORA四指标API测试
 * Issue: backend#885
 * PR: #908
 */

test.describe('DORA四指标API', () => {
  const baseURL = 'http://localhost:6040';
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${baseURL}/auth/login`, {
      data: { username: 'admin', password: 'admin123' }
    });
    const loginBody = await loginRes.json();
    authToken = loginBody.data?.token || loginBody.token;
  });

  test('GET /dora/summary - 获取DORA汇总数据', async ({ request }) => {
    const response = await request.get(`${baseURL}/dora/summary`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
    // DORA四指标: 部署频率、变更前置时间、变更失败率、恢复时间
    expect(body.data.deploymentFrequency).toBeDefined();
    expect(body.data.leadTimeForChanges).toBeDefined();
    expect(body.data.changeFailureRate).toBeDefined();
    expect(body.data.timeToRestore).toBeDefined();
  });

  test('GET /dora/trend - 获取DORA趋势数据', async ({ request }) => {
    const response = await request.get(`${baseURL}/dora/trend?days=30`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBeTruthy();
  });

  test('GET /dora/breakdown - 获取DORA拆分数据', async ({ request }) => {
    const response = await request.get(`${baseURL}/dora/breakdown?groupBy=repo`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
  });

  test('GET /dora/level - 获取DORA等级评估', async ({ request }) => {
    const response = await request.get(`${baseURL}/dora/level`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const body = await response.json();

    expect(body.code).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.level).toBeDefined(); // Elite/High/Medium/Low
  });
});
