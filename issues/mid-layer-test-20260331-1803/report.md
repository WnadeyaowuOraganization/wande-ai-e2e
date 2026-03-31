# 中层测试报告 $(date '+%Y-%m-%d %H:%M')

## 测试概览

| 测试套件 | 通过 | 失败 | 跳过 |
|---------|------|------|------|
| Backend API | 298 | 0 | 124 |
| Front Smoke | 155 | 63 | 34 |

## PR 测试结果

### 🔴 阻塞PR (API 500错误)

| PR | 仓库 | 标题 | 问题 |
|----|------|------|------|
| #876 | backend | 外部工具企微告警推送 + 驾驶舱卡片数据API | `/dashboard-card` 返回500 |
| #875 | backend | 新增 good_lead/bad_lead 反馈 API | `/feedback` 返回500 |
| #874 | backend | 项目分配企微机器人推送通知 | 依赖上述修复 |
| #873 | backend | 修复 E2E 测试失败 | TIMESTAMPTZ兼容 |
| #872 | backend | tender_data与discovered_projects关联查询 | 待测试 |

### 🟡 待验证PR (菜单缺失)

| PR | 仓库 | 标题 | 问题 |
|----|------|------|------|
| #373 | front | 审批中心+企微通知控制台页面 | 菜单未注册 |
| #376 | front | 执行日志页 | 待验证 |
| #372 | front | 需求闭环看板页面 | 待验证 |

### 🟢 已通过PR

- wande-data-pipeline #90, #88, #87 - 已标记e2e:tested

## 失败详情

### Backend API 500错误
- `GET /monitor/ext-tool/dashboard-card` → code: 500
- `PUT /wande/project/mine/feedback/{id}` → code: 500  
- `GET /wande/project/mine/feedback-stats` → code: 500

### Front 页面测试失败
- 63个页面测试失败，主要是菜单未注册或页面结构变化
- 需要检查菜单路由配置

## 建议

1. **优先合并 #835** - 修复dashboard-card 500错误
2. **检查 #875** - feedback API 500错误需要修复
3. **Front PR** - 需要确认菜单已注册后再测试
