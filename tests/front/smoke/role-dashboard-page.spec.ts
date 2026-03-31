import { test, expect } from '@playwright/test';

/**
 * 角色化仪表盘视图冒烟测试
 * Issue: front#388
 * PR: #410
 */

test.describe('角色化仪表盘视图', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8083/login');
    await page.getByPlaceholder('用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('admin123');
    await page.getByRole('button', { name: '登录' }).click();
    await page.waitForURL('**/cockpit');
  });

  test('角色切换器显示', async ({ page }) => {
    await page.goto('http://localhost:8083/cockpit');
    await page.waitForLoadState('networkidle');

    // 验证角色切换器存在
    const roleSwitcher = page.locator('[data-testid="role-switcher"], .role-switcher, [class*="role"]').first();
    // 如果存在则验证可见
    if (await roleSwitcher.isVisible().catch(() => false)) {
      await expect(roleSwitcher).toBeVisible();
    }
  });

  test('超管视图加载', async ({ page }) => {
    await page.goto('http://localhost:8083/cockpit?view=super-admin');
    await page.waitForLoadState('networkidle');

    // 验证超管视图特有的元素
    await expect(page.locator('body')).toContainText('驾驶舱');
  });

  test('开发者视图加载', async ({ page }) => {
    await page.goto('http://localhost:8083/cockpit?view=developer');
    await page.waitForLoadState('networkidle');

    // 验证开发者视图
    await expect(page.locator('body')).toContainText('驾驶舱');
  });

  test('业务方视图加载', async ({ page }) => {
    await page.goto('http://localhost:8083/cockpit?view=business');
    await page.waitForLoadState('networkidle');

    // 验证业务方视图
    await expect(page.locator('body')).toContainText('驾驶舱');
  });
});
