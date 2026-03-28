---
PR: wande-ai-backend#679 fix(menu): 修复前端页面菜单路由配置 #664
关联Issue: #664 [E2E失败] 前端新页面菜单未注册导致404
测试开始: 2026-03-28 23:45:00
---

# PR信息

## 变更文件（关键）
- 增量SQL: 修复sys_menu表菜单配置
- 影响模块: AI渲染助手、产品参数查询中心、应收账款管理、工具详情

## PR描述
- 修复 AI 渲染助手菜单为目录类型(M)，添加渲染首页子菜单以匹配前端静态路由
- 修正工具详情路由路径为 `/wande/tool/detail/:id`
- 修复菜单层级和 path 配置

## 修复的路由
- `/wande/ai-render/index` - 渲染首页
- `/wande/ai-render/history` - 渲染历史
- `/wande/product-center` - 产品参数查询中心
- `/wande/finance/receivable` - 应收账款管理
- `/wande/tool/detail/:id` - 工具详情

# 覆盖度评估

## 现有用例
根据 traceability/requirement-map.json：
- tests/smoke/ai-render.spec.ts (Issue #187)
- tests/smoke/product-center.spec.ts (Issue #192)
- tests/smoke/receivable.spec.ts (Issue #180)
- tests/smoke/tool-detail.spec.ts (Issue #242)

## 覆盖判定: A (完整覆盖)
所有关联Issue已有测试用例，直接执行测试。

# 测试执行

