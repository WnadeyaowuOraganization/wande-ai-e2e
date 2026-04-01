# PR #978 中层测试记录

## PR信息
- 仓库: wande-ai-backend
- 标题: feat(notification): 事件采集Service — Issue/PR/CI事件写入通知表 + Spring Event发布 #869
- 关联Issue: #869

## 覆盖度评估
- 状态: B（部分覆盖，已有 notification-center.spec.ts 但缺少事件采集API测试）

## 阻塞分析
- 发现 **#986** 已在 dev 分支统一合并了 #869 和 #870 的内容（commit: 10951329）
- PR #978 因此变为过时/重复

## 处理结果
- ⛔ PR 已关闭（由中层测试CC自动关闭）
- 备注: 功能已统一由 #986 合并，无需单独合并此PR
