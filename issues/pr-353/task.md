# PR #353 中层测试记录

**测试时间**: 2026-03-31 16:45
**仓库**: wande-ai-front
**关联 Issue**: #122
**PR 标题**: feat(dashboard): 开发效率看板页面 — 核心指标卡片+趋势图+周月切换+明细表 #122

## 覆盖度评估
- 已有 tests/front/smoke/dev-efficiency-page.spec.ts（A级）。

## 执行结果
- 测试命令: `npx playwright test tests/front/ --reporter=list`
- 结果: **Blocked**
- 原因: Backend dev 环境 API 不稳定（ECONNREFUSED / 500 / 旧模块未部署），导致全量回归及 front smoke 登录流程受环境性失败影响，无法确认本 PR 页面安全性。
- 结论: 本轮不 approve/merge。等待环境恢复后在中层测试下一周期重测。

## 失败分析
- Front 测试: 445 passed, 154 skipped, 3 did not run, **212 failed**
- 失败大量集中在 backend api-tests（brand、prompt-templates、contract、crm-direct-sales 等旧模块未部署），以及部分 front smoke（workflow-pages、workspace-page 因 backend login ECONNREFUSED 失败）。属于环境问题，非 PR 代码缺陷。
