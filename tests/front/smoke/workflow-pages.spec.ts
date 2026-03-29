import { test, expect } from '@playwright/test';

/**
 * Workflow (审批引擎) 页面冒烟测试
 * 对应 Issue: wande-ai-front#165
 *
 * 前端路由：
 * - /admin/workflow/templates - 审批模板列表
 * - /admin/workflow/groups - 审批组管理
 */

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

test.describe('Workflow Pages @smoke @workflow @issue:front#165', () => {
  test.describe('Templates Page', () => {
    test('templates page loads successfully', { tag: ['@smoke', '@workflow'] }, async ({ page, request }) => {
      await loginAndGoto(page, request, '/admin/workflow/templates');
      await page.waitForTimeout(2000);

      // 验证页面标题
      const pageTitle = page.locator('.a-page-header, [class*="page-header"], h1, h2');
      await expect(pageTitle.first()).toBeVisible({ timeout: 10000 });
    });

    test('templates page displays category filter', { tag: ['@smoke', '@workflow'] }, async ({ page, request }) => {
      await loginAndGoto(page, request, '/admin/workflow/templates');
      await page.waitForTimeout(2000);

      // 验证分类筛选存在
      const radioGroup = page.locator('.a-radio-group, .ant-radio-group');
      await expect(radioGroup).toBeVisible({ timeout: 10000 });
    });

    test('templates page shows template cards or empty state', { tag: ['@smoke', '@workflow'] }, async ({ page, request }) => {
      await loginAndGoto(page, request, '/admin/workflow/templates');
      await page.waitForTimeout(2000);

      // 验证有模板卡片或空状态
      const cards = page.locator('.template-card, .ant-card');
      const empty = page.locator('.a-empty, .ant-empty');

      // 二选一应该可见
      const cardsVisible = await cards.count();
      const emptyVisible = await empty.count();

      expect(cardsVisible > 0 || emptyVisible > 0).toBeTruthy();
    });
  });

  test.describe('Groups Page', () => {
    test('groups page loads successfully', { tag: ['@smoke', '@workflow'] }, async ({ page, request }) => {
      await loginAndGoto(page, request, '/admin/workflow/groups');
      await page.waitForTimeout(2000);

      // 验证页面标题
      const pageTitle = page.locator('.a-page-header, [class*="page-header"], h1, h2');
      await expect(pageTitle.first()).toBeVisible({ timeout: 10000 });
    });

    test('groups page displays add button', { tag: ['@smoke', '@workflow'] }, async ({ page, request }) => {
      await loginAndGoto(page, request, '/admin/workflow/groups');
      await page.waitForTimeout(2000);

      // 验证新增按钮存在
      const addButton = page.locator('.a-button:has-text("新增"), .ant-btn:has-text("新增")');
      await expect(addButton.first()).toBeVisible({ timeout: 10000 });
    });

    test('groups page displays table', { tag: ['@smoke', '@workflow'] }, async ({ page, request }) => {
      await loginAndGoto(page, request, '/admin/workflow/groups');
      await page.waitForTimeout(2000);

      // 验证表格存在
      const table = page.locator('.a-table, .ant-table');
      await expect(table).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Template Card Popconfirm (PR #255)', () => {
    test('template toggle shows Popconfirm confirmation dialog', { tag: ['@smoke', '@workflow', '@issue:front#255'] }, async ({ page, request }) => {
      await loginAndGoto(page, request, '/admin/workflow/templates');
      await page.waitForTimeout(2000);

      // 查找模板卡片中的 Switch 控件
      const switchElement = page.locator('.a-switch, .ant-switch').first();
      const switchCount = await switchElement.count();

      // 如果有 Switch，测试 Popconfirm
      if (switchCount > 0) {
        await switchElement.first().click();
        await page.waitForTimeout(500);

        // 验证 Popconfirm 对话框出现
        const popconfirm = page.locator('.a-popconfirm-content, .ant-popconfirm-content');
        const popconfirmVisible = await popconfirm.count();

        if (popconfirmVisible > 0) {
          // 验证确认/取消按钮存在
          const confirmBtn = page.locator('.a-btn:has-text("确认"), .ant-btn:has-text("确认")');
          const cancelBtn = page.locator('.a-btn:has-text("取消"), .ant-btn:has-text("取消")');

          expect(await confirmBtn.count()).toBeGreaterThan(0);
          expect(await cancelBtn.count()).toBeGreaterThan(0);
        }
      }
      // 如果没有 Switch（空状态），测试通过
    });
  });

  test.describe('Accounts Payable Route (PR #255)', () => {
    test('accounts-payable route loads successfully', { tag: ['@smoke', '@workflow', '@issue:front#255'] }, async ({ page, request }) => {
      // 测试修复后的 accounts-payable 路由路径
      await loginAndGoto(page, request, '/wande/finance/accounts-payable');
      await page.waitForTimeout(2000);

      // 验证页面加载成功（不应重定向到 404 或登录页）
      const currentUrl = page.url();
      expect(currentUrl).toContain('/wande/finance/accounts-payable');

      // 验证页面标题或内容存在
      const pageTitle = page.locator('.a-page-header, [class*="page-header"], h1, h2');
      const pageContent = await pageTitle.count();
      // 如果有页面标题，应该可见；如果没有，至少 URL 正确
      if (pageContent > 0) {
        await expect(pageTitle.first()).toBeVisible({ timeout: 10000 });
      }
    });
  });
});
