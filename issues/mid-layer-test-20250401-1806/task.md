# 中层测试记录 - 2026-04-01 18:06 UTC / 19:06 CST

## 扫描结果

### wande-ai-backend
| PR | 标题 | 标签 | mergeable | 状态 |
|----|------|------|-----------|------|
| #982 | fix(scheduler): GitHub同步修复+增强 #599 | status:test-passed | DIRTY | 无法merge |
| #981 | feat(notification): 通知中心查询API #871 | - | ✅ MERGED | merge+部署后测试失败 |
| #978 | feat(notification): 事件采集Service #869 | size/XL | MERGEABLE | BLOCKED |
| #977 | feat(notification): SSE实时推送服务 #870 | size/L | MERGEABLE | BLOCKED |
| #961 | fix(dealer): 修复 E2E 测试失败 #840 | status:test-passed | DIRTY | 无法merge |
| #958 | fix(alias-conflict): 删除重复类解决 MyBatis alias 冲突 #955 | status:test-passed | DIRTY | 无法merge |

### wande-ai-front
| PR | 标题 | 标签 | 状态 |
|----|------|------|------|
| #456 | refactor(front): 10个列表页按UI-GUIDE.md规范改造 #408 | status:test-passed | DIRTY，无法merge |
| #437 | feat: 外部工具健康度卡片 #213 | status:test-passed | DIRTY，无法merge |

### wande-data-pipeline
| PR | 标题 | 标签 | 状态 |
|----|------|------|------|
| #90 | feat(关键词学习): 效果追踪+无效词降权+Top20/Bottom20报告 v3.0 | e2e:tested | UNKNOWN，无法merge |
| #88 | feat(domestic_projects): 采集引擎配置分离+JSON日志+README #16 | e2e:tested | UNKNOWN，无法merge |

### wande-gh-plugins
无待测PR

---

## 重点PR处理详情

### PR #981 — 通知中心查询API #871
**动作**: approve → squash merge → 本地 dev 部署 → 运行 E2E 测试

**测试执行**: `tests/backend/api/notification-center.spec.ts` (10 cases)
- 通过: 3 (认证检查、无效ID、标记单条已读skip)
- 失败: 7 (所有核心API返回500)

**失败根因**:
```
java.lang.NumberFormatException: For input string: "sys_user:1"
    at NotificationController.list(NotificationController.java:43)
```
代码使用 `StpUtil.getLoginIdAsLong()`，但 loginId 实际为字符串 `sys_user:1`。

**后续动作**:
- [x] 创建 P0 修复 Issue: backend#987
- [x] 将 Issue #871 标签改为 `status:test-failed`

### PR #977 / #978 — notification 事件/SSE PR
**状态**: 仍 BLOCKED

**原因**: 两个 PR 对 `NotificationCreatedEvent.java` 的设计不一致：
- #977 字段: `id`, `createdAt`, `sourceRepo`，使用 `@Builder`
- #978 字段: `notificationId`，使用 `@RequiredArgsConstructor`

虽然两者各自与当前 dev 都 `MERGEABLE`，但顺序合并会产生 add/add 冲突。在统一事件类定义前不能 merge。维持 `request-changes`。

---

## 环境状态

### dev 环境回归情况
在部署包含 #981 的 dev 后，运行了 broader backend API 回归测试。发现大量现有端点也返回失败（如 audit-log、brand、prompt-templates 等）。这些失败与 #981 的 notification 代码无直接关系，属于 dev 分支上的 pre-existing regression，需要额外调查。

### 已标记 passed 但全部 dirty 的 PR
所有其他仓库的已 passed PR（backend#982/#961/#958, front#456/#437, pipeline#90/#88）均因 dev 更新而处于 `mergeStateStatus: DIRTY/UNKNOWN`，`gh pr merge` 返回 "not mergeable: the merge commit cannot be cleanly created"。需要编程CC先 rebase 才能继续合并。

---

## 下一步

1. 编程CC优先修复 backend#987（notification 500 错误）
2. 编程CC协调 #977/#978 的 `NotificationCreatedEvent` 统一设计
3. 编程CC rebase 所有 dirty 的 passed PR 并解决冲突
4. 下一次中层测试重点验证 #981 修复、#977/#978 冲突解决
