---
PR: wande-ai-front#255 - fix: 审批模板启用/禁用二次确认 + 修复路由路径
关联 Issue: #165
测试开始：2026-03-27
---

# PR 信息
- **变更文件**:
  - apps/web-antd/src/views/admin/workflow/components/template-card.vue (Popconfirm 包裹 Switch)
  - apps/web-antd/src/router/routes/modules/wande.ts (accounts-payable 路由路径修复)
- **影响模块**: workflow (审批流管理)
- **变更内容**:
  - template-card.vue: Switch 切换改为 Popconfirm 包裹，需二次确认后才触发 toggle 事件
  - wande.ts: 修复 accounts-payable 路由组件路径错误（payable → accounts-payable）

# 覆盖度评估
- 现有用例：6 个 (tests/smoke/workflow-pages.spec.ts)
  - templates page loads successfully
  - templates page displays category filter
  - templates page shows template cards or empty state
  - groups page loads successfully
  - groups page displays add button
  - groups page displays table
- 新增用例：待创建 Popconfirm 二次确认测试 + 路由路径测试
- 覆盖判定：B (部分覆盖 - 有基础页面测试，但缺少 PR 核心变更的测试)
- 测试计划：
  1. 创建 Popconfirm 二次确认测试（切换模板启用/禁用状态）
  2. 创建 accounts-payable 路由路径测试

# 测试执行
| 用例 | 结果 | 说明 |
|------|------|------|
| template toggle shows Popconfirm confirmation dialog | PASS | Popconfirm 二次确认功能正常 |
| accounts-payable route loads successfully | PASS | 路由路径修复成功 |

# 最终判定
- 结果：PASS
- 处理：PR 已测试通过，可以 merge
