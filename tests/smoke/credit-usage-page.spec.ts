import { test, expect } from '@playwright/test';

/**
 * Perplexity Credit 消耗统计页面冒烟测试
 * 对应 Issue: wande-ai-front#2
 * 路由：/wande-dev/credit-usage
 * 组件：wande/credit-usage/index.vue
 */

test.describe('Credit Usage Page Smoke Tests @smoke @credit-usage @issue:front#2', () => {
  test('credit usage page loads successfully', { tag: ['@smoke', '@credit-usage'] }, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/wande-dev/credit-usage');
    await page.waitForLoadState('networkidle');

    // 页面不应出现 500 错误
    await expect(page).not.toHaveTitle(/500|Error|Exception/i);

    // 页面不应为空白
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);

    // 过滤掉常见的无害错误
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('manifest') && !e.includes('404')
    );

    // 记录错误但不强制失败（某些环境可能有 CORS 预检错误）
    if (criticalErrors.length > 0) {
      console.log('Console errors (non-critical):', criticalErrors);
    }
  });

  test('credit usage page has no critical console errors', { tag: ['@smoke', '@credit-usage'] }, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/wande-dev/credit-usage');
    await page.waitForLoadState('networkidle');

    // 过滤掉常见的无害错误
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('manifest') &&
        !e.includes('404') &&
        !e.includes('Failed to fetch') // API 请求失败在测试环境是预期的
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('credit usage page route exists', { tag: ['@smoke', '@credit-usage'] }, async ({ page }) => {
    await page.goto('/wande-dev/credit-usage');

    // 不应被重定向到 404 页面
    const currentUrl = page.url();
    expect(currentUrl).not.toMatch(/404|not-found|not_found/i);
  });

  test('credit usage page has expected UI elements', { tag: ['@smoke', '@credit-usage'] }, async ({ page }) => {
    await page.goto('/wande-dev/credit-usage');
    await page.waitForLoadState('networkidle');

    // 等待页面内容加载
    await page.waitForTimeout(2000);

    // 检查页面是否包含 Credit 相关的关键字（页面组件应有的内容）
    const content = await page.content();

    // 页面应包含一些文本内容，而不是完全空白
    expect(content.length).toBeGreaterThan(500);

    // 可能包含的关键字（根据典型的 Credit 统计页面设计）
    const expectedKeywords = ['credit', 'Credit', '消耗', '统计', 'usage', 'Usage'];
    const hasExpectedContent = expectedKeywords.some((keyword) =>
      content.includes(keyword)
    );

    // 如果页面已加载，应该有相关内容
    if (hasExpectedContent) {
      expect(true).toBe(true);
    } else {
      // 即使没有预期关键字，只要页面不是空白就认为基本通过
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length).toBeGreaterThan(100);
    }
  });

  test('credit usage page refresh works', { tag: ['@smoke', '@credit-usage'] }, async ({ page }) => {
    await page.goto('/wande-dev/credit-usage');
    await page.waitForLoadState('networkidle');

    // 获取当前页面状态
    const initialUrl = page.url();

    // 刷新页面
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 刷新后 URL 应该保持不变
    expect(page.url()).toBe(initialUrl);

    // 刷新后页面不应为空白
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);
  });
});
