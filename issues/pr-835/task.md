# PR #835 测试任务 — 修复dashboard-card API 500错误

## PR信息
- **Repository**: wande-ai-backend
- **PR**: #835
- **Title**: fix(ext-tool): 修复dashboard-card API 500错误，@PathVariable显式命名+BigDecimal精度修复 #830
- **Branch**: feature-issue-830
- **Base**: dev

## 变更摘要
- 修复 `@PathVariable` 显式命名
- BigDecimal精度修复
- 影响文件: ExtToolController, ExtToolService等

## 测试执行记录

### 2026-04-01 09:05
**环境**: G7e dev

**执行测试**:
```bash
npx playwright test tests/front/smoke/ext-tool-health-card.spec.ts
```

**结果**: 2 passed, 2 failed, 1 skipped

**测试详情**:
| 测试用例 | 结果 | 备注 |
|---------|------|------|
| dashboard-card API rejects unauthenticated requests | ✅ | 通过 |
| dashboard-card API returns valid data with auth | ❌ | API返回500 |
| dashboard-card API response has expected fields | ⏭️ | 跳过 |
| cockpit page loads with external tool health card | ✅ | 通过 |
| cockpit page has no critical console errors | ❌ | 页面有错误 |

## 结论

**状态**: ❌ 测试失败

**问题**: API返回500错误，说明修复尚未生效或部署

**下一步**:
- [ ] 检查PR是否已合并部署
- [ ] 重新测试验证修复
