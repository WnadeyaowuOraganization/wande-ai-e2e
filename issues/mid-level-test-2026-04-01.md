# 中层测试记录 - 2026-04-01

## 测试执行时间
2026-04-01

## 扫描范围
- wande-ai-backend: 0 open PRs
- wande-ai-front: 0 open PRs
- wande-data-pipeline: 3 open PRs
- wande-gh-plugins: 0 open PRs

## PR状态汇总

### wande-data-pipeline

| PR | 标题 | 状态 | 合并状态 | 处理结果 |
|----|------|------|----------|----------|
| #90 | feat(关键词学习): 效果追踪+无效词降权+Top20/Bottom20报告 v3.0 | e2e:tested | **DIRTY** (CONFLICTING) | 阻塞 - 需解决冲突 |
| #88 | feat(domestic_projects): 采集引擎配置分离+JSON日志+README #16 | e2e:tested | **DIRTY** (CONFLICTING) | 阻塞 - 需解决冲突 |
| #87 | add: 添加post-task.sh脚本 #38 | e2e:tested | **DIRTY** (CONFLICTING) | 阻塞 - 需解决冲突 |

## 测试环境状态
- 后端服务 (localhost:6040): **未启动** (ECONNREFUSED)
- 当前无法执行新的E2E测试

## 历史测试记录
根据PR评论历史，3个PR均已在2026-03-31通过E2E测试：
- PR #90: 2026-03-31 05:26 测试通过 (14/14 PASS)
- PR #88: 2026-03-31 04:33 测试通过 (14/14 PASS)
- PR #87: 2026-03-31 04:33 测试通过 (14/14 PASS)

## 阻塞原因
所有3个PR均因与dev分支存在合并冲突（DIRTY）而无法merge。需要编程CC解决冲突后重新提交。

## 关联Issue
- PR #87 与 PR #88 存在文件重叠（domestic_projects/README.md、config.yaml）
- 建议先merge其中一个，另一个rebase后再merge

## 下一步行动
1. 通知编程CC解决PR #87, #88, #90的合并冲突
2. 冲突解决后重新执行中层测试验证
3. 测试环境后端服务需要启动才能执行新的E2E测试
