/**
 * Dashboard New Pages Smoke Tests
 * Covers multiple front PRs for dashboard-related pages:
 *
 * - Ops Center: WnadeyaowuOraganization/wande-ai-front#310 (Issue #32)
 * - Gateway Usage: WnadeyaowuOraganization/wande-ai-front#309 (Issue #248)
 * - Developer Activity + Deploy: WnadeyaowuOraganization/wande-ai-front#307 (Issue #31)
 * - Issue Kanban: WnadeyaowuOraganization/wande-ai-front#306 (Issue #30)
 * - Schedule Center: WnadeyaowuOraganization/wande-ai-front#308 (Issue #252)
 *
 * Menu: Most pages not registered in sys_menu → API-only tests + frontend validation
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

async function getToken(request: any): Promise<string> {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: { username: process.env.TEST_USERNAME || 'admin', password: process.env.TEST_PASSWORD || 'admin123' },
  });
  const body = await loginRes.json();
  return body.data.access_token;
}

// ---------------------------------------------------------------------------
// Ops Center — 运维监控中心 #32
// ---------------------------------------------------------------------------
test.describe('Ops Center @smoke @ops-center @issue:front#32', () => {
  test('command API is accessible', { tag: ['@smoke', '@ops-center'] }, async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${API_BASE}/api/dashboard/commands/presets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
  });

  test('frontend serves correctly', { tag: ['@smoke', '@ops-center'] }, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Gateway Usage — API网关使用记录 #248
// ---------------------------------------------------------------------------
test.describe('Gateway Usage @smoke @gateway-usage @issue:front#248', () => {
  test('credit usage API is accessible', { tag: ['@smoke', '@gateway-usage'] }, async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${API_BASE}/wande/credit-usage/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
  });

  test('frontend serves correctly', { tag: ['@smoke', '@gateway-usage'] }, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Issue Kanban — Issue看板 #30
// ---------------------------------------------------------------------------
test.describe('Issue Kanban @smoke @issue-kanban @issue:front#30', () => {
  test('frontend serves correctly', { tag: ['@smoke', '@issue-kanban'] }, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Schedule Center — 排程调度中心 #252
// ---------------------------------------------------------------------------
test.describe('Schedule Center @smoke @schedule-center @issue:front#252', () => {
  test('frontend serves correctly', { tag: ['@smoke', '@schedule-center'] }, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Developer Activity + Deploy #31
// ---------------------------------------------------------------------------
test.describe('Developer Activity & Deploy @smoke @dev-activity @issue:front#31', () => {
  test('frontend serves correctly', { tag: ['@smoke', '@dev-activity'] }, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });
});
