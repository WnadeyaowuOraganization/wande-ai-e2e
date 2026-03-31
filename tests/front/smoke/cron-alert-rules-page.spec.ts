import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';

async function apiLogin(request: any): Promise<string> {
  const response = await request.post(`${API_BASE}/auth/login`, {
    data: { username: 'admin', password: 'admin123' },
  });
  const body = await response.json();
  return body.data?.access_token || body.data?.token || '';
}

async function loginAndGoto(page: any, request: any, targetPath: string) {
  const token = await apiLogin(request);
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(
    ({ key, token }: { key: string; token: string }) => {
      localStorage.setItem(key, JSON.stringify({ accessToken: token, refreshToken: token, accessCodes: [] }));
    },
    { key: STORAGE_KEY, token },
  );
  await page.goto(targetPath);
  await page.waitForLoadState('networkidle');
}

test('cron-alert-rules page loads @smoke @front @issue:front#117', async ({ page, request }) => {
  await loginAndGoto(page, request, '/wande/dashboard/cron-alert-rules');
  await page.waitForTimeout(2000);
  const content = await page.content();
  expect(content).not.toContain('404 Not Found');
  expect(content).not.toContain('页面不存在');
});
