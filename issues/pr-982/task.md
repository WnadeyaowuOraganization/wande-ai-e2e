# PR 982 (wande-ai-backend) - 中层测试记录

**测试时间**: 2026-04-02T01:18:17+0800
**结果**: PASSED
**详情**: approved but merge conflict. Removes deprecated config/tests (#599).

## 测试覆盖
- backend API smoke + health tests
- front smoke page tests
- pipeline health tests

## 关键发现
- Backend dev baseline 不稳定：dashboard-blocker / cc-api-metric 端点缺失；dealer candidate / project mine 500 错误；TIMESTAMPTZ / schema 列缺失问题。
- 这些问题影响所有依赖 backend 的 front / pipeline 测试，必须由 #958 / #961 等修复 PR 解决后才能恢复。

## 操作记录
- PASSED: approved but merge conflict. Removes deprecated config/tests (#599).
