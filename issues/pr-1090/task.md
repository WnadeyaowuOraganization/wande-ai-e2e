# PR #1090 测试任务

## PR信息
- **标题**: feat(商机): 为 business_opportunities 表添加项目级情报字段和红绿灯机制 #634
- **分支**: feature-issue-634
- **关联Issue**: #634

## 变更范围
- BusinessOpportunity Entity/Bo/Vo 新增字段
- 红绿灯机制字段

## 覆盖度评估
- **状态**: A (已有 business-opportunity.spec.ts 覆盖)
- **测试文件**: tests/backend/api/business-opportunity.spec.ts

## 测试结果

### 2026-04-02 中层E2E测试
- **状态**: ❌ FAIL
- **失败场景**: 商机创建API (POST /wande/opportunity)
- **错误摘要**: code: 500, msg: integer out of range
- **根因分析**: 后端日志显示插入 business_opportunities 时出现 PostgreSQL `integer out of range`。可能是 id 生成策略（如雪花算法 Long）与数据库 `integer` 类型不匹配，属于代码/Mapper 层面 bug。
- **合并状态**: 未合并，已 request-changes
- **Issue 看板**: Todo (status:test-failed)

