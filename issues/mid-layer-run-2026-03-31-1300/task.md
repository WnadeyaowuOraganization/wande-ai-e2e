# 中层测试运行 — 2026-03-31 13:00

## 执行概要

| 仓库 | Open PR | 本轮测试 | 通过 | 阻塞 | 跳过 |
|------|---------|---------|------|------|------|
| wande-ai-backend | 14 | 2 | 1 (merged) | 1 (bug) | 11 (已tested, conflict) |
| wande-ai-front | 12 | 1 | 1 (merged) | 0 | 11 (已tested, conflict) |
| wande-data-pipeline | 3 | 0 | — | — | 3 (已tested, conflict) |
| wande-gh-plugins | 0 | — | — | — | — |

## 本轮新增测试PR

### backend#842 — scheduler健壮性升级 #602
- **状态**: MERGED
- **覆盖度**: C — PR只含 issues/issue-602/task.md（74行）
- **分析**: Issue #602 是CC Scheduler（Python）SQLite升级，不涉及后端Java API
- **决策**: 文档PR，无HTTP API可测试，直接通过
- **标签**: e2e:tested (已通过合并)

### front#351 — 超管驾驶舱菜单合并 #155
- **状态**: MERGED
- **覆盖度**: B — 路由配置变更 (dashboard.ts order:-2 + task.md更新)
- **测试结果**:
  - 前端全量测试: 452/452 passed (149 skipped)
  - Dashboard相关: 11/11 passed
  - 超管驾驶舱路由验证: /dashboard/cockpit → 200
  - 子路由验证: dev-activity, task-center, monitor, wecom → 全部200
- **变更**: order: -2 使超管驾驶舱排侧边栏最顶部

### backend#839 — dealer Phase3 #309
- **状态**: BLOCKED (CONFLICTING + Issue #840 OPEN)
- **测试结果**: 4/10 passed, 6 failed
  - Phase3 新API: /import-from-tender, /sync-to-crm, /related-project → 500
  - 基础列表: /candidates/list, /bid-records/list, /follow-up/list → 500
  - 认证测试: /list, /stats → passed
- **阻塞原因**: Issue #840 (TIMESTAMPTZ类型不兼容 + Mapper XML缺失) 仍OPEN，无修复PR
- **行动**: 需编程CC修复 #840 后重新测试

## 已测试但CONFLICTING的PR（需编程CC解决冲突）

### backend (11个)
- #838 cron #828, #836 project-notification #360, #835 ext-tool #830
- #834 cockpit #831, #833 scheduler #599, #832 security #9
- #827 gateway-budget #576, #783 execution #38, #778 feedback #134
- #774 cron-dashboard #248, #771 claude-monitor #333

### front (11个)
- #348 mine #163, #347 alert #212, #344 mine-dashboard #143
- #343 feedback #63, #342 feedback #62, #340 cron #338
- #314 cron-overview #118, #312 pixel-office #233, #310 ops-center #32
- #308 schedule #252, #307 dev-activity #31

### pipeline (3个)
- #90 keyword #17, #88 collector #16, #87 post-task #38

## 下一步
1. 编程CC修复 Issue #840 (dealer基础列表API 500)
2. 编程CC解决上述CONFLICTING PR的merge conflict
3. 冲突解决后自动进入下一轮中层测试
