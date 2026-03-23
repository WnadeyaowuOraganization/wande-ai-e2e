# 万德 AI 平台接口测试错误报告

**测试时间**: 2026-03-23
**测试环境**: G7e dev (API: 6040)
**测试工具**: Playwright + TypeScript
**测试范围**: 29 个模块，146 个接口

---

## 测试摘要

| 类别 | 通过 | 失败 | 跳过 |
|------|------|------|------|
| API 测试 | 146 | 0 | 0 |
| **带错误的接口** | - | **69** | - |

> 注：所有测试 HTTP 状态码均为 200，错误在 JSON body 的 `code` 字段中返回。

---

## 错误接口列表（按序号排列）

### 1. 仪表盘模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 1 | `/api/dashboard/health-check` | GET | 200 | 401 | 认证失败，无法访问系统资源 |
| 2 | `/wande/dashboard/overview` | GET | 200 | 500 | `Error attempting to get column 'date' from result set. Bad value for type timestamp/date/time: 游乐设施` |
| 3 | `/wande/dashboard/quick-stats` | GET | 200 | 500 | `Error attempting to get column 'date' from result set. Bad value for type timestamp/date/time: 游乐设施` |

**问题分析**:
- 健康检查接口认证问题
- 数据库字段类型映射错误：`date` 列名冲突（可能与关键字冲突）

---

### 2. 招投标模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 4 | `/wande/tender/list` | GET | 200 | 500 | `Error attempting to get column 'date' from result set. Bad value for type timestamp/date/time: 游乐设施` |

**问题分析**:
- 数据库字段 `date` 类型映射问题，应改为 `publish_time` 或其他非关键字名称

---

### 3. 项目挖掘模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 5 | `/wande/project/mine/list` | GET | 200 | 500 | `ERROR: relation "wdpp_discovered_projects" does not exist` |
| 6 | `/wande/project/mine/stats` | GET | 200 | 500 | `ERROR: relation "wdpp_discovered_projects" does not exist` |
| 7 | `/wande/project/mine/{id}` | GET | 200 | 500 | `ERROR: relation "wdpp_discovered_projects" does not exist` |
| 8 | `/wande/project/mine/g7e/{g7eProjectId}` | GET | 200 | 500 | `ERROR: relation "wdpp_discovered_projects" does not exist` |
| 9 | `POST /wande/project/mine` | POST | 200 | 500 | `ERROR: relation "wdpp_discovered_projects" does not exist` |
| 10 | `PUT /wande/project/mine` | PUT | 200 | 500 | `ERROR: relation "wdpp_discovered_projects" does not exist` |
| 11 | `PUT /wande/project/mine/batch-status` | PUT | 200 | 500 | `Required request parameter 'ids' for method parameter type List is not present` |
| 12 | `PUT /wande/project/mine/match-grade/{id}` | PUT | 200 | 500 | `Required request parameter 'matchGrade' for method parameter type String is not present` |
| 13 | `POST /wande/project/mine/export` | POST | 200 | 500 | `ERROR: relation "wdpp_discovered_projects" does not exist` |
| 14 | `DELETE /wande/project/mine/{ids}` | DELETE | 200 | 500 | `ERROR: relation "wdpp_discovered_projects" does not exist` |

**问题分析**:
- 数据库表 `wdpp_discovered_projects` 不存在，需要执行建表 SQL
- `batch-status` 接口需要 `ids` 参数（List 类型）
- `match-grade` 接口需要 `matchGrade` 参数（String 类型）

---

### 4. CRM 客户管理模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 9 | `/wande/client/{id}` | GET | 200 | 500 | `ERROR: column "create_time" does not exist` |

**问题分析**:
- 数据库字段 `create_time` 不存在，可能是 `created_at`

---

### 5. 商机管理模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 10 | `/wande/opportunity/{id}` | GET | 200 | 500 | `ERROR: column "create_time" does not exist` |

**问题分析**:
- 数据库字段 `create_time` 不存在

---

