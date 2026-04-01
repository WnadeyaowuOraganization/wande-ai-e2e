# PR #839 测试任务

## PR信息
- **仓库**: wande-ai-backend
- **PR**: #839
- **标题**: feat(dealer): Phase 3 模块间数据打通 — 招标↔矿场↔CRM联动 #309
- **关联Issue**: #309
- **分支**: feature-issue-309

## 测试结果
**状态**: ❌ 测试失败

### 失败用例
| 用例 | 期望 | 实际 | 错误 |
|------|------|------|------|
| import-from-tender 未认证 | 401 | 500 | 服务器错误 |
| sync-to-crm 未认证 | 401 | 500 | 服务器错误 |
| related-project 未认证 | 401 | 500 | 服务器错误 |
| 经销商候选人列表 | 200 | 500 | 服务器错误 |
| 中标记录列表 | 200 | 500 | 服务器错误 |
| 跟进记录列表 | 200 | 500 | 服务器错误 |

### 通过用例
- 4个Phase3边界测试用例通过
- 1个详情查询跳过（无数据）

## 问题分析
Dealer模块API大面积返回500，可能原因：
1. 数据库表结构变更未同步（clients表BaseEntity兼容）
2. Mapper XML配置问题
3. Service依赖注入失败

## 执行时间
2026-04-01 06:55

## 建议
需要编程CC检查：
1. 增量SQL: `2026-03-31-dealer-module-integration.sql` 是否正确执行
2. ClientMapper.xml 和 TenderDataMapper.xml 配置是否正确
3. DealerCandidateServiceImpl 依赖是否正确注入
4. G7eServiceConfig 合并冲突是否完全解决
