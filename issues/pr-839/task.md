# 中层测试工作记录 — backend#839 (dealer Phase3)

## 时间: 2026-03-31 11:35 UTC

## PR信息
- 仓库: wande-ai-backend
- PR: #839 feat(dealer): Phase 3 模块间数据打通 — 招标↔矿场↔CRM联动 #309
- 关联Issue: #309

## 测试结果: ❌ FAIL 8/11

### Unauthenticated (4/4) ✓
- 候选列表 → 401 ✓
- import-from-tender → 401 ✓
- sync-to-crm → 401 ✓
- related-project → 401 ✓

### Phase3 New APIs (3/3) ✓
- POST /import-from-tender/99999 → graceful ✓
- POST /sync-to-crm/99999 → graceful ✓
- GET /related-project/99999 → 200/null ✓

### Base List APIs (0/3) ✗
- GET /candidate/list → 500: TIMESTAMPTZ→LocalDateTime (stage_entered_at)
- GET /bid/list → 500: Mapper XML not found (selectPageBidRecordList)
- GET /followup/list → 500: Mapper XML not found (selectPageFollowUpList)

### 根因
1. SQL类型不兼容: TIMESTAMPTZ列无法映射到Java LocalDateTime
2. Mapper XML缺失: bid/followup的查询方法未部署
3. SQL迁移脚本可能未执行

## 处理
- Issue #309: status:test-failed ✓
- P0 Bugfix Issue: #840 已创建
- PR comment: 失败详情已记录

## 测试文件
- tests/backend/api/dealer.spec.ts (补充了Phase3用例)
