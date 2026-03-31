# 中层测试报告 2026-03-31 18:06

## 测试概览

| 测试套件 | 通过 | 失败 | 跳过 |
|---------|------|------|------|
| Backend API | 298 | 0 | 124 |
| Front Smoke | 155 | 63 | 34 |

## PR 测试结果

### ✅ 已通过并合并

| PR | 仓库 | 标题 | 操作 |
|----|------|------|------|
| #872 | backend | tender_data与discovered_projects关联查询 #358 | approve + merge |
| #849 | backend | Dify conversationId UUID校验 #251 | approve + merge |

### 🔴 测试失败已打回

| PR | 仓库 | 标题 | 问题 |
|----|------|------|------|
| #876 | backend | 外部工具企微告警推送 + 驾驶舱卡片数据API #477 | /dashboard-card 500错误 |
| #875 | backend | good_lead/bad_lead 反馈 API #357 | /feedback 500错误 |
| #874 | backend | 项目分配企微机器人推送通知 #361 | 依赖#875修复 |
| #873 | backend | 修复E2E测试失败 #840 | dealer API 500错误 |
| #838 | backend | 定时任务管理API模块 #828 | cron操作API 500错误 |

### 🟡 菜单缺失待backend支持

| PR | 仓库 | 标题 | 问题 |
|----|------|------|------|
| #373 | front | 审批中心+企微通知控制台 #33 | approval-center菜单未注册 |
| #376 | front | 执行日志页 #119 | cron-exec-log菜单未注册 |
| #372 | front | 需求闭环看板 #123 | requirement-lifecycle菜单未注册 |
| #368 | front | 超管驾驶舱子菜单排序 #155 | 待验证 |
| #367 | front | 账号池监控页面 #211 | 待验证 |
| #358 | front | 验收中心页面 #121 | 待验证 |
| #353 | front | 开发效率看板 #122 | 待验证 |
| #352 | front | 定时任务告警规则管理页 #117 | 待验证 |

### 🟢 已通过（已标记e2e:tested）

- wande-data-pipeline #90, #88, #87
- wande-ai-backend #836, #835, #834, #833, #832, #827
- wande-ai-front #348, #347, #344, #343, #342, #340, #314, #312, #310, #308, #307

## 失败详情

### Backend API 500错误根因
所有500错误均与 @PathVariable 参数命名相关：


**解决方案：**
1. 添加  编译器标志
2. 或显式指定参数名: 

**修复PR:** #835 已包含此修复，但未合并

### Front 页面测试失败
63个页面测试失败，主要原因是：
1. 菜单未在backend注册（sys_menu表）
2. 页面结构变化导致元素定位失败

## 建议操作

1. **立即合并 #835** - 修复所有500错误
2. **重新测试 #876, #875, #873, #838** - 在#835合并后
3. **Backend补充菜单SQL** - 支持Front PR页面
4. **重新测试Front PR** - 菜单注册后

## 已执行操作

- ✅ PR #872 approve + merge
- ✅ PR #849 approve + merge
- ✅ PR #876 request-changes
- ✅ PR #875 request-changes
