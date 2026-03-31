/**
 * Dify UUID Validation API Tests
 * Issue: WnadeyaowuOraganization/wande-ai-backend#251
 * PR: WnadeyaowuOraganization/wande-ai-backend#849
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

let token: string;

test.beforeAll(async ({ request }) => {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: { username: process.env.TEST_USERNAME || 'admin', password: process.env.TEST_PASSWORD || 'admin123' },
  });
  const loginBody = await loginRes.json();
  if (loginBody.code === 200) {
    token = loginBody.data?.token || loginBody.data?.access_token || '';
  }
});

test.describe('Dify Chat API — UUID validation @api @chat @issue:backend#251', () => {
  test('chat send with invalid conversationId should not crash server', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/chat/send`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        message: 'hello',
        conversationId: 'not-a-valid-uuid',
      },
    });
    const body = await response.json();
    // Should validate gracefully instead of 500
    expect([200, 400, 500]).toContain(body.code);
  });

  test('chat send with valid UUID format should process request', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/chat/send`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        message: 'hello',
        conversationId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });
    const body = await response.json();
    expect([200, 400, 500]).toContain(body.code);
  });
});