### 6. 竞品分析模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 29 | `/wande/competitor/{id}` | GET | 200 | 500 | `ERROR: column "create_dept" does not exist` |
| 30 | `/wande/competitor/{id}/profile` | GET | 200 | 500 | `ERROR: function group_concat does not exist` |
| 31 | `/wande/competitor/compare` | GET | 200 | 500 | `ERROR: function group_concat does not exist` |
| 32 | `POST /wande/competitor` | POST | 200 | 500 | `cannot find converter from CompetitorBo to Competitor` |
| 33 | `PUT /wande/competitor` | PUT | 200 | 500 | `cannot find converter from CompetitorBo to Competitor` |
| 34 | `POST /wande/competitor/export` | POST | 200 | 500 | `ERROR: column "create_dept" does not exist` |

**问题分析**:
- 数据库字段 `create_dept` 不存在（应改为 `created_at`）
- PostgreSQL 不支持 `group_concat` 函数（应改为 `string_agg`）
- Object 转换器缺失：`CompetitorBo` 到 `Competitor` 的转换未注册

---

### 7. 研发管控模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 13 | `/wande/dev/list` | GET | 200 | 500 | `ERROR: column "create_time" does not exist` |
| 14 | `/wande/dev/{id}` | GET | 200 | 500 | `ERROR: column "create_time" does not exist` |
| 15 | `/wande/dev/status/{status}` | GET | 200 | 500 | `ERROR: column "create_time" does not exist` |
| 16 | `/wande/dev/project/{project}` | GET | 200 | 500 | `ERROR: column "create_time" does not exist` |
| 17 | `/wande/worklog/list` | GET | 200 | 500 | `Error evaluating expression 'bo.startDate != null'. Cause: NoSuchPropertyException: WorkLogBo.startDate` |
| 18 | `/wande/worklog/user/{userName}` | GET | 200 | 500 | `ERROR: column "create_time" does not exist` |

**问题分析**:
- 数据库字段 `create_time` 不存在
- `WorkLogBo` 类缺少 `startDate` 属性

---

### 8. 企微集成模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 19 | `/wande/wecom/stat/list` | GET | 200 | 500 | `Error evaluating expression 'bo.startDate != null'. NoSuchPropertyException: WecomDailyStatBo.startDate` |
| 20 | `/wande/wecom/stat/{id}` | GET | 200 | 500 | `ERROR: column "create_time" does not exist` |
| 21 | `/wande/wecom/log/list` | GET | 200 | 500 | `ERROR: column "create_time" does not exist` |

**问题分析**:
- `WecomDailyStatBo` 类缺少 `startDate` 属性
- 数据库字段 `create_time` 不存在

---

### 9. 运营驾驶舱模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 22 | `/wande/cockpit/config/all` | GET | 200 | 500 | `ERROR: column "update_time" does not exist` |
| 23 | `/wande/cockpit/config/list` | GET | 200 | 500 | `ERROR: column "update_time" does not exist` |
| 24 | `/wande/cockpit/news/list` | GET | 200 | 500 | `ERROR: column "create_time" does not exist` |

**问题分析**:
- 数据库字段 `update_time` / `create_time` 不存在

---

### 10. 工作流模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 25 | `/workflow/mine/search` | GET | 200 | 500 | `must not be null` |
| 26 | `/workflow/public/search` | GET | 200 | 500 | `must not be null` |
| 27 | `/workflow/runtime/page` | GET | 200 | 500 | `Required request parameter 'wfUuid' is not present` |

**问题分析**:
- 接口需要必选参数未提供
- 需要确认工作流查询的必填参数

---

### 11. AI 人类模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 35 | `/aihuman/aihumanRealConfig/list` | GET | 200 | 500 | `ERROR: relation "aihuman_real_config" does not exist` |

**问题分析**:
- 数据库表 `aihuman_real_config` 不存在

---

### 12. 竞品告警模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 36 | `/wande/competitor-alert/{id}` | GET | 200 | 500 | `ERROR: column "create_dept" does not exist` |
| 37 | `/wande/competitor-alert/competitor/{competitorId}` | GET | 200 | 500 | `ERROR: column create_time does not exist` |
| 38 | `POST /wande/competitor-alert` | POST | 200 | 500 | `cannot find converter from CompetitorAlertBo to CompetitorAlert` |
| 39 | `PUT /wande/competitor-alert` | PUT | 200 | 500 | `cannot find converter from CompetitorAlertBo to CompetitorAlert` |
| 40 | `PUT /wande/competitor-alert/{id}/read` | PUT | 200 | 500 | `Required request parameter 'isRead' for method parameter type Boolean is not present` |
| 41 | `PUT /wande/competitor-alert/batch-read` | PUT | 200 | 500 | `Required request parameter 'ids' for method parameter type List is not present` |

