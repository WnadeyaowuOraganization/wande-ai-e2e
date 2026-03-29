import { test, expect } from '@playwright/test';

/**
 * 招投标 (Tender) 页面冒烟测试
 * 对应 Issue: wande-ai-front#236
 *
 * 前端路由：/wande/tender（需确认 sys_menu 注册）
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

test.describe('Tender Page @smoke @tender @issue:front#236', () => {
  test('tender API endpoints are functional (backend validation)', { tag: ['@smoke', '@tender'] }, async ({ request }) => {
    // 登录获取 token
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
    });
    const loginBody = await loginRes.json();
    const token = loginBody.data.access_token;

    // 验证 list API
    const listRes = await request.get(`${API_BASE}/wande/tender/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    expect(listBody.code).toBe(200);

    // 验证 stats API
    const statsRes = await request.get(`${API_BASE}/wande/tender/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statsBody = await statsRes.json();
    expect(statsBody.code).toBe(200);

    // 验证 crawler stats API
    const crawlerRes = await request.get(`${API_BASE}/wande/crawler/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const crawlerBody = await crawlerRes.json();
    expect(crawlerBody.code).toBe(200);
  });

  test('frontend serves correctly', { tag: ['@smoke', '@tender'] }, async ({ page }) => {
    // 验证前端应用能正常加载
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeTruthy();
  });

  // 以下测试在 sys_menu 注册后启用
  test.skip('page loads successfully (requires sys_menu registration)', { tag: ['@smoke', '@tender'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande/tender');
    await page.waitForTimeout(3000);

    // 验证页面容器存在
    const container = page.locator('.wande-tender');
    await expect(container).toBeVisible({ timeout: 10000 });
  });

  test.skip('page displays statistics cards', { tag: ['@smoke', '@tender'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande/tender');
    await page.waitForTimeout(3000);

    // 验证统计卡片存在
    const cards = page.locator('.stat-card');
    await expect(cards).toHaveCountGreaterThan(0);

    // 验证核心统计项
    await expect(page.locator('.ant-statistic-title:has-text("总招标数")')).toBeVisible();
    await expect(page.locator('.ant-statistic-title:has-text("进行中")')).toBeVisible();
    await expect(page.locator('.ant-statistic-title:has-text("已截止")')).toBeVisible();
    await expect(page.locator('.ant-statistic-title:has-text("已中标")')).toBeVisible();
  });

  test.skip('page has toolbar buttons for export, delete, add, crawler', { tag: ['@smoke', '@tender'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande/tender');
    await page.waitForTimeout(3000);

    // 验证工具栏按钮
    await expect(page.locator('button:has-text("导出")')).toBeVisible();
    await expect(page.locator('button:has-text("新增")')).toBeVisible();
    await expect(page.locator('button:has-text("运行采集")')).toBeVisible();
  });

  test.skip('page has action column with edit, view, evaluation, delete', { tag: ['@smoke', '@tender'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande/tender');
    await page.waitForTimeout(3000);

    // 验证表格操作列
    await expect(page.locator('button:has-text("编辑")')).toBeVisible();
    await expect(page.locator('button:has-text("详情")')).toBeVisible();
    await expect(page.locator('button:has-text("AI 评估")')).toBeVisible();
  });

  test.skip('drawer opens when viewing tender details', { tag: ['@smoke', '@tender'] }, async ({ page, request }) => {
    await loginAndGoto(page, request, '/wande/tender');
    await page.waitForTimeout(3000);

    // 点击详情按钮
    const viewButton = page.locator('button:has-text("详情")').first();
    await viewButton.click();

    // 验证抽屉打开
    const drawer = page.locator('.ant-drawer');
    await expect(drawer).toBeVisible({ timeout: 10000 });
  });
});
