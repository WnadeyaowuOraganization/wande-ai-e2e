# PR #922 测试任务

## PR信息
- 仓库: wande-ai-backend
- 标题: feat(mgmt-fee): 管理费配置 API + 超管权限控制 + 审计日志 #225
- 关联Issue: #225
- 状态: **阻塞** (Dev环境不可用)

## 变更范围
- 新增: 管理费配置API (MgmtFeeConfig)
- 新增: 审计日志注解和AOP
- 新增: 外部工具Dashboard卡片API
- 新增: 用户反馈Controller
- 删除: 旧版审计日志实现
- 影响模块: mgmtfee, audit, ext-tool, tokenpool, feedback

## 测试执行记录
- 时间: 2026-04-01
- 结果: **阻塞**
- 原因: Dev环境后端服务未启动 (ECONNREFUSED 127.0.0.1:6040)
- 前端服务: 正常 (8083)

## 待测项目
- [ ] GET /wande/mgmt-fee/config/list - 获取管理费配置列表
- [ ] GET /wande/user-feedback/list - 用户反馈列表API
- [ ] POST /wande/user-feedback - 创建用户反馈
- [ ] GET /monitor/ext-tool/dashboard-card - 外部工具Dashboard卡片

## 阻塞解除后操作
1. 重新执行中层测试
2. 通过后approve并merge
3. 失败则request-changes并创建P0 Issue
