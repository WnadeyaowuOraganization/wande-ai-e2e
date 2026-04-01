# PR #912 测试任务

## PR信息
- **仓库**: wande-ai-backend
- **PR**: #912
- **标题**: feat(cockpit): CC API调用质量监控 - 输入输出比异常检测+token浪费告警 #698
- **关联Issue**: #698
- **分支**: feature-698

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
1. 数据库表 `wdpp_cc_api_metrics` 不存在
2. Controller路径冲突未完全解决
3. SQL schema未正确执行

## 执行时间
2026-04-01 06:55

## 建议
需要编程CC检查：
1. 增量SQL是否正确执行
2. TokenPoolUsageController路径是否正确注册
3. 数据库表结构是否正确创建
