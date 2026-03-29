---
PR: wande-ai-front#227
标题：feat: 完成 Issue #54 - 项目矿场页面 (6 Tab+ 筛选 + 批量操作 + 垃圾桶)
关联 Issue: #54
测试开始：2026-03-24 19:00:00
---

# PR 信息
- **仓库**: wande-ai-front
- **PR 编号**: #227
- **关联 Issue**: #54（项目矿场页面功能增强）
- **变更文件**:
  - `apps/web-antd/src/views/wande/project/index.vue` - 主页面改造（+292/-51）
  - `apps/web-antd/src/views/wande/project/data.ts` - 查询 schema 和列配置（+109/-16）
  - 其他文件为其他 PR 合并内容（员工花名册、样品管理等）

- **影响模块**: `project-mine`（项目挖掘）
- **页面路由**: `/wande-project/project`（从 sys_menu 表确认）

# 变更内容摘要
- 实现 6 个 Tab 切换：前期金矿/当前可投/待我确认/竞对动态/垃圾桶/全部
- 增强筛选栏：省份多选/阶段多选/验证状态/匹配等级/评分范围/金额范围/时间范围/全文搜索
- 批量操作：确认通过/标记为竞对/分配给商务/留待观察/设为分析中/已评估/已归档/批量恢复/批量删除
- 垃圾桶逻辑：放入垃圾桶时需选择原因，支持从垃圾桶恢复
- 统计卡片：项目总数/A 级/B 级/C 级项目统计

# 覆盖度评估
- **现有用例**: 无直接映射（Issue #54 为全新功能）
- **同模块用例**:
  - `tests/api/project-mine.spec.ts` - API 认证测试
  - `tests/smoke/project-mine-page.spec.ts` - 页面冒烟测试（部分跳过）
- **覆盖判定**: 情况 C（无覆盖）- 需要补充测试

# 测试执行计划
1. 运行现有 project-mine API 测试（回归）
2. 运行项目矿场页面冒烟测试（验证 Tab、筛选、批量操作等 UI 元素）
3. 更新 requirement-map.json 添加 Issue #54 映射

# 最终判定
- 结果: PENDING
- 处理: TBD
