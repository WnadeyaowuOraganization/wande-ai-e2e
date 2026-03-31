# 中层测试报告 2026-03-31

## 测试时间
2026-03-31 20:40

## 扫描范围
- wande-ai-backend: 20 open PRs
- wande-ai-front: 20 open PRs  
- wande-data-pipeline: 3 open PRs (全部已测)
- wande-gh-plugins: 0 PRs

## 待测PR清单（排除已标记e2e:tested和status:test-failed）

### Backend (2个)
1. **#906** feat(dashboard): CC API调用质量监控 #698
2. **#905** feat(tool): 工具管理Service+API #567

### Frontend (10个)
3. **#415** 驾驶舱全页面深色主题 #394
4. **#414** 键盘快捷键系统 #392
5. **#413** 首页卡片聚合升级 #385
6. **#411** 超管后台权限管理界面 #67
7. **#410** 角色化仪表盘视图 #388
8. **#409** DORA四指标看板页面 #386
9. **#407** 全平台操作审计日志页面 #387
10. **#405** 超管驾驶舱预算总览组件 #320
11. **#403** 超管驾驶舱预算总览组件 #320

## 测试结果汇总

### API测试
| 测试文件 | 结果 | 备注 |
|---------|------|------|
| health.spec.ts | 10/10 | 基础健康检查通过 |
| auth.spec.ts | 10/10 | 认证API通过 |
| dashboard-claude-session.spec.ts | 10/10 | Claude Session监控通过 |
| confirmation-center.spec.ts | 9/9 | 确认中心API通过 |
| tool-management.spec.ts | 9/13 | 4个未认证测试失败（API未部署返回500而非401）|
| dashboard-blocker.spec.ts | 6/11 | 5个失败（返回500）|
| dashboard-cron.spec.ts | 3/6 | 3个失败（返回500而非401）|

### 页面测试
| 测试文件 | 结果 | 备注 |
|---------|------|------|
| cockpit-page.spec.ts | 2/4 | API通过，页面测试skip（菜单未注册）|
| issue-board-page.spec.ts | 1/1 | 通过 |
| health-card-grid.spec.ts | 3/3 | 通过 |
| admin-permission-page.spec.ts | 2/3 | API通过，页面skip |
| budget-overview.spec.ts | 2/4 | 有console错误 |
| dora-metrics.spec.ts | 0/1 | 页面未部署 |

## 阻塞分析

### 后端API未部署（代码在PR中）
- PR #906 (CC API监控): API返回 "No static resource"
- PR #905 (工具管理): API返回 "No static resource"

### 前端页面未部署
- PR #409 (DORA看板): 页面未找到
- PR #415, #414, #413, #411, #410, #407: 页面需要部署验证

### 后端500错误（需要调查）
- dashboard-blocker API: 返回500错误
- dashboard-cron操作API: 返回500而非401

## 结论

**当前状态**: 12个PR全部阻塞

**阻塞原因**:
1. 后端API代码在PR中，需要合并部署后才能测试
2. 前端页面需要构建部署
3. 部分已部署API存在500错误

**建议**:
- 编程CC需要先合并并部署PR #906, #905
- 前端需要构建部署新页面
- 修复dashboard-blocker和dashboard-cron的500错误
