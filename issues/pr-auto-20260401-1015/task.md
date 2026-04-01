# 中层测试记录 — 2026-04-01 10:15

## 扫描范围
- wande-ai-backend
- wande-ai-front
- wande-data-pipeline
- wande-gh-plugins

## 待测PR清单

| 仓库 | PR | 标题 | 标签 | 状态 |
|------|----|------|------|------|
| wande-ai-backend | #836 | feat(project-mine): 项目分配作战信息卡通知 #360 | e2e:tested | APPROVED / DIRTY |
| wande-ai-backend | #833 | fix(scheduler): GitHub同步修复+增强 — key转换+关闭同步+排序+日志 #599 | e2e:tested | APPROVED / DIRTY |
| wande-ai-backend | #778 | feat(dashboard): 用户反馈管理API — 多渠道收集+AI自动评估+超管审阅 | e2e:tested | APPROVED / DIRTY |
| wande-ai-backend | #771 | feat(dashboard): G7e claude_monitor — Claude Code状态采集+task.md解析+Webhook回调 | e2e:tested | APPROVED / DIRTY |
| wande-ai-front | #348 | feat(mine): 业务员待办中心 — 我的项目列表+通知中心 #163 | e2e:tested | APPROVED / DIRTY |
| wande-ai-front | #344 | feat(project): 矿场运营仪表盘 — 核心指标可视化 #143 | e2e:tested | APPROVED / DIRTY |
| wande-ai-front | #340 | feat(super-admin): 定时任务管理看板页面 #338 | e2e:tested | APPROVED / DIRTY |
| wande-ai-front | #335 | feat(dashboard): 外部工具健康度卡片 #213 | status:blocked | 跳过（阻塞中） |
| wande-ai-front | #312 | feat(cockpit): 像素办公室升级 — 动态工位+线路着色+状态详情 #233 | e2e:tested | APPROVED / DIRTY |
| wande-ai-front | #308 | feat(cockpit): 排程调度中心 — 完整队列管理+线路面板+日志流 #252 | e2e:tested | APPROVED / DIRTY |
| wande-ai-front | #307 | feat(cockpit): 开发者动态+部署管理页面 — 时间线+CI/CD+一键回滚 #31 | e2e:tested | APPROVED / DIRTY |
| wande-data-pipeline | #90 | feat(关键词学习): 效果追踪+无效词降权+Top20/Bottom20报告 v3.0 | e2e:tested | APPROVED / DIRTY |
| wande-data-pipeline | #88 | feat(domestic_projects): 采集引擎配置分离+JSON日志+README #16 | e2e:tested | APPROVED / DIRTY |
| wande-data-pipeline | #87 | add: 添加post-task.sh脚本 #38 | e2e:tested | APPROVED / DIRTY |

## 测试执行
- 所有可测PR均已带有 `e2e:tested` 标签，无需重新执行测试。
- wande-gh-plugins 无 open PR。

## 结果处理

### 通过（APPROVED）
全部 13 个可测PR均已被 approve。

### Merge 尝试
对全部 13 个 APPROVED PR 执行 `gh pr merge --squash --delete-branch`，结果全部失败：
> Pull request is not mergeable: the merge commit cannot be cleanly created.

原因：`mergeStateStatus = DIRTY`，即分支与 base=dev 存在冲突，需先 rebase/解决冲突。

### 阻塞/跳过
- PR #335 (wande-ai-front)：带有 `status:blocked`，按规定跳过测试与审批。

## 下一步
- 编程CC或PR作者需处理以下PR的 rebase 冲突：
  - backend: #836, #833, #778, #771
  - front: #348, #344, #340, #312, #308, #307
  - pipeline: #90, #88, #87
- 冲突解决后，下一次中层测试将重新运行测试并尝试 merge。
