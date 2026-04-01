# PR #850 测试任务

## 状态
- 创建时间: 2026-04-01 02:31
- 测试状态: test-failed
- 结果: 阻塞 - SQL语法错误

## PR信息
- 仓库: wande-ai-backend
- PR: #850 - feat(dashboard): 修复开发阻塞主动提醒功能代码结构 #485
- 标签: status:test-failed

## 测试执行记录

### 测试轮次1 (2026-04-01 02:31)
- 状态: failed
- SQL执行: ❌ 语法错误
  - add-dashboard-blockers.sql: ERROR: AUTO_INCREMENT不支持(PostgreSQL)
  - add-project-mine-feedback-columns.sql: 部分执行成功
- API测试: ❌ 无法测试

## 阻塞原因
1. SQL文件使用MySQL语法(AUTO_INCREMENT)，需要改为PostgreSQL语法(BIGSERIAL)
2. PR代码尚未部署

## 需要修复
- 原MySQL语法: `id BIGINT AUTO_INCREMENT PRIMARY KEY`
- 应改为PostgreSQL语法: `id BIGSERIAL PRIMARY KEY`

## 测试轮次2 (2026-04-01 05:35)
- 状态: **部分通过**
- Dev环境: ✅ 已恢复

| 测试用例 | 状态 | 说明 |
|---------|------|------|
| GET /list requires auth | ✅ 通过 | - |
| GET /stats requires auth | ✅ 通过 | - |
| POST requires auth | ❌ 失败 | 返回500而非401 |
| GET /unresolved-count requires auth | ✅ 通过 | - |
| GET /list (auth) | ✅ 通过 | - |
| GET /stats (auth) | ❌ 失败 | 返回500 |
| GET /unresolved-count (auth) | ❌ 失败 | 返回500 |
| GET /group-by-type (auth) | ❌ 失败 | 返回500 |
| POST should create | ✅ 通过 | - |
| PUT /resolve/{id} | ✅ 通过 | - |
| DELETE /{ids} | ✅ 通过 | - |

### 失败详情
- 部分端点返回500错误，可能是数据库表或查询问题

### 操作
- 提交 request-changes review
- 保持 status:test-failed 标签

## 下一步
1. 修复返回500的端点
2. 重新触发测试
