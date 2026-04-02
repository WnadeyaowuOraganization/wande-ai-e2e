# PR #1074 - 中层E2E测试记录

## 基本信息
- **仓库**: wande-ai-backend
- **PR**: #1074 - fix(tender): 修复 has_embedding 类型不匹配导致后端500错误 - Issue #858
- **分支**: feature-issue-858 → dev
- **测试时间**: 2026-04-02 14:05 CST

## 测试结果
- **状态**: 失败
- **失败场景**: Tender list API 仍返回 500 - has_embedding 类型未修复
- **错误摘要**: `Bad value for type int : t`

## 测试覆盖
- `tests/backend/api/tender.spec.ts`

## 处理结果
- [x] PR comment 标记失败
- [ ] request-changes review（作者为自己的PR，无法执行）
- [x] 更新 Issue #858 标签: status:test-failed（移除 status:in-progress）
- [x] 更新 Project 看板: Todo

## 失败原因分析
Dev 环境数据库 `has_embedding` 字段类型仍为 int/其他类型，与修复后的 Boolean 映射不匹配。SQL 脚本可能尚未应用到 dev 数据库。

## 修复检查清单
- [ ] 确认 SQL 已执行到 dev 数据库
- [ ] 重新部署后端服务到 dev 环境
- [ ] 本地验证: `npx playwright test tests/backend/api/tender.spec.ts --reporter=list`
- [ ] 等待中层E2E自动重测
