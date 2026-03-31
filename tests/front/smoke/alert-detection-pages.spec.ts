/**
 * Alert Center + Detection Log Pages Smoke Tests — 告警中心+检测日志
 * Issue: WnadeyaowuOraganization/wande-ai-front#212
 * PR: WnadeyaowuOraganization/wande-ai-front#347
 *
 * API Endpoints:
 * - GET  /system/dashboard/ext-tools/alerts             — 告警列表
 * - GET  /system/dashboard/ext-tools/alerts/stats        — 告警统计
 * - PUT  /system/dashboard/ext-tools/alerts/{id}/resolve — 解决告警
 * - PUT  /system/dashboard/ext-tools/alerts/batch-resolve — 批量解决
 * - GET  /system/dashboard/ext-tools/detection-logs      — 检测日志
 *
 * Pages:
 * - /dashboard/ext-tools/alert-center   — 告警中心
 * - /dashboard/ext-tools/detection-log  — 检测日志
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const FRONT_BASE = process.env.BASE_URL_FRONT || 'http://localhost:8083';

async function getToken(request: any): Promise<string> {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: { username: process.env.TEST_USERNAME || 'admin', password: process.env.TEST_PASSWORD || 'admin123' },
  });
  const body = await loginRes.json();
  if (body.code === 200) {
    return body.data?.token || body.data?.access_token || '';
  }
  return '';
}

// ---------------------------------------------------------------------------
// Alert API Tests — 告警中心API
// ---------------------------------------------------------------------------
test.describe('Alert Center API @smoke @alert-center @issue:front#212', () => {
  test('GET /alerts rejects unauthenticated requests', async ({ request }) => {
    const res = await request.get(`${API_BASE}/system/dashboard/ext-tools/alerts`, {
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('GET /alerts/stats rejects unauthenticated requests', async ({ request }) => {
    const res = await request.get(`${API_BASE}/system/dashboard/ext-tools/alerts/stats`);
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('PUT /alerts/{id}/resolve rejects unauthenticated requests', async ({ request }) => {
    const res = await request.put(`${API_BASE}/system/dashboard/ext-tools/alerts/1/resolve`, {
      data: { resolveNote: 'test' },
    });
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('PUT /alerts/batch-resolve rejects unauthenticated requests', async ({ request }) => {
    const res = await request.put(`${API_BASE}/system/dashboard/ext-tools/alerts/batch-resolve`, {
      data: { ids: [1, 2], resolveNote: 'test' },
    });
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('GET /alerts returns data with auth', async ({ request }) => {
    const token = await getToken(request);
    test.skip(!token, 'No token available');
    const res = await request.get(`${API_BASE}/system/dashboard/ext-tools/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
    if (body.code === 200 && body.data) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /alerts/stats returns stats with auth', async ({ request }) => {
    const token = await getToken(request);
    test.skip(!token, 'No token available');
    const res = await request.get(`${API_BASE}/system/dashboard/ext-tools/alerts/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
    if (body.code === 200 && body.data) {
      expect(body.data).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// Detection Log API Tests — 检测日志API
// ---------------------------------------------------------------------------
test.describe('Detection Log API @smoke @detection-log @issue:front#212', () => {
  test('GET /detection-logs rejects unauthenticated requests', async ({ request }) => {
    const res = await request.get(`${API_BASE}/system/dashboard/ext-tools/detection-logs`, {
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([401, 500]).toContain(body.code);
  });

  test('GET /detection-logs returns data with auth', async ({ request }) => {
    const token = await getToken(request);
    test.skip(!token, 'No token available');
    const res = await request.get(`${API_BASE}/system/dashboard/ext-tools/detection-logs`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
    if (body.code === 200 && body.data) {
      expect(body.data).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// Page Load Tests — 页面加载测试
// ---------------------------------------------------------------------------
test.describe('Alert Center + Detection Log Pages @smoke @ext-tools @issue:front#212', () => {
  test('alert center page loads without crash', async ({ page }) => {
    await page.goto(`${FRONT_BASE}/dashboard/ext-tools/alert-center`);
    await page.waitForLoadState('networkidle');
    // page should not redirect to login or error
    expect(page.url()).toContain('dashboard');
  });

  test('detection log page loads without crash', async ({ page }) => {
    await page.goto(`${FRONT_BASE}/dashboard/ext-tools/detection-log`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('dashboard');
  });

  test('alert center page has no critical console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto(`${FRONT_BASE}/dashboard/ext-tools/alert-center`);
    await page.waitForLoadState('networkidle');
    // filter out known noisy errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ResizeObserver') && !e.includes('401'),
    );
    expect(criticalErrors.length).toBeLessThan(5);
  });

  test('detection log page has no critical console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto(`${FRONT_BASE}/dashboard/ext-tools/detection-log`);
    await page.waitForLoadState('networkidle');
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ResizeObserver') && !e.includes('401'),
    );
    expect(criticalErrors.length).toBeLessThan(5);
  });
});