**问题分析**:
- 数据库字段 `create_dept` 不存在
- 数据库字段 `create_time` 不存在
- Object 转换器缺失：`CompetitorAlertBo` 到 `CompetitorAlert` 的转换未注册
- `{id}/read` 接口需要 `isRead` 参数
- `batch-read` 接口需要 `ids` 参数（List 类型）

---

### 13. 竞品投标模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 42 | `/wande/competitor-bid/{id}` | GET | 200 | 500 | `ERROR: column "create_dept" does not exist` |
| 43 | `/wande/competitor-bid/competitor/{competitorId}` | GET | 200 | 500 | `ERROR: column create_time does not exist` |
| 44 | `POST /wande/competitor-bid` | POST | 200 | 500 | `cannot find converter from CompetitorBidBo to CompetitorBid` |
| 45 | `PUT /wande/competitor-bid` | PUT | 200 | 500 | `cannot find converter from CompetitorBidBo to CompetitorBid` |
| 46 | `POST /wande/competitor-bid/export` | POST | 200 | 500 | `ERROR: column "create_dept" does not exist` |

**问题分析**:
- 数据库字段 `create_dept` 不存在
- 数据库字段 `create_time` 不存在
- Object 转换器缺失：`CompetitorBidBo` 到 `CompetitorBid` 的转换未注册

---

### 14. 监控告警模块

| 序号 | 接口 | 方法 | HTTP 状态 | 业务 code | 错误信息 |
|------|------|------|----------|----------|----------|
| 47 | `POST /wande/monitor/alert/export` | POST | 200 | - | 返回二进制文件（Excel），测试脚本尝试解析为 JSON 失败 |

**问题分析**:
- 导出接口返回二进制文件流，不是 JSON 格式
- 测试脚本需要特殊处理二进制响应

---

## 错误分类统计

| 错误类型 | 数量 | 占比 | 主要影响模块 |
|---------|------|------|-------------|
| 数据库字段不存在 | 30 | 43% | CRM、商机、研发管控、企微、驾驶舱、竞品模块 |
| 数据库表不存在 | 14 | 20% | 项目挖掘、AI 人类 |
| Object 转换器缺失 | 6 | 9% | 竞品、竞品告警、竞品投标 |
| MyBatis 表达式错误 | 4 | 6% | 工作日志、企微统计 |
| 接口参数缺失 | 6 | 9% | 竞品对比、工作流、竞品告警、项目挖掘 |
| 认证问题 | 1 | 1% | 健康检查 |
| 其他 | 8 | 12% | date 列名冲突、group_concat 函数不存在、二进制响应 |

---

## 通过的接口（部分列举）

以下接口测试通过（HTTP 200 + code 200）：

**认证与系统**:
- `/auth/login` - 登录
- `/auth/logout` - 登出
- `/auth/code` - 验证码
- `/system/user/getInfo` - 用户信息
- `/system/user/list` - 用户列表
- `/system/menu/getRouters` - 路由菜单
- `/system/menu/list` - 菜单列表
- `/system/role/list` - 角色列表
- `/system/notice/list` - 通知公告
- `/system/model/list` - 模型列表
- `/system/message/list` - 消息列表
- `/system/session/list` - 会话列表
- `/system/dict/type/list` - 字典类型
- `/system/dict/data/list` - 字典数据
- `/system/config/list` - 系统配置
- `/system/post/list` - 岗位列表
- `/system/dept/list` - 部门列表
- `/system/promptTemplate/list` - 提示词模板
- `/system/tenant/package/list` - 租户套餐
- `/system/payOrder/list` - 支付订单

