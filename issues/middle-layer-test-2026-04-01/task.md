# 中层测试 2026-04-01 04:46

## 测试环境状态
- 前端服务: ✅ http://localhost:8083 (正常)
- 后端服务: ❌ http://localhost:6040 (未启动)

## 扫描结果

### wande-ai-backend (8个open PR)
| PR | 标题 | 标签 | 决策 |
|----|------|------|------|
| #922 | feat(mgmt-fee): 管理费配置 API | 无 | ✅ 测试通过，有合并冲突 |
| #921 | fix(cockpit): 协调统一CC API监控API路径 | blocked | ⏭️ 跳过 |
| #920 | fix(security): SysNoticeController 权限注解修复 | e2e:tested | ✅ 测试通过，有合并冲突 |
| #912 | feat(cockpit): CC API调用质量监控 | test-failed | ⏭️ 跳过 |
| #906 | feat(dashboard): CC API调用质量监控 | test-failed | ⏭️ 跳过 |
| #905 | feat(tool): 工具管理Service+API | test-failed | ⏭️ 跳过 |
| #850 | feat(dashboard): 修复开发阻塞主动提醒 | test-failed | ⏭️ 跳过 |
| #839 | feat(dealer): Phase 3 模块间数据打通 | test-failed | ⏭️ 跳过 |

### wande-ai-front (2个待测PR)
| PR | 标题 | 标签 | 决策 |
|----|------|------|------|
| #428 | feat(dashboard): 外部工具管理页面 | status:blocked | ⏸️ 阻塞(后端未启动) |
| #427 | test(dashboard): 修复 ExtToolsPage 测试 | status:blocked | ⏸️ 阻塞(后端未启动) |

### wande-data-pipeline
- 无待测PR

### wande-gh-plugins
- 无待测PR

## 测试结果

### Backend测试 (6个用例)
- ✅ mgmt-fee.spec.ts: 3 passed
  - GET /wande/mgmt-fee/config/list - 获取管理费配置列表
  - GET /wande/user-feedback/list - 用户反馈列表API
  - POST /wande/user-feedback - 创建用户反馈
- ✅ system-notice.spec.ts: 3 passed
  - notice list API requires authentication
  - notice detail API requires authentication
  - notice list API works with valid token
- **总计: 6/6 passed**

### Frontend测试
- ⏸️ ext-tool-health-card.spec.ts: 5 failed (后端服务未启动)
- **阻塞原因: Dev环境后端服务 http://localhost:6040 未响应**

## 处理决策

### 测试通过但有合并冲突的PR
1. **PR #922** → ✅ approve，添加e2e:tested标签
   - 合并状态: CONFLICTING (需要解决冲突)
2. **PR #920** → ✅ approve，添加e2e:tested标签
   - 合并状态: CONFLICTING (需要解决冲突)

### 阻塞的PR
1. **PR #428** → ⏸️ 添加status:blocked标签，等待后端服务恢复
2. **PR #427** → ⏸️ 添加status:blocked标签，等待后端服务恢复

## GitHub操作记录

```bash
# 已执行
gh pr review 922 --approve --body "✅ E2E测试通过..."
gh issue edit 225 --add-label "e2e:tested"

gh pr review 920 --approve --body "✅ E2E测试通过..."
gh issue edit 44 --add-label "e2e:tested"

gh pr edit 428 --add-label "status:blocked"
gh pr comment 428 --body "⏸️ E2E测试阻塞..."

gh pr edit 427 --add-label "status:blocked"
gh pr comment 427 --body "⏸️ E2E测试阻塞..."
```

## 下一步
- [ ] 通知DevOps检查后端服务状态 (localhost:6040)
- [ ] PR #922, #920 需要开发者解决合并冲突
- [ ] 后端服务恢复后重新测试PR #428, #427
