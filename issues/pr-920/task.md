# PR #920 测试任务

## PR信息
- 仓库: wande-ai-backend
- 标题: fix(security): SysNoticeController 添加权限注解修复未授权访问漏洞 #44
- 关联Issue: #44
- 状态: **阻塞** (Dev环境不可用)

## 变更范围
- SysNoticeController 添加 @SaCheckPermission 注解
- GET /system/notice/list → system:notice:query
- GET /system/notice/getNotice → system:notice:query
- 新增回归测试: SysNoticeControllerPermissionTest

## 测试执行记录
- 时间: 2026-04-01
- 结果: **阻塞**
- 原因: Dev环境后端服务未启动 (ECONNREFUSED 127.0.0.1:6040)

## 待测项目
- [ ] GET /system/notice/list - 未认证访问应返回401
- [ ] GET /system/notice/1 - 未认证访问应返回401
- [ ] 有权限用户正常访问

## 阻塞解除后操作
1. 重新执行中层测试
2. 通过后approve并merge（安全修复优先）
3. 失败则request-changes并创建P0 Issue
