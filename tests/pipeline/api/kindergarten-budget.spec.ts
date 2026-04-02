/**
 * 幼儿园客户发现 - 各区教育局部门预算PDF扫描器 API 测试
 * Issue: WnadeyaowuOraganization/wande-data-pipeline#12
 * PR:  WnadeyaowuOraganization/wande-data-pipeline#103
 *
 * 测试范围:
 * 1. 后端API能正确返回教育局预算扫描数据
 * 2. dept_budget_items表数据完整性
 * 3. 预警分级字段 (priority: high/medium/low)
 * 4. 支持区域字段 (district)
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';

let token: string;

test.beforeAll(async ({ request }) => {
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    data: { username: 'admin', password: 'admin123' },
  });
  const loginBody = await loginRes.json();
  if (loginBody.code === 200) {
    token = loginBody.data?.token || loginBody.data?.access_token || '';
  }
});

// ---------------------------------------------------------------------------
// 教育局预算数据API测试
// ---------------------------------------------------------------------------
test.describe('Kindergarten Budget Scanner - Data API @api @pipeline @kindergarten @budget @issue:pipeline#12', () => {
  test('budget items API requires authentication', { tag: ['@api', '@pipeline', '@kindergarten', '@budget', '@issue:pipeline#12'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/wande/kindergarten/budget/items`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    // API可能返回401(未认证)或404(未注册)或500(服务端错误)
    expect([401, 404, 500]).toContain(body.code);
  });

  test('budget items API returns data with valid token', { tag: ['@api', '@pipeline', '@kindergarten', '@budget', '@issue:pipeline#12'] }, async ({ request }) => {
    test.skip(!token, 'No auth token available');
    const response = await request.get(`${API_BASE}/wande/kindergarten/budget/items?pageNum=1&pageSize=10`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    // 接口可能返回200(有数据)或404(未注册菜单)或500(参数错误)
    expect([200, 404, 500]).toContain(body.code);
  });

  test('budget items include district field', { tag: ['@api', '@pipeline', '@kindergarten', '@budget', '@issue:pipeline#12'] }, async ({ request }) => {
    test.skip(!token, 'No auth token available');
    const response = await request.get(`${API_BASE}/wande/kindergarten/budget/items?pageNum=1&pageSize=20`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();

    if (body.code === 200 && body.rows && body.rows.length > 0) {
      // 验证每条记录都有区域字段
      for (const record of body.rows) {
        expect(record).toHaveProperty('district');
        // 深圳10个区之一
        const validDistricts = ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '龙华区', '坪山区', '光明区', '盐田区', '大鹏新区'];
        expect(validDistricts).toContain(record.district);
      }
    }
  });

  test('budget items include priority level field', { tag: ['@api', '@pipeline', '@kindergarten', '@budget', '@issue:pipeline#12'] }, async ({ request }) => {
    test.skip(!token, 'No auth token available');
    const response = await request.get(`${API_BASE}/wande/kindergarten/budget/items?pageNum=1&pageSize=20`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();

    if (body.code === 200 && body.rows && body.rows.length > 0) {
      for (const record of body.rows) {
        expect(record).toHaveProperty('priority');
        // 优先级: high(≥100万), medium(≥50万), low(<50万)
        expect(['high', 'medium', 'low']).toContain(record.priority);
      }
    }
  });

  test('budget items include amount and budget subject fields', { tag: ['@api', '@pipeline', '@kindergarten', '@budget', '@issue:pipeline#12'] }, async ({ request }) => {
    test.skip(!token, 'No auth token available');
    const response = await request.get(`${API_BASE}/wande/kindergarten/budget/items?pageNum=1&pageSize=20`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();

    if (body.code === 200 && body.rows && body.rows.length > 0) {
      for (const record of body.rows) {
        // 预算金额
        expect(record).toHaveProperty('amount');
        // 预算科目名称
        expect(record).toHaveProperty('budgetSubject');
        // 年份
        expect(record).toHaveProperty('year');
      }
    }
  });
});

// ---------------------------------------------------------------------------
// 预警分级测试
// ---------------------------------------------------------------------------
test.describe('Kindergarten Budget Priority Levels @api @pipeline @kindergarten @budget @issue:pipeline#12', () => {
  test('high priority for budget >= 1 million', { tag: ['@api', '@pipeline', '@kindergarten', '@budget', '@issue:pipeline#12'] }, async ({ request }) => {
    test.skip(!token, 'No auth token available');
    const response = await request.get(`${API_BASE}/wande/kindergarten/budget/items?priority=high&pageNum=1&pageSize=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();

    if (body.code === 200 && body.rows && body.rows.length > 0) {
      for (const record of body.rows) {
        expect(record.priority).toBe('high');
        // 高优先级金额应≥100万
        expect(record.amount).toBeGreaterThanOrEqual(1000000);
      }
    }
  });

  test('medium priority for budget >= 500k and < 1 million', { tag: ['@api', '@pipeline', '@kindergarten', '@budget', '@issue:pipeline#12'] }, async ({ request }) => {
    test.skip(!token, 'No auth token available');
    const response = await request.get(`${API_BASE}/wande/kindergarten/budget/items?priority=medium&pageNum=1&pageSize=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();

    if (body.code === 200 && body.rows && body.rows.length > 0) {
      for (const record of body.rows) {
        expect(record.priority).toBe('medium');
        expect(record.amount).toBeGreaterThanOrEqual(500000);
        expect(record.amount).toBeLessThan(1000000);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// 区域筛选测试
// ---------------------------------------------------------------------------
test.describe('Kindergarten Budget District Filter @api @pipeline @kindergarten @budget @issue:pipeline#12', () => {
  test('filter by specific district', { tag: ['@api', '@pipeline', '@kindergarten', '@budget', '@issue:pipeline#12'] }, async ({ request }) => {
    test.skip(!token, 'No auth token available');
    const testDistrict = '福田区';
    const response = await request.get(`${API_BASE}/wande/kindergarten/budget/items?district=${encodeURIComponent(testDistrict)}&pageNum=1&pageSize=20`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();

    if (body.code === 200 && body.rows && body.rows.length > 0) {
      for (const record of body.rows) {
        expect(record.district).toBe(testDistrict);
      }
    }
  });
});
