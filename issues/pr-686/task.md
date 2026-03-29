---
PR: wande-ai-backend#686 修复 Gateway 子账户管理菜单 component 路径
关联Issue: #685
测试开始: 2026-03-29 02:05:00 CST
---

# PR信息
- **标题**: fix(menu): 修复 Gateway 子账户管理菜单 component 路径 #685
- **变更类型**: Bug修复
- **变更文件**:
  - script/sql/update/ruoyi_ai/2026-03-29-fix-gateway-account-menu-component.sql (增量SQL)
- **影响模块**: Gateway子账户管理页面菜单

# 覆盖度评估
- **变更性质**: 菜单component路径修复
- **现有用例**: tests/smoke/gateway-account-page.spec.ts
- **测试策略**: 验证Gateway Account页面正常加载
