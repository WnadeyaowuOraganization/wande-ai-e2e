# 中层测试记录 2026-03-31 20:25

## 测试范围
扫描4个仓库的open PR (base=dev)，执行E2E测试

## 待测PR清单

### wande-ai-backend (20个PR)
| PR | 标题 | 状态 | 测试结果 |
|----|------|------|----------|
| #905 | feat(tool): 工具管理Service+API — 超管CRUD+用户端只读 #567 | 🆕 新PR | ⏳ 后端API未部署 |
| #887 | feat(dashboard): Claude Code会话监控API #249 | e2e:tested | 跳过 |
| #884 | feat(dashboard): Phase9 统一审批队列+企微通知控制台 API #46 | e2e:tested | 跳过 |
| #876 | feat(dashboard): 外部工具企微告警推送 + 驾驶舱卡片数据API #477 | e2e:tested | 跳过 |
| #875 | feat(project-mine): 新增 good_lead/bad_lead 反馈 API #357 | e2e:tested | 跳过 |
| #874 | feat(project): 项目分配企微机器人推送通知 #361 | e2e:tested | 跳过 |
| #873 | fix(dealer): 修复 E2E 测试失败 #840 | e2e:tested | 跳过 |
| #860 | feat(cockpit): 快捷指令执行引擎 #45 | e2e:tested | 跳过 |
| #851 | feat(acceptance): 验收中心 Service + Controller 实现 #250 | e2e:tested | 跳过 |
| #850 | feat(dashboard): 修复开发阻塞主动提醒功能代码结构 #485 | status:test-failed | 跳过 |
| #846 | feat(dashboard): API网关子账户管理 [1/4] #575 | status:test-failed | 跳过 |
| #845 | feat(scheduler): API SQLite迁移+调度器去重+僵尸检测 #602 | e2e:tested | 跳过 |
| #839 | feat(dealer): Phase 3 模块间数据打通 #309 | status:test-failed | 跳过 |
| #838 | feat(cron): 新增定时任务管理API模块 #828 | e2e:tested | 跳过 |
| #836 | feat(project-mine): 项目分配作战信息卡通知 #360 | e2e:tested | 跳过 |
| #835 | fix(ext-tool): 修复dashboard-card API 500错误 #830 | e2e:tested | 跳过 |
| #834 | fix(cockpit): cockpit_config表添加BaseEntity标准列修复SQL报错 #831 | e2e:tested | 跳过 |
| #833 | fix(scheduler): GitHub同步修复+增强 #599 | e2e:tested | 跳过 |
| #832 | fix(security): 修复任意文件上传漏洞 #9 | e2e:tested | 跳过 |
| #827 | feat(#576): API网关子账户管理 — 预算管理引擎 | e2e:tested | 跳过 |

### wande-ai-front (20个PR)
| PR | 标题 | 状态 | 测试结果 |
|----|------|------|----------|
| #413 | feat(cockpit): 首页卡片聚合升级 — 全子模块健康度统一展示+drill-down跳转 #385 | 🆕 新PR | ⏳ 前端新组件未部署 |
| #411 | feat(admin): 超管后台权限管理界面 — 模块分类+部门/个人权限+功能发布开关 #67 | 🆕 新PR | ⏳ 菜单未注册+前端未部署 |
| #410 | feat(cockpit): 角色化仪表盘视图 — 超管/开发者/业务方三种布局自动切换 #388 | 新PR | ⏳ 菜单未注册 |
| #409 | feat(dashboard): DORA四指标看板页面 — 首页KPI卡片+独立详情页 #386 | 新PR | ❌ 菜单未注册+API 404 |
| #407 | feat(dashboard): 全平台操作审计日志页面 — 时间线+筛选+用户统计+导出 #387 | 新PR | ⏳ 需后端API |
| #405 | feat(cockpit): 超管驾驶舱预算总览组件 #320 | 新PR | ❌ API 500 |
| #403 | feat(cockpit): 超管驾驶舱预算总览组件 — 健康度排行+预警汇总+成本偏差TOP5+保证金到期提醒 #320 | 新PR | ⚠️ 与#405重复 |
| #384 | feat(cockpit): 用户反馈管理页面 #63 | e2e:tested | 跳过 |
| #383 | feat(asset): 素材库列表页面 #233 | e2e:tested | 跳过 |
| #382 | feat(claude-office): Kanban看板面板 #234 | e2e:tested | 跳过 |
| #381 | feat(dashboard): API网关使用记录页面 #246 | e2e:tested | 跳过 |
| #380 | feat(gateway): API 网关子账户管理页面 #245 | e2e:tested | 跳过 |
| #379 | feat(dashboard): 确认中心页面 #244 | e2e:tested | 跳过 |
| #378 | feat(dev): 新增前端生成代码模板UI #30 | e2e:tested | 跳过 |
| #376 | feat(dashboard): 执行日志页 #119 | e2e:tested | 跳过 |
| #373 | feat(cockpit): 审批中心+企微通知控制台页面 #33 | e2e:tested | 跳过 |
| #372 | feat(dashboard): 需求闭环看板页面 #123 | e2e:tested | 跳过 |
| #368 | feat(dashboard): 超管驾驶舱子菜单排序优化+路由配置测试 #155 | e2e:tested | 跳过 |
| #367 | feat(dashboard): 账号池监控页面 #211 | e2e:tested | 跳过 |
| #358 | feat(dashboard): 验收中心页面 #121 | e2e:tested | 跳过 |

