# PR #846 中层测试记录

**测试时间**: 2026-03-31 22:15（重测）
**仓库**: wande-ai-backend
**关联 Issue**: #575
**PR 标题**: feat(dashboard): API网关子账户管理 [1/4] - 数据同步API #575

## 覆盖度评估
- 已有 tests/backend/api/gateway-budget.spec.ts 部分路径覆盖（B级）。

## 执行结果（重测）
- 测试命令: `npx playwright test tests/backend/ --reporter=list`
- 结果: **Blocked**
- 原因: Backend dev 环境 API 未启动（localhost:6040 ECONNREFUSED）。无法执行任何后端API测试。
- 结论: 本轮不 approve/merge。等待环境恢复后在中层测试下一周期重测。

## 历史记录
- 2026-03-31 16:45: 首次测试被阻塞（Backend 134 failed）
- 2026-03-31 22:15: 重测仍被阻塞（Backend 389 failed，后端服务未启动）

## 环境状态
- 后端API: `http://localhost:6040` - **未启动 (ECONNREFUSED)**
- 前端页面: `http://localhost:8083` - 正常

## 失败分析
- Backend 测试: 389 failed（全部因后端服务未启动而失败）
- 这不是PR代码问题，是环境部署问题
