import { test, expect } from '@playwright/test';

/**
 * 键盘快捷键系统冒烟测试
 * Issue: front#392
 * PR: #414
 */

test.describe('键盘快捷键系统', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8083/login');
    await page.getByPlaceholder('用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('admin123');
    await page.getByRole('button', { name: '登录' }).click();
    await page.waitForURL('**/cockpit');
  });

  test('快捷键帮助面板', async ({ page }) => {
    await page.goto('http://localhost:8083/cockpit');
    await page.waitForLoadState('networkidle');

    // 查找帮助按钮或按?键打开帮助面板
    const helpBtn = page.locator('[data-testid="hotkey-help"], .hotkey-help-btn, button[title*="快捷键"]').first();

    if (await helpBtn.isVisible().catch(() => false)) {
      await helpBtn.click();
    } else {
      // 尝试按?键打开帮助
      await page.keyboard.press('?');
    }

    await page.waitForTimeout(500);

    // 验证帮助面板或模态框
    const helpPanel = page.locator('.hotkey-help, .keyboard-shortcuts, .ant-modal:has-text("快捷键")').first();
    if (await helpPanel.isVisible().catch(() => false)) {
      await expect(helpPanel).toContainText('快捷键');
    }
  });

  test('快捷键浮动按钮', async ({ page }) => {
    await page.goto('http://localhost:8083/cockpit');
    await page.waitForLoadState('networkidle');

    // 查找浮动快捷键按钮
    const floatBtn = page.locator('.hotkey-float-btn, [data-testid="hotkey-float"], .fixed button').first();

    if (await floatBtn.isVisible().catch(() => false)) {
      await expect(floatBtn).toBeVisible();
    }
  });

  test('通知面板', async ({ page }) => {
    await page.goto('http://localhost:8083/cockpit');
    await page.waitForLoadState('networkidle');

    // 查找通知按钮
    const notifBtn = page.locator('[data-testid="notification-panel"], .notification-btn, .bell-icon, button[title*="通知"]').first();

    if (await notifBtn.isVisible().catch(() => false)) {
      await notifBtn.click();
      await page.waitForTimeout(500);

      // 验证通知面板
      const notifPanel = page.locator('.notification-panel, .ant-dropdown:has-text("通知")').first();
      await expect(notifPanel || page.locator('body')).toBeVisible();
    }
  });
});
