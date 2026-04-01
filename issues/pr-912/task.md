# PR #912 测试记录

## PR信息
- **仓库**: wande-ai-backend
- **标题**: feat(cockpit): CC API调用质量监控 - 输入输出比异常检测+token浪费告警 #698
- **分支**: feature-698
- **关联Issue**: #698
- **当前标签**: status:test-failed

## 测试范围
- CC API指标列表: `/wande/dashboard/cc-metrics/list`
- 全部CC API指标: `/wande/dashboard/cc-metrics/all`
- 上报CC API指标: `/wande/dashboard/cc-metrics/report`
- 批量上报: `/wande/dashboard/cc-metrics/report/batch`
- 告警列表: `/wande/dashboard/cc-metrics/alerts`
- 统计摘要: `/wande/dashboard/cc-metrics/stats/summary`

## 测试结果
❌ **失败** - 2026-04-01

| 测试用例 | 状态 | 错误 |
|---------|------|------|
| GET /wande/dashboard/cc-metrics/list | ❌ 失败 | 返回500错误 |
| GET /wande/dashboard/cc-metrics/all | ❌ 失败 | 返回500错误 |
| POST /wande/dashboard/cc-metrics/report | ❌ 失败 | 返回500错误 |
| POST /wande/dashboard/cc-metrics/report/batch | ❌ 失败 | 返回500错误 |
| GET /wande/dashboard/cc-metrics/alerts | ❌ 失败 | 返回500错误 |
| GET /wande/dashboard/cc-metrics/stats/summary | ❌ 失败 | 返回500错误 |

## 错误详情
所有API端点返回404/500错误：
```json
{
  "code": 500,
  "msg": "No static resource wande/dashboard/cc-metrics/list."
}
```

## 根因分析
API端点未部署到dev环境，可能是：
1. PR代码尚未合并到dev分支
2. 部署失败
3. 路由配置问题

## 测试轮次2 (2026-04-01 05:35)
- 状态: **部分失败**
- Dev环境: ✅ 已恢复

| 测试用例 | 状态 | 错误 |
|---------|------|------|
| GET /wande/dashboard/cc-metrics/list | ✅ 通过 | - |
| GET /wande/dashboard/cc-metrics/all | ❌ 失败 | 500 - 数据库字段缺失 |
| POST /wande/dashboard/cc-metrics/report | ❌ 失败 | 500 - 数据库字段缺失 |
| POST /wande/dashboard/cc-metrics/report/batch | ❌ 失败 | 500 - 数据库字段缺失 |
| GET /wande/dashboard/cc-metrics/alerts | ❌ 失败 | 404 - 静态资源不存在 |
| GET /wande/dashboard/cc-metrics/stats/summary | ❌ 失败 | 500 - 数据库字段缺失 |

### 错误详情
```json
{
  "code": 500,
  "msg": "ERROR: column \"create_dept\" does not exist"
}
```

### 根因分析
1. 数据库表 `wdpp_cc_api_metrics` 缺少 `create_dept`, `create_by`, `create_time`, `update_by`, `update_time` 等BaseEntity字段
2. `/alerts` 端点未实现或路径错误

### 操作
- 提交 request-changes review
- 保持 status:test-failed 标签

## 测试轮次3 (2026-04-01 05:47)
- 状态: **❌ 失败**
- Dev环境: ✅ 正常

| 测试用例 | 状态 | 错误 |
|---------|------|------|
| GET /wande/dashboard/cc-metrics/list | ✅ 通过 | 返回200 |
| GET /wande/dashboard/cc-metrics/all | ❌ 失败 | 500 - 数据库字段缺失 |
| POST /wande/dashboard/cc-metrics/report | ❌ 失败 | 500 - 数据库字段缺失 |
| POST /wande/dashboard/cc-metrics/report/batch | ❌ 失败 | 500 - 数据库字段缺失 |
| GET /wande/dashboard/cc-metrics/alerts | ❌ 失败 | 404 - 静态资源不存在 |
| GET /wande/dashboard/cc-metrics/stats/summary | ❌ 失败 | 500 - 数据库字段缺失 |

### 错误详情
```
ERROR: column "create_dept" does not exist
表: wdpp_cc_api_metrics
SQL: SELECT ... create_dept,create_by,create_time ... FROM wdpp_cc_api_metrics
```

### 根因分析
数据库表 `wdpp_cc_api_metrics` 缺少BaseEntity字段:
- create_dept
- create_by
- create_time
- update_by
- update_time

### 操作
- [x] 添加PR评论，说明失败原因
- [ ] 等待编程CC修复数据库表结构
- [ ] 重新测试

## 结论
PR #912 测试失败，数据库schema不完整，需要修复SQL迁移脚本添加缺失字段。
