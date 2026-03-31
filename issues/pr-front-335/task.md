# 工作记录 — wande-ai-front#335

## PR信息
- **仓库**: WnadeyaowuOraganization/wande-ai-front
- **PR**: #335 — feat(dashboard): 外部工具健康度卡片 #213
- **关联Issue**: #213
- **分支**: feature-issue-213 → main
- **状态**: ❌ E2E测试失败

## 测试结果

### 测试文件
`tests/front/smoke/ext-tool-health-card.spec.ts` (新增5个测试用例)

### 结果
| # | 测试用例 | 结果 | 备注 |
|---|---------|------|------|
| 1 | dashboard-card API rejects unauthenticated requests | ✅ 通过 | 401正确返回 |
| 2 | dashboard-card API returns valid data with auth | ❌ 失败 | API返回code:500 |
| 3 | dashboard-card API response has expected fields | ⏭ 跳过 | 依赖#2 |
| 4 | cockpit page loads with external tool health card | ✅ 通过 | 页面可加载 |
| 5 | cockpit page has no critical console errors | ❌ 失败 | 6个console错误 |

## 发现的Bug

### Bug 1: dashboard-card API 500错误
- **API**: `GET /monitor/ext-tool/dashboard-card`
- **错误信息**: `Name for argument of type [java.lang.Long] not specified, and parameter name information not available via reflection. Ensure that the compiler uses the '-parameters' flag.`
- **原因**: Spring Boot控制器参数名绑定失败，编译器未启用`-parameters`标志
- **修复**: 后端Controller方法参数需显式指定`@RequestParam("name")`或启用编译器`-parameters`选项

### Bug 2: CockpitConfigMapper SQL错误
- **Mapper**: `CockpitConfigMapper.xml` → `selectPageCockpitConfigList`
- **SQL**: `SELECT key, value, update_time FROM cockpit_config WHERE 1=1 ORDER BY update_time DESC LIMIT ?`
- **错误**: `column "update_time" does not exist`
- **原因**: `cockpit_config`表中不存在`update_time`列，可能是建表SQL遗漏或Mapper引用了错误字段
- **修复**: 检查`cockpit_config`表结构，添加缺失列或修正Mapper SQL

## 决策
PR本身前端代码质量可以，但后端存在2个blocking bug导致功能无法正常使用。
建议：等待后端修复后再合并前端PR。

## 下一步
- [x] 创建后端P0 Issue — API参数绑定bug
- [x] 创建后端P0 Issue — CockpitConfigMapper SQL bug
- [ ] 后端修复后重新执行E2E测试
