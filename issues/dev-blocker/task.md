# Dev环境阻塞问题 - 2026-04-01

## 问题概述

Dev环境（http://localhost:6040）启动失败，导致所有后端PR无法执行E2E测试。

## 错误信息

```
Caused by: org.apache.ibatis.type.TypeException: 
  The alias 'DashboardTokenPoolBo' is already mapped to the value 'org.ruoyi.wande.domain.tokenpool.bo.DashboardTokenPoolBo'.
  
Caused by: org.apache.ibatis.type.TypeException: 
  The alias 'DashboardTokenAlertHistoryVo' is already mapped to the value 'org.ruoyi.wande.domain.vo.DashboardTokenAlertHistoryVo'.
```

## 根因分析

合并多个PR后产生重复类定义：

**DashboardTokenPoolBo 重复定义:**
- `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/tokenpool/bo/DashboardTokenPoolBo.java`
- `ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/domain/bo/DashboardTokenPoolBo.java`

## 影响PR

| PR | 标题 | 状态 |
|----|------|------|
| #916 | feat(tool-center): 工具管理 Service+API | 测试失败 |
| #912 | feat(cockpit): CC API调用质量监控 | 测试失败 |
| #906 | feat(dashboard): CC API调用质量监控 | 测试失败 |
| #905 | feat(tool): 工具管理Service+API | 测试失败 |
| #850 | feat(dashboard): 修复开发阻塞主动提醒 | 测试失败 |
| #839 | feat(dealer): Phase 3 模块间数据打通 | 测试失败 |

## 已创建Issue

- #917 [P0] Dev环境启动失败 - MyBatis别名冲突

## 修复方案

1. 删除重复类定义，保留规范路径
2. 统一引用路径
3. 重新编译部署验证
4. 重新执行E2E测试

## SQL迁移状态

已提前执行以下SQL：
- ✅ platform_tools 表
- ✅ platform_tool_versions 表
- ✅ platform_tool_configs 表
- ✅ dashboard_blockers 表
- ✅ project_mine feedback 列

## 测试记录

- 测试时间: 2026-04-01 01:40
- 测试结果: 阻塞（环境不可用）
- 修复后需重新测试所有PR
