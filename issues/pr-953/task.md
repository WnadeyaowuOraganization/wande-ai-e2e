# PR #953 测试任务

## PR信息
- **仓库**: wande-ai-backend
- **PR**: #953
- **标题**: feat(dashboard): G7e claude_monitor + webhook回调注入 — Issue #333
- **作者**: david-hwp
- **关联Issue**: #333

## 变更范围
- docs/workflow.md（webhook回调注入）
- Token Pool相关Service修复（TokenPoolAlertRuleServiceImpl、TokenPoolQuotaServiceImpl）
- Token Pool相关Mapper XML（DashboardTokenAlertHistoryMapper.xml、DashboardTokenAlertRuleMapper.xml、DashboardTokenUsageDailyMapper.xml）
- DORA/Confirmation/Profit Dashboard Service修复
- 单元测试修复

## 测试结果
**状态**: ❌ 测试失败（阻塞）

### 失败详情
| API | 状态 | 错误 |
|-----|------|------|
| GET /token-pool/list | 500 | 服务端错误 |
| GET /token-pool/usage | 500 | 服务端错误 |
| GET /token-pool/alert-rules | 500 | 服务端错误 |
| POST /token-pool/sync | 500 | 服务端错误 |
| GET /audit-log/list | 500 | 服务端错误 |
| GET /audit-log/stats | 500 | 服务端错误 |

### 测试执行记录
```bash
npx playwright test tests/backend/ --reporter=json,list
# 结果: 328 passed, 25 skipped, 143 failed
```

## 问题分析
PR #953修改了Token Pool相关的Service实现和Mapper XML文件，但部署后这些API全部返回500错误。可能原因：
1. Mapper XML中的SQL语句有误
2. Service实现中的逻辑缺陷
3. 数据库schema与代码不匹配

## 下一步行动
1. 需要编程CC检查Token Pool相关代码
2. 检查后端日志定位具体错误
3. 修复后重新测试

## 2026-04-01 二次测试记录

**状态**: 阻塞 - 后端服务未启动

**问题**: 后端服务 `http://localhost:6040` 未响应，连接被拒绝 (ECONNREFUSED)

```
Error: apiRequestContext.get: connect ECONNREFUSED 127.0.0.1:6040
```

**影响**: 所有496个后端API测试无法执行

**结论**: 环境不可用，无法完成PR #953测试。需要启动后端服务后重测。

## 2026-04-01 三次测试记录（根因已定位）

**状态**: ❌ 测试失败 — PR代码引入启动级缺陷

**根因分析**：
通过分析后端 `sys-error.log`，确认 PR #953 新增的 `ruoyi-modules/wande-ai/src/main/resources/mapper/tokenpool/` 下 Mapper XML 文件导致了 **MyBatis alias 重复映射冲突**：
- `The alias 'DashboardTokenAlertHistoryVo' is already mapped to the value 'org.ruoyi.wande.domain.vo.DashboardTokenAlertHistoryVo'`
- `The alias 'DashboardTokenPoolBo' is already mapped to the value 'org.ruoyi.wande.domain.tokenpool.bo.DashboardTokenPoolBo'`

**影响链**：
`sqlSessionFactory` Bean创建失败 → `sysUserMapper` → `sysLoginService` → `authController` 失败 → `/login` 端点未注册 → 全局 API 返回 500/No static resource。

**backend API 测试结果**：496测试中 328 passed, 25 skipped, 143 failed。失败均因后端未启动导致，非原有功能退化。

**处理动作**：
- 已提交 `request-changes` review 到 backend#953
- 已创建 P0 修复 Issue: [backend#955](https://github.com/WnadeyaowuOraganization/wande-ai-backend/issues/955)

## 时间戳
- 首次测试: 2026-04-01 14:01
- 二次测试: 2026-04-01 16:xx
- 三次测试: 2026-04-01 14:48
