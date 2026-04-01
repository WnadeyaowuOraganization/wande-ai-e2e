# PR #906 测试任务

## PR信息
- **仓库**: wande-ai-backend
- **PR**: #906
- **标题**: feat(dashboard): Issue #698 CC API调用质量监控 — 后端 + 测试 + G7e脚本
- **关联Issue**: #698
- **分支**: feature-issue-698

## 测试结果
**状态**: ❌ 测试失败

### 失败用例
| 用例 | 期望 | 实际 | 错误 |
|------|------|------|------|
| GET /monitor/cc-api-metric/{id} | 200/404 | 500 | 服务器错误 |
| GET /monitor/cc-api-metric/overview | 200 | 500 | 服务器错误 |
| GET /monitor/cc-api-metric/trend | 200 | 500 | 服务器错误 |
| POST /monitor/cc-api-metric/webhook/report | 200 | 500 | 服务器错误 |

### 通过用例
- GET /monitor/cc-api-metric/list - 获取CC API指标列表

## 问题分析
API返回500错误，可能原因：
1. 数据库表 `wdpp_dashboard_cc_api_metrics` 不存在
2. DashboardCcApiMetricController 依赖问题
3. 测试环境与dev环境配置差异

## 执行时间
2026-04-01 06:55

## 建议
需要编程CC检查：
1. 增量SQL: `2026-03-31-create-dashboard-cc-api-metrics.sql` 是否正确执行
2. Service层是否正确注入
3. 数据库连接配置是否正确
