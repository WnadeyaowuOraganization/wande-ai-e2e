# PR 977 (wande-ai-backend) - 中层测试记录

**测试时间**: 2026-04-01 19:05 CST
**PR**: feat(notification): SSE实时推送服务 — SseEmitter连接管理 + Spring Event监听推送 #870
**状态**: BLOCKED — 设计冲突未解决，无法merge

## 变更范围
- 新增 `NotificationSseController.java` (SSE订阅/心跳/统计)
- 新增 `SseEmitterService.java`
- 新增 `NotificationEventListener.java`
- 新增 `NotificationCreatedEvent.java` (字段: id, type, level, title, content, sourceType, sourceId, sourceRepo, actionUrl, userId, createdAt)，使用 `@Builder` + `Serializable`
- 单元测试: `SseEmitterServiceTest`, `NotificationEventListenerTest`

## 覆盖度评估
- **等级**: C → 需新增E2E用例后执行
- 通知中心SSE为新端点，现有E2E无覆盖

## 测试结果
**BLOCKED — 无法merge到dev**

截至本轮检查，#977 与 #978 在 `NotificationCreatedEvent.java` 上仍存在设计级冲突：
- #977 使用字段 `id`、`createdAt`、`sourceRepo`，`@Builder` 构造
- #978 使用字段 `notificationId`，`@RequiredArgsConstructor` 构造，无 `createdAt`/`sourceRepo`

虽然 PR #981 (查询API) 已单独合并到 dev，但 #977 和 #978 仍因事件类接口不一致，不能安全顺序合并。编程CC需先统一事件定义后，再更新相关PR。

## 处理动作
- [x] PR #978 request-changes (维持)
- [x] PR #977 request-changes (维持)

## 关联
- PR #978 (事件采集Service #869)
- PR #981 (查询API #871)
- Issue backend#870
