# 中层E2E测试记录 2026-04-02

## 扫描结果
扫描时间: 2026-04-02 16:00
共发现 6 个待测 open PR（base=dev），全部来自 `wande-ai-backend`:

| PR | 标题 | 作者 | Issue | 合并状态 | 处理结果 |
|----|------|------|-------|----------|----------|
| #1091 | docs(migration): 明道云 MongoDB dump 字段映射表分析 #254 | wandeyaowu | #254 | MERGEABLE | ✅ MERGED |
| #1090 | feat(商机): 为 business_opportunities 表添加项目级情报字段和红绿灯机制 #634 | wandeyaowu | #634 | MERGEABLE | ❌ ENV-FAIL |
| #1089 | feat(客户情报): Phase2 信息质量计算引擎Service #635 | wandeyaowu | #635 | MERGEABLE | ❌ ENV-FAIL |
| #1073 | feat(dashboard): 开发效率统计API — Issue #252 | wandeyaowu | #252 | CONFLICTING | ❌ CONFLICT |
| #1072 | feat(contract): 实现合同编号生成API (Issue #171) | david-hwp | #171 | CONFLICTING | ❌ CONFLICT |
| #1071 | feat(d3): 实现模具库数据化功能 (Issue #623) | wandeyaowu | #623 | CONFLICTING | ❌ CONFLICT |

---

## 详细处理

### MERGEABLE PRs

#### #1091 (Issue #254)
- **变更范围**: 文档 + Python 脚本 (`analyze_bson.py`, `字段映射表.md`)
- **覆盖度**: 无API影响，无需E2E
- **决策**: ✅ 直接 approve + squash merge
- **操作**:
  ```bash
  gh pr review 1091 --approve
  gh pr merge 1091 --squash --delete-branch
  ```
- **状态**: 已合并

#### #1090 (Issue #634)
- **变更范围**: Entity/Bo/Vo/SQL + `BusinessOpportunityServiceTest`
- **覆盖度评估**: C → 生成 `tests/backend/api/business-opportunity.spec.ts`
- **编译验证**: `mvn clean compile` ✅ 通过
- **E2E验证**: 无法执行，dev环境启动失败
- **决策**: ❌ request-changes (ENV-FAIL)
- **Issue更新**:
  - 添加标签 `status:test-failed`
  - 移除标签 `status:in-progress`
  - 看板状态 → Todo

#### #1089 (Issue #635)
- **变更范围**: `IIntelligenceQualityService` + `IntelligenceQualityServiceImpl`
- **覆盖度评估**: B → 已有 `tests/backend/api/intelligence-quality.spec.ts`
- **编译验证**: `mvn clean compile -pl ruoyi-modules/wande-ai -am` ✅ 通过
- **E2E验证**: 无法执行，dev环境启动失败
- **决策**: ❌ request-changes (ENV-FAIL)
- **Issue更新**:
  - 添加标签 `status:test-failed`
  - 移除标签 `status:in-progress`
  - 看板状态 → Todo

### CONFLICTING PRs

#### #1073 (Issue #252)
- **合并状态**: DIRTY / CONFLICTING
- **决策**: ❌ request-changes (冲突阻塞)
- **Issue更新**:
  - 添加标签 `status:test-failed`
  - 看板状态 → Todo

#### #1072 (Issue #171)
- **合并状态**: DIRTY / CONFLICTING
- **决策**: ❌ comment (本账号创建，无法 self-request-changes)
- **Issue更新**:
  - 添加标签 `status:test-failed`
  - 看板状态 → Todo

#### #1071 (Issue #623)
- **合并状态**: DIRTY / CONFLICTING
- **决策**: ❌ request-changes (冲突阻塞)
- **Issue更新**:
  - 添加标签 `status:test-failed`
  - 看板状态 → Todo

---

## 环境故障 (ENV-FAIL)

**根本原因**: `wande-ai-backend` dev 分支部署后启动失败。

**关键错误日志**:
```
org.springframework.context.annotation.ConflictingBeanDefinitionException:
Annotation-specified bean name 'moldLibraryMapper' for bean class
[org.ruoyi.wande.d3.mapper.MoldLibraryMapper] conflicts with existing,
non-compatible bean definition of same name and class
[org.ruoyi.wande.mapper.d3.MoldLibraryMapper]
```

**影响**:
- 后端 `localhost:6040` 无法启动
- 所有基于 dev 分支的 feature 分支 E2E 测试均被阻塞
- `/auth/login` 返回 500 (No static resource)

**跟踪 Issue**: [#1098 - fix(dev-env): dev 分支 MoldLibraryMapper Bean 冲突导致启动失败](https://github.com/WnadeyaowuOraganization/wande-ai-backend/issues/1098)

---

## 新增/变更文件
- `tests/backend/api/business-opportunity.spec.ts` (新增，覆盖 Issue #634)

## requirement-map 更新
- 新增 `"634"` 映射
- 更新 `"635"` last_tested / last_result / notes

## 恢复指南
1. 修复 Issue #1098 (dev 环境 Bean 冲突)
2. 重新部署 dev: `cd /home/ubuntu/projects/wande-ai-backend && bash script/deploy-dev.sh`
3. 确认 `curl http://localhost:6040/auth/login` 正常返回
4. 重测所有 ENV-FAIL PR: #1090, #1089
5. 重测所有 CONFLICT PR: #1073, #1072, #1071（需先解决冲突）
