# Dev Branch 代码冲突阻断报告

**日期**: 2026-04-01  
**测试类型**: 中层测试 (Mid-layer Test)  
**状态**: 🔴 阻断 - Dev分支无法启动

## 问题摘要

Dev分支存在严重的代码冲突问题，导致后端服务无法编译/启动，所有待测PR被阻断。

## 发现的冲突

### 1. 重复类定义 (Duplicate Class Definitions)

以下类同时存在于 `ruoyi-modules-api/wande-ai-api` 和 `ruoyi-modules/wande-ai` 两个模块中，导致MyBatis别名冲突：

| 类名 | wande-ai-api 路径 | wande-ai 路径 |
|------|------------------|---------------|
| DashboardTokenPoolBo | domain/tokenpool/bo/ | domain/bo/ |
| DashboardTokenAlertHistoryVo | domain/tokenpool/vo/ | domain/vo/ |
| DashboardTokenAlertRuleVo | domain/tokenpool/vo/ | domain/vo/ |
| DashboardTokenPoolVo | domain/tokenpool/vo/ | domain/vo/ |
| DashboardTokenUsageDailyVo | domain/tokenpool/vo/ | domain/vo/ |
| DashboardTokenPool | domain/tokenpool/ | domain/tokenpool/ |
| DashboardTokenAlertHistory | domain/tokenpool/ | domain/tokenpool/ |
| ... | ... | ... |

### 2. 错误信息

```
org.apache.ibatis.type.TypeException: The alias 'DashboardTokenPoolBo' is already mapped
to the value 'org.ruoyi.wande.domain.bo.DashboardTokenPoolBo'.
```

### 3. 影响范围

所有以下PR无法在当前dev分支状态下进行E2E测试：

- PR #916: feat(tool-center): 工具管理 Service+API
- PR #912: feat(cockpit): CC API调用质量监控
- PR #906: feat(dashboard): Issue #698 CC API调用质量监控
- PR #905: feat(tool): 工具管理Service+API
- PR #850: feat(dashboard): 修复开发阻塞主动提醒功能代码结构
- PR #839: feat(dealer): Phase 3 模块间数据打通

## 建议解决方案

### 方案1: 删除wande-ai模块中的重复类（推荐）

保留 `wande-ai-api` 模块中的类定义，删除 `wande-ai` 模块中的重复类：

```bash
# 需要删除的文件列表
cd /home/ubuntu/projects/wande-ai-backend/ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/domain

# bo目录
rm bo/DashboardTokenPoolBo.java
rm bo/DashboardTokenAlertRuleBo.java

# vo目录
rm vo/DashboardTokenAlertHistoryVo.java
rm vo/DashboardTokenAlertRuleVo.java
rm vo/DashboardTokenPoolVo.java
rm vo/DashboardTokenUsageDailyVo.java

# tokenpool目录（Domain类）
rm tokenpool/DashboardTokenPool.java
rm tokenpool/DashboardTokenAlertHistory.java
rm tokenpool/DashboardTokenAlertRule.java
rm tokenpool/DashboardTokenUsageDaily.java
```

### 方案2: 重命名冲突类

将wande-ai模块中的类重命名为不同的名称。

### 方案3: 合并PR时解决

在合并引起冲突的PR之前，先解决这些重复定义问题。

## 相关Commit

通过 `git log` 检查，这些重复类可能是由以下PR合并引起的：
- Token Pool相关功能开发

## 测试恢复步骤

1. 修复dev分支代码冲突
2. 重新编译后端服务
3. 启动服务并验证健康检查通过
4. 重新执行中层测试

---

**记录人**: 测试CC  
**关联**: wande-ai-backend dev分支
