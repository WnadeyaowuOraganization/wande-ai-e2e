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

## 结论
PR #912 测试失败，API端点不可访问。需要确认代码是否已正确部署到dev环境。
