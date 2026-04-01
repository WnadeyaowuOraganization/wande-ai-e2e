# PR #88 — wande-data-pipeline

## 基本信息
- **PR**: [feat(domestic_projects): 采集引擎配置分离+JSON日志+README #16](https://github.com/WnadeyaowuOraganization/wande-data-pipeline/pull/88)
- **Author**: wandeyaowu
- **关联 Issue**: wande-data-pipeline#16
- **测试时间**: 2026-04-01 13:46

## 变更范围
- `pipelines/domestic_projects/config.yaml`
- `pipelines/domestic_projects/smart_project_discovery.py`
- `pipelines/domestic_projects/README.md`

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
`project mine API` 500 是因为后端数据库 `wdpp_discovered_projects` 缺少 `status` 列。PR 将表名从 `discovered_projects` 修正为 `wdpp_discovered_projects`，但后端 Mapper 期望的 `status` 列在新表中尚未创建。

## 处理结论
- **PR 状态**: request-changes
- **修复依赖**: backend#951
- **Issue 标签更新**: pipeline#16 已添加 `status:test-failed`
