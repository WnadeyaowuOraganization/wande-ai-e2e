# 中层测试记录 2026-03-31 18:17

## 测试范围
- 扫描仓库: wande-ai-backend, wande-ai-front, wande-data-pipeline, wande-gh-plugins
- 测试类型: API测试 + 页面Smoke测试

## 测试统计

### Backend API测试
- 通过: 297
- 跳过: 124
- 失败: 多个API返回500错误

### Front页面测试
- 通过: 157
- 失败: 61
- 跳过: 34

### 新页面专项测试
- 通过: 16
- 跳过: 4

## PR处理结果

### 已合并/可合并 (已有e2e:tested标签)
**Backend (9个)**:
- #838, #836, #835, #834, #833, #832, #827, #783, #778

**Front (8个)**:
- #348, #347, #344, #343, #342, #340, #314, #312

**Pipeline (3个)**:
- #90, #88, #87

### 阻塞PR (已添加评论)
**Backend (11个)** - API 500错误:
- #876, #875, #874, #873, #861, #860, #851, #850, #846, #845, #839

**Front (12个)** - 依赖后端菜单:
- #381, #380, #379, #378, #376, #373, #372, #368, #367, #358, #353, #352

## 阻塞原因分析

### 后端API 500错误
以下接口返回500错误，需要后端修复:
1. `GET /wande/dealer/candidate/list`
2. `GET /wande/dealer/bid-record/list`
3. `GET /wande/dealer/follow-up/list`
4. `GET /wande/ext-tool/dashboard-card`
5. `PUT /wande/project-mine/feedback/{id}`
6. `GET /wande/dashboard-acceptance/queue/list`
7. `POST /wande/dashboard-acceptance/queue`

### 前端页面菜单缺失
前端页面PR需要后端菜单SQL支持:
- 审批中心 (#33)
- 企微通知控制台 (#33)
- 验收中心 (#121)
- 开发效率看板 (#122)
- 定时任务告警规则 (#117)
- Issue看板 (#120)
- 确认中心 (#244)
- 我的项目 (#163)
- API网关相关页面 (#245, #246)

## 下一步行动
1. 后端团队修复500错误后重新触发测试
2. 前端页面PR等待后端菜单SQL合并
3. 下次中层测试时间: 15分钟后
