# 中层测试执行报告 — 2026-04-01 09:41

## 扫描范围
- wande-ai-backend: 10 open PRs
- wande-ai-front: 9 open PRs
- wande-data-pipeline: 3 open PRs
- wande-gh-plugins: 0 open PRs

## 测试执行摘要

### Backend
- **API全量测试**: 315 passed, 25 skipped (24.7s) — 环境健康
- `dashboard-blocker.spec.ts`: 7 passed, 4 failed（#850回归问题，与09:27结果一致）

#### PR处理结果
| PR | 标题 | 结果 |
|----|------|------|
| #834 | fix(cockpit): cockpit_config表添加BaseEntity标准列 #831 | ✅ 已 merge |
| #832 | fix(security): 修复任意文件上传漏洞 #9 | ✅ 已 merge |
| #827 | feat(#576): API网关子账户管理 — 预算管理引擎 | ✅ 已 merge |
| #836 | feat(project-mine): 项目分配作战信息卡通知 #360 | ⚠️ APPROVED，DIRTY |
| #833 | fix(scheduler): GitHub同步修复+增强 #599 | ⚠️ APPROVED，DIRTY |
| #783 | feat(执行管理): 扩展角色权限 #38 | ⚠️ APPROVED，DIRTY |
| #778 | feat(dashboard): 用户反馈管理API | ⚠️ APPROVED，DIRTY |
| #774 | feat(dashboard-cron): 定时任务操作API | ⚠️ APPROVED，DIRTY |
| #771 | feat(dashboard): G7e claude_monitor | ⚠️ APPROVED，DIRTY |
| #850 | feat(dashboard): 修复开发阻塞主动提醒功能 #485 | ❌ 测试失败，保持 CHANGES_REQUESTED |

### Frontend
- **Smoke + E2E 全量测试**: 498 passed, 62 skipped, 3 did not run (1.1m) — 全部通过

#### PR处理结果
- #378, #348, #347, #344, #340, #312, #308, #307: **全部 APPROVED**
- 全部因 **DIRTY** 无法 merge（需 rebase/update branch）
- #335: **跳过**（status:blocked）

### Pipeline
- **API测试**: 14 passed (1.5s) — 全部通过
- 修复了 `pipeline-health.spec.ts:85` 缺少分页参数导致的超时问题

#### PR处理结果
- #90, #88, #87: **全部 APPROVED**
- 全部因 **DIRTY** 无法 merge（需 rebase/update branch）

## 关键发现

1. **环境已恢复**: backend API 315 passed，整体环境健康（相比09:27的500大面积错误已恢复）
2. **#850 回归仍存**: dashboard blocker 4个用例失败，Issue #945 仍为 OPEN
3. **大量 PR 变为 DIRTY**: 在我 merge backend #834/#832/#827 的过程中，多个 frontend 和 backend PR 的 mergeStateStatus 从 UNKNOWN/CLEAN 变为 DIRTY，说明 dev 分支变化频繁

## 代码修复

- `tests/pipeline/api/pipeline-health.spec.ts:85`
  - 原: `request.get('/wande/project/mine/list')`
  - 改: `request.get('/wande/project/mine/list?pageNum=1&pageSize=10')`
  - 原因: 无分页参数导致后端全量查询超时（15s）

## 下一步行动

- [ ] 编程CC修复 #850（Issue #945 OPEN）
- [ ] 编程CC rebase 所有 DIRTY 状态的 PR
- [ ] 环境稳定后复测 #850
