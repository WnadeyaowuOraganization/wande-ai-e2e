# 中层测试记录 — PR #90

**仓库**: wande-data-pipeline
**PR标题**: feat(关键词学习): 效果追踪+无效词降权+Top20/Bottom20报告 v3.0
**关联Issue**: pipeline#17
**测试时间**: 2026-04-02T01:27+08:00

## 变更范围
- `pipelines/domestic_projects/keyword_learner.py`
- `smart_project_discovery.py`, `ggzy_collector.py`
- 部署cron配置
- `issues/issue-17/task.md`, `issue-18` 文档

## 覆盖度评估
- 矩阵映射: partial（已有 `tests/pipeline/api/pipeline-health.spec.ts`）
- 分类: B（部分覆盖）→ 直接执行

## 测试结果
- pipeline 测试: **17 passed, 1 failed**
- 失败用例: `project mine API returns data with valid token`（500错误）
- **失败原因**: 已知 backend dev 环境问题（backend#951，`wdpp_discovered_projects.status` 字段缺失），非本PR引入
- pipeline专属文件测试全部通过
- 结果: **通过（已知环境问题阻塞）**

## 处理状态
- [x] E2E测试通过（pipeline本身无问题）
- [ ] 无法approve（`Can not approve your own pull request` — 作者为 wandeyaowu）
- [ ] merge被阻塞: dirty state (merge conflict)

## 下一步
1. 编程CC解决与 `dev` 分支的merge conflict
2. backend#951 修复后project mine API将恢复
3. 之后重新触发中层测试
