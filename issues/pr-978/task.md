# PR 978 (wande-ai-backend) - 中层测试记录

**测试时间**: 2026-04-01 17:35 CST
**PR**: feat(notification): 事件采集Service — Issue/PR/CI事件写入通知表 + Spring Event发布 #869
**状态**: BLOCKED — 设计冲突导致无法顺序合并

## 变更范围
- 新增 `NotificationCreatedEvent.java` (字段: notificationId, userId, type, level, title, content, sourceType, sourceId, actionUrl)
- 新增 `NotificationEventController.java`
- 扩展 `INotificationService` / `NotificationServiceImpl`
- 新增 Event BOs: `CiEventBo`, `IssueStatusEventBo`, `PrEventBo`
- 单元测试: `NotificationEventControllerTest`, `NotificationServiceTest`

## 覆盖度评估
- **等级**: C → 需新增E2E用例后执行
- 通知中心为新模块，现有E2E无覆盖

## 测试结果
**BLOCKED — 无法执行独立E2E测试**

在按依赖顺序模拟合并 #978 → #977 → #981 时，#978 与 #977 在 `NotificationCreatedEvent.java` 上发生 add/add 冲突：
- #978 使用字段 `notificationId`
- #977 使用字段 `id`、`createdAt`、`sourceRepo`
- 两者对同一Spring Event类的设计不一致，属于接口级冲突

因此无法安全将三个通知中心PR按顺序合并到dev并部署测试。必须先解决接口设计冲突。

## 处理动作
- [x] 创建P0修复Issue
- [x] PR #978 request-changes
- [x] PR #977 request-changes
- [x] PR #981 request-changes (依赖同一事件类)

## 关联
- PR #977 (SSE实时推送 #870)
- PR #981 (查询API #871)
- Issue backend#869
