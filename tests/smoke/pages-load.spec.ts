import { test, expect } from '@playwright/test';

/**
 * 页面冒烟测试
 * 验证关键页面可访问、无JS崩溃、核心元素存在
 */

test.describe('Login Page @smoke @auth', () => {
  test('login page loads successfully', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    await page.goto('/');
    // 应能看到登录表单或已登录则自动跳转
    await expect(page).not.toHaveTitle(/500|Error|Exception/i);
    // 页面不应为空白
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);
  });

  test('login page has no console errors', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // 过滤掉常见的无害错误（favicon等）
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('manifest')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Core Pages Accessibility @smoke', () => {
  // 以下测试需要登录态，如果环境已配置自动登录cookie则直接测试
  // 否则跳过（Phase 2再补充带登录的页面测试）

  test('frontend root returns 200', { tag: ['@smoke'] }, async ({ request }) => {
    const response = await request.get('/');
    expect([200, 301, 302]).toContain(response.status());
  });

  test('frontend assets load correctly', { tag: ['@smoke'] }, async ({ request }) => {
    // 检查前端静态资源（Vite构建产物）
    const response = await request.get('/');
    if (response.ok()) {
      const html = await response.text();
      // Vite构建的Vue应用应包含 <div id="app"> 或类似挂载点
      expect(html).toMatch(/<div id="app"|<script type="module"/);
    }
  });
});
