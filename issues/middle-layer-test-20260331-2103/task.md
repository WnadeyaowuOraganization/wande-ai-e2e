# 中层测试报告 2026-03-31 21:03

## 测试时间
2026-03-31 21:03

## 扫描范围
- **wande-ai-backend**: 20 open PRs
- **wande-ai-front**: 20 open PRs
- **wande-data-pipeline**: 3 open PRs (全部 e2e:tested)
- **wande-gh-plugins**: 0 PRs

## 环境状态

| 服务 | 地址 | 状态 | 备注 |
|------|------|------|------|
| 后端API | http://localhost:6040 | **DOWN** | `ECONNREFUSED 127.0.0.1:6040` |
| 前端页面 | http://localhost:8083 | UP (200) | 可加载登录页，但后端502导致无法登录 |
| PostgreSQL | localhost:5433 | 未验证 | — |
| Redis | localhost:6380 | 未验证 | — |

**关键发现**: 后端API服务完全未启动。这是自 20:40 测试后的环境退化（当时后端至少部分可用，现在完全拒绝连接）。

## 待测PR清单（本次扫描到14个无e2e:tested的PR）

### wande-ai-backend (5个)
1. **#906** → Issue #698 `feat(dashboard): CC API调用质量监控`
2. **#905** → Issue #567 `feat(tool): 工具管理Service+API`
3. **#850** → Issue #485 `feat(dashboard): 修复开发阻塞主动提醒功能代码结构`
4. **#846** → Issue #575 `feat(dashboard): API网关子账户管理 [1/4] - 数据同步API`
5. **#839** → Issue #309 `feat(dealer): Phase 3 模块间数据打通 — 招标↔矿场↔CRM联动`

### wande-ai-front (9个)
6. **#415** → Issue #394 `feat(@vben/web-antd): 驾驶舱全页面深色主题+系统偏好自动检测+手动切换`
7. **#414** → Issue #392 `feat(@vben/web-antd): 键盘快捷键系统`
8. **#413** → Issue #385 `feat(cockpit): 首页卡片聚合升级 — 全子模块健康度统一展示+drill-down跳转`
9. **#411** → Issue #67 `feat(admin): 超管后台权限管理界面`
10. **#410** → Issue #388 `feat(cockpit): 角色化仪表盘视图`
11. **#409** → Issue #386 `feat(dashboard): DORA四指标看板页面`
12. **#407** → Issue #387 `feat(dashboard): 全平台操作审计日志页面`
13. **#405** → Issue #320 `feat(cockpit): 超管驾驶舱预算总览组件`
14. **#403** → Issue #320 `feat(cockpit): 超管驾驶舱预算总览组件 — 健康度排行+预警汇总+成本偏差TOP5+保证金到期提醒`

## 执行测试

### 后端API测试
```bash
npx playwright test tests/backend/api/ --reporter=list
```
结果: **全部失败** (`373 failed`)
失败原因: `connect ECONNREFUSED 127.0.0.1:6040`

健康检查 `health.spec.ts` 5/5 failed，确认后端服务完全没有响应。

### 前端Smoke测试
运行了以下测试文件:
- `tests/front/smoke/pages-load.spec.ts`
- `tests/front/smoke/dora-metrics.spec.ts`
- `tests/front/smoke/cockpit-page.spec.ts`
- `tests/front/smoke/health-card-grid.spec.ts`
- `tests/front/smoke/admin-permission-page.spec.ts`
- `tests/front/smoke/budget-overview.spec.ts`

结果: **13 failed, 3 passed, 2 skipped**

具体结果:
| 测试 | 结果 | 失败原因 |
|------|------|---------|
| pages-load login loads | 3/3 passed | 登录页可加载 |
| pages-load console errors | 1 failed | 后端502 Bad Gateway控制台报错 |
| dora-metrics page loads | 1 failed | 页面跳转到登录页，无 "DORA" 文本 |
| 其余需要认证的smoke测试 | 全部 failed | 后端API拒绝连接，无法获取token/login |

## 覆盖度评估

| PR | 仓库 | Issue | 现有测试覆盖 | 评估 |
|----|------|-------|-------------|------|
| #906 | backend | #698 | 无 | 需要新增 `dashboard-cc-api-metric.spec.ts` |
| #905 | backend | #567 | `tests/backend/api/tool-management.spec.ts` (13 cases) | 完整，但环境down无法执行 |
| #850 | backend | #485 | `tests/backend/api/dashboard-blocker.spec.ts` (11 cases) | 完整，但环境down无法执行 |
| #846 | backend | #575 | `tests/backend/api/gateway-budget.spec.ts` | 完整，但环境down无法执行 |
| #839 | backend | #309 | `tests/backend/api/dealer.spec.ts` (10 cases) | 完整，但环境down无法执行 |
| #415 | front | #394 | 无 | PR自带Vitest单元测试，但无Playwright覆盖 |
| #414 | front | #392 | 无 | PR自带Vitest单元测试 |
| #413 | front | #385 | `tests/front/smoke/health-card-grid.spec.ts` | 部分覆盖，环境down无法执行 |
| #411 | front | #67 | `tests/front/smoke/admin-permission-page.spec.ts` | 部分覆盖，环境down无法执行 |
| #410 | front | #388 | 无 | PR自带Vitest单元测试 |
| #409 | front | #386 | `tests/front/smoke/dora-metrics.spec.ts` | 部分覆盖，环境down无法执行 |
| #407 | front | #387 | 无 | PR自带Vitest单元测试 |
| #405 | front | #320 | `tests/front/smoke/budget-overview.spec.ts` | 部分覆盖，环境down无法执行 |
| #403 | front | #320 | 同 #405 | 同 #405 |

## 决策结果

**全部14个PR标记为 BLOCKED**

原因统一为：**后端API服务完全未启动 (localhost:6040 ECONNREFUSED)**

### 不执行的操作
- 不 approve/merge（环境故障，不是PR代码问题）
- 不 request-changes（没有PR代码缺陷证据）
- 不创建P0修复Issue到业务仓库（这是环境部署问题，不是PR代码bug）

### 需要后续处理
1. **启动/修复后端服务 localhost:6040**（可能是G7e dev部署脚本问题，或容器未启动）
2. **PR #906 (#698)** 需要补充Playwright API测试用例（当前无覆盖）
3. **前端PR #415, #414, #410, #407** 需要确认是否已有Playwright smoke测试需求，以及路由是否向后端 `sys_menu` 注册

## 历史对比

上一轮测试（2026-03-31 20:40）时后端API处于**部分可用**状态：
- health.spec.ts 通过
- auth.spec.ts 通过
- 部分API返回500或 "No static resource"

本次测试（21:03）后端API**完全不可用**：
- 所有请求 `ECONNREFUSED 127.0.0.1:6040`
- 说明在20:40~21:03之间后端服务被停止或崩溃

## 下一步建议

1. 排查 `script/deploy-dev.sh` 是否成功完成
2. 检查后端Java进程是否在6040端口监听：`ss -tlnp | grep 6040`
3. 检查Docker/Podman容器状态（如果后端以容器运行）
4. 环境恢复后重新执行中层测试
