# PR 981 (wande-ai-backend) - 中层测试记录

**测试时间**: 2026-04-01 19:05 CST
**PR**: feat(notification): 通知中心查询API #871
**状态**: MERGED → 测试失败，已创建P0修复Issue

## 变更范围
- 新增 `NotificationController.java` (列表/未读数/标记已读/标记全部已读)
- 新增 `UnreadCountVo.java`
- 扩展 `WdppNotificationMapper.java` / `WdppNotificationMapper.xml`
- 扩展 `INotificationService` / `NotificationServiceImpl`
- 单元测试: `NotificationServiceTest` (225个测试)

## 覆盖度评估
- **等级**: C → 已补充E2E用例 (`tests/backend/api/notification-center.spec.ts`)

## 测试执行
**2026-04-01 19:05** — 将 #981 merge 到 dev 并部署后执行 E2E 测试：
- `notification-center.spec.ts` 共10个用例
- **通过**: 3个（认证检查、无效ID、标记单条已读因无通知skip）
- **失败**: 7个（所有核心API端点返回500）

## 失败原因

后端日志显示 `NotificationController.java:43` 抛出 `NumberFormatException`：
```
java.lang.NumberFormatException: For input string: "sys_user:1"
    at org.ruoyi.wande.controller.notification.NotificationController.list(NotificationController.java:43)
```

**根因**: 代码使用 `StpUtil.getLoginIdAsLong()`，但 Sa-Token 存储的 loginId 为字符串 `sys_user:1`，无法直接解析为 `Long`。

**影响端点**:
- GET `/wande/notification/list`
- GET `/wande/notification/unread-count`
- PUT `/wande/notification/{id}/read`
- PUT `/wande/notification/read-all`

## 处理动作
- [x] approve PR #981
- [x] merge PR #981 → dev
- [x] 部署 dev 环境并执行 E2E 测试
- [x] 创建 P0 修复 Issue — backend#987
- [x] 更新 Issue #871 标签为 `status:test-failed`

## 关联
- P0 修复 Issue: backend#987
- PR #978 (事件采集Service #869)
- PR #977 (SSE实时推送 #870)
- Issue backend#871
