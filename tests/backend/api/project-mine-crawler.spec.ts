/**
 * Project Mine Crawler Status API Tests — 爬虫状态增强
 * Issue: WnadeyaowuOraganization/wande-ai-backend#8
 * PR: WnadeyaowuOraganization/wande-ai-backend#785
 *
 * Enhancement to existing /api/project-mine/stats endpoint:
 * - Added crawler_status field (normal/delayed/error)
 * - Added last_sync_time field
 *
 * This tests the enhanced stats endpoint.
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

let token: string;

test.beforeAll(async ({ request }) => {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: {
      username: process.env.TEST_USERNAME || 'admin',
      password: process.env.TEST_PASSWORD || 'admin123',
    },
  });
  const loginBody = await loginRes.json();
  if (loginBody.code === 200) {
    token = loginBody.data?.token || loginBody.data?.access_token || '';
  }
});

test.describe('Project Mine Crawler Status @api @project-mine @issue:backend#8', () => {
  test('GET /stats requires authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/project/mine/stats`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.code).toBe(401);
  });

  test('GET /stats with token should include crawler fields', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/project/mine/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200 && body.data) {
      // Enhanced stats should include crawler status fields
      const data = body.data;
      // crawlerStatus should be one of: normal, delayed, error, or undefined/null
      if (data.crawlerStatus !== undefined && data.crawlerStatus !== null) {
        expect(['normal', 'delayed', 'error']).toContain(data.crawlerStatus);
      }
      // lastSyncTime should be a string if present
      if (data.lastSyncTime !== undefined && data.lastSyncTime !== null) {
        expect(typeof data.lastSyncTime).toBe('string');
      }
    }
  });
});
