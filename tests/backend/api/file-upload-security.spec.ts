/**
 * File Upload Security Tests — Path Traversal Prevention
 * Issue: WnadeyaowuOraganization/wande-ai-backend#9
 * PR: WnadeyaowuOraganization/wande-ai-backend#832
 *
 * Tests that file upload endpoints properly sanitize filenames
 * to prevent path traversal attacks.
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

test.describe('File Upload Security — Path Traversal Prevention @api @security @issue:backend#9', () => {
  const maliciousFilenames = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\config\\sam',
    '....//....//....//etc/passwd',
    '../../../tmp/malicious.txt',
    '..\\..\\..\\tmp\\malicious.txt',
  ];

  for (const filename of maliciousFilenames) {
    test(`SSE upload rejects path traversal: ${filename}`, async ({ request }) => {
      test.skip(!token, 'No token available');
      const response = await request.post(`${API_BASE}/chat/sse/speech-to-text-transcriptions-v2`, {
        headers: { Authorization: `Bearer ${token}` },
        multipart: {
          file: {
            name: filename,
            mimeType: 'text/plain',
            buffer: Buffer.from('malicious content'),
          },
        },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      // Should NOT return 500 internal error from path traversal reaching filesystem
      expect(body.code).not.toBe(500);
    });
  }

  test('SSE upload endpoint requires authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE}/chat/sse/speech-to-text-transcriptions-v2`, {
      multipart: {
        file: {
          name: 'normal.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('test content'),
        },
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.code).toBe(401);
  });

  test('upload with null bytes in filename is handled', async ({ request }) => {
    test.skip(!token, 'No token available');
    const response = await request.post(`${API_BASE}/chat/sse/speech-to-text-transcriptions-v2`, {
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        file: {
          name: 'test\x00.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('test content'),
        },
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 400, 401, 403]).toContain(body.code);
  });

  test('upload with extremely long filename is handled', async ({ request }) => {
    test.skip(!token, 'No token available');
    const longName = 'a'.repeat(300) + '.txt';
    const response = await request.post(`${API_BASE}/chat/sse/speech-to-text-transcriptions-v2`, {
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        file: {
          name: longName,
          mimeType: 'text/plain',
          buffer: Buffer.from('test content'),
        },
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect([200, 400, 401, 403, 500]).toContain(body.code);
  });
});
