# 中层测试报告 — 2026-03-31 17:50

## 执行摘要

| 仓库 | 扫描PR数 | 待测PR数 | 测试结果 | 处置 |
|------|---------|---------|---------|------|
| wande-ai-backend | 16 | 13 | 137 failed / 296 passed / 124 skipped | **Blocked — 环境原因** |
| wande-ai-front | 13 | 5 (无e2e:tested/status:test-failed的新PR) | 60 failed / 159 passed / 33 skipped | **Blocked — 环境原因** |
| wande-data-pipeline | 3 | 0 (全部e2e:tested) | 1 failed / 13 passed | **Blocked — 环境原因** |
| wande-gh-plugins | 0 | 0 | — | — |

**结论**：由于 backend API 服务 CPU 占用异常（~400%）导致大面积 500 错误和连接超时，本次中层测试**所有仓库均因环境问题被 block，未执行任何 approve/merge 或 request-changes 操作**。

---

## 根因分析

### Backend 服务状态
```
PID 3132250: java -jar ruoyi-admin.jar --server.port=6040 ...
CPU: 398%
```

后端 Java 进程 CPU 占用接近 400%，处于严重过载状态。直接表现为：
- 大量 API 返回 HTTP 500 / `code: 500`
- 部分请求出现 `socket hang up`
- 前端页面因 API 超时/失败导致渲染异常

### 影响范围
- **backend API 测试**：原本期望返回 401 的未认证接口也大量返回 500；已认证接口几乎全线 500
- **front smoke 测试**：大量页面加载测试失败，因为页面依赖的 backend API 超时/500
- **pipeline 测试**：仅有 1 个失败（调用 `/wande/project/mine/list` 时 socket hang up），也是 backend 不稳定导致

---

## 待测 PR 清单

### backend（13个，全部 blocked）
| PR | Issue | 标题 | 已有测试覆盖 |
|----|-------|------|-------------|
| #876 | #477 | feat(dashboard): 外部工具企微告警推送 + 驾驶舱卡片数据API | ext-tool-dashboard.spec.ts |
| #875 | #357 | feat(project-mine): 新增 good_lead/bad_lead 反馈 API | project-mine-feedback.spec.ts |
| #874 | #361 | feat(project): 项目分配企微机器人推送通知 | 无 E2E |
| #873 | #840 | fix(dealer): 修复 E2E 测试失败 — TIMESTAMPTZ + Mapper XML | dealer.spec.ts |
| #872 | #358 | feat(project-mine): tender_data 与 discovered_projects 关联查询 | project-mine.spec.ts |
| #861 | #89 | fix(知识库): 自动上传向量延迟3分钟 + 修复删除向量报错 | 无 E2E |
| #860 | #45 | feat(cockpit): 快捷指令执行引擎 | dashboard-command.spec.ts |
| #851 | #250 | feat(acceptance): 验收中心 Service + Controller | dashboard-acceptance.spec.ts |
| #850 | #485 | feat(dashboard): 修复开发阻塞主动提醒功能代码结构 | dashboard-blocker.spec.ts |
| #849 | #251 | fix(chat): Dify conversationId UUID校验 | dify-uuid.spec.ts |
| #846 | #575 | feat(dashboard): API网关子账户管理 [1/4] | gateway-budget.spec.ts |
| #845 | #602 | feat(scheduler): API SQLite迁移+调度器去重+僵尸检测 | 无 E2E（Python模块）|
| #839 | #309 | feat(dealer): Phase 3 模块间数据打通 | dealer.spec.ts |

### front（5个核心新PR，全部 blocked）
| PR | Issue | 标题 | 已有测试覆盖 |
|----|-------|------|-------------|
| #376 | #119 | feat(dashboard): 执行日志页 | cron-tasks-page.spec.ts 部分 |
| #373 | #33 | feat(cockpit): 审批中心+企微通知控制台 | approval-center-page.spec.ts, wecom-console-page.spec.ts |
| #372 | #123 | feat(dashboard): 需求闭环看板页面 | 无专门 E2E |
| #368 | #155 | feat(dashboard): 超管驾驶舱子菜单排序优化+路由配置测试 | 无专门 E2E |
| #367 | #211 | feat(dashboard): 账号池监控页面 | model-pool-page.spec.ts |

---

## 行动项

1. **紧急**：排查 backend 服务 CPU 400% 的根因
   - 检查是否有死循环、内存泄漏、或非法请求洪水
   - 检查数据库连接池是否耗尽
   - 检查是否有正在执行的 Maven 测试（PID 3133965 也在高负载运行）与运行中的服务竞争资源

2. **backend 恢复后**：重新运行中层测试，优先测试列表中的 13 个 backend PR 和 5 个 front 新 PR

3. **无需对任何 PR 打回或添加 `status:test-failed` 标签**，因为失败是环境导致的，不是代码质量问题
