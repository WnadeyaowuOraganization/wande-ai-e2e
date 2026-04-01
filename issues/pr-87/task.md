# PR #87 — wande-data-pipeline

## 基本信息
- **PR**: [add: 添加post-task.sh脚本 #38](https://github.com/WnadeyaowuOraganization/wande-data-pipeline/pull/87)
- **Author**: wandeyaowu
- **关联 Issue**: wande-data-pipeline#38
- **测试时间**: 2026-04-01 13:46

## 变更范围
- 大规模新增 competitors 采集管线
- `script/post-task.sh`
- 大量 README、config、adapter Python 脚本、tests

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
500 错误根因与 pipeline #88 相同：`wdpp_discovered_projects` 表缺少 `status` 列。这是 backend schema 与 mapper 定义不一致导致的阻塞问题，不是 PR #87 引入的新缺陷。

## 处理结论
- **PR 状态**: request-changes
- **修复依赖**: backend#951
- **Issue 标签更新**: pipeline#38 已添加 `status:test-failed`
