---
PR: wande-ai-backend#681 fix(menu): 修复菜单路由配置使其与测试期望一致 #671
关联Issue: #671
测试开始: 2026-03-29 11:00:00 CST
---

# PR信息

## 变更文件
- issues/issue-662/task.md
- issues/issue-671/task.md
- ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/controller/UserFeedbackController.java
- ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/ProjectMine.java
- ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/bo/ProjectMineBo.java
- ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/vo/ProjectMineVo.java
- ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/vo/UserFeedbackVo.java
- ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/mapper/UserFeedbackMapper.java
- ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/service/impl/ProjectMineServiceImpl.java
- ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/service/impl/UserFeedbackServiceImpl.java
- ruoyi-modules-api/wande-ai-api/src/main/resources/mapper/ProjectMineMapper.xml
- ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/controller/collab/DesignTaskController.java
- ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/controller/collab/DesignTaskController.java.disabled
- ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/service/collab/DesignTaskServiceImpl.java
- ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/service/collab/DesignTaskServiceImpl.java.disabled
- script/sql/update/ruoyi_ai/2026-03-28-fix-menu-routes.sql

## 影响模块
- 菜单系统 (sys_menu)
- UserFeedback模块
- ProjectMine模块
- DesignTask模块

## 关联Issue
- #671: [E2E失败] PR front#254 菜单未注册导致页面404

# 覆盖度评估

## 现有用例
从requirement-map.json中找到：
- tests/smoke/ai-render.spec.ts (@ai-render)
- tests/smoke/product-center.spec.ts (@product-center)
- tests/smoke/receivable.spec.ts (@receivable)
- tests/smoke/tool-detail.spec.ts (@tool-detail)
- tests/api/project-mine.spec.ts (@project-mine)

## 覆盖判定
A: 完整覆盖 - Issue #671 关联的页面测试已存在

# 测试执行

## 环境检查

### 后端状态
- 端口6040: ❌ 服务未运行
- 错误: Bean名称冲突 `g7eServiceConfig`
  - 类1: org.ruoyi.wande.config.G7eServiceConfig
  - 类2: org.ruoyi.wande.config.cockpit.G7eServiceConfig

### 前端状态
- 端口8083: ✅ 正常运行

## 测试结果

**无法执行测试** - 后端服务启动失败

# 最终判定
- 结果: FAIL (阻塞)
- 原因: 后端Bean名称冲突导致服务无法启动
- 处理:
  - 创建P0修复Issue: #692
  - PR评论已发布: https://github.com/WnadeyaowuOrganization/wande-ai-backend/pull/681#issuecomment-4149307831
  - 无法request-changes因为是自己的PR

## 测试结束时间
2026-03-29 11:15:00 CST

