import { test, expect } from '@playwright/test';
import { request } from '@playwright/test';

test.describe('商机数据 API (@api @opportunity @issue:backend#634)', () => {
  let baseURL = 'http://localhost:6040';
  let token: string;
  let createdId: number;

  test.beforeAll(async () => {
    const context = await request.newContext({ baseURL });
    const res = await context.post('/auth/login', {
      data: { username: 'admin', password: 'admin123' },
    });
    const body = await res.json();
    expect(body.code).toBe(200);
    token = body.data?.token || body.token;
  });

  test('商机 CRUD 应包含新增项目级情报和红绿灯字段', async () => {
    const context = await request.newContext({
      baseURL,
      extraHTTPHeaders: { Authorization: `Bearer ${token}` },
    });

    const payload = {
      projectName: 'E2E测试项目-' + Date.now(),
      clientName: 'E2E客户',
      contactInfo: '13800138000',
      source: 'test',
      stage: 'new',
      estimatedAmount: 100000,
      followUpNotes: '测试备注',
      assignedTo: 'admin',
      // 新增字段
      projectIntelligenceScore: 85,
      budgetSource: '企业自筹',
      budgetCycle: '年初',
      designFirmInvolved: true,
      designFirmName: 'TestDesign',
      competitorStatus: '[{"brand":"A","status":"in","advantage":"price"}]',
      customerUrgency: 'high',
      infoVerificationStatus: 'verified',
      infoSources: '["mine","visit"]',
      lastVisitDate: '2026-04-01',
      visitCount: 3,
      keyFindings: '测试关键发现',
      infoTrafficLight: 'GREEN',
      trafficLightSkipCount: 0,
      trafficLightSkipReason: '',
    };

    // 1. 创建
    const createRes = await context.post('/wande/opportunity', { data: payload });
    const createBody = await createRes.json();
    expect(createBody.code).toBe(200);

    // 2. 列表查询
    const listRes = await context.get('/wande/opportunity/list?pageNum=1&pageSize=10');
    const listBody = await listRes.json();
    expect(listBody.code).toBe(200);
    expect(Array.isArray(listBody.rows)).toBe(true);

    // 3. 验证新增字段存在于列表数据中
    const row = listBody.rows.find((r: any) => r.projectName === payload.projectName);
    expect(row).toBeDefined();
    createdId = row.id;

    expect(row).toHaveProperty('projectIntelligenceScore', 85);
    expect(row).toHaveProperty('budgetSource', '企业自筹');
    expect(row).toHaveProperty('budgetCycle', '年初');
    expect(row).toHaveProperty('designFirmInvolved', true);
    expect(row).toHaveProperty('designFirmName', 'TestDesign');
    expect(row).toHaveProperty('competitorStatus');
    expect(row).toHaveProperty('customerUrgency', 'high');
    expect(row).toHaveProperty('infoVerificationStatus', 'verified');
    expect(row).toHaveProperty('infoSources');
    expect(row).toHaveProperty('lastVisitDate');
    expect(row).toHaveProperty('visitCount', 3);
    expect(row).toHaveProperty('keyFindings', '测试关键发现');
    expect(row).toHaveProperty('infoTrafficLight', 'GREEN');
    expect(row).toHaveProperty('trafficLightSkipCount', 0);
    expect(row).toHaveProperty('trafficLightSkipReason', '');

    // 4. 详情查询验证
    const infoRes = await context.get(`/wande/opportunity/${createdId}`);
    const infoBody = await infoRes.json();
    expect(infoBody.code).toBe(200);
    const data = infoBody.data;
    expect(data).toHaveProperty('projectIntelligenceScore', 85);
    expect(data).toHaveProperty('infoTrafficLight', 'GREEN');

    // 5. 删除清理
    const delRes = await context.delete(`/wande/opportunity/${createdId}`);
    const delBody = await delRes.json();
    expect(delBody.code).toBe(200);
  });
});
