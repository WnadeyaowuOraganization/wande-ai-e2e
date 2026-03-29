---
PR: wande-ai-backend#684 项目挖掘API数据库列缺失修复
关联Issue: #662
测试开始: 2026-03-29 02:10:00 CST
---

# PR信息
- **标题**: fix(#662): 项目挖掘API数据库列缺失修复
- **变更类型**: Bug修复
- **变更文件**:
  - ProjectMine Entity/Vo/Bo/MapperXML - 修复数据库列匹配
  - UserFeedback 相关文件 - 导入路径修复
  - DesignTask 相关文件 - 禁用缺失依赖
- **影响模块**: 项目挖掘(project-mine)

# 覆盖度评估
- **现有用例**: tests/api/project-mine.spec.ts, tests/smoke/project-mine-page.spec.ts
- **测试策略**: 运行项目挖掘相关测试
