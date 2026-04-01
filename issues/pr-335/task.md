# PR #335 测试任务

## PR信息
- 仓库: wande-ai-front
- 标题: feat(dashboard): 外部工具健康度卡片 #213
- 关联Issue: #213
- 状态: **阻塞** (Dev环境不可用)

## 变更范围
- 新增: ExternalToolHealthCard.vue 组件
- 新增: /monitor/ext-tool/dashboard-card API调用
- 集成: 驾驶舱首页
- 单元测试: ExternalToolHealthCard.test.ts

## 测试执行记录
- 时间: 2026-04-01
- 结果: **阻塞**
- 原因: Dev环境后端服务未启动 (ECONNREFUSED 127.0.0.1:6040)
- 前端服务: 正常 (8083)

## 待测项目
- [ ] dashboard-card API rejects unauthenticated requests
- [ ] dashboard-card API returns valid data with auth
- [ ] dashboard-card API response has expected fields
- [ ] cockpit page loads with external tool health card
- [ ] cockpit page has no critical console errors

## 测试轮次2 (2026-04-01 05:35)
- 状态: **部分通过**
- Dev环境: ✅ 已恢复

| 测试用例 | 状态 | 说明 |
|---------|------|------|
| dashboard-card API rejects unauthenticated | ❌ 失败 | ECONNREFUSED |
| dashboard-card API returns valid data | ❌ 失败 | ECONNREFUSED |
| dashboard-card API response has expected fields | ⏭️ 跳过 | - |
| cockpit page loads | ✅ 通过 | - |
| cockpit page has no critical console errors | ❌ 失败 | 6个console错误 |

### 根因
- 后端API `/monitor/ext-tool/dashboard-card` 未实现或不可用
- PR已被标记为 `status:blocked`，等待后端API

### 操作
- 保持 blocked 状态
- 等待后端API实现

## 阻塞解除后操作
1. 重新执行中层测试
2. 通过后approve并merge
3. 失败则request-changes并创建P0 Issue
