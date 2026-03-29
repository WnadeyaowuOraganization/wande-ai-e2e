import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';

async function loginAndGoto(page: any, request: any, targetPath: string) {
  const response = await request.post(`${API_BASE}/auth/login`, {
    data: {
      username: process.env.TEST_USERNAME || 'admin',
      password: process.env.TEST_PASSWORD || 'admin123',
    },
  });
  const body = await response.json();
  const token = body.data.access_token;

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(
    ({ key, token }: { key: string; token: string }) => {
      localStorage.setItem(key, JSON.stringify({ accessToken: token, refreshToken: token, accessCodes: [], roles: ['admin'] }));
    },
    { key: STORAGE_KEY, token },
  );

  await page.goto(targetPath);
  await page.waitForLoadState('networkidle');
}

test('debug page structure', async ({ page, request }) => {
  await loginAndGoto(page, request, '/wande/ai-render/index');
  await page.waitForTimeout(3000);
  
  const radioGroup = await page.locator('.ant-radio-group').count();
  console.log('Radio group count:', radioGroup);
  
  const uploadDragger = await page.locator('.ant-upload-dragger').count();
  console.log('Upload dragger count:', uploadDragger);
  
  const select = await page.locator('.ant-select').count();
  console.log('Select count:', select);
  
  const buttons = await page.locator('button').allTextContents();
  console.log('Buttons:', buttons);
  
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
});
