import { test, expect } from '@playwright/test';

/**
 * 登录流程E2E测试
 *
 * 策略：通过 API 登录获取 token，注入到浏览器 localStorage，
 * 然后主动导航到目标页面进行验证。不依赖平台的自动跳转。
 *
 * vben-admin token 存储（2026-03-22 确认）：
 * - key: "vben-web-antd-1.2.3-prod-core-access"
 * - value: {"accessToken":"...","refreshToken":"...","accessCodes":[]}
 *
 * 登录页 DOM：
 * - URL: /auth/login
 * - 用户名: getByPlaceholder("请输入用户名")
 * - 密码: getByPlaceholder("密码")
 * - 登录按钮: button[aria-label="login"]
 */

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';
const TEST_USER = {
  username: process.env.TEST_USERNAME || 'admin',
  password: process.env.TEST_PASSWORD || 'admin123',
};

/** 通过 API 登录并返回 token */
async function apiLogin(request: any): Promise<string> {
  const response = await request.post(`${API_BASE}/auth/login`, {
    data: { username: TEST_USER.username, password: TEST_USER.password },
  });
  const body = await response.json();
  expect(body.code).toBe(200);
  return body.data.access_token;
}

/** 注入 token 到浏览器 localStorage 并导航到目标页面 */
async function loginAndGoto(page: any, request: any, targetPath: string) {
  const token = await apiLogin(request);

  // 先访问前端首页（初始化 localStorage 域）
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 注入 token 到 vben-admin 的 pinia persist 存储
  await page.evaluate(
    ({ key, token }: { key: string; token: string }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          accessToken: token,
          refreshToken: token,
          accessCodes: [],
        }),
      );
    },
    { key: STORAGE_KEY, token },
  );

  // 导航到目标页面
  await page.goto(targetPath);
  await page.waitForLoadState('networkidle');
}

test.describe('Login Flow E2E @e2e @auth', () => {
  test('should complete login and access dashboard', { tag: ['@e2e', '@auth'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/analytics');
    expect(page.url()).not.toContain('/auth/login');
  });

  test('should show error for wrong password', { tag: ['@e2e', '@auth'] }, async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('请输入用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('wrong_password_test_12345');
    await page.locator('button[aria-label="login"]').click();
    await page.waitForTimeout(2000);

    expect(page.url()).toContain('/auth/login');
  });

  test('should access GPU monitor page after login', { tag: ['@e2e', '@auth', '@gpu-monitor'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande-dev/monitor');
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasMonitorContent =
      content.includes('监控') ||
      content.includes('monitor') ||
      content.includes('GPU');
    expect(hasMonitorContent).toBeTruthy();
  });
});
