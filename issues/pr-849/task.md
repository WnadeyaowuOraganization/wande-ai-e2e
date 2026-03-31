# PR #849 中层测试记录

**测试时间**: 2026-03-31 16:45
**仓库**: wande-ai-backend
**关联 Issue**: #251
**PR 标题**: fix(chat): Dify conversationId UUID校验 — 修复无效UUID报错 #251

## 覆盖度评估
- 已有 tests/backend/api/dify-uuid.spec.ts（A级）。

## 执行结果
- 测试命令: `npx playwright test tests/backend/ --reporter=list`
- 结果: **Blocked**
- 原因: Backend dev 环境 API 不稳定。全量回归出现大量失败（旧模块未部署 / 返回异常 / ECONNREFUSED），无法确认本 PR 变更的安全性。
- 结论: 本轮不 approve/merge。等待环境恢复后在中层测试下一周期重测。

## 失败分析
- Backend 测试: 291 passed, 124 skipped, **134 failed**
- Front 测试: 445 passed, 154 skipped, 3 did not run, **212 failed**
- 失败主要集中在与本次 PR 无关的旧模块（brand、prompt-templates、collab-document、contract、crm-direct-sales、workflow-pages、workspace-page 等），属于环境/部署问题，而非 PR 引入的代码缺陷。
