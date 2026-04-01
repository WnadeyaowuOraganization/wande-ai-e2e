# PR 981 (wande-ai-backend) - 中层测试记录

**测试时间**: 2026-04-01 17:35 CST
**PR**: feat(notification): 通知中心查询API #871
**状态**: BLOCKED — 设计冲突导致无法顺序合并

## 变更范围
- 新增 `NotificationController.java` (列表/未读数/标记已读/标记全部已读)
- 新增 `UnreadCountVo.java`
- 扩展 `WdppNotificationMapper.java` / `WdppNotificationMapper.xml`
- 扩展 `INotificationService` / `NotificationServiceImpl`
- 单元测试: `NotificationServiceTest` (225个测试)

## 覆盖度评估
- **等级**: C → 需新增E2E用例后执行
- 通知中心查询API为新端点，现有E2E无覆盖

## 测试结果
**BLOCKED — 无法执行E2E测试**

在按依赖顺序模拟合并 #978 → #977 → #981 时，发现 #978 与 #977 在 `NotificationCreatedEvent.java` 上存在 add/add 冲突，属于接口级设计不一致。虽然 #981 本身不涉及该事件类的直接修改，但其依赖的 Service 层（`NotificationServiceImpl`）需要与事件发布/监听机制协同工作。

由于整个通知中心功能链（#869 → #870 → #871）必须完整集成后才能正确部署和测试，在底层事件接口冲突解决前，无法安全地将 #981 合并到 dev。

## 处理动作
- [x] 统一创建P0修复Issue
- [x] PR #978 request-changes
- [x] PR #977 request-changes
- [x] PR #981 request-changes

## 关联
- PR #978 (事件采集Service #869)
- PR #977 (SSE实时推送 #870)
- Issue backend#871
