# 中层测试报告 — 2026-03-31 18:45

## 扫描范围

| 仓库 | Open PR数 | 待测PR数 |
|------|----------|---------|
| wande-ai-backend | 20 | 11 |
| wande-ai-front | 20 | 14 |
| wande-data-pipeline | 3 | 0 (均已e2e:tested) |
| wande-gh-plugins | 0 | 0 |

## Backend PR 测试结果

| PR | 标题 | 状态 | 备注 |
|----|------|------|------|
| #883 | fix(dashboard): Issue #700 阻塞待处理表修复与测试补充 | ⚠️ 待合并 | 需数据库表dashboard_blockers |
| #882 | feat(#440): 用户反馈管理模块测试修复 | ⚠️ 待合并 | 修复H2表结构 |
| #881 | feat(execution): 新增管理费配置 API | ⚠️ 待合并 | 新功能，需创建表 |
| #876 | feat(dashboard): 外部工具企微告警推送 | ⚠️ 待合并 | 新功能 |
| #875 | feat(project-mine): 新增 good_lead/bad_lead 反馈 API | ⚠️ 待合并 | 新功能 |
| #874 | feat(project): 项目分配企微机器人推送通知 | ⚠️ 待合并 | 新功能 |
| #873 | fix(dealer): 修复 E2E 测试失败 | ❌ 有冲突 | TIMESTAMPTZ修复，需解决冲突 |
| #861 | fix(知识库): 自动上传向量延迟3分钟 | ⚠️ 待合并 | 修复 |
| #860 | feat(cockpit): 快捷指令执行引擎 | ❌ 有冲突 | 新功能 |
| #851 | feat(acceptance): 验收中心 Service + Controller | ⚠️ 待合并 | 新功能 |
| #845 | feat(scheduler): API SQLite迁移+调度器去重 | ⚠️ 待合并 | 新功能 |

## Front PR 测试结果

| PR | 标题 | 状态 | 备注 |
|----|------|------|------|
| #383 | feat(asset): 素材库列表页面 | ⚠️ 待合并 | 新页面 |
| #382 | feat(claude-office): Kanban看板面板 | ⚠️ 待合并 | 新页面 |
| #381 | feat(dashboard): API网关使用记录页面 | ⚠️ 待合并 | 新页面 |
| #380 | feat(gateway): API 网关子账户管理页面 | ⚠️ 待合并 | 新页面 |
| #379 | feat(dashboard): 确认中心页面 | ⚠️ 待合并 | 新页面 |
| #378 | feat(dev): 新增前端生成代码模板UI | ⚠️ 待合并 | 新功能 |
| #376 | feat(dashboard): 执行日志页 | ⚠️ 待合并 | 新页面 |
| #373 | feat(cockpit): 审批中心+企微通知控制台页面 | ⚠️ 待合并 | 新页面 |
| #372 | feat(dashboard): 需求闭环看板页面 | ⚠️ 待合并 | 新页面 |
| #368 | feat(dashboard): 超管驾驶舱子菜单排序优化 | ⚠️ 待合并 | 优化 |
| #367 | feat(dashboard): 账号池监控页面 | ⚠️ 待合并 | 新页面 |
| #358 | feat(dashboard): 验收中心页面 | ⚠️ 待合并 | 新页面 |
| #353 | feat(dashboard): 开发效率看板页面 | ⚠️ 待合并 | 新页面 |
| #352 | feat(dashboard): 定时任务告警规则管理页 | ⚠️ 待合并 | 新页面 |

## 关键问题

### 1. 数据库表缺失
以下API因数据库表不存在而返回500：
- `dashboard_blockers` 表缺失 → PR #883
- `mgmt_fee_config` 表缺失 → PR #881

### 2. API路径问题
测试发现API实际路径与部分测试代码中的路径不一致，需要更新测试代码。

### 3. 权限问题
部分API需要超管权限（403错误）。

## 建议操作

1. **优先合并**: PR #883, #882（修复现有问题）
2. **解决冲突**: PR #873, #860
3. **批量合并**: 其他新功能PR可以批量合并后统一测试

## 测试环境状态

- 后端API: http://localhost:6040 (运行中)
- 前端页面: http://localhost:8083 (运行中)
- PostgreSQL: localhost:5433 (运行中)
- Redis: localhost:6380 (运行中)
