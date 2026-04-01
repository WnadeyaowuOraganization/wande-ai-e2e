# PR #839 测试记录

## PR信息
- **仓库**: wande-ai-backend
- **标题**: feat(dealer): Phase 3 模块间数据打通 — 招标↔矿场↔CRM联动 #309
- **分支**: feature-issue-309
- **关联Issue**: #309
- **当前标签**: status:test-failed

## 测试范围
- 经销商候选人列表: `/wande/dealer/candidate/list`
- 从招标导入: `/wande/dealer/candidate/import-from-tender/{tenderId}`
- 同步到CRM: `/wande/dealer/candidate/{id}/sync-to-crm`
- 相关项目: `/wande/dealer/candidate/{id}/related-project`
- 中标记录: `/wande/dealer/candidate/{id}/bids`
- 跟进记录: `/wande/dealer/candidate/{id}/follow-ups`

## 测试结果
❌ **失败** - 2026-04-01

| 测试用例 | 状态 | 错误 |
|---------|------|------|
| 未认证: import-from-tender | ❌ 失败 | 返回500而非401 |
| 未认证: sync-to-crm | ❌ 失败 | 返回500而非401 |
| 未认证: related-project | ❌ 失败 | 返回500而非401 |
| 候选人列表 | ❌ 失败 | 返回500错误 |
| 中标记录 | ❌ 失败 | 返回500错误 |
| 跟进记录 | ❌ 失败 | 返回500错误 |

## 错误详情
API返回500错误，可能是数据库表缺失或代码问题。

## 结论
PR #839 测试失败，需要修复后端API问题。
