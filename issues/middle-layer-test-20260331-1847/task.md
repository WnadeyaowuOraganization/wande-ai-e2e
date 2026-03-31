# 中层测试记录 2026-03-31 18:47

## 扫描结果

### 待测PR（无e2e:tested标签）

| 仓库 | PR | 标题 | 状态 |
|------|-----|------|------|
| wande-ai-backend | #884 | feat(dashboard): Phase9 统一审批队列+企微通知控制台 API #46 | 测试通过 |
| wande-ai-front | #384 | feat(cockpit): 用户反馈管理页面 - 更新任务追踪文档 #63 | 无法自审批 |
| wande-ai-front | #381 | feat(dashboard): API网关使用记录页面 #246 | 阻塞 - 后端API 500 |
| wande-ai-front | #376 | feat(dashboard): 执行日志页 — 时间线表格+筛选栏+日志详情抽屉 #119 | 阻塞 - 后端API 500 |
| wande-ai-front | #352 | feat(dashboard): 定时任务告警规则管理页 #117 | 需要后端API支持 |

### 已有e2e:tested标签（跳过）
- backend: #876, #875, #874, #873, #860, #851, #845, #838, #836, #835, #834, #833, #832, #827, #783, #778
- front: #383, #382, #380, #379, #378, #373, #372, #368, #367, #358, #353, #348, #347, #344, #342, #340
- pipeline: #90, #88, #87

### 已有status:test-failed标签（跳过）
- backend: #850, #846, #839

---

## 详细测试结果

### backend#884 - Phase9 统一审批队列+企微通知控制台 API

**变更范围：**
- DashboardApprovalQueue.java (实体类字段添加)
- DashboardWecomHistory.java, DashboardWecomRule.java (实体类修改)
- DashboardWecomServiceImpl.java (服务实现)
- 单元测试和schema.sql

**测试执行：**
```bash
npx playwright test tests/backend/api/dashboard-approval-wecom.spec.ts
```

**结果：** 13 passed (1.6s)
- Approval Queue API - 认证测试
- Approval Queue API - GET /page
- Approval Queue API - POST 创建审批项
- Wecom Console API - 认证测试
- Wecom Console API - GET /rules
- Wecom Console API - GET /history
- Wecom Console API - POST /rules
- Wecom Console API - DELETE /rules/{ids}

**结论：** 测试通过，可以approve和merge

---

### front#384 - 用户反馈管理页面文档更新

**变更范围：**
- issues/issue-63/task.md (仅文档)

**测试执行：** 无需E2E测试

**结论：** 纯文档更新，但无法self-approve（GitHub限制）

---

### front#381 - API网关使用记录页面

**变更范围：**
- apps/web-antd/src/api/wande/types.ts
- apps/web-antd/src/views/wande/dashboard/cron-exec-log/__tests__/CronExecLogPage.test.ts
- issues/task.md

**阻塞原因：**
后端API不稳定，大量API返回500错误：
- Brand API: 500
- CRM API: 500
- Contract API: 500
- Dashboard API: 500

**结论：** 等待后端API稳定后再测试

---

### front#376 - 执行日志页

**变更范围：**
- apps/web-antd/src/views/wande/dashboard/cron-exec-log/__tests__/CronExecLogPage.test.ts
- issues/issue-119/task.md

**阻塞原因：**
同front#381，后端API 500错误

**结论：** 等待后端API稳定后再测试

---

### front#352 - 定时任务告警规则管理页

**变更范围：**
- apps/web-antd/src/api/wande/cron-alert-rule.ts (新增API类型)
- apps/web-antd/src/views/wande/dashboard/cron-alert-rule/ (页面实现)
- 组件测试 13/13 通过

**测试执行：**
```bash
npx playwright test tests/front/smoke/cron-alert-rules-page.spec.ts
```

**结果：** 1 passed, 6 skipped
- 前端服务正常
- 页面加载测试被跳过（需要后端菜单注册）

**结论：** 前端代码完整，但后端API支持不完整（PR描述中提到"后端补充 CronAlertRule Controller 后验证 API 对接"）

---

## 汇总

| 结果 | 数量 | PR |
|------|------|-----|
| 测试通过待merge | 1 | backend#884 |
| 无法self-approve | 1 | front#384 |
| 后端API 500阻塞 | 2 | front#381, front#376 |
| 需要后端API支持 | 1 | front#352 |

## 下一步行动

1. **backend#884**: approve + merge（需要其他用户或等待手动处理）
2. **front#384**: 已由作者创建，需要其他reviewer审批
3. **front#381, #376**: 等待后端API稳定性修复
4. **front#352**: 等待后端CronAlertRule Controller实现
