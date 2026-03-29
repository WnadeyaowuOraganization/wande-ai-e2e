import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

/**
 * 项目矿场 + 竞品情报 模块全面接口测试
 * 补充测试之前未覆盖的接口
 */

let token: string;

test.beforeAll(async ({ request }) => {
  const response = await request.post(`${API_BASE}/auth/login`, {
    data: { username: 'admin', password: 'admin123' },
  });
  const body = await response.json();
  if (body.code === 200 && body.data) {
    token = body.data.access_token || body.data.token || '';
  }
});

test.describe('项目矿场模块 - 完整接口测试 @mine @competitor', () => {

  // === 项目矿场列表接口 ===
  test('GET /wande/project/mine/list - 项目矿场列表', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/project/mine/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[项目矿场列表] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 项目矿场统计接口 ===
  test('GET /wande/project/mine/stats - 项目矿场统计', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/project/mine/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[项目矿场统计] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 项目矿场详情接口 ===
  test('GET /wande/project/mine/{id} - 项目矿场详情', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/project/mine/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[项目矿场详情] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === G7E 项目关联接口 ===
  test('GET /wande/project/mine/g7e/{g7eProjectId} - G7E 项目关联', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/project/mine/g7e/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[G7E 项目关联] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 项目矿场创建接口 ===
  test('POST /wande/project/mine - 创建项目矿场记录', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/wande/project/mine`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: '测试项目', source_type: 'test' },
    });
    const body = await response.json();
    console.log('[创建项目矿场] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 项目矿场更新接口 ===
  test('PUT /wande/project/mine - 更新项目矿场记录', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.put(`${API_BASE}/wande/project/mine`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { id: 1, title: '更新后标题' },
    });
    const body = await response.json();
    console.log('[更新项目矿场] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 批量状态更新接口 ===
  test('PUT /wande/project/mine/batch-status - 批量更新状态', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.put(`${API_BASE}/wande/project/mine/batch-status`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { ids: [1, 2], status: 'tracking' },
    });
    const body = await response.json();
    console.log('[批量状态更新] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 匹配评级接口 ===
  test('PUT /wande/project/mine/match-grade/{id} - 匹配评级', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.put(`${API_BASE}/wande/project/mine/match-grade/1`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { match_grade: 'A', match_reason: '测试评级' },
    });
    const body = await response.json();
    console.log('[匹配评级] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 导出接口 ===
  test('POST /wande/project/mine/export - 导出项目矿场', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/wande/project/mine/export`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {},
    });
    const body = await response.json();
    console.log('[导出项目矿场] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 删除接口 ===
  test('DELETE /wande/project/mine/{ids} - 删除项目矿场', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.delete(`${API_BASE}/wande/project/mine/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[删除项目矿场] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });
});

test.describe('竞品情报模块 - 完整接口测试 @competitor', () => {

  // === 竞品列表接口 ===
  test('GET /wande/competitor/list - 竞品列表', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[竞品列表] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 竞品详情接口 ===
  test('GET /wande/competitor/{id} - 竞品详情', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[竞品详情] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 竞品档案接口 ===
  test('GET /wande/competitor/{id}/profile - 竞品档案', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor/1/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[竞品档案] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 竞品对比接口 ===
  test('GET /wande/competitor/compare - 竞品对比', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor/compare?ids=1,2`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[竞品对比] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 创建竞品接口 ===
  test('POST /wande/competitor - 创建竞品', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/wande/competitor`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: '测试竞品', short_name: 'TC' },
    });
    const body = await response.json();
    console.log('[创建竞品] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 更新竞品接口 ===
  test('PUT /wande/competitor - 更新竞品', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.put(`${API_BASE}/wande/competitor`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { id: 1, name: '更新后名称' },
    });
    const body = await response.json();
    console.log('[更新竞品] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 导出竞品接口 ===
  test('POST /wande/competitor/export - 导出竞品', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/wande/competitor/export`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {},
    });
    // 导出接口返回Excel文件，不能解析为JSON
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('application');
    const buffer = await response.body();
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer[0]).toBe(0x50); // 'P' - ZIP/Excel文件开头
    expect(buffer[1]).toBe(0x4b); // 'K'
    console.log('[导出竞品] HTTP:', response.status(), 'Content-Type:', contentType, 'Size:', buffer.length);
  });

  // === 删除竞品接口 ===
  test('DELETE /wande/competitor/{ids} - 删除竞品', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.delete(`${API_BASE}/wande/competitor/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[删除竞品] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });
});

test.describe('竞品告警模块 - 完整接口测试 @competitor', () => {

  // === 告警列表接口 ===
  test('GET /wande/competitor-alert/list - 告警列表', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor-alert/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[告警列表] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 告警详情接口 ===
  test('GET /wande/competitor-alert/{id} - 告警详情', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor-alert/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[告警详情] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 竞品关联告警接口 ===
  test('GET /wande/competitor-alert/competitor/{competitorId} - 竞品关联告警', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor-alert/competitor/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[竞品关联告警] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 创建告警接口 ===
  test('POST /wande/competitor-alert - 创建告警', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/wande/competitor-alert`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { competitor_id: 1, alert_type: 'price', content: '测试告警' },
    });
    const body = await response.json();
    console.log('[创建告警] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 更新告警接口 ===
  test('PUT /wande/competitor-alert - 更新告警', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.put(`${API_BASE}/wande/competitor-alert`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { id: 1, content: '更新后内容' },
    });
    const body = await response.json();
    console.log('[更新告警] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 单个告警已读接口 ===
  test('PUT /wande/competitor-alert/{id}/read - 单个告警已读', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.put(`${API_BASE}/wande/competitor-alert/1/read`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[单个告警已读] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 全部告警已读接口 ===
  test('PUT /wande/competitor-alert/read-all - 全部告警已读', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.put(`${API_BASE}/wande/competitor-alert/read-all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[全部告警已读] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 批量已读接口 ===
  test('PUT /wande/competitor-alert/batch-read - 批量告警已读', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.put(`${API_BASE}/wande/competitor-alert/batch-read`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { ids: [1, 2] },
    });
    const body = await response.json();
    console.log('[批量告警已读] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 导出告警接口 ===
  test('POST /wande/competitor-alert/export - 导出告警', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/wande/competitor-alert/export`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {},
    });
    // 导出接口返回Excel文件，不能解析为JSON
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('application');
    const buffer = await response.body();
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer[0]).toBe(0x50); // 'P' - ZIP/Excel文件开头
    expect(buffer[1]).toBe(0x4b); // 'K'
    console.log('[导出告警] HTTP:', response.status(), 'Content-Type:', contentType, 'Size:', buffer.length);
  });

  // === 删除告警接口 ===
  test('DELETE /wande/competitor-alert/{ids} - 删除告警', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.delete(`${API_BASE}/wande/competitor-alert/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[删除告警] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });
});

test.describe('竞品投标模块 - 完整接口测试 @competitor', () => {

  // === 投标列表接口 ===
  test('GET /wande/competitor-bid/list - 投标列表', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor-bid/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[投标列表] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 投标详情接口 ===
  test('GET /wande/competitor-bid/{id} - 投标详情', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor-bid/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[投标详情] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 竞品关联投标接口 ===
  test('GET /wande/competitor-bid/competitor/{competitorId} - 竞品关联投标', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor-bid/competitor/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[竞品关联投标] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 创建投标接口 ===
  test('POST /wande/competitor-bid - 创建投标', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/wande/competitor-bid`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { competitor_id: 1, project_name: '测试项目', bid_amount: 100000 },
    });
    const body = await response.json();
    console.log('[创建投标] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 更新投标接口 ===
  test('PUT /wande/competitor-bid - 更新投标', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.put(`${API_BASE}/wande/competitor-bid`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { id: 1, bid_amount: 150000 },
    });
    const body = await response.json();
    console.log('[更新投标] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 导出投标接口 ===
  test('POST /wande/competitor-bid/export - 导出投标', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/wande/competitor-bid/export`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {},
    });
    // 导出接口返回Excel文件，不能解析为JSON
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('application');
    const buffer = await response.body();
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer[0]).toBe(0x50); // 'P' - ZIP/Excel文件开头
    expect(buffer[1]).toBe(0x4b); // 'K'
    console.log('[导出投标] HTTP:', response.status(), 'Content-Type:', contentType, 'Size:', buffer.length);
  });

  // === 删除投标接口 ===
  test('DELETE /wande/competitor-bid/{ids} - 删除投标', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.delete(`${API_BASE}/wande/competitor-bid/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[删除投标] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });
});

test.describe('监控告警模块 - 完整接口测试 @monitor', () => {

  // === 告警列表接口 ===
  test('GET /wande/monitor/alert/list - 监控告警列表', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/monitor/alert/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[监控告警列表] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 告警详情接口 ===
  test('GET /wande/monitor/alert/{id} - 监控告警详情', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/monitor/alert/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[监控告警详情] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 未确认告警数量接口 ===
  test('GET /wande/monitor/alert/unacknowledged-count - 未确认告警数量', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/monitor/alert/unacknowledged-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[未确认告警数量] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 创建告警接口 ===
  test('POST /wande/monitor/alert - 创建告警', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/wande/monitor/alert`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { alert_type: 'test', content: '测试告警' },
    });
    const body = await response.json();
    console.log('[创建告警] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 确认告警接口 ===
  test('PUT /wande/monitor/alert/{id}/acknowledge - 确认告警', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.put(`${API_BASE}/wande/monitor/alert/1/acknowledge`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { acknowledged_by: 'admin', note: '已确认' },
    });
    const body = await response.json();
    console.log('[确认告警] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 导出告警接口 ===
  test('POST /wande/monitor/alert/export - 导出告警', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/wande/monitor/alert/export`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {},
    });
    const body = await response.json();
    console.log('[导出告警] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });

  // === 删除告警接口 ===
  test('DELETE /wande/monitor/alert/{ids} - 删除告警', async ({ request }) => {
    if (!token) { test.skip(); return; }
    const response = await request.delete(`${API_BASE}/wande/monitor/alert/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    console.log('[删除告警] HTTP:', response.status(), 'Code:', body.code, 'Msg:', body.msg?.substring(0, 100));
    expect(response.status()).toBe(200);
  });
});

test.afterAll(async () => {
  console.log('\n=== 项目矿场 + 竞品情报 模块测试完成 ===');
});
