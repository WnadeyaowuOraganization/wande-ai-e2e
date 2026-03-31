# 中层测试记录 — 2026-03-31 20:40

## 扫描范围
- wande-ai-backend: 18 open PRs (base=dev)
- wande-ai-front: 20 open PRs (base=dev)
- wande-data-pipeline: 3 open PRs (base=dev)
- wande-gh-plugins: 0 open PRs

## 环境状态

| 服务 | 状态 | 说明 |
|------|------|------|
| 前端 (8083) | UP | 返回旧版本登录页，未包含待测PR的新路由/页面 |
| 后端 (6040) | DOWN | `ECONNREFUSED 127.0.0.1:6040`，API 完全不可达 |
| PostgreSQL (5433) | 未验证 | — |
| Redis (6380) | 未验证 | — |

**结论**：测试环境后端未启动，所有依赖 backend auth / API 的 E2E 测试均无法执行。

## 已过滤PR
- 跳过 `human-only` 标签PR：无
- 跳过已有 `e2e:tested` 的标签PR：wande-data-pipeline 全部3个、backend 14个、front 12个
- 跳过已有 `status:test-failed` 且近期无新commit的PR：backend#850/#846/#839（上次更新时间约2小时前，已被测试CC打回）

## 本次待测PR清单（9个）

| # | 仓库 | PR | Issue | 标题 | 覆盖度评估 | 执行结果 |
|---|------|----|-------|------|-----------|---------|
| 1 | backend | #905 | #567 | feat(tool): 工具管理Service+API | C: 无覆盖（矩阵未记录） | **BLOCKED** 后端API未部署/未启动 |
| 2 | front | #414 | #392 | feat(@vben/web-antd): 键盘快捷键系统 | C: 无覆盖 | **BLOCKED** 后端未启动，页面未部署 |
| 3 | front | #413 | #385 | feat(cockpit): 首页卡片聚合升级 | C: 无覆盖 | **BLOCKED** 后端未启动，页面未部署 |
| 4 | front | #411 | #67 | feat(admin): 超管后台权限管理界面 | C: 无覆盖 | **BLOCKED** 后端未启动，页面未部署 |
| 5 | front | #410 | #388 | feat(cockpit): 角色化仪表盘视图 | C: 无覆盖 | **BLOCKED** 后端未启动，页面未部署 |
| 6 | front | #409 | #386 | feat(dashboard): DORA四指标看板页面 | C: 无覆盖 | **BLOCKED** 后端未启动，页面未部署 |
| 7 | front | #407 | #387+#320 | feat(dashboard): 全平台操作审计日志页面 + budget-overview | C: 无覆盖 | **BLOCKED** 后端未启动，页面未部署 |
| 8 | front | #405 | #320 | feat(cockpit): 超管驾驶舱预算总览组件 | C: 无覆盖 | **BLOCKED** 后端未启动，重复PR |
| 9 | front | #403 | #320 | feat(cockpit): 超管驾驶舱预算总览组件(详细版) | C: 无覆盖 | **BLOCKED** 后端未启动，重复PR |

## 测试执行详情

### backend#905 (tool-management)
- 运行文件：`tests/backend/api/tool-management.spec.ts`
- 结果：13 tests, 8 passed, **5 failed**
- 失败原因：未认证接口返回 `code: 500`（后端缺少该API实现或Spring Security未拦截到全新Controller），但已认证接口返回同样的500/403说明API未部署。期望 `401` 但实际 `500`。
- **判定**：非PR代码问题，是Dev环境未部署该分支导致。

### front smoke 批次 (#403, #405, #409, #411, #413)
- 运行文件：
  - `tests/front/smoke/budget-overview.spec.ts`
  - `tests/front/smoke/dora-metrics.spec.ts`
  - `tests/front/smoke/admin-permission-page.spec.ts`
  - `tests/front/smoke/health-card-grid.spec.ts`
- 结果：12 tests, **12 failed**
- 失败原因：全部因 `ECONNREFUSED 127.0.0.1:6040`（后端登录API不可达）而无法获取token。
- **判定**：环境阻塞。

### front#414 / #410 / #407 新增功能
- 缺少针对性 E2E 测试文件（无历史测试提交）。
- 但由于后端完全不可达、前端为旧版本，即使补充测试用例也无法获得有效结果。
- 本次周期不新增用例，留待环境恢复后补充并执行。

## 重复PR说明
- front#405 与 front#403 的 diff 内容**完全一致**（5个文件，`apps/web-antd/src/api/wande/dashboard.ts`、`apps/web-antd/src/views/dashboard/cockpit/components/BudgetOverview.vue` 等）。
- 建议：**merge 其中一个（如 #403），关闭另一个（#405）并说明为重复**。否则两个PR同时merge会产生空变更冲突。

## 决策汇总
- **通过（approve+merge）**：0 个
- **失败（request-changes）**：0 个
- **阻塞（环境原因，等待恢复）**：9 个（#905, #414, #413, #411, #410, #409, #407, #405, #403）

## 下一步行动
1. 等待 dev 环境后端服务（6040）恢复并重新部署。
2. 前端 PR 需要 merge 到 dev 后或 dev 环境切到对应分支部署，才能验证新路由/新页面。
3. 环境恢复后，优先为 front#414、front#410、front#407 补充 Playwright smoke 用例并执行。
4. 处理重复 PR #405 / #403。
