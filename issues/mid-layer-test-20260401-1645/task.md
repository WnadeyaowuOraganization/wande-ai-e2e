# 中层测试总报告 2026-04-01 16:45

## 扫描范围
- wande-ai-backend: 9 open PRs (base=dev)
- wande-ai-front: 2 open PRs
- wande-data-pipeline: 3 open PRs
- wande-gh-plugins: 0 open PRs

## 关键发现

### Backend 基线崩溃
- backend dev 因 #957 (MyBatis alias 冲突) 导致大量 API 返回 code:500 / body 异常。
- auth 测试 5/5 passed（服务启动正常），但非 core API 共 143 failed / 496 tests。
- **所有 backend PR 被 #957 阻塞**，无法正常评估。

### Backend PR 合并状态
- MERGEABLE: #983, #981, #980, #979, #978, #977
- CONFLICTING: #958 (#955 fix), #982, #961

### Frontend 页面测试正常
- front smoke: 168 passed, 37 skipped, 0 failed（页面可加载，无白屏）。
- 但两个 front PR 均存在 **merge conflict**，无法 merge。

### Pipeline
- pipeline-health.spec.ts: 13 passed, 1 failed（project mine API 返回 500，受 backend 影响）。
- #90, #88: merge conflict。
- #87: MERGEABLE 但变更范围严重失控（80+文件 vs 标题 "add post-task.sh"）。

## 处理结论
| PR | 决策 | 原因 |
|----|------|------|
| backend#983~#977, #982 | 挂起/comment | blocked by #957 |
| backend#958 | 挂起/comment | merge conflict + blocked by #957 |
| backend#961 | 挂起/comment | merge conflict + blocked by #957 |
| front#456, #437 | 挂起/comment | merge conflict |
| pipeline#90, #88 | 挂起/comment | merge conflict |
| pipeline#87 | request-changes | 变更范围失控 |

## 下一步
1. 编程CC优先解决 #957 / #955 alias 冲突，恢复 backend dev 基线。
2. 解决 front/pipeline 的 merge conflicts。
3. 基线恢复后，由下一班中层测试重新评估所有 MERGEABLE PR。
