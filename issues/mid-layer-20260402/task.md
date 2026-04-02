# 中层E2E测试记录 — 2026-04-02

## 扫描结果

仓库: wande-ai-backend，共 7 个 open PR (base=dev)

| PR | Issue | 标题 | 测试覆盖 | 环境状态 | 结果 |
|---|---|---|---|---|---|
| #1088 | - | feat(generator): 修改字典功能和模板生成ID策略 | 新增 dict.spec.ts | 已部署 | ✅ MERGED |
| #1075 | #625 | feat(d3): 完成新模具定义流程 | mold-definition.spec.ts | 未部署 | ❌ FAILED |
| #1073 | #252 | feat(dashboard): 开发效率统计API | dashboard-efficiency.spec.ts | 未部署 | ❌ FAILED |
| #1072 | #171 | feat(contract): 实现合同编号生成API | contract.spec.ts | 已部署 | ⚠️ CONFLICT |
| #1071 | #623 | feat(d3): 实现模具库数据化功能 | mold-library.spec.ts | 未部署 | ❌ FAILED |
| #1019 | #70 | feat(contract): 实现 AI 合同自动填充功能 | contract-auto-fill.spec.ts | 已部署 | ✅ MERGED |
| #1018 | #624 | feat(d3): 实现模具选型引擎 API | mold.spec.ts | 已部署 | ✅ MERGED |

## 测试执行

```bash
npx playwright test tests/backend/api/contract.spec.ts tests/backend/api/contract-auto-fill.spec.ts tests/backend/api/dashboard-efficiency.spec.ts tests/backend/api/d3/mold-definition.spec.ts tests/backend/api/d3/mold-library.spec.ts tests/backend/api/d3/mold.spec.ts tests/backend/api/dict.spec.ts --project=api-tests
```

- **34 passed** (合同、自动填充、模具选型、字典通过)
- **25 failed** (dashboard效率统计、mold-definition、mold-library因环境未部署全部失败)
- **4 skipped**

## 环境诊断

- `api/dashboard/efficiency/*` → 500 "No static resource"
- `wande/d3/mold-definition/*` → 500 "No static resource"
- `api/d3/molds/*` → 500 "No static resource"
- `system/dict/type/all` → 已存在，返回 `{total, rows}` 格式

## 处理动作

1. **MERGED**: PR #1018, #1019, #1088 → Issue #624, #70 看板改为 Done
2. **CONFLICT**: PR #1072 与 dev 存在合并冲突 (DIRTY)，已评论并改 Issue #171 为 Todo + test-failed
3. **FAILED (环境)**: PR #1073, #1071, #1075 已评论失败原因，Issue #252, #623, #625 改为 Todo + test-failed

## 新增/修改文件

- `tests/backend/api/dict.spec.ts` (新增)
- `traceability/requirement-map.json` (更新)
