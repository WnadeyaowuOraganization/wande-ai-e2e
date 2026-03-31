# PR #875 中层测试记录

**测试时间**: 2026-03-31 17:07
**仓库**: wande-ai-backend
**关联 Issue**: #357
**PR 标题**: feat(project-mine): 新增 good_lead/bad_lead 反馈 API #357

## 覆盖度评估
- 新增 API `PUT /wande/project/mine/feedback/{id}`、`GET /wande/project/mine/feedback-stats` 无现有 Playwright 覆盖（C级）。
- 新建测试文件: `tests/backend/api/project-mine-feedback.spec.ts`

## 执行结果
- 测试命令: `npx playwright test tests/backend/api/project-mine-feedback.spec.ts --reporter=list`
- 结果: **Blocked**
- 失败用例:
  1. `PUT /feedback/{id} requires authentication` — 未认证请求返回 500（期望 401），说明 API 未正确拦截匿名请求或 dev 环境未完全部署。
  2. `GET /feedback-stats returns data or permission error` — 认证后返回 500（期望 200 或 403），说明后端服务内部异常（可能是增量 SQL 未执行）。
- 结论: 本轮不 approve/merge。属 backend dev 环境部署不稳定/模块未就绪，非测试代码缺陷。等待环境恢复后重测。
