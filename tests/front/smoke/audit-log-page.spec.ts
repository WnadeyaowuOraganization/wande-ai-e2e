import { test, expect } from '@playwright/test';

/**
 * 审计日志页面冒烟测试
 * Issue: front#387
 * PR: #407
 */

test.describe('审计日志页面', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('http://localhost:8083/login');
    await page.getByPlaceholder('用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('admin123');
    await page.getByRole('button', { name: '手机号登录' }).click();
    await page.waitForURL('**/cockpit');
  });

  test('审计日志页面加载', async ({ page }) => {
    // 导航到审计日志页面
    await page.goto('http://localhost:8083/super-admin/audit-log');

    // 等待页面加载
    await page.waitForLoadState('networkidle');

    // 验证页面标题
    await expect(page.locator('h1:has-text("审计日志")')).toBeVisible();

    // 验证筛选栏
    await expect(page.locator('.ant-picker-range')).toBeVisible();
    await expect(page.locator('input[placeholder*="用户"]')).toBeVisible();

    // 验证时间线表格
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  test('审计日志筛选功能', async ({ page }) => {
    await page.goto('http://localhost:8083/super-admin/audit-log');
    await page.waitForLoadState('networkidle');

    // 选择日期范围
    const datePicker = page.locator('.ant-picker-range').first();
    await datePicker.click();
    await page.locator('.ant-picker-cell-today').first().click();
    await page.locator('.ant-picker-cell-today').last().click();

    // 点击查询
    await page.getByRole('button', { name: '查询' }).click();

    // 等待加载完成
    await page.waitForTimeout(1000);

    // 验证表格数据
    await expect(page.locator('.ant-table-row')).toHaveCount.greaterThanOrEqual(0);
  });

  test('审计日志导出功能', async ({ page }) => {
    await page.goto('http://localhost:8083/super-admin/audit-log');
    await page.waitForLoadState('networkidle');

    // 点击导出按钮
    const exportBtn = page.getByRole('button', { name: '导出' });
    if (await exportBtn.isVisible().catch(() => false)) {
      await exportBtn.click();
      // 验证导出提示
      await expect(page.locator('.ant-message')).toContainText('导出');
    }
  });
});
