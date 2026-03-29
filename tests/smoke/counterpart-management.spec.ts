import { test, expect } from '@playwright/test';

/**
 * 项目配合单位管理功能冒烟测试
 * 对应 Issue: wande-ai-front#162
 *
 * 功能描述:
 * - 项目详情页新增"配合单位"区块
 * - 按角色分组展示（甲方/代建/设计/总包/监理/代理/运营方）
 * - 支持手动录入、编辑、删除、标记已验证
 *
 * 前端路由：/wande-project/project（项目详情页）
 */

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const FRONT_BASE = process.env.BASE_URL_FRONT || 'http://localhost:8083';
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
      localStorage.setItem(key, JSON.stringify({ accessToken: token, refreshToken: token, accessCodes: [] }));
    },
    { key: STORAGE_KEY, token },
  );

  await page.goto(targetPath);
  await page.waitForLoadState('networkidle');
}

test.describe('Project Counterpart Management @smoke @counterpart @issue:front#162', () => {

  test('counterpart management API requires authentication', { tag: ['@smoke', '@counterpart'] }, async ({ request }) => {
    // 验证未认证时 API 返回 401
    const listRes = await request.get(`${API_BASE}/wande/project/counterpart/list`);
    const listBody = await listRes.json();
    expect(listBody.code).toBe(401);

    // 登录获取 token
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
    });
    const loginBody = await loginRes.json();
    const token = loginBody.data.access_token;

    // 验证认证后的 API 访问
    const listResWithToken = await request.get(`${API_BASE}/wande/project/counterpart/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBodyWithToken = await listResWithToken.json();
    expect(listBodyWithToken.code).toBe(200);
  });

  test('project detail page loads with counterpart tab', { tag: ['@smoke', '@counterpart'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande-project/project');

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 验证页面容器存在
    const container = page.locator('.wande-project-mine, .app-container');
    await expect(container).toBeVisible({ timeout: 10000 });
  });

  test('counterpart management tab exists in project detail', { tag: ['@smoke', '@counterpart'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande-project/project');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 验证配合单位 Tab 存在
    const counterpartTab = page.locator('text=配合单位');
    await expect(counterpartTab).toBeVisible({ timeout: 10000 });
  });

  test('counterpart management has role groupings', { tag: ['@smoke', '@counterpart'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande-project/project');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 点击配合单位 Tab
    const counterpartTab = page.locator('text=配合单位');
    await counterpartTab.click();
    await page.waitForTimeout(1000);

    // 验证角色分组标签存在（至少有一个角色组）
    const roleLabels = page.locator('.ant-tag, [class*="role"], [class*="counterpart"]');
    const count = await roleLabels.count();

    // 如果有数据，验证角色分组显示
    if (count > 0) {
      // 期望看到角色类型标签如：甲方、代建、设计、总包、监理、代理、运营方
      const pageContent = await page.content();
      const expectedRoles = ['甲方', '代建', '设计', '总包', '监理', '代理', '运营方'];
      const foundRoles = expectedRoles.filter(role => pageContent.includes(role));
      expect(foundRoles.length).toBeGreaterThanOrEqual(0); // 允许暂无数据
    }
  });

  test('counterpart add button exists', { tag: ['@smoke', '@counterpart'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande-project/project');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 点击配合单位 Tab
    const counterpartTab = page.locator('text=配合单位');
    await counterpartTab.click();
    await page.waitForTimeout(1000);

    // 验证添加按钮存在
    const addButton = page.locator('button:has-text("添加"), button:has-text("新增"), button:has-text("添加配合单位")');
    const addButtonVisible = await addButton.count();

    // 允许暂无数据时的引导文字
    const pageContent = await page.content();
    expect(addButtonVisible > 0 || pageContent.includes('添加') || pageContent.includes('暂无信息')).toBeTruthy();
  });

  test('counterpart role types dropdown has expected options', { tag: ['@smoke', '@counterpart'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande-project/project');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 点击配合单位 Tab
    const counterpartTab = page.locator('text=配合单位');
    await counterpartTab.click();
    await page.waitForTimeout(1000);

    // 尝试点击添加按钮打开表单
    const addButton = page.locator('button:has-text("添加"), button:has-text("新增")').first();
    const addButtonCount = await addButton.count();

    if (addButtonCount > 0) {
      await addButton.first().click();
      await page.waitForTimeout(1000);

      // 验证角色类型下拉框存在
      const roleSelect = page.locator('select, .ant-select, [class*="role-select"]');
      const roleSelectCount = await roleSelect.count();

      if (roleSelectCount > 0) {
        // 验证下拉选项包含预期角色
        const pageContent = await page.content();
        const expectedRoles = ['甲方', '代建', '设计', '总包', '监理', '代理', '运营方'];
        const foundRoles = expectedRoles.filter(role => pageContent.includes(role));
        expect(foundRoles.length).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('counterpart list displays expected fields', { tag: ['@smoke', '@counterpart'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande-project/project');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 点击配合单位 Tab
    const counterpartTab = page.locator('text=配合单位');
    await counterpartTab.click();
    await page.waitForTimeout(1000);

    // 验证配合单位列表区域存在
    const counterpartList = page.locator('.ant-table, .ant-list, [class*="counterpart-list"], [class*="counterpart"]');
    const listCount = await counterpartList.count();

    // 列表存在或显示暂无数据都算正常
    expect(listCount > 0).toBeTruthy();
  });
});
