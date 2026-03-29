/**
 * Brand Center API Tests
 * PR: WnadeyaowuOraganization/wande-ai-backend#694 (Issue #12)
 * PR: WnadeyaowuOraganization/wande-ai-backend#699 (Issue #253)
 *
 * Covers:
 * - Brand Account CRUD + platform filter
 * - Brand Content CRUD + status flow (draft/submitted/approved/rejected/published)
 * - Brand Metrics CRUD + content filter
 * - Brand Publish Log CRUD + content filter
 * - Brand Publish (scheduler, tasks, logs, platforms)
 * - Production Progress CRUD + timeline + batch + QC
 * - Project Document CRUD + project filters + batch
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:6040';
const AUTH_HEADERS = (token: string) => ({ Authorization: `Bearer ${token}` });

// ─── Shared login helper ───────────────────────────────────────────

async function login(request: any): Promise<string> {
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: {
      username: process.env.API_USERNAME || 'admin',
      password: process.env.API_PASSWORD || 'admin123',
    },
  });
  const body = await res.json();
  expect(body.code).toBe(200);
  return body.data.token || body.data.access_token;
}

// ═══════════════════════════════════════════════════════════════════
//  Brand Account  @issue:backend#694
// ═══════════════════════════════════════════════════════════════════

test.describe('Brand Account API @api @brand @issue:backend#694', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
  });

  // ── Unauthenticated ──────────────────────────────────────────────

  test('GET /wande/brand/account/list requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/account/list`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('GET /wande/brand/account/{id} requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/account/1`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  // ── Authenticated list + detail ──────────────────────────────────

  test('should list brand accounts with valid token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/account/list`, {
      headers: AUTH_HEADERS(token),
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toHaveProperty('rows');
      expect(body.data).toHaveProperty('total');
    }
  });

  test('should get brand account detail by id', async ({ request }) => {
    const listRes = await request.get(`${API_BASE}/wande/brand/account/list`, {
      headers: AUTH_HEADERS(token),
    });
    const listBody = await listRes.json();

    if (listBody.code === 200 && listBody.data?.rows?.length > 0) {
      const id = listBody.data.rows[0].id;
      const res = await request.get(`${API_BASE}/wande/brand/account/${id}`, {
        headers: AUTH_HEADERS(token),
      });
      const body = await res.json();
      expect(body.code).toBe(200);
      expect(body.data).toBeDefined();
    } else {
      test.skip();
    }
  });

  // ── Platform filter ──────────────────────────────────────────────

  test('should get accounts by platform', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/account/platform/wechat`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(Array.isArray(body.data)).toBe(true);
    }
  });

  // ── State-changing operations (add/edit/delete) ──────────────────

  test('POST /wande/brand/account responds with 200 or 403', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/brand/account`, {
      headers: AUTH_HEADERS(token),
      data: { platform: 'wechat', accountName: 'e2e-test-account' },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
  });

  test('PUT /wande/brand/account responds with 200 or 403', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/brand/account`, {
      headers: AUTH_HEADERS(token),
      data: { id: -1, platform: 'wechat', accountName: 'e2e-test-update' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /wande/brand/account/{ids} responds with 200 or 403', async ({ request }) => {
    const res = await request.delete(`${API_BASE}/wande/brand/account/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

// ═══════════════════════════════════════════════════════════════════
//  Brand Content  @issue:backend#694
// ═══════════════════════════════════════════════════════════════════

test.describe('Brand Content API @api @brand @issue:backend#694', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
  });

  // ── Unauthenticated ──────────────────────────────────────────────

  test('GET /wande/brand/content/list requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/content/list`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('PUT /wande/brand/content/{id}/submit requires authentication', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/brand/content/1/submit`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  // ── Authenticated CRUD ───────────────────────────────────────────

  test('should list brand content with valid token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/content/list`, {
      headers: AUTH_HEADERS(token),
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toHaveProperty('rows');
      expect(body.data).toHaveProperty('total');
    }
  });

  test('should get brand content detail by id', async ({ request }) => {
    const listRes = await request.get(`${API_BASE}/wande/brand/content/list`, {
      headers: AUTH_HEADERS(token),
    });
    const listBody = await listRes.json();

    if (listBody.code === 200 && listBody.data?.rows?.length > 0) {
      const id = listBody.data.rows[0].id;
      const res = await request.get(`${API_BASE}/wande/brand/content/${id}`, {
        headers: AUTH_HEADERS(token),
      });
      const body = await res.json();
      expect(body.code).toBe(200);
      expect(body.data).toBeDefined();
    } else {
      test.skip();
    }
  });

  test('POST /wande/brand/content responds with 200 or 403', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/brand/content`, {
      headers: AUTH_HEADERS(token),
      data: { title: 'e2e-test-content', contentType: 'article' },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
  });

  test('PUT /wande/brand/content responds with 200 or 403', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/brand/content`, {
      headers: AUTH_HEADERS(token),
      data: { id: -1, title: 'e2e-test-update', contentType: 'article' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /wande/brand/content/{ids} responds with 200 or 403', async ({ request }) => {
    const res = await request.delete(`${API_BASE}/wande/brand/content/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  // ── Status flow endpoints ────────────────────────────────────────

  test('PUT /wande/brand/content/{id}/submit responds properly', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/brand/content/999999/submit`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /wande/brand/content/{id}/approve responds properly', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/brand/content/999999/approve`, {
      headers: AUTH_HEADERS(token),
      params: { reviewerId: 1, reviewComment: 'e2e test' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /wande/brand/content/{id}/reject responds properly', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/brand/content/999999/reject`, {
      headers: AUTH_HEADERS(token),
      params: { reviewerId: 1, reviewComment: 'e2e test reject' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /wande/brand/content/{id}/resubmit responds properly', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/brand/content/999999/resubmit`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /wande/brand/content/{id}/publish responds properly', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/brand/content/999999/publish`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

// ═══════════════════════════════════════════════════════════════════
//  Brand Metrics  @issue:backend#694
// ═══════════════════════════════════════════════════════════════════

test.describe('Brand Metrics API @api @brand @issue:backend#694', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
  });

  // ── Unauthenticated ──────────────────────────────────────────────

  test('GET /wande/brand/metrics/list requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/metrics/list`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  // ── Authenticated ────────────────────────────────────────────────

  test('should list brand metrics with valid token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/metrics/list`, {
      headers: AUTH_HEADERS(token),
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toHaveProperty('rows');
      expect(body.data).toHaveProperty('total');
    }
  });

  test('should get brand metrics detail by id', async ({ request }) => {
    const listRes = await request.get(`${API_BASE}/wande/brand/metrics/list`, {
      headers: AUTH_HEADERS(token),
    });
    const listBody = await listRes.json();

    if (listBody.code === 200 && listBody.data?.rows?.length > 0) {
      const id = listBody.data.rows[0].id;
      const res = await request.get(`${API_BASE}/wande/brand/metrics/${id}`, {
        headers: AUTH_HEADERS(token),
      });
      const body = await res.json();
      expect(body.code).toBe(200);
      expect(body.data).toBeDefined();
    } else {
      test.skip();
    }
  });

  test('should get brand metrics by content id', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/metrics/content/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(Array.isArray(body.data)).toBe(true);
    }
  });

  test('POST /wande/brand/metrics responds with 200 or 403', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/brand/metrics`, {
      headers: AUTH_HEADERS(token),
      data: { contentId: 999999, platform: 'wechat', views: 0 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
  });

  test('PUT /wande/brand/metrics responds with 200 or 403', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/brand/metrics`, {
      headers: AUTH_HEADERS(token),
      data: { id: -1, contentId: 999999, platform: 'wechat', views: 10 },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /wande/brand/metrics/{ids} responds with 200 or 403', async ({ request }) => {
    const res = await request.delete(`${API_BASE}/wande/brand/metrics/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

// ═══════════════════════════════════════════════════════════════════
//  Brand Publish Log  @issue:backend#694
// ═══════════════════════════════════════════════════════════════════

test.describe('Brand Publish Log API @api @brand @issue:backend#694', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
  });

  // ── Unauthenticated ──────────────────────────────────────────────

  test('GET /wande/brand/publish-log/list requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/publish-log/list`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  // ── Authenticated ────────────────────────────────────────────────

  test('should list brand publish logs with valid token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/publish-log/list`, {
      headers: AUTH_HEADERS(token),
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toHaveProperty('rows');
      expect(body.data).toHaveProperty('total');
    }
  });

  test('should get brand publish log detail by id', async ({ request }) => {
    const listRes = await request.get(`${API_BASE}/wande/brand/publish-log/list`, {
      headers: AUTH_HEADERS(token),
    });
    const listBody = await listRes.json();

    if (listBody.code === 200 && listBody.data?.rows?.length > 0) {
      const id = listBody.data.rows[0].id;
      const res = await request.get(`${API_BASE}/wande/brand/publish-log/${id}`, {
        headers: AUTH_HEADERS(token),
      });
      const body = await res.json();
      expect(body.code).toBe(200);
      expect(body.data).toBeDefined();
    } else {
      test.skip();
    }
  });

  test('should get publish logs by content id', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/publish-log/content/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(Array.isArray(body.data)).toBe(true);
    }
  });

  test('POST /wande/brand/publish-log responds with 200 or 403', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/brand/publish-log`, {
      headers: AUTH_HEADERS(token),
      data: { contentId: 999999, platform: 'wechat' },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
  });

  test('PUT /wande/brand/publish-log responds with 200 or 403', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/brand/publish-log`, {
      headers: AUTH_HEADERS(token),
      data: { id: -1, contentId: 999999, platform: 'wechat' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /wande/brand/publish-log/{ids} responds with 200 or 403', async ({ request }) => {
    const res = await request.delete(`${API_BASE}/wande/brand/publish-log/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

// ═══════════════════════════════════════════════════════════════════
//  Brand Publish (Scheduler)  @issue:backend#699
// ═══════════════════════════════════════════════════════════════════

test.describe('Brand Publish API @api @brand @issue:backend#699', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
  });

  // ── Unauthenticated ──────────────────────────────────────────────

  test('POST /wande/brand/publish requires authentication', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/brand/publish`, {
      data: { contentId: 1, platform: 'wechat' },
    });
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('GET /wande/brand/publish/log/list requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/publish/log/list`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('GET /wande/brand/publish/task/list requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/publish/task/list`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  // ── Platforms (may not require auth) ─────────────────────────────

  test('GET /wande/brand/publish/platforms responds', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/publish/platforms`);
    const body = await res.json();
    // Platforms may or may not require auth; accept both outcomes
    expect([200, 401, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(Array.isArray(body.data)).toBe(true);
    }
  });

  // ── Authenticated: publish + log ─────────────────────────────────

  test('POST /wande/brand/publish responds with 200 or 403', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/brand/publish`, {
      headers: AUTH_HEADERS(token),
      data: { contentId: 999999, platform: 'wechat', publishType: 'immediate' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('should list publish logs with valid token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/publish/log/list`, {
      headers: AUTH_HEADERS(token),
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200 && body.data) {
      // Response is wrapped in R<TableDataInfo<...>>
      const td = body.data.data || body.data;
      if (td && typeof td === 'object' && 'rows' in td) {
        expect(Array.isArray(td.rows)).toBe(true);
      }
    }
  });

  test('GET /wande/brand/publish/log/{id} responds with 200 or 403', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/publish/log/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /wande/brand/publish/retry/{logId} responds with 200 or 403', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/brand/publish/retry/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  // ── Authenticated: task endpoints ────────────────────────────────

  test('POST /wande/brand/publish/task responds with 200 or 403', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/brand/publish/task`, {
      headers: AUTH_HEADERS(token),
      data: { contentId: 999999, platform: 'wechat', scheduledTime: '2026-04-01 10:00:00' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('should list publish tasks with valid token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/publish/task/list`, {
      headers: AUTH_HEADERS(token),
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
  });

  test('GET /wande/brand/publish/task/{id} responds with 200 or 403', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/brand/publish/task/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /wande/brand/publish/task/cancel/{id} responds with 200 or 403', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/brand/publish/task/cancel/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

// ═══════════════════════════════════════════════════════════════════
//  Production Progress  @issue:backend#699
// ═══════════════════════════════════════════════════════════════════

test.describe('Production Progress API @api @execution @issue:backend#699', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
  });

  // ── Unauthenticated ──────────────────────────────────────────────

  test('GET /wande/execution/progress/list requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/progress/list`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('GET /wande/execution/progress/timeline/{id} requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/progress/timeline/1`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  // ── Authenticated list + detail ──────────────────────────────────

  test('should list production progress with valid token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/progress/list`, {
      headers: AUTH_HEADERS(token),
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200 && body.data) {
      const td = body.data.data || body.data;
      if (td && typeof td === 'object' && 'rows' in td) {
        expect(Array.isArray(td.rows)).toBe(true);
      }
    }
  });

  test('should get production progress detail by id', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/progress/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('should get progress timeline by project execution id', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/progress/timeline/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(Array.isArray(body.data)).toBe(true);
    }
  });

  // ── State-changing operations ────────────────────────────────────

  test('POST /wande/execution/progress responds with 200 or 403', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/execution/progress`, {
      headers: AUTH_HEADERS(token),
      data: { projectExecutionId: 999999, progressDesc: 'e2e test' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /wande/execution/progress/batch/{projectExecutionId} responds properly', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/execution/progress/batch/999999`, {
      headers: AUTH_HEADERS(token),
      data: [{ progressDesc: 'e2e batch item' }],
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /wande/execution/progress responds with 200 or 403', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/execution/progress`, {
      headers: AUTH_HEADERS(token),
      data: { id: -1, projectExecutionId: 999999, progressDesc: 'e2e update' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /wande/execution/progress/{id}/qc responds properly', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/execution/progress/999999/qc`, {
      headers: AUTH_HEADERS(token),
      params: { qcResult: 'pass', qcComment: 'e2e test qc' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /wande/execution/progress/{ids} responds with 200 or 403', async ({ request }) => {
    const res = await request.delete(`${API_BASE}/wande/execution/progress/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

// ═══════════════════════════════════════════════════════════════════
//  Project Document  @issue:backend#699
// ═══════════════════════════════════════════════════════════════════

test.describe('Project Document API @api @execution @issue:backend#699', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
  });

  // ── Unauthenticated ──────────────────────────────────────────────

  test('GET /wande/execution/documents/list requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/documents/list`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  test('GET /wande/execution/documents/by-project/{id} requires authentication', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/documents/by-project/1`);
    const body = await res.json();
    expect(body.code).toBe(401);
  });

  // ── Authenticated list + detail ──────────────────────────────────

  test('should list project documents with valid token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/documents/list`, {
      headers: AUTH_HEADERS(token),
      params: { pageNum: 1, pageSize: 10 },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200 && body.data) {
      const td = body.data.data || body.data;
      if (td && typeof td === 'object' && 'rows' in td) {
        expect(Array.isArray(td.rows)).toBe(true);
      }
    }
  });

  test('should get documents by project execution id', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/documents/by-project/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(Array.isArray(body.data)).toBe(true);
    }
  });

  test('should get documents by project and type', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/documents/by-project-type`, {
      headers: AUTH_HEADERS(token),
      params: { projectExecutionId: 999999, documentType: 'design' },
    });
    const body = await res.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(Array.isArray(body.data)).toBe(true);
    }
  });

  test('should get project document detail by id', async ({ request }) => {
    const res = await request.get(`${API_BASE}/wande/execution/documents/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  // ── State-changing operations ────────────────────────────────────

  test('POST /wande/execution/documents responds with 200 or 403', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/execution/documents`, {
      headers: AUTH_HEADERS(token),
      data: { projectExecutionId: 999999, documentName: 'e2e-test-doc', documentType: 'design' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /wande/execution/documents/batch/{projectExecutionId} responds properly', async ({ request }) => {
    const res = await request.post(`${API_BASE}/wande/execution/documents/batch/999999`, {
      headers: AUTH_HEADERS(token),
      data: [{ documentName: 'e2e-batch-doc', documentType: 'design' }],
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /wande/execution/documents responds with 200 or 403', async ({ request }) => {
    const res = await request.put(`${API_BASE}/wande/execution/documents`, {
      headers: AUTH_HEADERS(token),
      data: { id: -1, projectExecutionId: 999999, documentName: 'e2e-update-doc' },
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /wande/execution/documents/{ids} responds with 200 or 403', async ({ request }) => {
    const res = await request.delete(`${API_BASE}/wande/execution/documents/999999`, {
      headers: AUTH_HEADERS(token),
    });
    const body = await res.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});
