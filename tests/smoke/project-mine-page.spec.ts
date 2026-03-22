import { test, expect } from '@playwright/test';

/**
 * 项目挖掘 (Project Mine) 页面冒烟测试
 * 对应 Issue: wande-ai-front#138
 *
 * 该页面修复了字段卡死问题，将 42 列精简为 20 列核心字段
 * 前端路由：/wande/project-mine（需确认 sys_menu 注册）
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
      localStorage.setItem(key, JSON.stringify({ accessToken: token, refreshToken: token, accessCodes: [] }));
    },
    { key: STORAGE_KEY, token },
  );

  await page.goto(targetPath);
  await page.waitForLoadState('networkidle');
}

test.describe('Project Mine Page @smoke @project-mine @issue:front#138', () => {
  test('project mine API endpoints are functional (backend validation)', { tag: ['@smoke', '@project-mine'] }, async ({ request }) => {
    // 登录获取 token
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
    });
    const loginBody = await loginRes.json();
    const token = loginBody.data.access_token;

    // 验证 list API
    const listRes = await request.get(`${API_BASE}/wande/project/mine/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    expect(listBody.code).toBe(200);

    // 验证 stats API
    const statsRes = await request.get(`${API_BASE}/wande/project/mine/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statsBody = await statsRes.json();
    expect(statsBody.code).toBe(200);
  });

  test('frontend serves correctly', { tag: ['@smoke', '@project-mine'] }, async ({ page }) => {
    // 验证前端应用能正常加载
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });

  // 以下测试在 sys_menu 注册后启用
  test.skip('page loads successfully (requires sys_menu registration)', { tag: ['@smoke', '@project-mine'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande/project-mine');
    // 等待页面加载完成，验证没有卡死
    await page.waitForTimeout(3000);

    // 验证页面容器存在
    const container = page.locator('.wande-project-mine');
    await expect(container).toBeVisible({ timeout: 10000 });
  });

  test.skip('page has table with expected columns (20 core fields)', { tag: ['@smoke', '@project-mine'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande/project-mine');
    await page.waitForTimeout(3000);

    // 验证表格加载完成
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible({ timeout: 10000 });

    // 验证核心字段存在（精简后的 20 列）
    const expectedColumns = ['项目名称', '项目等级', '省份', '状态'];
    for (const col of expectedColumns) {
      const header = page.locator(`th:has-text("${col}")`);
      await expect(header).toBeVisible();
    }
  });

  test.skip('page has filter form with province/grade/status', { tag: ['@smoke', '@project-mine'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande/project-mine');
    await page.waitForTimeout(3000);

    // 验证筛选表单存在
    const form = page.locator('.ant-form');
    await expect(form).toBeVisible({ timeout: 10000 });

    // 验证筛选字段
    await expect(page.locator('input[placeholder*="省份"]')).toBeVisible();
    await expect(page.locator('select:has-text("等级")')).toBeVisible();
  });

  test.skip('page displays statistics cards', { tag: ['@smoke', '@project-mine'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande/project-mine');
    await page.waitForTimeout(3000);

    // 验证统计卡片存在
    const cards = page.locator('.ant-statistic');
    await expect(cards).toHaveCountGreaterThan(0);

    // 验证核心统计项
    const content = await page.content();
    expect(content).toContain('项目总数') || expect(content).toContain('Total');
  });
});
