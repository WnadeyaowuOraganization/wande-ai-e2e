---
PR: wande-ai-backend#682 fix(tender): 修复招投标API数据库列不匹配问题 #663
关联Issue: #663
测试开始: 2026-03-29 01:15:00 CST
---

# PR信息

## 基本信息
- **仓库**: WnadeyaowuOraganization/wande-ai-backend
- **PR编号**: #682
- **标题**: fix(tender): 修复招投标API数据库列不匹配问题 #663
- **目标分支**: dev → main
- **关联Issue**: #663 [E2E失败] 招投标统计API数据库列缺失 - status字段

## 变更文件
1. `issues/issue-663/task.md` - 工作记录
2. `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/TenderData.java` - Entity字段修复
3. `ruoyi-modules-api/wande-ai-api/src/main/resources/mapper/TenderDataMapper.xml` - Mapper XML修复
4. `script/sql/update/wande_ai/2026-03-28-add-tender-status-column.sql` - 增量SQL

# 测试状态

## ⚠️ 阻塞问题

**后端服务无法启动** - 检测到 `hrContractMapper` Bean名称冲突。

错误日志：
```
ConflictingBeanDefinitionException: Annotation-specified bean name 'hrContractMapper'
for bean class [org.ruoyi.wande.mapper.HrContractMapper] conflicts with existing,
non-compatible bean definition of same name and class
[org.ruoyi.wande.hr.mapper.HrContractMapper]
```

已创建修复Issue: **WnadeyaowuOraganization/wande-ai-backend#683**

## 后续行动
- 等待 Issue #683 修复后重新测试
- 后端修复后执行: `npx playwright test --grep "@tender"`

