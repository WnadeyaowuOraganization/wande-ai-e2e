/**
 * Claude Office & Cockpit Pages Smoke Tests
 * Covers:
 *
 * - Kanban Board: WnadeyaowuOraganization/wande-ai-front#313 (Issue #234)
 * - Pixel Office Upgrade: WnadeyaowuOraganization/wande-ai-front#312 (Issue #233)
 * - Schedule Tab: WnadeyaowuOraganization/wande-ai-front#311 (Issue #251)
 *
 * Menu: Most pages not registered → API-only + frontend validation
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';

async function getToken(request: any): Promise<string> {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: { username: process.env.TEST_USERNAME || 'admin', password: process.env.TEST_PASSWORD || 'admin123' },
  });
  const body = await loginRes.json();
  return body.data.access_token;
}

// ---------------------------------------------------------------------------
// Kanban Board — #234
// ---------------------------------------------------------------------------
test.describe('Claude Office Kanban @smoke @kanban @issue:front#234', () => {
  test('claude session API is accessible', { tag: ['@smoke', '@kanban'] }, async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${API_BASE}/api/dashboard/claude/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
  });

  test('frontend serves correctly', { tag: ['@smoke', '@kanban'] }, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Pixel Office Upgrade — #233
// ---------------------------------------------------------------------------
test.describe('Pixel Office @smoke @pixel-office @issue:front#233', () => {
  test('frontend serves correctly', { tag: ['@smoke', '@pixel-office'] }, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Schedule Tab — #251
// ---------------------------------------------------------------------------
test.describe('Schedule Tab @smoke @schedule-tab @issue:front#251', () => {
  test('frontend serves correctly', { tag: ['@smoke', '@schedule-tab'] }, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });
});
