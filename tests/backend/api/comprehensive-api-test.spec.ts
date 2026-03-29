import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const errors: Array<{
  id: number;
  endpoint: string;
  method: string;
  status: number;
  code: number | null;
  msg: string | null;
  error: string | null;
}> = [];

let globalToken: string;

/**
 * 万德 AI 平台全面接口测试
 * 测试所有主要模块的 API 接口，记录异常信息
 */

test.describe('1. 认证与登录模块 @comprehensive', () => {
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
    });
    const body = await response.json();
    if (body.code === 200 && body.data) {
      globalToken = body.data.access_token || body.data.token || '';
    }
  });

  test('POST /auth/login - 登录接口', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'admin', password: 'admin123' },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 1, endpoint: '/auth/login', method: 'POST', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
    expect(response.status()).toBe(200);
  });

  test('POST /auth/logout - 登出接口', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.post(`${API_BASE}/auth/logout`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 2, endpoint: '/auth/logout', method: 'POST', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /auth/code - 获取验证码', async ({ request }) => {
    const response = await request.get(`${API_BASE}/auth/code`);
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 3, endpoint: '/auth/code', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('2. 仪表盘模块 @comprehensive', () => {

  test('GET /api/dashboard/health-check - 健康检查', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/dashboard/health-check`);
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 10, endpoint: '/api/dashboard/health-check', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /api/dashboard/pipeline-status - 流水线状态', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/api/dashboard/pipeline-status`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 11, endpoint: '/api/dashboard/pipeline-status', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /api/dashboard/project-overview - 项目概览', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/api/dashboard/project-overview`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 12, endpoint: '/api/dashboard/project-overview', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /api/dashboard/todo-list - 待办列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/api/dashboard/todo-list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 13, endpoint: '/api/dashboard/todo-list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/dashboard/overview - 万德概览', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/dashboard/overview`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 14, endpoint: '/wande/dashboard/overview', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/dashboard/quick-stats - 快速统计', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/dashboard/quick-stats`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 15, endpoint: '/wande/dashboard/quick-stats', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('3. GPU 监控模块 @comprehensive', () => {

  test('GET /api/monitor/gpu/realtime - GPU 实时数据', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/api/monitor/gpu/realtime`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || (body.code !== 200 && body.code !== 500)) {
      errors.push({ id: 20, endpoint: '/api/monitor/gpu/realtime', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /api/monitor/gpu/summary - GPU 汇总数据', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/api/monitor/gpu/summary`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || (body.code !== 200 && body.code !== 500)) {
      errors.push({ id: 21, endpoint: '/api/monitor/gpu/summary', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /api/monitor/gpu/alerts - GPU 告警列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/api/monitor/gpu/alerts`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || (body.code !== 200 && body.code !== 500)) {
      errors.push({ id: 22, endpoint: '/api/monitor/gpu/alerts', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /api/monitor/gpu/health - GPU 健康状态', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/api/monitor/gpu/health`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 23, endpoint: '/api/monitor/gpu/health', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('4. 招投标模块 @comprehensive', () => {

  test('GET /wande/tender/list - 招投标列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/tender/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 30, endpoint: '/wande/tender/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/tender/stats - 招投标统计', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/tender/stats`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 31, endpoint: '/wande/tender/stats', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/tender/{id} - 招投标详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/tender/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 32, endpoint: '/wande/tender/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/tender/evaluation/list - 评标列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/tender/evaluation/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 33, endpoint: '/wande/tender/evaluation/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/tender/crawler/stats - 爬虫统计', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/tender/crawler/stats`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 34, endpoint: '/wande/tender/crawler/stats', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('5. 项目挖掘模块 @comprehensive', () => {

  test('GET /wande/project/mine/list - 项目挖掘列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/project/mine/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 40, endpoint: '/wande/project/mine/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/project/mine/stats - 项目挖掘统计', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/project/mine/stats`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 41, endpoint: '/wande/project/mine/stats', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/project/mine/{id} - 项目挖掘详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/project/mine/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 42, endpoint: '/wande/project/mine/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/project/mine/g7e/{g7eProjectId} - G7E 项目关联', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/project/mine/g7e/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 43, endpoint: '/wande/project/mine/g7e/{g7eProjectId}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/project/review/list - 项目评审列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/project/review/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 44, endpoint: '/wande/project/review/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/project/feedback/list - 项目反馈列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/project/feedback/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 45, endpoint: '/wande/project/feedback/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('6. Perplexity Credit 消耗统计模块 @comprehensive', () => {
  test('GET /wande/credit-usage/list - Credit 消耗列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/credit-usage/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 50, endpoint: '/wande/credit-usage/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/credit-usage/summary - Credit 消耗汇总', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/credit-usage/summary`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 51, endpoint: '/wande/credit-usage/summary', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/credit-usage/{id} - Credit 消耗详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/credit-usage/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 52, endpoint: '/wande/credit-usage/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('7. CRM 客户管理模块 @comprehensive', () => {
  test('GET /wande/client/list - 客户列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/client/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 60, endpoint: '/wande/client/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/client/{id} - 客户详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/client/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 61, endpoint: '/wande/client/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('8. 商机管理模块 @comprehensive', () => {
  test('GET /wande/opportunity/list - 商机列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/opportunity/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 70, endpoint: '/wande/opportunity/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/opportunity/{id} - 商机详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/opportunity/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 71, endpoint: '/wande/opportunity/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('9. 竞品分析模块 @comprehensive', () => {
  test('GET /wande/competitor/list - 竞品列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 80, endpoint: '/wande/competitor/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/competitor/{id} - 竞品详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 81, endpoint: '/wande/competitor/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/competitor/compare - 竞品对比', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor/compare`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 82, endpoint: '/wande/competitor/compare', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/competitor-alert/list - 竞品告警列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor-alert/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 83, endpoint: '/wande/competitor-alert/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/competitor-bid/list - 竞品投标列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/competitor-bid/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 84, endpoint: '/wande/competitor-bid/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('10. 研发管控模块 @comprehensive', () => {
  test('GET /wande/dev/list - 研发项目列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/dev/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 90, endpoint: '/wande/dev/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/dev/{id} - 研发项目详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/dev/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 91, endpoint: '/wande/dev/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/dev/status/{status} - 按状态查询', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/dev/status/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 92, endpoint: '/wande/dev/status/{status}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/dev/project/{project} - 按项目查询', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/dev/project/test`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 93, endpoint: '/wande/dev/project/{project}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/task/list - 任务列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/task/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 94, endpoint: '/wande/task/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/task/stats - 任务统计', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/task/stats`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 95, endpoint: '/wande/task/stats', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/task/engine-status - 引擎状态', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/task/engine-status`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 96, endpoint: '/wande/task/engine-status', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/worklog/list - 工作日志列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/worklog/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 97, endpoint: '/wande/worklog/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/worklog/user/{userName} - 用户工作日志', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/worklog/user/admin`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 98, endpoint: '/wande/worklog/user/{userName}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/followup/list - 跟进记录列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/followup/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 99, endpoint: '/wande/followup/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('11. 企微集成模块 @comprehensive', () => {
  test('GET /wande/wecom/stat/list - 企微统计列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/wecom/stat/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 100, endpoint: '/wande/wecom/stat/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/wecom/stat/{id} - 企微统计详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/wecom/stat/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 101, endpoint: '/wande/wecom/stat/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/wecom/log/list - 企微日志列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/wecom/log/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 102, endpoint: '/wande/wecom/log/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/wecom/feedback/list - 企微反馈列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/wecom/feedback/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 103, endpoint: '/wande/wecom/feedback/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('12. 运营驾驶舱模块 @comprehensive', () => {
  test('GET /wande/cockpit/config/all - 驾驶舱配置', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/cockpit/config/all`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 110, endpoint: '/wande/cockpit/config/all', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/cockpit/config/list - 驾驶舱配置列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/cockpit/config/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 111, endpoint: '/wande/cockpit/config/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/cockpit/news/list - 驾驶舱新闻列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/cockpit/news/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 112, endpoint: '/wande/cockpit/news/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('13. 系统管理模块 @comprehensive', () => {
  test('GET /system/user/getInfo - 获取用户信息', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/user/getInfo`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 120, endpoint: '/system/user/getInfo', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/user/list - 用户列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/user/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 121, endpoint: '/system/user/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/menu/getRouters - 获取路由菜单', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/menu/getRouters`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 122, endpoint: '/system/menu/getRouters', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/menu/list - 菜单列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/menu/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 123, endpoint: '/system/menu/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/role/list - 角色列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/role/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 124, endpoint: '/system/role/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/notice/list - 通知公告列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/notice/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 125, endpoint: '/system/notice/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/model/list - 模型列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/model/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 126, endpoint: '/system/model/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/message/list - 消息列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/message/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 127, endpoint: '/system/message/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('14. 知识库模块 @comprehensive', () => {
  test('GET /knowledge/list - 知识库列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/knowledge/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 130, endpoint: '/knowledge/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /knowledge/detail/{kid} - 知识库详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/knowledge/detail/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 131, endpoint: '/knowledge/detail/{kid}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /knowledgeRole/list - 知识角色列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/knowledgeRole/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 132, endpoint: '/knowledgeRole/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /knowledgeRoleGroup/list - 知识角色组列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/knowledgeRoleGroup/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 133, endpoint: '/knowledgeRoleGroup/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('15. 工作流模块 @comprehensive', () => {
  test('GET /workflow/mine/search - 我的工作流搜索', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/workflow/mine/search`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 140, endpoint: '/workflow/mine/search', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /workflow/public/search - 公共工作流搜索', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/workflow/public/search`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 141, endpoint: '/workflow/public/search', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /workflow/public/operators - 工作流操作符', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/workflow/public/operators`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 142, endpoint: '/workflow/public/operators', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /workflow/runtime/page - 工作流运行时页面', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/workflow/runtime/page`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 143, endpoint: '/workflow/runtime/page', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('16. 监控告警模块 @comprehensive', () => {
  test('GET /wande/monitor/log/list - 监控日志列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/monitor/log/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 150, endpoint: '/wande/monitor/log/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/monitor/log/{id} - 监控日志详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/monitor/log/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 151, endpoint: '/wande/monitor/log/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/monitor/alert/list - 告警列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/monitor/alert/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 152, endpoint: '/wande/monitor/alert/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /wande/monitor/alert/unacknowledged-count - 未确认告警数量', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/wande/monitor/alert/unacknowledged-count`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 153, endpoint: '/wande/monitor/alert/unacknowledged-count', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('17. Dev Schema 模块 @comprehensive', () => {
  test('GET /dev/schema/list - Schema 列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/dev/schema/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 160, endpoint: '/dev/schema/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /dev/schema/{id} - Schema 详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/dev/schema/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 161, endpoint: '/dev/schema/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /dev/schemaGroup/list - Schema 组列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/dev/schemaGroup/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 162, endpoint: '/dev/schemaGroup/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /dev/schemaField/list - Schema 字段列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/dev/schemaField/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 163, endpoint: '/dev/schemaField/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('18. 聊天与 AI 人类模块 @comprehensive', () => {
  test('GET /chat/config/list - 聊天配置列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/chat/config/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 170, endpoint: '/chat/config/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /chat/config/sysConfigKey - 系统配置键', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/chat/config/sysConfigKey`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 171, endpoint: '/chat/config/sysConfigKey', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /aihuman/info/list - AI 人类配置列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/aihuman/info/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 172, endpoint: '/aihuman/info/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /aihuman/aihumanConfig/list - AI 人类配置', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/aihuman/aihumanConfig/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 173, endpoint: '/aihuman/aihumanConfig/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /aihuman/aihumanRealConfig/list - 真实 AI 人类配置', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/aihuman/aihumanRealConfig/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 174, endpoint: '/aihuman/aihumanRealConfig/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('19. MCP 运营商模块 @comprehensive', () => {
  test('GET /operator/mcpInfo/list - MCP 信息列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/operator/mcpInfo/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 180, endpoint: '/operator/mcpInfo/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /operator/mcpInfo/tools/names - MCP 工具名称', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/operator/mcpInfo/tools/names`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 181, endpoint: '/operator/mcpInfo/tools/names', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /operator/mcpInfo/{mcpId} - MCP 详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/operator/mcpInfo/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 182, endpoint: '/operator/mcpInfo/{mcpId}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('20. OSS 资源模块 @comprehensive', () => {
  test('GET /resource/oss/list - OSS 文件列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/resource/oss/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 190, endpoint: '/resource/oss/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /resource/oss/config/list - OSS 配置列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/resource/oss/config/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 191, endpoint: '/resource/oss/config/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('21. 系统监控模块 @comprehensive', () => {
  test('GET /monitor/cache - 缓存监控', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/monitor/cache`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 200, endpoint: '/monitor/cache', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /monitor/online/list - 在线用户列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/monitor/online/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 201, endpoint: '/monitor/online/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /monitor/logininfor/list - 登录日志列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/monitor/logininfor/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 202, endpoint: '/monitor/logininfor/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /monitor/operlog/list - 操作日志列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/monitor/operlog/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 203, endpoint: '/monitor/operlog/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('22. 租户与套餐模块 @comprehensive', () => {
  test('GET /system/tenant/package/list - 租户套餐列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/tenant/package/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 210, endpoint: '/system/tenant/package/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/tenant/package/{packageId} - 租户套餐详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/tenant/package/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 211, endpoint: '/system/tenant/package/{packageId}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('23. 支付与订单模块 @comprehensive', () => {
  test('GET /system/payOrder/list - 支付订单列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/payOrder/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 220, endpoint: '/system/payOrder/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/payOrder/{id} - 支付订单详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/payOrder/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 221, endpoint: '/system/payOrder/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('24. 会话模块 @comprehensive', () => {
  test('GET /system/session/list - 会话列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/session/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 230, endpoint: '/system/session/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/session/{id} - 会话详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/session/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 231, endpoint: '/system/session/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('25. 字典与配置模块 @comprehensive', () => {
  test('GET /system/dict/type/list - 字典类型列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/dict/type/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 240, endpoint: '/system/dict/type/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/dict/data/list - 字典数据列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/dict/data/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 241, endpoint: '/system/dict/data/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/config/list - 系统配置列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/config/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 242, endpoint: '/system/config/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/post/list - 岗位列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/post/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 243, endpoint: '/system/post/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/dept/list - 部门列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/dept/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 244, endpoint: '/system/dept/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

test.describe('26. 提示词模板模块 @comprehensive', () => {
  test('GET /system/promptTemplate/list - 提示词模板列表', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/promptTemplate/list`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 250, endpoint: '/system/promptTemplate/list', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });

  test('GET /system/promptTemplate/{id} - 提示词模板详情', async ({ request }) => {
    if (!globalToken) { test.skip(); return; }
    const response = await request.get(`${API_BASE}/system/promptTemplate/1`, {
      headers: { Authorization: `Bearer ${globalToken}` },
    });
    const body = await response.json();
    if (response.status() !== 200 || body.code !== 200) {
      errors.push({ id: 251, endpoint: '/system/promptTemplate/{id}', method: 'GET', status: response.status(), code: body.code, msg: body.msg, error: null });
    }
  });
});

// 测试结束后输出错误汇总
test.afterAll(async () => {
  if (errors.length > 0) {
    console.log('\n=== 接口测试错误汇总 ===');
    console.log(JSON.stringify(errors, null, 2));
  } else {
    console.log('\n=== 所有接口测试通过 ===');
  }
});
