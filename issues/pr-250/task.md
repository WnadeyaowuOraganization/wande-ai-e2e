---
PR: wande-ai-front#250 应收账款管理
关联Issue: #180
测试开始: 2026-03-28
测试结束: 2026-03-28
baseRef: main
---

# 第一步：理解PR
- 标题: feat: 应收账款管理页面 - Issue #180
- 关联Issue: Fixes #180
- 变更文件: 23个文件
- 影响模块: finance/receivable, project, tool-detail

# 第二步：查找现有用例
- 测试文件: tests/smoke/receivable.spec.ts (14个测试用例)

# 第三步：覆盖度评估
- 覆盖判定: A (完整覆盖)

# 第四步：测试执行
| 用例 | 结果 |
|------|------|
| receivable page loads successfully | FAIL |
| receivable page displays statistics panel | FAIL |
| receivable page displays tabs | FAIL |
| receivable page displays customer receivables table | FAIL |
| receivable page displays search form | FAIL |
| receivable page displays customer name input | FAIL |
| receivable page displays overdue filter | PASS |
| receivable page displays aging chart | PASS |
| receivable page displays collection center | PASS |
| receivable page displays overdue list | PASS |
| receivable page displays collection button | PASS |
| receivable page displays history button | PASS |
| receivable page displays export button | PASS |
| receivable page displays refresh button | PASS |

**总计**: 8 通过 / 6 失败

# 第五步：结果处理
- 结果: FAIL
- 失败原因: 页面404 - 菜单未在sys_menu表中注册
- 处理: PR已打回，创建后端Issue #670

# 关联Issue
- 后端Issue: WnadeyaowuOrganization/wande-ai-backend#670