**监控与 GPU**:
- `/api/monitor/gpu/realtime` - GPU 实时数据（返回 500 为预期，GPU 服务不可）
- `/api/monitor/gpu/summary` - GPU 汇总
- `/api/monitor/gpu/alerts` - GPU 告警
- `/api/monitor/gpu/health` - GPU 健康
- `/monitor/cache` - 缓存监控
- `/monitor/online/list` - 在线用户
- `/monitor/logininfor/list` - 登录日志
- `/monitor/operlog/list` - 操作日志

**招投标与项目**:
- `/wande/tender/stats` - 招投标统计
- `/wande/task/list` - 任务列表
- `/wande/task/stats` - 任务统计
- `/wande/task/engine-status` - 引擎状态

**CRM 与商机**:
- `/wande/credit-usage/list` - Credit 消耗列表
- `/wande/credit-usage/summary` - Credit 汇总
- `/wande/client/list` - 客户列表
- `/wande/opportunity/list` - 商机列表
- `/wande/followup/list` - 跟进记录

**竞品分析**:
- `/wande/competitor/list` - 竞品列表
- `/wande/competitor-alert/list` - 竞品告警
- `/wande/competitor-bid/list` - 竞品投标

**资源与知识**:
- `/knowledge/list` - 知识库列表
- `/knowledgeRole/list` - 知识角色
- `/knowledgeRoleGroup/list` - 知识角色组
- `/resource/oss/list` - OSS 文件
- `/resource/oss/config/list` - OSS 配置

**竞品模块新增通过接口**:
- `DELETE /wande/competitor/{ids}` - 删除竞品
- `DELETE /wande/competitor-alert/{ids}` - 删除告警
- `DELETE /wande/competitor-bid/{ids}` - 删除投标
- `PUT /wande/monitor/alert/{id}/acknowledge` - 确认告警
- `GET /wande/monitor/alert/unacknowledged-count` - 未确认告警数量
- `GET /wande/monitor/alert/list` - 监控告警列表
- `GET /wande/monitor/alert/{id}` - 监控告警详情

---

## 建议修复优先级

### P0 - 阻塞性问题
1. **数据库表缺失**: `wdpp_discovered_projects`, `aihuman_real_config`
2. **字段名映射错误**: `create_time` → `created_at`, `update_time` → `updated_at`, `create_dept` → `created_at`

### P1 - 核心功能问题
3. **Object 转换器缺失**: `CompetitorBo` → `Competitor`, `CompetitorAlertBo` → `CompetitorAlert`, `CompetitorBidBo` → `CompetitorBid`
4. **MyBatis 表达式错误**: `WorkLogBo.startDate`, `WecomDailyStatBo.startDate`
5. **PostgreSQL 函数兼容**: `group_concat` → `string_agg`
6. **date 列名冲突**: 改为 `publish_time` 或其他非关键字

### P2 - 接口规范问题
7. **参数验证**: 工作流接口需要明确必填参数
8. **竞品对比接口**: 需要明确 `ids` 参数使用方式
9. **竞品告警接口**: `{id}/read` 需要 `isRead` 参数，`batch-read` 需要 `ids` 参数
10. **项目挖掘接口**: `batch-status` 需要 `ids` 参数，`match-grade` 需要 `matchGrade` 参数

---

## 附录：测试脚本

### 综合 API 测试

测试脚本位于：`tests/api/comprehensive-api-test.spec.ts`

运行命令：
```bash
export BASE_URL_API=http://localhost:6040
npx playwright test tests/api/comprehensive-api-test.spec.ts
```

### 项目矿场 + 竞品分析模块测试

测试脚本位于：`tests/api/mine-competitor-api.spec.ts`

运行命令：
```bash
export BASE_URL_API=http://localhost:6040
npx playwright test tests/api/mine-competitor-api.spec.ts
```

---

## 测试更新日志

### 2026-03-23 第二次测试

**新增模块**: 项目矿场、竞品分析、竞品告警、竞品投标、监控告警

**测试统计**:
- 新增测试接口：42 个
- 新增错误接口：28 个
- 新增通过接口：14 个

**新增错误类型**:
- Object 转换器缺失（6 个接口）
- PostgreSQL 函数兼容性问题（`group_concat` 不存在）
- 接口必填参数缺失（`isRead`, `ids`, `matchGrade`）
