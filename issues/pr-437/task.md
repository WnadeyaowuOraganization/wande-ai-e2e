# PR #437 — wande-ai-front

## 基本信息
- **PR**: [feat: 外部工具健康度卡片 #213](https://github.com/WnadeyaowuOraganization/wande-ai-front/pull/437)
- **Author**: david-hwp
- **关联 Issue**: wande-ai-front#213
- **测试时间**: 2026-04-01 13:46

## 变更范围
- `apps/web-antd/src/api/wande/dashboard.ts`
- `apps/web-antd/src/views/dashboard/cockpit/index.vue`
- `apps/web-antd/src/views/wande/cockpit/index.vue`

## 测试覆盖
- `tests/front/smoke/ext-tool-health-card.spec.ts` (5 cases)
- `tests/front/smoke/cockpit-page.spec.ts` (4 cases, 2 skipped)

## 测试结果
| 用例 | 结果 | 说明 |
|------|------|------|
| dashboard-card API rejects unauth | pass | - |
| dashboard-card API returns valid data with auth | **fail** | backend 500, `dashboard_ext_tools` 表不存在 |
| dashboard-card API response has expected fields | skip | 依赖前一项 |
| cockpit page loads with external tool health card | pass | - |
| cockpit page has no critical console errors | **fail** | 8 个 console 错误（API 500 + budget-overview 缺失） |
| cockpit API endpoints are functional | pass | - |
| frontend serves correctly | pass | - |

## 根因分析
失败均来自后端环境缺失，不是前端代码本身的问题：
1. `/monitor/ext-tool/dashboard-card` 500 因 `dashboard_ext_tools` 表未创建。
2. cockpit console 8 errors 由 API 失败级联触发。

## 处理结论
- **PR 状态**: request-changes（失败 comment 已留痕，因 identity 为 PR 作者本人，无法 request-changes）
- **修复依赖**: backend#477
- **Issue 标签更新**: front#213 已添加 `status:test-failed`，移除 `status:test-passed`
