# 中层测试汇总 - 2026-04-02T01:18:17+0800

## 扫描范围
- wande-ai-backend: #958 #961 #982 #980 #983 #979 #978 #977 #981
- wande-ai-front: #456 #437
- wande-data-pipeline: #90 #88 #87
- wande-gh-plugins: 无

## 合并成功
- backend#980 (cron-task test resources)
- backend#983 (G7e cron_reporter.py)
- backend#979 (notification SQL)
- pipeline#87 (post-task.sh)

## 测试通过但需解决冲突
- backend#958 (alias-conflict fix - P0)
- backend#961 (dealer TIMESTAMPTZ fix)
- backend#982 (scheduler cleanup)
- front#456 (10 pages UI refactor)
- pipeline#90 (keyword learner v3.0)
- pipeline#88 (config separation)

## 暂缓（基线阻塞）
- backend#978 #977 #981 (notification 功能三连发，待 baseline 修复)

## 未处理（已有 passed 标签）
- front#437 (外部工具健康度卡片，已有 status:test-passed，未 checkout)

## Backend Dev 基线问题
1. `/wande/dealer/candidate/list` -> 500 TIMESTAMPTZ 转换错误
2. `/wande/project/mine/list` -> 500 column "status" does not exist
3. `/wande/dashboard/blocker/*`, `/wande/dashboard/cc-api-metric/*` -> No static resource (端点缺失)
4. 上述问题导致 front/pipeline 大量 smoke 测试失败

## 建议
- 优先推动 #958 / #961 解决冲突并 merge，修复 dev baseline。
- baseline 稳定后再测试并 merge notification 系列 PR (#978/#977/#981)。
