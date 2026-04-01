# PR #90 — wande-data-pipeline

## 基本信息
- **PR**: [feat(关键词学习): 效果追踪+无效词降权+Top20/Bottom20报告 v3.0](https://github.com/WnadeyaowuOraganization/wande-data-pipeline/pull/90)
- **Author**: wandeyaowu
- **关联 Issue**: wande-data-pipeline#17
- **测试时间**: 2026-04-01 13:46

## 变更范围
- `pipelines/domestic_projects/keyword_learner.py`
- `pipelines/domestic_projects/smart_project_discovery.py`

## 测试覆盖
- `tests/pipeline/api/pipeline-health.spec.ts` (14 cases)

## 测试结果
| 用例 | 结果 | 说明 |
|------|------|------|
| backend service is reachable for pipeline data | pass | - |
| tender data API requires auth | pass | - |
| tender data API returns data with valid token | pass | - |
| project mine API requires auth | pass | - |
| project mine API returns data with valid token | **fail** | backend 500, `wdpp_discovered_projects` 表缺失 `status` 列 |
| pipeline database is reachable via backend health | pass | - |
| competitor API requires auth | pass | - |
| product center API requires auth | pass | - |
| mine competitor API requires auth | pass | - |
| dashboard command API is reachable | pass | - |
| config.yaml database connection matches backend | pass | - |
| pipeline search services are configured (SearXNG) | pass | - |
| discovered projects have required fields | pass | - |
| tender data has required fields | pass | - |

## 根因分析
`project mine API` 500 是因为后端数据库 schema 中 `wdpp_discovered_projects` 缺少 `status` 列，导致后端 Mapper SQL 执行失败。与 PR 中表名修正为 `wdpp_discovered_projects` 的变更有关，但缺少对应列的增量 SQL。

## 2026-04-01 14:48 更新

**状态变更**: 🚫 DIRTY / merge conflict — 无法合并  
backend dev 环境经排查已由 backend#953 的 MyBatis alias 冲突导致整体瘫痪，但本 PR 此前记录的 `project mine API 500` 问题现已有新的 backend schema 修复方向（backend#951 / backend#955）。

尝试 `gh pr merge` 时返回: `Pull request is not mergeable: the merge commit cannot be cleanly created.` 表明 PR 与当前 `dev` 分支存在 merge conflict，需要编程CC先行解决冲突后再进入E2E测试流程。

**当前状态**: 保持 open，待编程CC解决 merge conflict 后重测。

## 处理结论（历史）
- **首轮PR 状态**: request-changes
- **修复依赖**: backend#951
- **Issue 标签更新**: pipeline#17 已添加 `status:test-failed`
