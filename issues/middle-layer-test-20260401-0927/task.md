# 中层测试执行报告 — 2026-04-01 09:27

## 扫描范围
- wande-ai-backend: 10 open PRs
- wande-ai-front: 11 open PRs  
- wande-data-pipeline: 3 open PRs
- wande-gh-plugins: 0 open PRs

## 测试执行摘要

### Backend PRs

| PR | 作者 | 标题 | 状态 | 结果 |
|----|------|------|------|------|
| #850 | wandeyaowu | 修复开发阻塞主动提醒功能代码结构 #485 | ❌ 失败 | 路由映射+SQL字段缺失，已创建P0修复Issue #945 |
| #836 | wandeyaowu | 项目分配作战信息卡通知 #360 | ⚠️ 阻塞 | 代码未部署+环境故障 |
| #835 | wandeyaowu | 修复dashboard-card API 500错误 #830 | ✅ 已合并 | 09:02已merge，等待部署 |
| #834 | wandeyaowu | cockpit_config表添加BaseEntity标准列 #831 | ⏭️ 未测 | e2e:tested标签，环境故障 |
| #833 | wandeyaowu | GitHub同步修复+增强 #599 | ⏭️ 未测 | e2e:tested标签，环境故障 |
| #832 | david-hwp | 修复任意文件上传漏洞 #9 | ⚠️ 阻塞 | 环境被#850影响，无法准确测试 |
| #827-771 | wandeyaowu | 多个功能PR | ⏭️ 未测 | e2e:tested标签，环境故障 |

### Frontend PRs

| PR | 作者 | 标题 | 状态 | 结果 |
|----|------|------|------|------|
| #378 | wandeyaowu | 新增前端生成代码模板UI #30 | ⏭️ 未测 | e2e:tested标签 |
| #358 | david-hwp | 验收中心页面 #121 | ✅ 已合并 | smoke测试通过，已merge |
| #348-307 | wandeyaowu | 多个功能PR | ⏭️ 未测 | e2e:tested标签 |
| #335 | wandeyaowu | 外部工具健康度卡片 #213 | ⏭️ 跳过 | status:blocked |

### Pipeline PRs

| PR | 作者 | 标题 | 状态 | 结果 |
|----|------|------|------|------|
| #90, #88, #87 | wandeyaowu | 关键词学习/采集引擎 | ⏭️ 未测 | e2e:tested标签 |

## 关键发现

### Dev环境故障
PR #850 最新commit (09:15) 引入严重回归：
1. **SQL表结构缺失**: dashboard_blockers 表缺少 issue_title 等列
2. **Controller路由顺序错误**: /{id} 路径排在功能路径之前，导致 /stats、/unresolved-count 等被截获
3. **影响范围**: 所有 /wande/* 和 /chat/* 路径受影响，大面积API返回500

**影响**: Backend PR测试受阻，需等待 #850 修复后环境恢复。

## 操作记录

1. ✅ PR #850: 提交测试失败评论，创建P0修复Issue #945
2. ✅ PR #358: 测试通过，已合并
3. 📝 PR #832, #836: 标记环境阻塞，记录待复测

## 下一步行动

- [ ] 编程CC修复 #850 并重新部署dev环境
- [ ] 环境恢复后复测 #832, #836 等阻塞PR
- [ ] 继续中层测试循环，处理剩余open PR
