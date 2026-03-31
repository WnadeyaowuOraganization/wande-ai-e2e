# PR #876 中层测试记录

**测试时间**: 2026-03-31 17:07
**仓库**: wande-ai-backend
**关联 Issue**: #477
**PR 标题**: feat(dashboard): 外部工具企微告警推送 + 驾驶舱卡片数据API #477

## 覆盖度评估
- 新增 API `GET /monitor/ext-tool/dashboard-card`、`GET /monitor/ext-tool/send-daily-report` 无现有 Playwright 覆盖（C级）。
- 新建测试文件: `tests/backend/api/ext-tool-dashboard.spec.ts`

## 执行结果
- 测试命令: `npx playwright test tests/backend/api/ext-tool-dashboard.spec.ts --reporter=list`
- 结果: **Blocked**
- 失败用例:
  1. `GET /dashboard-card returns data or permission error` — 认证后返回 500（期望 200 或 403），说明后端服务内部异常，可能是 `ext_tool` 相关数据表/缓存未就绪。
- `send-daily-report` 认证及未认证测试均通过（3/4 passed）。
- 结论: 本轮不 approve/merge。属 backend dev 环境 API 不稳定/部分模块未部署，非代码缺陷。等待环境恢复后重测。
