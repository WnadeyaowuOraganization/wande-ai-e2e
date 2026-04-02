# 中层E2E测试汇总 2026-04-02 20:35

## 扫描结果
- **仓库**: wande-ai-backend
- **Open PR (base=dev)**: 9 个
- **其他仓库**: 无 open PR

## 各PR测试结论

### ✅ MERGE (已通过并合并到 dev)
| PR | Issue | 标题 | 测试结果 | 备注 |
|----|-------|------|---------|------|
| #1089 | #635 | Phase2 信息质量计算引擎Service | PASS | 由 #1099 API 间接覆盖验证 |
| #1099 | #636 | 信息质量API系统 | PASS | 14 passed, 0 failed |
| #1101 | #639 | 国贸客户尽调清单 | PASS | 8 passed, 0 failed |

### ❌ FAIL (已打回，需修复)
| PR | Issue | 标题 | 失败原因 |
|----|-------|------|---------|
| #1090 | #634 | 商机情报字段+红绿灯 | `integer out of range` 插入报错 (business_opportunities) |
| #1097 | #638 | 经销商信息提交模板 | 缺少 `wdpp_dealer_submissions` 建表 SQL |
| #1100 | #637 | 三模式信息SOP配置 | SQL 语法错误 (MySQL AUTO_INCREMENT 不兼容 PostgreSQL) |

### ⚠️ CONFLICT (无法自动合并到 dev)
| PR | Issue | 标题 |
|----|-------|------|
| #1071 | #623 | 模具库数据化功能 |
| #1072 | #171 | 合同编号生成API |
| #1073 | #252 | 开发效率统计API |

## 新增测试文件
- `tests/backend/api/dealer-submission.spec.ts` (#638)
- `tests/backend/api/intelligence.spec.ts` (#636)
- `tests/backend/api/client-intelligence-rule.spec.ts` (#637)
- `tests/backend/api/due-diligence.spec.ts` (#639)

## 环境说明
- **关键修复**: #1100 本地 merge 修复了 `MoldLibraryMapper` bean 冲突， unblock 了 dev 启动。但 #1100 自身 SQL 有 bug，最终未 push 到 remote dev。
- **Remote dev 状态**: 当前 remote dev 仍然缺少 #1100 的 bean 修复，启动仍会失败（ moldLibraryMapper 冲突）。已通过测试的 #1089/#1099/#1101 已 push 到 remote dev。
