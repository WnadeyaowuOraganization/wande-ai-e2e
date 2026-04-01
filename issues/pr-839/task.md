# PR #839 E2E 测试工作记录

## PR信息
- **编号**: #839
- **标题**: feat(dealer): Phase 3 模块间数据打通 — 招标↔矿场↔CRM联动 #309
- **分支**: feature-issue-309
- **状态**: OPEN
- **标签**: status:test-failed

## 关联Issue
- #309 Phase 3 模块间数据打通

## 测试执行
- **时间**: 2026-04-01
- **范围**: `tests/backend/api/dealer.spec.ts`

## 测试结果
❌ 8 项失败，7 项通过，1 项跳过

## 失败分析

### 1. Dealer 核心 API 返回 500 — TIMESTAMPTZ 转换异常
- **接口**: `GET /wande/dealer/candidate/list`、`GET /wande/dealer/bid/list`、`GET /wande/dealer/followup/list`
- **预期**: code = 200
- **实际**: code = 500
- **错误详情**:
  ```
  Error attempting to get column 'stage_entered_at' from result set.
  Cause: org.postgresql.util.PSQLException: Cannot convert the column of type TIMESTAMPTZ to requested type java.time.LocalDateTime.
  ```
- **根因**: PostgreSQL 中 `stage_entered_at` 字段类型为 `TIMESTAMPTZ`，但 Java Mapper/Entity 映射要求 `java.time.LocalDateTime`，结果集类型转换失败。这是 PR 引入的数据库-代码映射缺陷。

### 2. Phase3 新接口未认证返回 500（类型转换异常连锁反应）
- **接口**: `POST /wande/dealer/candidate/1/sync-to-crm`、`GET /wande/dealer/candidate/1/related-project`、`POST .../import-from-tender/1`
- **预期**: code = 401 (未认证)
- **实际**: code = 500
- **根因**: 上述 TIMESTAMPTZ 转换异常在请求处理链路中提前抛出，导致 Sa-Token 认证拦截器未能正常返回 401，暴露出服务端异常。

## 测试执行记录

### 2026-04-01 08:18
- 执行中层测试
- 结果: 8项失败，3项通过，1项跳过
- 主要问题:
  1. Dealer核心API返回500: TIMESTAMPTZ转换异常
  2. Phase3新接口认证测试失败（返回404而非401）

### 2026-04-01 08:19
- 手动验证: candidate/list返回500，错误为`Cannot convert the column of type TIMESTAMPTZ to requested type java.time.LocalDateTime`

## 已执行动作
- [x] 执行 backend API 测试
- [x] 提交 `request-changes` review
- [x] Issue #309 保持 `status:test-failed`

## 下一步
- [ ] 修复 PostgreSQL `TIMESTAMPTZ` → `LocalDateTime` 映射问题（可将字段类型改为 `TIMESTAMP`，或调整 MyBatis 类型处理器）
- [ ] 重新部署 dev 环境并执行 E2E 测试
