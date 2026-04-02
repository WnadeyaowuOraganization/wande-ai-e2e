# 中层测试记录 — PR #958

**仓库**: wande-ai-backend
**PR标题**: fix(alias-conflict): 删除重复类解决 MyBatis alias 冲突 #955
**关联Issue**: backend#955
**测试时间**: 2026-04-02T01:27+08:00

## 变更范围
- 删除重复 domain 类: `AuditLog`, `AiSuggestion`, `Annotation`, `Component`, `DesignTask`, `DocumentTranslation`, `TemplateLang`, `UserFeedback` 等
- `ruoyi-modules-api` 与 `ruoyi-modules` 之间的重复类清理

## 覆盖度评估
- Bug修复类变更（D类），必须确保回归测试通过
- 涉及大量domain类的删除，依赖编译通过和现有测试回归

## 测试结果
- backend API + smoke 测试: **328 passed, 26 skipped, 0 failed**
- 回归测试全部通过，无MyBatis alias冲突
- 结果: **通过**

## 处理状态
- [x] E2E测试通过
- [ ] 无法approve（`Can not approve your own pull request` — 作者为 wandeyaowu）
- [ ] merge被阻塞: dirty state (merge conflict)

## 下一步
编程CC需要解决与 `dev` 分支的merge conflict后重新触发中层测试。
