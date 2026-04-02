# PR #1018 中层E2E测试记录

## PR信息
- **PR**: [#1018 feat(d3): 实现模具选型引擎 API #624](https://github.com/WnadeyaowuOraganization/wande-ai-backend/pull/1018)
- **关联Issue**: backend#624
- **分支**: feature-issue-57 → dev
- **测试时间**: 2026-04-02 12:17
- **重测时间**: 2026-04-02 14:42

## 变更范围
- 数据库: wdpp_d3_mold_library, wdpp_d3_mold_platform_interface, wdpp_d3_step_cache
- API:
  - GET /wande/d3/molds/select - 模具选型查询
  - GET /wande/d3/molds/{id} - 获取模具详情
  - GET /wande/d3/molds/code/{moldCode} - 根据编码获取模具
  - GET /wande/d3/molds/{moldId}/position - 获取模具定位参数
  - GET /wande/d3/molds/categories - 获取所有品类列表
  - GET /wande/d3/molds/compliance - 检查模具市场合规性

## 测试覆盖度评估
- **类型**: A - 完整覆盖（已有对应测试文件）
- **测试文件**: tests/backend/api/d3/mold.spec.ts
- **测试用例数**: 14个（7失败，4通过，3跳过）

## 测试结果

### 状态: ❌ 失败 - API未部署（第2次检测）

**失败原因**: 后端API尚未部署到测试环境，与上次检测结果一致。
**PR状态**: OPEN, reviewDecision: CHANGES_REQUESTED

**错误详情**:
```
GET /wande/d3/molds/select
返回: {"code":500,"msg":"No static resource wande/d3/molds/select."}
```

**失败用例**:
1. 模具选型查询未认证应返回401 - 收到 code: 500
2. 模具详情未认证应返回401 - 收到 code: 500
3. 模具品类列表未认证应返回401 - 收到 code: 500
4. 应能执行模具选型查询 - 收到 code: 500
5. 应支持按平台高度筛选 - 收到 code: 500
6. 应支持按市场筛选 - 收到 code: 500
7. 应支持按方向筛选 - 收到 code: 500

**通过用例**:
- 无效模具ID应返回错误
- 应能获取所有品类列表
- 应能检查模具市场合规性
- 应支持不同市场的合规性检查

**跳过用例**:
- 应能获取模具详情（依赖列表查询）
- 应能根据模具编码获取模具（依赖列表查询）
- 应能获取模具定位参数（依赖列表查询）

## 处理动作

### 已执行
- [x] 扫描PR列表
- [x] 分析变更范围
- [x] 执行API测试（重测 #2）
- [x] PR状态仍为 request-changes（API未部署）
- [x] 2026-04-02 14:42 重测确认：API仍未部署

### 待执行（需研发修复）
- [ ] 部署API到测试环境
- [ ] 确保数据库SQL脚本已执行: `2026-04-02-create-d3-mold-library-tables.sql`
- [ ] 本地验证通过: `npx playwright test tests/backend/api/d3/mold.spec.ts`
- [ ] 等待中层E2E自动重测

## 关联文件
- 测试: tests/backend/api/d3/mold.spec.ts
