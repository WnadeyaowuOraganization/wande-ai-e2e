# PR #839 中层测试记录

**测试时间**: 2026-03-31 22:15（重测）
**仓库**: wande-ai-backend
**关联 Issue**: #309
**PR 标题**: feat(dealer): Phase 3 模块间数据打通 — 招标↔矿场↔CRM联动 #309

## 覆盖度评估
- 已有 tests/backend/api/dealer.spec.ts（A级）。

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

## 2026-03-31 23:05 测试记录
**状态**: 阻塞 (API未部署)

**测试结果**:
- Backend测试: 300 passed, 157 failed, 25 skipped
- 失败的157个测试主要是因为API端点返回500错误或数据不符合预期
- Dealer相关新API未部署

**阻塞原因**: PR代码尚未部署到G7e dev环境，无法执行有效测试。

## 失败分析
- Backend 测试: 157 failed（新API未部署，现有API部分数据问题）
- 这不是PR代码问题，是环境部署问题
