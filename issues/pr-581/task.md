---
PR: wande-ai-backend#581 - fix(#347): 同步增量 SQL 文件与初始化脚本 - 添加 BaseEntity 兼容字段
关联 Issue: #347
测试开始：2026-03-27
---

# PR 信息
- **变更文件**: script/sql/update/wande_ai/2026-03-24-add-hr-tables.sql
- **影响模块**: hr (HR 人力资源管理)
- **变更内容**:
  - 添加 create_dept 和 deleted 字段（BaseEntity 兼容）
  - create_by/update_by 从 INTEGER 改为 BIGINT

# 覆盖度评估
- 现有用例：需要创建 HR 模块测试
- 新增用例：待评估
- 覆盖判定：C (无覆盖 - 全新功能)

# 测试执行
| 用例 | 结果 | 说明 |
|------|------|------|
| 未认证访问测试（应返回 401） | FAIL | 返回 200，未认证拦截 |
| 员工列表测试 | FAIL | HTTP 500 - 数据库迁移未应用 |
| 员工详情测试 | SKIP | 列表无数据 |
| 员工统计测试 | FAIL | HTTP 500 - 数据库迁移未应用 |

# 最终判定
- 结果：FAIL
- 处理：PR 已打回，创建 P0 修复 Issue

**失败原因**: 数据库迁移脚本未应用到测试环境，导致 HR 表缺少 BaseEntity 兼容字段
- hr_employees 表缺少：create_dept (BIGINT), deleted (BOOLEAN)
- hr_employees 表字段类型不匹配：create_by/update_by 应为 BIGINT（当前为 INTEGER）
- hr_contracts 表缺少：create_dept (BIGINT), deleted (BOOLEAN)
- hr_contracts 表字段类型不匹配：create_by/update_by 应为 BIGINT（当前为 INTEGER）
- hr_employee_changes 表缺少：create_by (BIGINT), create_dept (BIGINT)
