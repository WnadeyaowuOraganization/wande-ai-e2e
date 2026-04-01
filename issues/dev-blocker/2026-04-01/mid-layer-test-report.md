# 中层测试报告 - 2026-04-01

## 测试时间
2026-04-01 02:45

## 测试范围
扫描4个仓库的open PR（base=dev），排除已标记e2e:tested和human-only的PR

## 待测PR清单

### wande-ai-backend (4个)
| PR | 标题 | 状态 | 测试结果 |
|----|------|------|---------|
| #912 | feat(cockpit): CC API调用质量监控 - 输入输出比异常检测+token浪费告警 #698 | test-failed | ✅ 测试通过 |
| #906 | feat(dashboard): Issue #698 CC API调用质量监控 — 后端 + 测试 + G7e脚本 | test-failed | ✅ 测试通过 |
| #905 | feat(tool): 工具管理Service+API — 超管CRUD+用户端只读 #567 | test-failed | ✅ 测试通过 |
| #850 | feat(dashboard): 修复开发阻塞主动提醒功能代码结构 #485 | test-failed | ✅ 测试通过 |

### wande-ai-front (1个)
| PR | 标题 | 状态 | 测试结果 |
|----|------|------|---------|
| #421 | feat(dashboard): 渐进式信息展示 drill-down 标杆改造 #390 #416 | 无标签 | ✅ 测试通过 |

### wande-data-pipeline (0个)
- 无待测PR（全部已标记e2e:tested）

### wande-gh-plugins (0个)
- 无open PR

## 测试执行结果

### Backend API测试
```
npx playwright test tests/backend/api/
结果: 301 passed, 25 skipped
```

### Frontend测试
```
npx playwright test tests/front/
结果: 461 passed, 63 skipped
```

## 阻塞原因

所有5个PR的**测试均已通过**，但无法完成审批和合并：

**原因**: PR创建者均为 `wandeyaowu`，当前测试账号也是 `wandeyaowu`
GitHub限制用户不能审批自己的PR

## 建议操作

需要另一位有权限的团队成员执行以下操作：

```bash
# 审批并合并 Backend PRs
gh pr review 912 --repo WnadeyaowuOraganization/wande-ai-backend --approve --body "E2E测试通过"
gh pr review 906 --repo WnadeyaowuOraganization/wande-ai-backend --approve --body "E2E测试通过"
gh pr review 905 --repo WnadeyaowuOraganization/wande-ai-backend --approve --body "E2E测试通过"
gh pr review 850 --repo WnadeyaowuOraganization/wande-ai-backend --approve --body "E2E测试通过"

# 审批并合并 Front PR
gh pr review 421 --repo WnadeyaowuOraganization/wande-ai-front --approve --body "E2E测试通过"

# 合并（可选，也可以让原创建者合并）
gh pr merge <PR_NUMBER> --squash --delete-branch
```

## 更新标签

测试通过后，需要更新PR标签：
- 移除: `status:test-failed`
- 添加: `e2e:tested`

---
测试CC执行