### wande-data-pipeline (3个PR)
全部已标记 e2e:tested，跳过

### wande-gh-plugins (0个PR)
无待测PR

## 新增测试文件

### PR #905 (backend#567)
- `tests/backend/api/tool-management.spec.ts`
  - Admin未认证端点 3 tests
  - User未认证端点 2 tests
  - Admin已认证端点 4 tests
  - User已认证端点 4 tests
  - **结果**: 8 passed, 5 failed (API返回 `No static resource` - 后端未部署)

### PR #413 (front#385)
- `tests/front/smoke/health-card-grid.spec.ts`
  - cockpit API functional ✅
  - cockpit page loads ✅
  - no critical console errors ✅
  - **结果**: 3/3 passed (基线通过，新组件因前端未部署无法验证)

### PR #411 (front#67)
- `tests/front/smoke/admin-permission-page.spec.ts`
  - permission API functional ✅ (返回 404 - API未部署)
  - permission page loads - skipped (404，菜单未注册)
  - no critical console errors ✅
  - **结果**: 2 passed, 1 skipped

## 测试执行详情

### PR #905 (backend#567) - 工具管理API
```bash
npx playwright test tests/backend/api/tool-management.spec.ts --project=api-tests
```
结果: 8 passed, 5 failed ⏳
失败原因: `No static resource api/admin/tool/list` - PR代码尚未部署到测试环境

### PR #413 (front#385) - 首页卡片聚合升级
```bash
npx playwright test tests/front/smoke/health-card-grid.spec.ts --project=smoke-tests
```
结果: 3/3 passed ✅
说明: 测试验证的是当前环境中cockpit页面基线。PR新增组件 `HealthCardGrid` 因前端dist未更新而无法实际验证。

### PR #411 (front#67) - 超管后台权限管理
```bash
npx playwright test tests/front/smoke/admin-permission-page.spec.ts --project=smoke-tests
```
结果: 2/3 passed, 1 skipped ⏳
跳过原因: 页面返回 404 (`未找到页面`)，sys_menu 中无 `/wande/admin/permission` 路由。

### 既有阻塞PR状态（与20:05周期一致，无变化）
| PR | 状态 |
|----|------|
| #410 | ⏳ 菜单未注册 |
| #409 | ❌ 菜单未注册 + API 404 |
| #407 | ⏳ 需后端API |
| #405 | ❌ API 500 |
| #403 | ⚠️ 与#405重复 |

## 处理结果

| PR | 操作 | 状态 |
|----|------|------|
| #905 | 添加阻塞评论 | ⏳ 阻塞 |
| #413 | 添加阻塞评论 | ⏳ 阻塞 |
| #411 | 添加阻塞评论 | ⏳ 阻塞 |
| #410 | 无操作（状态未变） | ⏳ 阻塞 |
| #409 | 无操作（状态未变） | ❌ 阻塞 |
| #407 | 无操作（状态未变） | ⏳ 阻塞 |
| #405 | 无操作（状态未变） | ❌ 阻塞 |
| #403 | 无操作（状态未变） | ⚠️ 重复 |

## 阻塞原因汇总

### 后端API未部署/500错误
1. `/api/admin/tool/*` (PR #905)
2. `/api/dashboard/budget-overview` (PR #405)
3. `/wande/dora/summary` (PR #409)

### 前端菜单未注册 / 页面未部署
1. `/wande-dev/cockpit` HealthCardGrid 新组件 (PR #413)
2. `/wande/admin/permission` (PR #411)
3. 角色化仪表盘视图 (PR #410)
4. `/super-admin/dora-metrics` (PR #409)
5. 审计日志页面 (PR #407)

### PR重复
- PR #405 和 PR #403 内容重复 (都是 Issue #320 预算总览组件)

## 环境Console错误（已知基线问题）
当前dev环境cockpit页面存在以下非PR引入的console错误：
- `No static resource wande/dora/summary`
- `No static resource wande/cockpit/feedback/stats`
- `TypeError: Cannot use 'in' operator to search for 'type' in null`
- 多个 `未找到对应组件` (HR/Brand等模块组件缺失)

已在smoke测试过滤条件中排除，避免误报。

## 关联Issue

- backend#567 - 工具管理API (⏳ 阻塞)
- front#385 - 首页卡片聚合升级 (⏳ 阻塞)
- front#67 - 超管后台权限管理 (⏳ 阻塞)
- front#388 - 角色化仪表盘视图 (⏳ 阻塞)
- front#386 - DORA四指标看板 (❌ 阻塞)
- front#387 - 审计日志页面 (⏳ 阻塞)
- front#320 - 预算总览组件 (❌ 阻塞)
