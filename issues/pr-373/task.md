# PR #373 中层测试记录

**测试时间**: 2026-03-31 17:07
**仓库**: wande-ai-front
**关联 Issue**: #33
**PR 标题**: feat(cockpit): 审批中心+企微通知控制台页面 #33

## 覆盖度评估
- 新增页面 `/wande/common/approval` 和 `/super-admin/wecom-console` 无现有 Playwright 覆盖（C级）。
- 新建测试文件:
  - `tests/front/smoke/approval-center-page.spec.ts`
  - `tests/front/smoke/wecom-console-page.spec.ts`

## 执行结果
- 测试命令: `npx playwright test tests/front/smoke/approval-center-page.spec.ts tests/front/smoke/wecom-console-page.spec.ts --reporter=list`
- 结果: **Skipped / Blocked**
- 页面测试均因 `sys_menu` 未注册对应菜单而被动态 skip（404）。
- 数据库查询确认无 `wande/common/approval` 及 `super-admin/wecom-console` 菜单记录，需 backend 补充增量 SQL。
- 依赖的 backend API（`/wande/cockpit/approvals/*`、`/wande/cockpit/wecom/*`）已被 `dashboard-approval-wecom.spec.ts` 覆盖，但当前 dev 环境 backend 存在部分 500，难以确认前端页面加载后的实际交互稳定性。
- 结论: 本轮不 approve/merge。等待 backend 菜单 SQL 补齐且 API 稳定后重测。菜单缺失属后端配套遗漏。
