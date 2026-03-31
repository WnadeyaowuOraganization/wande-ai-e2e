# PR #409 测试任务

## PR信息
- **仓库**: wande-ai-front
- **标题**: feat(dashboard): DORA四指标看板页面 — 首页KPI卡片+独立详情页 #386
- **分支**: feature-issue-386 → dev
- **作者**: wandeyaowu

## 变更范围
- DORA API层: api/wande/dora.ts
- DORA详情页: views/wande/dora/index.vue
- 驾驶舱首页DORA卡片

## 测试结果
**状态**: ❌ 阻塞

### 失败原因
DORA页面需要登录才能访问，测试需要更新登录流程。

### 测试详情
- dora-metrics.spec.ts: 0/1 通过

## 阻塞原因
前端登录流程变化，测试用例需要更新。

## 关联Issue
- #386
