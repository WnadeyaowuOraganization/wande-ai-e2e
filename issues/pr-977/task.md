# PR 977 (wande-ai-backend) - 中层测试记录

**测试时间**: 2026-04-01 17:35 CST
**PR**: feat(notification): SSE实时推送服务 — SseEmitter连接管理 + Spring Event监听推送 #870
**状态**: BLOCKED — 设计冲突导致无法顺序合并

## 变更范围
- 新增 `NotificationSseController.java` (SSE订阅/心跳/统计)
- 新增 `SseEmitterService.java`
- 新增 `NotificationEventListener.java`
- 新增 `NotificationCreatedEvent.java` (字段: id, type, level, title, content, sourceType, sourceId, sourceRepo, actionUrl, userId, createdAt)
- 单元测试: `SseEmitterServiceTest`, `NotificationEventListenerTest`

## 覆盖度评估
- **等级**: C → 需新增E2E用例后执行
- 通知中心SSE为新端点，现有E2E无覆盖

## 测试结果
**BLOCKED — 无法执行独立E2E测试**

在按依赖顺序模拟合并 #978 → #977 → #981 时，#977 与其前置PR #978 在 `NotificationCreatedEvent.java` 上发生 add/add 冲突：
- #977 的 `NotificationCreatedEvent` 包含 `id`, `createdAt`, `sourceRepo`，使用 `@Builder` + `Serializable`
- #978 的 `NotificationCreatedEvent` 包含 `notificationId`，使用 `@RequiredArgsConstructor`，无 `createdAt`/`sourceRepo`

两者对同一Spring Event类的设计不一致，属于接口级冲突。单独merge #977 到当前dev可成功，但与 #978 合并后会冲突，导致整个通知中心功能链无法完整集成。

## 处理动作
- [x] 统一创建P0修复Issue
- [x] PR #978 request-changes
- [x] PR #977 request-changes
- [x] PR #981 request-changes

## 关联
- PR #978 (事件采集Service #869)
- PR #981 (查询API #871)
- Issue backend#870
