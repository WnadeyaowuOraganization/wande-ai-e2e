# PR #1100 测试任务

## PR信息
- **标题**: feat(crm): 三模式信息 SOP 配置 — Issue #637
- **分支**: feature-issue-637-restored
- **关联Issue**: #637

## 变更范围
- ClientIntelligenceRuleController (REST API: /wande/intelligence/sop-rules)
- SOP 规则 CRUD + 按销售模式查询

## 覆盖度评估
- **状态**: C (无覆盖) → 已补充测试
- **测试文件**: tests/backend/api/client-intelligence-rule.spec.ts

## 测试结果

### 2026-04-02 中层E2E测试
- **状态**: ❌ FAIL
- **失败场景**: SOP规则列表API (GET /wande/intelligence/sop-rules/list)
- **错误摘要**: code: 500, relation "wdpp_client_intelligence_rules" does not exist
- **根因分析**: 增量 SQL `2026-04-02-create-client-intelligence-rules.sql` 使用了 MySQL 语法 (`BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT`)，不兼容 PostgreSQL，导致建表失败。
- **合并状态**: 未合并，已在 PR 评论标记失败
- **Issue 看板**: Todo (status:test-failed)

