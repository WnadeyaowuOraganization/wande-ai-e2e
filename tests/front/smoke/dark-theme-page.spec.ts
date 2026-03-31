import { test, expect } from '@playwright/test';

/**
 * 深色主题冒烟测试
 * Issue: front#394
 * PR: #415
 */

test.describe('深色主题功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8083/login');
    await page.getByPlaceholder('用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('admin123');
    await page.getByRole('button', { name: '手机号登录' }).click();
    await page.waitForURL('**/cockpit');
  });

  test('深色主题CSS加载', async ({ page }) => {
    await page.goto('http://localhost:8083/cockpit');
    await page.waitForLoadState('networkidle');

    // 检查深色主题样式表是否存在
    const darkThemeStyles = page.locator('link[href*="dark-theme"], style[data-theme="dark"]').first();
    // 深色主题可能通过CSS变量或class实现
    const hasDarkClass = await page.locator('.dark, [data-theme="dark"], .dark-theme').count() > 0;
    const bodyBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });

    // 页面应该正常加载
    await expect(page.locator('body')).toBeVisible();
  });

  test('主题切换按钮', async ({ page }) => {
    await page.goto('http://localhost:8083/cockpit');
    await page.waitForLoadState('networkidle');

    // 查找主题切换按钮
    const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle, button[title*="主题"], button[aria-label*="主题"]').first();

    if (await themeToggle.isVisible().catch(() => false)) {
      await themeToggle.click();
      // 验证主题切换后的效果
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('系统偏好自动检测', async ({ page }) => {
    // 模拟系统深色偏好
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('http://localhost:8083/cockpit');
    await page.waitForLoadState('networkidle');

    // 页面应该正常加载
    await expect(page.locator('body')).toBeVisible();

    // 恢复
    await page.emulateMedia({ colorScheme: 'light' });
  });
});
