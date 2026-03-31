# PR #352 测试任务

## PR信息
- **仓库**: wande-ai-front
- **PR**: #352
- **标题**: feat(dashboard): 定时任务告警规则管理页 — 表格+CRUD弹窗+类型Tooltip #117
- **关联Issue**: #117
- **状态**: OPEN

## 变更范围
- 新增告警规则管理页面
- API类型定义: CronAlertRule, CronAlertRuleType, NotifyChannel
- CRUD调用函数

## 依赖的后端API
- GET/POST/PUT/DELETE `/wande/dashboard/cron/alert-rule/*`

## 阻塞问题
**后端API未部署**

验证命令:
```bash
curl -s http://localhost:6040/wande/dashboard/cron/alert-rule/list
# 返回: {"code":500,"msg":"No static resource wande/dashboard/cron/alert-rule/list."}
```

需要后端PR实现CronAlertRule Controller后才能测试。

## 建议操作
1. 确认后端对应PR
2. 后端API部署后重新测试
