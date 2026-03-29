---
PR: wande-ai-backend#490
标题：fix: 修复项目挖掘模块 stageLabel 字段命名错误 (#488)
关联 Issue: #488
测试开始：2026-03-24
---

# 第一步：理解 PR

## PR 信息
- **PR 编号**: #490
- **标题**: fix: 修复项目挖掘模块 stageLabel 字段命名错误 (#488)
- **关联 Issue**: Fixes #488
- **标签**: size/XL（超大 — 建议拆分）

## 变更摘要
这是一个大型 PR，包含多个修复：
1. **项目挖掘模块**: `stageLabel` → `stageDetail`（修复 Issue #488）
2. **GPU Monitor**: 字段名修复（修复 Issue #394）
3. **批量操作接口**: 修复参数绑定错误（修复 Issue #397）
4. **竞品分析模块**: 添加 BaseEntity 标准字段
5. **数据库表**: 添加 `wdpp_discovered_projects` 表
6. **竞品预警**: 修复批量标记已读 SQL 语法错误（修复 Issue #399）
7. **项目中心 Phase1**: 创建 project_team/task/change_log/cost 4 张表（修复 Issue #379）
8. **Entity 清理**: 清理 created_at/updated_at 冗余字段（修复 Issue #487）
9. **时间列标准化**: 统一 33 张老表时间字段为 BaseEntity 规范

## 变更文件分类
- **Entity/VO/BO**: 约 30+ 个文件（清理冗余字段、字段重命名）
- **Controller**: ProjectMineController, CompetitorAlertController
- **Mapper/XML**: ProjectMineMapper.xml, CompetitorAlertMapper.xml
- **Service**: 多个 ServiceImpl 修复
- **SQL**: 新增 4 个增量 SQL 脚本

## 影响模块
- 项目挖掘（project-mine）
- GPU 监控（gpu-monitor）
- 竞品分析（competitor）
- 竞品预警（competitor-alert）
- 项目中心（project-center）
- 任务调度（task-queue）
- 工作日志（worklog）
- 系统监控（monitor）

# 第二步：查找现有用例

## 直接关联 Issue 的用例

| Issue | 模块 | 测试文件 | 覆盖情况 |
|-------|------|---------|---------|
| #488 | project-mine | tests/api/project-mine.spec.ts | ✅ 完整（list/stats/detail API） |
| #394 | gpu-monitor | tests/api/gpu-monitor.spec.ts | ✅ 完整（realtime/summary/alerts/health） |
| #399 | competitor-alert | tests/api/mine-competitor-api.spec.ts | ✅ 完整（batch-read API） |
| #397 | task-queue | tests/api/mine-competitor-api.spec.ts | ✅ 完整（batch operations） |

## 同模块用例（回归测试）

| 模块 | 测试文件 | 用例数量 |
|------|---------|---------|
| project-mine | tests/api/project-mine.spec.ts | 6 个 |
| project-mine | tests/smoke/project-mine-page.spec.ts | 2 个（活跃） |
| gpu-monitor | tests/api/gpu-monitor.spec.ts | 9 个 |
| gpu-monitor | tests/smoke/gpu-monitor-page.spec.ts | 5 个 |
| competitor/competitor-alert | tests/api/mine-competitor-api.spec.ts | 36 个 |

## 新增测试需求

| 变更内容 | Issue | 是否需要新测试 | 理由 |
|---------|------|--------------|------|
| 项目中心 Phase1 表创建 | #379 | ❌ 否 | 数据库 DDL 变更，无 API 接口，现有 API 测试可间接验证 |
| Entity 清理/时间列标准化 | #487 | ❌ 否 | 内部字段重构，不影响 API 契约，现有测试可验证 |
| 竞品分析 BaseEntity 字段 | - | ❌ 否 | 标准字段添加，不影响现有 API 契约 |
| wdpp_discovered_projects 表 | - | ❌ 否 | project-mine 模块已覆盖 |

**结论**: 现有测试用例已覆盖 PR 中所有 API 接口变更，无需新增测试。

# 第三步：覆盖度评估

## 覆盖度分析

| 变更项 | 关联 Issue | 覆盖情况 | 测试文件 |
|--------|-----------|---------|---------|
| stageLabel → stageDetail | #488 | ✅ 完整 | tests/api/project-mine.spec.ts |
| GPU Monitor 字段修复 | #394 | ✅ 完整 | tests/api/gpu-monitor.spec.ts |
| 批量操作参数绑定 | #397 | ✅ 完整 | tests/api/mine-competitor-api.spec.ts |
| 竞品预警批量标记已读 | #399 | ✅ 完整 | tests/api/mine-competitor-api.spec.ts |
| 项目中心 Phase1 表 | #379 | ✅ 间接 | 无 API，数据库 DDL 变更 |
| Entity 清理/时间列标准化 | #487 | ✅ 间接 | 内部重构，API 契约不变 |
| 竞品分析 BaseEntity 字段 | - | ✅ 间接 | 标准字段，不影响 API |

## 覆盖判定

**判定**: A - 完整覆盖

**理由**:
1. 所有 API 接口变更都有对应的测试用例
2. 数据库 DDL 变更（表创建、字段标准化）不影响 API 契约，现有测试可间接验证
3. Entity 内部字段重构不改变外部接口行为

## 测试执行计划

| 优先级 | 测试类别 | 命令 | 目的 |
|--------|---------|------|------|
| 1 | 直接关联用例 | `--grep "@issue:backend#488"` | 验证 stageLabel 修复 |
| 2 | 直接关联用例 | `--grep "@issue:backend#394"` | 验证 GPU Monitor 修复 |
| 3 | 直接关联用例 | `--grep "@issue:backend#399"` | 验证批量标记已读修复 |
| 4 | 模块回归 | `--grep "@project-mine"` | 回归 project-mine 模块 |
| 5 | 模块回归 | `--grep "@gpu-monitor"` | 回归 gpu-monitor 模块 |
| 6 | 模块回归 | `--grep "@competitor"` | 回归 competitor/competitor-alert 模块 |

# 第四步：执行测试

## 测试环境问题

**发现部署不匹配问题**：

- 数据库表 `wdpp_discovered_projects` 已有 `stage_detail` 列（PR #490 的 DDL 变更）
- 但部署在 port 6040 的后端仍使用 `stage_label` 字段（旧版本代码）
- PR #490 状态：OPEN（未合并到 main）

**验证证据**：
```
数据库 schema 确认：stage_detail 列存在
后端日志：ERROR: column "stage_label" does not exist at character 109
JAR 文件时间：2026-03-24 12:33（PR #490 创建时间 12:15 之前）
```

**问题根因**：
PR #490 是 feature→main 的 PR，尚未合并到 main 分支。dev 环境的 CI/CD 流水线从 main 分支构建，因此部署的是旧版本后端代码。而数据库的增量 SQL 已被执行（添加了 stage_detail 列），导致代码与数据库 schema 不匹配。

**解决方案**：
由于 PR #490 尚未合并，无法在 dev 环境测试。需要：
1. 等待 PR #490 合并到 main 后，CI/CD 会自动部署到 dev
2. 或者手动部署 PR #490 分支到 dev 环境进行测试

**当前状态**：测试暂停，等待 PR #490 部署到 dev 环境

# 第五步：结果处理

（待执行）
