# PR #905 测试任务

## 状态
- 创建时间: 2026-04-01 02:31
- 测试状态: test-failed
- 结果: 阻塞 - 代码未部署

## PR信息
- 仓库: wande-ai-backend
- PR: #905 - feat(tool): 工具管理Service+API — 超管CRUD+用户端只读 #567
- 标签: status:test-failed

## 测试执行记录

### 测试轮次1 (2026-04-01 02:31)
- 状态: failed
- API测试: ❌ 无法测试 - 代码未部署
- 错误信息: PR代码未部署到测试环境

## 阻塞原因
PR代码尚未部署到G7e dev环境。

## 测试轮次2 (2026-04-01 05:35)
- 状态: **部分通过**
- Dev环境: ✅ 已恢复

| 测试用例 | 状态 | 说明 |
|---------|------|------|
| Admin GET /list requires auth | ✅ 通过 | - |
| Admin GET /{id} requires auth | ❌ 失败 | 返回500而非401 |
| Admin POST requires auth | ✅ 通过 | - |
| User GET /list requires auth | ✅ 通过 | - |
| User GET /{id} requires auth | ✅ 通过 | - |
| Admin GET /list (auth) | ✅ 通过 | - |
| Admin GET /{id} (auth) | ✅ 通过 | - |
| Admin GET /{id}/versions | ✅ 通过 | - |
| Admin GET /{id}/configs | ✅ 通过 | - |
| User GET /list (auth) | ✅ 通过 | - |
| User GET /{id} (auth) | ✅ 通过 | - |
| User GET /{id}/versions | ✅ 通过 | - |
| User GET /{id}/guide | ✅ 通过 | - |

### 失败详情
- `/api/admin/tool/{id}` 未认证访问时返回500，应为401

### 操作
- 提交 request-changes review
- 保持 status:test-failed 标签

## 下一步
1. 修复AdminToolController的异常处理，未认证时返回401
2. 重新触发测试
