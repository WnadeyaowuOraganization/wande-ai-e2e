# 中层测试结果 - 2026-03-31 14:45

## 扫描结果

| 仓库 | Open PR | 已测试通过 | 待测 | 阻塞 |
|------|---------|-----------|------|------|
| backend | 13 | 10 | 3 | 3 |
| front | 13 | 11 | 2 | 2 |
| pipeline | 3 | 3 | 0 | 0 |
| plugins | 0 | 0 | 0 | 0 |

## 待测PR详情

### backend#846 - API网关子账户管理 [1/4]
- **状态**: ⛔ BLOCKED
- **原因**: mergeable=CONFLICTING，存在合并冲突
- **关联Issue**: #575
- **数据库表已创建**: wdpp_dashboard_gw_accounts, wdpp_dashboard_gw_usage_logs, wdpp_dashboard_gw_monthly_summary
- **建议**: 需要PR作者解决合并冲突后重新测试

### backend#845 - SQLite迁移+调度器去重+僵尸检测
- **状态**: ⛔ BLOCKED
- **原因**: mergeable=CONFLICTING，存在合并冲突
- **关联Issue**: #602
- **建议**: 需要PR作者解决合并冲突后重新测试

### backend#839 - Phase 3 模块间数据打通
- **状态**: ⛔ BLOCKED
- **原因**: mergeable=CONFLICTING，存在合并冲突
- **关联Issue**: #309
- **建议**: 需要PR作者解决合并冲突后重新测试

### front#353 - 开发效率看板页面
- **状态**: ⛔ BLOCKED
- **原因**: 依赖的backend API未部署（PR未合并到dev分支）
- **关联Issue**: #122
- **依赖**: 需要backend提供对应的API接口
- **页面路由**: /wande/dev-efficiency
- **建议**: 等待后端API部署后测试

### front#352 - 定时任务告警规则管理页
- **状态**: ⛔ BLOCKED
- **原因**: 依赖的backend API未部署（PR未合并到dev分支）
- **关联Issue**: #117
- **依赖**: 需要backend提供CronAlertRule Controller
- **建议**: 等待后端API部署后测试

## 已合并PR验证

### backend#847 - 确认中心API
- **状态**: ✅ 通过
- **API路径**: /api/dashboard/confirmations
- **验证结果**: stats接口返回正确数据

### backend#843 - 排程管理API
- **状态**: ⚠️ 有问题
- **API路径**: /wande/task
- **问题**: TaskQueueVo缺少createdAt属性setter
- **建议**: 创建修复Issue

## 后端服务状态

- 后端API: http://localhost:6040 ✅
- 前端页面: http://localhost:8083 ✅
- PostgreSQL: localhost:5433 ✅
- Redis: localhost:6380 ✅

## 下一步行动

1. 等待待测PR解决合并冲突
2. 为backend#843创建修复Issue（TaskQueueVo映射问题）
3. 下次测试周期重新扫描
