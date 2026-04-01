# 中层测试记录 2026-04-01 16:13

## 扫描范围
- wande-ai-backend: 5个open PR
- wande-ai-front: 1个open PR
- wande-data-pipeline: 3个open PR（已有e2e:tested标签）
- wande-gh-plugins: 0个open PR

## PR测试结果汇总

### wande-ai-backend

| PR | 标题 | 状态 | 操作 | 结果 |
|---|---|---|---|---|
| #961 | fix(dealer): 修复 E2E 测试失败 #840 | CONFLICTING | request-changes | ❌ 需解决冲突 |
| #960 | fix(ext-tool): 修复dashboard-card API 500错误 #830 | MERGEABLE | approve + merge | ✅ 已合并 |
| #959 | fix: 解决 MyBatis 别名冲突 #917 | MERGEABLE | approve + merge | ✅ 已合并 |
| #958 | fix(alias-conflict): 删除重复类解决 MyBatis alias 冲突 #955 | CONFLICTING | request-changes | ❌ 需解决冲突 |
| #956 | feat(dashboard): Phase3 API #248 | UNKNOWN (空PR) | comment | ⚠️ 无文件变更 |

### wande-ai-front

| PR | 标题 | 状态 | 操作 | 结果 |
|---|---|---|---|---|
| #437 | feat: 外部工具健康度卡片 #213 | CONFLICTING | comment | ⚠️ 已有test-passed标签，但需解决冲突 |

### wande-data-pipeline

| PR | 标题 | 状态 | 操作 | 结果 |
|---|---|---|---|---|
| #90 | feat(关键词学习): 效果追踪+无效词降权+Top20/Bottom20报告 v3.0 | CONFLICTING | 跳过 | 已有e2e:tested标签 |
| #88 | feat(domestic_projects): 采集引擎配置分离+JSON日志+README #16 | CONFLICTING | 跳过 | 已有e2e:tested标签 |
| #87 | add: 添加post-task.sh脚本 #38 | CONFLICTING | 跳过 | 已有e2e:tested标签 |

## 测试执行详情

### Backend API测试
```bash
npx playwright test tests/backend/ --reporter=json,list
```

结果:
- **317 passed** (25.5s)
- **25 skipped**
- **0 failed**

覆盖范围:
- dealer API (#961相关)
- dashboard-card API (#960相关)
- 所有backend API模块

## 已执行操作

1. **PR #960**: approve + squash merge + delete-branch
2. **PR #959**: approve + squash merge + delete-branch
3. **PR #961**: request-changes (conflict)
4. **PR #958**: request-changes (conflict)
5. **PR #956**: comment (空PR)
6. **front#437**: comment (conflict)

## 待跟进事项

1. PR #961 - 等待解决merge conflict后重新测试
2. PR #958 - 等待解决merge conflict后重新测试（size/XL，需特别注意）
3. PR #956 - 确认是否需要关闭或重新推送变更
4. front#437 - 等待解决merge conflict
5. pipeline PRs - 已有e2e:tested标签，但都有conflict，需解决

## GitHub身份

测试执行时使用 `weiping` 账号进行PR审批和merge操作。
