---
测试类型: 全量E2E回归测试
测试开始: 2026-03-28
测试环境: G7e dev (backend:6040, front:8083)
---

# 全量回归测试

## 测试文件清单
- tests/api/auth.spec.ts
- tests/api/project-mine.spec.ts
- tests/api/credit-usage.spec.ts
- tests/api/mine-competitor-api.spec.ts
- tests/api/tender.spec.ts
- tests/api/health.spec.ts
- tests/api/comprehensive-api-test.spec.ts
- tests/api/gpu-monitor.spec.ts
- tests/smoke/credit-usage-page.spec.ts
- tests/smoke/gpu-monitor-page.spec.ts
- tests/smoke/project-mine-page.spec.ts
- tests/smoke/pages-load.spec.ts
- tests/e2e/login-flow.spec.ts

## 测试执行记录

### 测试结果汇总
| 类别 | 通过 | 失败 | 跳过 |
|------|------|------|------|
| API测试 | - | - | - |
| 冒烟测试 | - | - | - |
| E2E测试 | - | - | - |
| **总计** | **85** | **8** | **109** |

### 失败用例分析

#### 1. 项目挖掘API - 数据库列缺失 (P0)
**用例**：
- `should get project mine list with valid token`
- `should get project mine stats with valid token`
- `should get project mine detail with valid token`
- `project mine API endpoints are functional (backend validation)`

**根因**：`wdpp_discovered_projects` 表缺少 `score_match` 列
**错误**：`column "score_match" does not exist`
**归属**：后端
**Issue**: WnadeyaowuOraganization/wande-ai-backend#662

#### 2. 招投标统计API - 数据库列缺失 (P0)
**用例**：`should get tender stats with valid token`

**根因**：`wdpp_tender_data` 表缺少 `status` 列
**错误**：`column "status" does not exist`
**归属**：后端
**Issue**: WnadeyaowuOraganization/wande-ai-backend#663

#### 3. 竞品导出接口 - 测试代码问题 (已修复)
**用例**：
- `POST /wande/competitor/export - 导出竞品`
- `POST /wande/competitor-alert/export - 导出告警`
- `POST /wande/competitor-bid/export - 导出投标`

**根因**：导出接口返回Excel文件(.xlsx)，但测试代码尝试解析为JSON
**修复方案**：修改测试代码，检查返回的Content-Type和文件内容
**状态**：✅ 已修复

---

## 创建的Issue

| Issue | 标题 | 仓库 | 优先级 |
|-------|------|------|--------|
| #662 | 项目挖掘API数据库列缺失 - score_match等字段 | wande-ai-backend | P0 |
| #663 | 招投标统计API数据库列缺失 - status字段 | wande-ai-backend | P0 |

## 测试代码修复

修改 `tests/api/mine-competitor-api.spec.ts` 中3个导出接口测试：
- 改用 `response.body()` 获取二进制数据
- 验证返回Excel文件的magic bytes (PK = 0x50, 0x4b)

## 最终判定

- **后端Bug**: 2个P0 Issue已创建
- **测试代码Bug**: 已修复
- **等待后端修复后重新测试**
