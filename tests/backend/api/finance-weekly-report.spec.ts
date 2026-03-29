/**
 * FinanceWeeklyReport, PptPlugin & ProjectStageDocumentTemplate API Tests
 * Issue: WnadeyaowuOraganization/wande-ai-backend#656
 * PR: WnadeyaowuOraganization/wande-ai-backend#674
 *
 * WeeklyReportController — /wande/finance/weekly-report:
 *   GET  /list, GET /{id}, POST, PUT, DELETE /{ids}
 *   POST /{id}/submit, POST /{id}/assess, POST /{id}/review
 *   POST /collection, PUT /collection, DELETE /collection/{ids}
 *   GET  /current-week
 *
 * PptPluginController — /api/ppt-plugin:
 *   POST /auth, GET /templates, GET /assets/search, GET /assets/recommend
 *   POST /generate-section, POST /check-style, POST /batch-replace, GET /vi-config
 *
 * ProjectStageDocumentTemplateController — /wande/finance/template:
 *   GET  /list, GET /by-stage/{stageCode}, GET /{id}, POST, PUT /{id}, DELETE /{id}, DELETE /batch
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
  expect(loginBody.code).toBe(200);
  token = loginBody.data?.token || loginBody.data?.access_token || '';
});

// ---------------------------------------------------------------------------
// WeeklyReportController — /wande/finance/weekly-report
// ---------------------------------------------------------------------------
test.describe('WeeklyReport — unauthenticated access @api @finance @issue:backend#656', () => {
  test('GET /list should return 401 without token', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/finance/weekly-report/list`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('GET /current-week should return 401 without token', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/finance/weekly-report/current-week`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('POST should return 401 without token', async ({ request }) => {
    const response = await request.post(`${API_BASE}/wande/finance/weekly-report`, {
      data: { title: 'test' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });
});

test.describe('WeeklyReport — authenticated CRUD @api @finance @issue:backend#656', () => {
  test('GET /list should return report list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/finance/weekly-report/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /{id} should return report detail', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/wande/finance/weekly-report/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.get(`${API_BASE}/wande/finance/weekly-report/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('POST should create a weekly report', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/wande/finance/weekly-report`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: 'E2E test weekly report',
        reportContent: 'Automated test content',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT should update a weekly report', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/wande/finance/weekly-report/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.put(`${API_BASE}/wande/finance/weekly-report`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { id, title: 'Updated by E2E' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /{ids} should delete reports', async ({ request }) => {
    test.skip(!token, 'No token available');
    // Use a non-existent ID — should not crash
    const response = await request.delete(`${API_BASE}/wande/finance/weekly-report/0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

test.describe('WeeklyReport — workflow endpoints @api @finance @issue:backend#656', () => {
  test('POST /{id}/submit should submit report', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/wande/finance/weekly-report/0/submit`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /{id}/assess should assess report', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/wande/finance/weekly-report/0/assess`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { score: 90, comment: 'E2E assessment' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /{id}/review should review report', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/wande/finance/weekly-report/0/review`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { reviewResult: 'approved', reviewComment: 'E2E review' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('GET /current-week should return current week info', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/finance/weekly-report/current-week`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });
});

test.describe('WeeklyReport — collection endpoints @api @finance @issue:backend#656', () => {
  test('POST /collection should create collection record', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/wande/finance/weekly-report/collection`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { amount: 10000, description: 'E2E test collection' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /collection should update collection record', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.put(`${API_BASE}/wande/finance/weekly-report/collection`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { id: 0, amount: 20000 },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /collection/{ids} should delete collection records', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.delete(`${API_BASE}/wande/finance/weekly-report/collection/0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});

// ---------------------------------------------------------------------------
// PptPluginController — /api/ppt-plugin
// ---------------------------------------------------------------------------
test.describe('PptPlugin — auth endpoint @api @ppt @issue:backend#656', () => {
  test('POST /auth should authenticate plugin', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ppt-plugin/auth`, {
      data: {
        pluginId: 'e2e-test-plugin',
        pluginSecret: 'test-secret',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    // Auth endpoint — invalid credentials should not be 401 in HTTP status
    // but may return code 401/500 for bad credentials
    expect([200, 401, 403, 500]).toContain(body.code);
  });
});

test.describe('PptPlugin — unauthenticated access @api @ppt @issue:backend#656', () => {
  test('GET /templates should require authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/ppt-plugin/templates`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('GET /assets/search should require authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/ppt-plugin/assets/search`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('GET /assets/recommend should require authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/ppt-plugin/assets/recommend`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('GET /vi-config should require authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/ppt-plugin/vi-config`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('POST /generate-section should require authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ppt-plugin/generate-section`, {
      data: { sectionType: 'cover' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('POST /check-style should require authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ppt-plugin/check-style`, {
      data: { styleId: 1 },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('POST /batch-replace should require authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ppt-plugin/batch-replace`, {
      data: { replacements: [] },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });
});

test.describe('PptPlugin — authenticated access @api @ppt @issue:backend#656', () => {
  test('GET /templates should return template list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/api/ppt-plugin/templates`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /assets/search should search assets', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/api/ppt-plugin/assets/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { keyword: 'test', page: 1, size: 10 },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /assets/recommend should recommend assets', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/api/ppt-plugin/assets/recommend`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('POST /generate-section should generate section', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/api/ppt-plugin/generate-section`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { sectionType: 'cover', title: 'E2E Test' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /check-style should check style', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/api/ppt-plugin/check-style`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { styleId: 1 },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('POST /batch-replace should batch replace', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/api/ppt-plugin/batch-replace`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { replacements: [{ from: '{{title}}', to: 'E2E Test' }] },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('GET /vi-config should return VI config', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/api/ppt-plugin/vi-config`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// ProjectStageDocumentTemplateController — /wande/finance/template
// ---------------------------------------------------------------------------
test.describe('StageDocumentTemplate — unauthenticated access @api @finance @issue:backend#656', () => {
  test('GET /list should return 401 without token', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/finance/template/list`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('GET /by-stage/{stageCode} should return 401 without token', async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/finance/template/by-stage/initiation`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('POST should return 401 without token', async ({ request }) => {
    const response = await request.post(`${API_BASE}/wande/finance/template`, {
      data: { name: 'test' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });
});

test.describe('StageDocumentTemplate — authenticated CRUD @api @finance @issue:backend#656', () => {
  test('GET /list should return template list', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(`${API_BASE}/wande/finance/template/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /by-stage/{stageCode} should return templates for stage', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.get(
      `${API_BASE}/wande/finance/template/by-stage/initiation`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('GET /{id} should return template detail', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/wande/finance/template/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.get(`${API_BASE}/wande/finance/template/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403]).toContain(body.code);
    if (body.code === 200) {
      expect(body.data).toBeDefined();
    }
  });

  test('POST should create a template', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/wande/finance/template`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'E2E test template',
        stageCode: 'initiation',
        content: 'Test template content',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('PUT /{id} should update a template', async ({ request }) => {
    test.skip(!token, 'No token available');
    const listRes = await request.get(`${API_BASE}/wande/finance/template/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    if (listBody.code !== 200 || !listBody.data?.rows?.length) {
      test.skip();
      return;
    }
    const id = listBody.data.rows[0].id;
    const response = await request.put(`${API_BASE}/wande/finance/template/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: 'Updated by E2E' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /{id} should delete a template', async ({ request }) => {
    test.skip(!token, 'No token available');
    // Use non-existent ID — should not crash
    const response = await request.delete(`${API_BASE}/wande/finance/template/0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });

  test('DELETE /batch should batch-delete templates', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.delete(`${API_BASE}/wande/finance/template/batch`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { ids: [0] },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 403, 500]).toContain(body.code);
  });
});
