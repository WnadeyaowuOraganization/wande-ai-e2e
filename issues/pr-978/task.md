# PR 978 (wande-ai-backend) - 中层测试记录

**测试时间**: 2026-04-01 19:05 CST
**PR**: feat(notification): 事件采集Service — Issue/PR/CI事件写入通知表 + Spring Event发布 #869
**状态**: BLOCKED — 设计冲突未解决，无法merge

## 变更范围
- 新增 `NotificationCreatedEvent.java` (字段: notificationId, userId, type, level, title, content, sourceType, sourceId, actionUrl)，使用 `@RequiredArgsConstructor`
- 新增 `NotificationEventController.java`
- 扩展 `INotificationService` / `NotificationServiceImpl`
- 新增 Event BOs: `CiEventBo`, `IssueStatusEventBo`, `PrEventBo`
- 单元测试: `NotificationEventControllerTest`, `NotificationServiceTest`

## 覆盖度评估
- **等级**: C → 需新增E2E用例后执行
- 通知中心为新模块，现有E2E无覆盖

## 测试结果
**BLOCKED — 无法merge到dev**

截至本轮检查，#978 与 #977 在 `NotificationCreatedEvent.java` 上仍存在设计级冲突：
- #978 使用字段 `notificationId`，`@RequiredArgsConstructor` 构造
- #977 使用字段 `id`、`createdAt`、`sourceRepo`，`@Builder` 构造

PR #981 (查询API) 已单独合并到 dev，但 #977 和 #978 仍因事件类接口不一致，不能安全顺序合并。编程CC需先统一事件定义后，再更新相关PR。

## 处理动作
- [x] PR #978 request-changes (维持)
- [x] PR #977 request-changes (维持)

## 关联
- PR #977 (SSE实时推送 #870)
- PR #981 (查询API #871)
- Issue backend#869
