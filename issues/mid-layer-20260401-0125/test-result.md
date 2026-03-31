# 中层测试结果 - 2026-04-01 01:25

## 扫描结果

| 仓库 | Open PR | 已Merge | Blocked/Skipped |
|------|---------|---------|-----------------|
| backend | 9 | 1 | 8 |
| front | 9 | 5 | 4 |
| pipeline | 3 | 0 | 0 (全部已有 e2e:tested) |
| plugins | 0 | 0 | 0 |

## 详细结果

### Backend — wande-ai-backend

| PR | Issue | 状态 | 说明 |
|----|-------|------|------|
| #859 | #46 | ✅ Merged | dashboard-approval-wecom API 全部通过 |
| #860 | #45 | ⛔ Blocked | dashboard-command 测试通过，但 PR dirty (merge conflict) |
| #876 | #477 | ⛔ Blocked | ext-tool-dashboard API 500，backend dev 不稳定 |
| #875 | #357 | ⛔ Blocked | project-mine-feedback 2/4 失败 (500) |
| #874 | #361 | ⛔ Blocked | 无 E2E 覆盖 + PR dirty (merge conflict) |
| #873 | #840 | ⛔ Blocked | dealer Phase3 端点仍返回 500，修复未完全生效 |
| #872 | #358 | ⛔ Blocked | 无 E2E 覆盖 (project-mine enriched) |
| #861 | #89 | ⛔ Blocked | PR dirty + 无 E2E 覆盖 (知识库向量) |
| #851 | #250 | ⛔ Blocked | dashboard-acceptance 3/6 失败 (500) |

### Frontend — wande-ai-front

| PR | Issue | 状态 | 说明 |
|----|-------|------|------|
| #370 | #251 | ✅ Merged | claude-office schedule tab 页面加载正常 |
| #369 | #188 | ✅ Merged | GPU monitor 页面与 API 全部通过 |
| #366 | #339 | ✅ Merged | docs-only PR |
| #365 | #241 | ✅ Merged | test-only PR (工具中心测试修复) |
| #363 | #244 | ✅ Merged | test-only PR (vitest setup 修复) |
| #368 | #155 | ✅ 测试通过 | 超管驾驶舱路由配置测试通过，但 merge blocked (not mergeable) |
| #373 | #33 | ⏸ Skipped | approval-center / wecom-console 菜单未注册，页面测试 skip |
| #372 | #123 | ⛔ Blocked | 无 E2E 覆盖 (需求闭环看板) |
| #367 | #211 | ⛔ Blocked | model-pool console errors 因 backend MonitorAlertVo 环境问题 |

## 环境阻塞项

1. **Backend dev API 500 广泛存在**
   - 影响模块: acceptance, dealer, ext-tool-dashboard, project-mine-feedback
   - 已知根因: dev 环境部分 SQL 未部署 / `has_embedding` type mismatch (backend#858) / MonitorAlertVo `createdAt` setter 缺失
   - 建议: 修复 backend dev 环境稳定性后重测 blocked PR

2. **菜单缺失导致页面测试 Skip**
   - front#33 (approval-center / wecom-console) 需 backend 增量 SQL 注册 `sys_menu`
   - 建议: 部署 `2026-03-31-dashboard-approval-wecom.sql` 后重测

3. **合并冲突**
   - backend#860, #874, #861 存在 dirty state
   - front#368 not mergeable

## 测试执行命令

```bash
# backend
npx playwright test tests/backend/api/dashboard-approval-wecom.spec.ts tests/backend/api/dashboard-command.spec.ts tests/backend/api/dashboard-acceptance.spec.ts tests/backend/api/dealer.spec.ts tests/backend/api/ext-tool-dashboard.spec.ts tests/backend/api/project-mine-feedback.spec.ts tests/backend/api/project-mine.spec.ts --reporter=list

# front
npx playwright test tests/front/smoke/approval-center-page.spec.ts tests/front/smoke/wecom-console-page.spec.ts tests/front/smoke/gpu-monitor-page.spec.ts tests/front/smoke/dashboard-new-pages.spec.ts tests/front/smoke/model-pool-page.spec.ts tests/front/smoke/claude-office-pages.spec.ts --reporter=list
```

## 操作记录

- 使用 REST API 成功 merge: backend#859, front#370/#369/#366/#365/#363
- 使用 REST API 成功添加 `status:test-passed` 标签到对应 Issue
- 对 blocked PR 添加了 PR comment 说明原因
- 更新了 `traceability/requirement-map.json`
