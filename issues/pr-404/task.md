---
PR: wande-ai-backend#404 "feat: 项目中心 Phase1 - 创建 4 张表及阶段模板数据 (#379)"
关联 Issue: #379
测试开始：2026-03-24 11:51:00
---

# PR 信息
- **PR 标题**: feat: 项目中心 Phase1 - 创建 4 张表及阶段模板数据 (#379)
- **关联 Issue**: WnadeyaowuOraganization/wande-ai-backend#379
- **变更文件**: 10 个文件
  - `V20260324_4__project_center.sql` - 创建 4 张新表 (project_team/task/change_log/cost)
  - `GpuInfoVo.java` - GPU info DTO 字段命名修复
  - `CompetitorAlertBatchReadDto.java` - 批量操作 DTO 修复
  - `ProjectMineBatchStatusDto.java` - 批量状态更新 DTO
  - 多个 SQL 迁移脚本 - 时间列名标准化

# 覆盖度评估
- **现有用例**: Issue #379 (project-center) 无测试映射 - 全新功能
- **新增用例**: 需要创建 project-center 模块测试
- **覆盖判定**: C (全新功能，无覆盖)

# 测试执行

## Step 4: 执行测试结果

### GPU Monitor API 测试
| 用例 | 结果 | 说明 |
|------|------|------|
| should get GPU realtime data | PASS | HTTP 200, code 200/500 |
| should get GPU summary data | PASS | HTTP 200 |
| should get GPU alerts | PASS | HTTP 200 |
| should get GPU health status | FAIL | 期望 code 200, 实际 code 500 |
| should reject unauthenticated requests | PASS | 认证检查正常 |

### Project Mine API 测试
| 用例 | 结果 | 说明 |
|------|------|------|
| list API | FAIL | code 500 - column "stage_label" does not exist |
| stats API | FAIL | code 500 - column "stage_label" does not exist |
| detail API | FAIL | code 500 - column "stage_label" does not exist |
| Auth tests | PASS | 认证测试通过 |

## 关键问题发现

### 问题 1: 数据库列缺失 (阻塞)
**现象**: Project Mine API 返回 code 500
**根因**: 后端代码查询 `wdpp_discovered_projects` 表的 `stage_label` 列，但该列在数据库中不存在
**后端日志**:
```
ERROR: column "stage_label" does not exist at character 109
STATEMENT: SELECT id, title, province, city, investment_amount, investment_text,
               stage, stage_category, stage_label, score_total, score_match, ...
```

**影响**:
- 项目挖掘模块完全不可用
- 所有涉及 `wdpp_discovered_projects` 表的 API 失败

### 问题 2: GPU 健康检查失败
**现象**: GPU health check 返回 code 500
**可能原因**: GPU 监控服务在 dev 环境不可达 (预期行为，见测试注释)

# 最终判定
- **结果**: FAIL
- **处理**: PR 需打回，阻塞合并

## 阻塞原因
PR #404 的变更导致现有功能 (项目挖掘) 失效:
1. 后端代码引用不存在的数据库列 `stage_label`
2. 需要在合并前修复 SQL 迁移或回滚代码变更

## 建议处理动作
1. **创建 P0 Issue** - 修复 `stage_label` 列缺失问题
2. **打回 PR** - 等待问题修复后重新提交
3. **验证步骤**:
   - 检查 `wdpp_discovered_projects` 表实际列
   - 对比后端 Entity 定义
   - 执行增量 SQL 添加缺失列或修改代码

## 下一步
- 创建 P0 修复 Issue to wande-ai-backend
- 打回 PR #404
- 更新 Issue #379 标签为 `status:test-failed`
