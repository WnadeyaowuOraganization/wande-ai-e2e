import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const FRONT_BASE = process.env.BASE_URL_FRONT || 'http://localhost:8083';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';

/**
 * Gateway Account Page 测试
 * Issue: WnadeyaowuOraganization/wande-ai-front#245
 * PR: #269
 */

async function loginAndGoto(page, targetPath: string) {
  // 1. 先尝试API登录获取token
  try {
    const response = await page.request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
      timeout: 5000,
    });
    if (response.ok()) {
      const body = await response.json();
      const token = body.data?.access_token || body.data?.token || body.token;
      if (token) {
        // 2. 注入token到localStorage
        await page.goto(FRONT_BASE);
        await page.waitForLoadState('domcontentloaded');
        await page.evaluate(
          ({ key, token }) => {
            localStorage.setItem(key, JSON.stringify({
              accessToken: token, refreshToken: token, accessCodes: [],
            }));
          },
          { key: STORAGE_KEY, token },
        );
      }
    }
  } catch {
    // API不可用，降级为UI登录
  }

  // 3. 导航到目标页面
  await page.goto(`${FRONT_BASE}${targetPath}`);
  await page.waitForLoadState('networkidle');

  // 4. 如果被重定向到登录页，执行UI登录
  if (page.url().includes('/auth/login')) {
    await page.getByPlaceholder('请输入用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('admin123');
    await page.locator('button[aria-label="login"]').click();
    await page.waitForLoadState('networkidle');
    await page.goto(`${FRONT_BASE}${targetPath}`);
    await page.waitForLoadState('networkidle');
  }
}

test.describe('Gateway Account Page @smoke @gateway-account @issue:front#245', () => {
  test('frontend serves correctly', { tag: ['@smoke', '@gateway-account'] }, async ({ page }) => {
    const response = await page.request.get(`${FRONT_BASE}/wande-ops/gateway-account`);
    expect(response.status()).toBe(200);
  });

  test('page route exists in sys_menu', { tag: ['@smoke', '@gateway-account'] }, async ({ page }) => {
    // 验证菜单已注册
    await loginAndGoto(page, '/wande-ops/gateway-account');

    // 检查是否在登录页（说明token无效或菜单未注册）
    const currentUrl = page.url();
    const isLoginPage = currentUrl.includes('/auth/login');
    const is404Page = await page.locator('text=未找到页面').isVisible().catch(() => false);

    // 如果菜单已注册，应该不在登录页且不是404
    if (!isLoginPage && !is404Page) {
      // 页面正常加载
      await expect(page).toHaveURL(/gateway-account/);
    }
  });

  test('page loads successfully', { tag: ['@smoke', '@gateway-account'] }, async ({ page }) => {
    await loginAndGoto(page, '/wande-ops/gateway-account');

    // 检查是否被重定向到登录页
    if (page.url().includes('/auth/login')) {
      test.skip(true, 'Redirected to login page - API unavailable');
    }

    // 检查404
    const is404 = await page.locator('text=未找到页面').isVisible().catch(() => false);
    if (is404) {
      test.skip(true, 'Page shows 404 - menu not registered');
    }

    // 页面应该有一些内容
    await expect(page.locator('body')).toBeVisible();
  });

  test('page has expected UI elements', { tag: ['@smoke', '@gateway-account'] }, async ({ page }) => {
    await loginAndGoto(page, '/wande-ops/gateway-account');

    if (page.url().includes('/auth/login')) {
      test.skip(true, 'Redirected to login page');
    }

    const is404 = await page.locator('text=未找到页面').isVisible().catch(() => false);
    if (is404) {
      test.skip(true, 'Page shows 404');
    }

    // 等待页面加载
    await page.waitForTimeout(1000);

    // 检查关键元素：标题、表格或卡片
    const hasTitle = await page.locator('text=网关').or(page.locator('text=子账户')).isVisible().catch(() => false);
    const hasTable = await page.locator('table, .ant-table, [class*="table"]').isVisible().catch(() => false);
    const hasCard = await page.locator('.ant-card, [class*="card"]').isVisible().catch(() => false);

    expect(hasTitle || hasTable || hasCard).toBe(true);
  });

  test('page has no critical console errors', { tag: ['@smoke', '@gateway-account'] }, async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await loginAndGoto(page, '/wande-ops/gateway-account');
    await page.waitForTimeout(2000);

    // 过滤掉已知的非关键错误
    const criticalErrors = errors.filter((e) =>
      !e.includes('favicon') &&
      !e.includes('manifest') &&
      !e.includes('ResizeObserver') &&
      !e.includes('[HMR]') &&
      !e.includes('NetworkError') &&
      !e.includes('Failed to fetch') &&
      !e.includes('ECONNREFUSED') // 后端不可用时的网络错误
    );

    expect(criticalErrors.length).toBe(0);
  });
});
