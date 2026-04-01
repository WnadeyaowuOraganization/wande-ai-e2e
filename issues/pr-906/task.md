# PR #906 E2E 测试工作记录

## PR信息
- **编号**: #906
- **标题**: feat(dashboard): Issue #698 CC API调用质量监控 — 后端 + 测试 + G7e脚本
- **分支**: feature-issue-698
- **状态**: OPEN
- **标签**: size/XL, status:test-failed

## 关联Issue
- #698 CC API调用质量监控

## 测试执行
- **时间**: 2026-04-01
- **范围**: `tests/backend/api/dashboard-cc-api-metric.spec.ts` (本次新增)

## 测试结果
❌ 6 项失败，8 项通过，1 项跳过

## 失败分析

### 1. Webhook 上报接口返回 401（代码缺陷）
- **接口**: `POST /monitor/cc-api-metric/webhook/report`
- **预期**: code = 200 (供 G7e 脚本无鉴权调用)
- **实际**: code = 401, msg = "认证失败，无法访问系统资源"
- **根因**: `CcApiMetricWebhookController` 的 `/report` 端点未配置公开访问，被 Sa-Token 全局拦截。
- **结论**: 这是 PR 引入的功能缺陷，必须修复。

### 2. 管理接口返回 500 — SQL 字段缺失（代码缺陷）
- **接口**: `GET /monitor/cc-api-metric/overview`、`GET /monitor/cc-api-metric/trend`
- **预期**: code = 200
- **实际**: code = 500
- **错误详情**:
  ```
  ERROR: column "create_dept" does not exist
  SQL: SELECT ...,create_dept,create_by,create_time,update_by,update_time FROM wdpp_dashboard_cc_api_metrics
  ```
- **根因**: 表 `wdpp_dashboard_cc_api_metrics` 实际缺少 `create_dept`、`create_by` 等 BaseEntity 标准列。PR 的增量 SQL 脚本未包含这些字段，导致带 BaseEntity 的 Entity 查询报错。
- **结论**: 需要修复建表 SQL 并同步到 dev 数据库。

## 测试执行记录

### 2026-04-01 08:17
- 执行中层测试
- 结果: 6项失败，4项通过
- 主要问题:
  1. Webhook接口返回404（API未部署或路径错误）
  2. /overview和/trend接口返回500: column "create_dept" does not exist

### 2026-04-01 08:18
- 手动验证: Webhook接口仍返回401（需要公开访问配置）
- 手动验证: /overview接口返回500（数据库字段缺失）

## 已执行动作
- [x] 新增 E2E 测试文件 `tests/backend/api/dashboard-cc-api-metric.spec.ts`
- [x] 提交 `request-changes` review
- [x] Issue #698 保持 `status:test-failed`

## 下一步
- [ ] 修复 webhook 端点公开访问配置
- [ ] 修复 `wdpp_dashboard_cc_api_metrics` 表结构，补充 BaseEntity 字段
- [ ] 重新部署 dev 环境并执行 E2E 测试
