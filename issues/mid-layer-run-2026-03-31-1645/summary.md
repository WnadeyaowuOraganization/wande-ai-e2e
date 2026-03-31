# 中层测试执行报告 — 2026-03-31 16:45

## 扫描结果
- **wande-ai-backend**: 16 open PRs，9 个待测（未标记 e2e:tested 或有 test-failed）
- **wande-ai-front**: 20 open PRs，11 个待测 + 1 个 docs-only
- **wande-data-pipeline**: 3 open PRs（全部已有 e2e:tested）
- **wande-gh-plugins**: 0 open PRs

## 覆盖度评估
| PR | Repo | Issue | 覆盖度 |
|---|---|---|---|
| #861 | backend | #89 | C（无现成用例） |
| #860 | backend | #45 | A（dashboard-command.spec.ts） |
| #859 | backend | #46 | A（dashboard-approval-wecom.spec.ts） |
| #851 | backend | #250 | A（dashboard-acceptance.spec.ts） |
| #850 | backend | #485 | B（blocker + 新表结构） |
| #849 | backend | #251 | A（dify-uuid.spec.ts） |
| #846 | backend | #575 | B（gateway-budget 部分覆盖） |
| #845 | backend | #602 | A（无代码变更） |
| #839 | backend | #309 | A（dealer.spec.ts） |
| #372 | front | #123 | C（无定向页面测试） |
| #370 | front | #251 | A（claude-office-pages.spec.ts） |
| #369 | front | #188 | B（gpu-monitor-page，页面扩展） |
| #368 | front | #155 | B（dashboard/cockpit 通用覆盖） |
| #367 | front | #211 | B（model-pool-page，路由可能不一致） |
| #366 | front | #339 | A（docs-only） |
| #365 | front | #241 | A（vitest only） |
| #363 | front | #244 | A（vitest only） |
| #358 | front | #121 | A（acceptance-center-page.spec.ts） |
| #353 | front | #122 | A（dev-efficiency-page.spec.ts） |
| #352 | front | #117 | A（cron-alert-rules-page.spec.ts） |

## 执行结果
- Backend 全量: `npx playwright test tests/backend/ --reporter=list`
  - 291 passed, 124 skipped, **134 failed**
- Front 全量: `npx playwright test tests/front/ --reporter=list`
  - 445 passed, 154 skipped, 3 did not run, **212 failed**

## 失败根因
Backend dev 环境 API 不稳定，旧模块（brand、prompt-templates、collab-document、contract、crm-direct-sales 等）未部署或返回异常；front 运行期间 backend API 出现 `ECONNREFUSED 127.0.0.1:6040`，导致依赖登录的 smoke 测试失败。**失败属于环境问题，非本次 PR 引入的代码缺陷。**

## 处理结论
- **所有 20 个 PR 本轮标记为 Blocked**，不执行 approve / merge / request-changes。
- 等待 backend API 环境恢复后，在下一中层测试周期重测。
- 对应工作记录已写入 `issues/pr-<N>/task.md`。
