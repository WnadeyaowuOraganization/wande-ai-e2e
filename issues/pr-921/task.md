# PR #921 测试任务

## PR信息
- **仓库**: wande-ai-backend
- **PR**: #921
- **标题**: fix(cockpit): 协调统一CC API监控API路径 - Issue #913
- **分支**: feature-issue-913

## 变更范围
- 新增 CcApiMetricsController - CC API调用质量监控API
- API路径: `/wande/dashboard/cc-metrics/*`
- 包含功能: 指标上报(单条/批量)、列表查询、告警查询、统计摘要
- 新增数据库表: cc_api_metrics

## 测试状态
**阻塞** - Dev环境未部署PR #921代码

## 阻塞原因
当前Dev环境部署的是PR #922代码 (commit d1b8c54b)，PR #921的代码尚未合并到dev分支，因此：
1. CcApiMetricsController 未加载
2. cc_api_metrics 表未创建
3. 所有 `/wande/dashboard/cc-metrics/*` 接口返回 404/500

## 测试用例
已更新 `tests/backend/api/cc-api-quality.spec.ts`：
- GET /wande/dashboard/cc-metrics/list - 获取CC API指标列表
- GET /wande/dashboard/cc-metrics/all - 获取全部CC API指标
- POST /wande/dashboard/cc-metrics/report - 上报CC API调用指标
- POST /wande/dashboard/cc-metrics/report/batch - 批量上报
- GET /wande/dashboard/cc-metrics/alerts - 获取告警列表
- GET /wande/dashboard/cc-metrics/stats/summary - 获取统计摘要

## 下一步
等待PR #921合并到dev分支并部署后重测。

## 时间戳
- 创建: 2026-04-01
