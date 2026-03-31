# 中层测试工作记录 — 2026-03-31 12:35

## 扫描结果

| 仓库 | 未测试PR | 已测试PR |
|------|---------|---------|
| wande-ai-backend | #839 | #838, #836, #835, #834, #833, #832, #827, #783, #778, #774, #771 |
| wande-ai-front | #350, #348 | #347, #344, #343, #342, #340, #314, #312, #310, #308, #307 |
| wande-data-pipeline | #94 | #90, #88, #87 |
| wande-gh-plugins | 无 | 无 |

## 测试结果

### backend#839 — dealer Phase3 模块间数据打通 (Issue #309)
- **结果**: ❌ 失败（阻塞）
- **测试**: 7 passed, 3 failed, 1 skipped
- **Phase3 API**: 3/3 passed ✅
- **基础列表API**: 3 failed (500错误)
- **阻塞**: Issue #840 仍OPEN — TIMESTAMPTZ类型不兼容 + Mapper XML缺失
- **处理**: 维持 request-changes，等待修复

### front#350 — 确认中心页面 (Issue #244)
- **结果**: ✅ 通过
- **测试**: 6/6 passed (confirmation-center)
- **菜单**: 未注册到 sys_menu
- **合并**: ✅ 已自动merge (squash)

### front#348 — 业务员待办中心 (Issue #163)
- **结果**: ✅ 通过
- **测试**: 6/6 passed (my-projects)
- **菜单**: 未注册到 sys_menu
- **合并**: ❌ merge conflict (DIRTY)，需手动解决

### pipeline#94 — 多源项目智能去重合并 v2.0 (Issue #20)
- **结果**: ✅ 通过
- **测试**: 14/14 passed (pipeline-health)
- **合并**: ✅ 已自动merge (squash)

## 新增测试文件

- `tests/front/smoke/confirmation-center.spec.ts` — 6 tests
- `tests/front/smoke/my-projects-page.spec.ts` — 6 tests

## 合并汇总

| PR | 仓库 | 测试 | 合并状态 |
|----|------|------|---------|
| #839 | backend | ❌ fail | merge conflict + Issue #840 |
| #350 | front | ✅ pass | **MERGED** |
| #348 | front | ✅ pass | merge conflict (需手动) |
| #94 | pipeline | ✅ pass | **MERGED** |
