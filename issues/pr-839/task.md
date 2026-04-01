# PR #839 测试记录 - Dealer Phase 3 模块间数据打通

## PR信息
- **仓库**: wande-ai-backend
- **PR**: #839 - feat(dealer): Phase 3 模块间数据打通 — 招标↔矿场↔CRM联动 #309
- **关联Issue**: #309
- **状态**: ❌ 测试失败

## 测试执行
- **执行时间**: 2026-04-01 06:50
- **测试范围**: tests/backend/api/dealer.spec.ts
- **结果**: 6/11 测试失败

## 失败用例

### 未认证访问测试 (全部失败)
| 用例 | 期望 | 实际 | 错误详情 |
|------|------|------|----------|
| import-from-tender | 401 | 500 | No static resource |
| sync-to-crm | 401 | 500 | code: 500 |
| related-project | 401 | 500 | code: 500 |

### 已认证访问测试 (部分失败)
| 用例 | 期望 | 实际 | 错误详情 |
|------|------|------|----------|
| 候选人列表 | 200 | 500 | TIMESTAMPTZ类型转换错误 |
| 中标记录列表 | 200 | 500 | Mapper未找到 |
| 跟进记录列表 | 200 | 500 | code: 500 |

## 根因分析

### 1. TIMESTAMPTZ类型转换错误
```
Error attempting to get column 'stage_entered_at' from result set.
Cause: PSQLException: Cannot convert the column of type TIMESTAMPTZ to requested type java.time.LocalDateTime.
```

**问题**: PostgreSQL `TIMESTAMPTZ` 类型与Java `LocalDateTime` 不兼容。

**解决方案**:
- 方案A: 数据库字段改为 `TIMESTAMP` (不带时区)
- 方案B: Java实体使用 `OffsetDateTime` 替代 `LocalDateTime`

### 2. Mapper未找到
```
Invalid bound statement (not found): org.ruoyi.wande.mapper.DealerBidRecordMapper.selectPageBidRecordList
```

**问题**: Mapper XML文件未正确加载或SQL语句ID不匹配。

### 3. Phase3新端点返回静态资源错误
```
No static resource wande/dealer/candidate/import-from-tender/1.
```

**问题**: 新端点未正确注册到Spring MVC，可能缺少Controller或路径配置错误。

## 操作记录
- [x] 2026-04-01 06:50 - 执行API测试
- [x] 2026-04-01 06:50 - 诊断多个技术问题
- [ ] 等待修复后重测

## 修复建议
1. 修复TIMESTAMPTZ类型兼容性
2. 检查Mapper XML配置和SQL语句ID
3. 确认Controller端点正确注册
4. 添加权限控制注解
