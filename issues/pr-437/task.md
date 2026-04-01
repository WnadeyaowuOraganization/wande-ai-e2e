# PR #437 测试记录

## 基本信息
- **仓库**: wande-ai-front
- **PR**: #437 - feat: 外部工具健康度卡片 #213
- **作者**: david-hwp
- **状态**: ❌ 测试失败 / 合并冲突
- **测试时间**: 2026-04-01 13:34

## 变更范围
- apps/web-antd/src/api/wande/dashboard.ts
- apps/web-antd/src/views/dashboard/cockpit/index.vue
- apps/web-antd/src/views/wande/cockpit/index.vue

## 测试结果
```
❌ 2/5 测试失败, 1/5 跳过, 2/5 通过

✅ dashboard-card API rejects unauthenticated requests
❌ dashboard-card API returns valid data with auth - API返回500
⏭️ dashboard-card API response has expected fields (skipped)
✅ cockpit page loads with external tool health card
❌ cockpit page has no critical console errors - 8个console错误
```

## 失败详情

### 1. API返回500错误
```
Expected: 200
Received: 500
```
- 端点: /monitor/ext-tool/dashboard-card
- 问题: 后端API内部错误

### 2. Console错误
```
Expected: 0
Received: 8
```
- 静态资源加载失败: api/dashboard/budget-overview

## 阻塞问题
- **合并状态**: DIRTY (有冲突)
- **API状态**: 500错误

## 建议修复
1. 解决合并冲突
2. 检查/monitor/ext-tool/dashboard-card后端实现
3. 修复驾驶舱页面静态资源加载问题
4. 重新运行E2E测试

## 关联Issue
- Fixes #213
