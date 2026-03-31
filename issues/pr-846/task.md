# PR #846 测试任务

## PR信息
- **仓库**: wande-ai-backend
- **PR**: #846
- **标题**: feat(dashboard): API网关子账户管理 [1/4] - 数据同步API #575
- **关联Issue**: #575
- **状态**: OPEN, mergeStateStatus: UNSTABLE (可能有CI失败)

## 变更范围
- 数据库: 3张表 (wdpp_dashboard_gw_accounts/usage_logs/monthly_summary)
- Entity/Mapper: DashboardGwAccount/UsageLog/MonthlySummary
- GatewayConfig: G7e网关管理API配置
- GatewayDataSyncService: 全量同步+增量同步+月度汇总计算
- DashboardGatewayService: 子账户CRUD/使用记录查询/预算管理
- DashboardGatewayController: REST API (/system/dashboard/gateway/*)

## API端点
- GET /system/dashboard/gateway/accounts - 子账户列表
- POST /system/dashboard/gateway/accounts - 创建子账户
- PUT /system/dashboard/gateway/accounts/{id} - 更新子账户
- DELETE /system/dashboard/gateway/accounts/{id} - 删除子账户
- GET /system/dashboard/gateway/usage-logs - 使用记录查询
- GET /system/dashboard/gateway/monthly-summary - 月度汇总
- POST /system/dashboard/gateway/sync - 手动触发同步

## 测试策略
1. 验证数据库表创建
2. 测试CRUD API
3. 测试数据同步功能
4. 测试预算管理

## 测试结果
- [ ] 测试执行中
- [ ] 结果记录

## 阻塞问题
**API未部署**: `/system/dashboard/gateway/*` 端点不存在于当前运行环境

当前部署的后端不包含PR #846的代码变更。需要部署后才能测试。

## 建议操作
1. 通知编程CC部署PR #846到dev环境
2. 部署完成后重新执行中层测试

## 备注
从mappings检查确认gateway相关API未注册
