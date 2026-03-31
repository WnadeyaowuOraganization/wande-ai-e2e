# PR #839 测试记录

## 基本信息
- **PR**: feat(dealer): Phase 3 模块间数据打通 — 招标↔矿场↔CRM联动 #309
- **仓库**: wande-ai-backend
- **测试时间**: 2026-03-31 16:15

## 测试结果
**状态**: ❌ 测试失败 - 请求修改 (request-changes)

## 失败原因
数据库字段类型不匹配错误：

```
Error attempting to get column 'stage_entered_at' from result set.
Cause: org.postgresql.util.PSQLException: Cannot convert the column of type TIMESTAMPTZ to requested type java.time.LocalDateTime.
bad SQL grammar []
```

## 问题分析
PostgreSQL表中的`stage_entered_at`字段类型为`TIMESTAMPTZ`，但Java实体使用`LocalDateTime`接收，类型转换失败。

## 建议修复方案
1. **方案A**: 修改Java实体，使用`OffsetDateTime`替代`LocalDateTime`
2. **方案B**: 修改数据库字段类型为`TIMESTAMP`（不带时区）
3. **方案C**: 在MyBatis映射中添加类型处理器

## 代码位置
- `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/Client.java`
- 相关Mapper XML文件

## 关联Issue
- Fixes #309
