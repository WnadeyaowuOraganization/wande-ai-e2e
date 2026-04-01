# PR #90 测试记录

## PR信息
- **仓库**: WnadeyaowuOraganization/wande-data-pipeline
- **标题**: feat(关键词学习): 效果追踪+无效词降权+Top20/Bottom20报告 v3.0
- **分支**: feature-issue-17 → dev
- **关联Issue**: #17

## 变更范围
- `pipelines/domestic_projects/keyword_learner.py` (v3.0升级)
- `pipelines/domestic_projects/smart_project_discovery.py` (修复表名/列名)
- `issues/issue-17/task.md`

## 测试执行

### 时间
2026-04-01 13:01

### 测试范围
- tests/pipeline/api/pipeline-health.spec.ts (14 tests)

### 结果
| 状态 | 数量 |
|------|------|
| 通过 | 13/14 |
| 失败 | 1/14 |

### 失败详情
- **测试**: project mine API returns data with valid token
- **原因**: 后端API返回500错误（非PR引入问题）
- **分析**: `/wande/project/mine/list` 服务端错误，与PR变更无关

## PR状态评估

### 合并状态
- **mergeStateStatus**: DIRTY
- **mergeable**: CONFLICTING
- **结论**: PR存在合并冲突，无法自动合并

### 建议操作
1. 需要编程CC解决合并冲突
2. 冲突解决后可重新执行E2E测试
3. 测试通过后（当前13/14通过，唯一失败与PR无关）可以审批合并

## 标签状态
- 当前: `e2e:tested` (绿色)
- 建议保持，等待冲突解决
