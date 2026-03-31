# PR #415 测试任务

## PR信息
- **仓库**: wande-ai-front
- **标题**: feat(@vben/web-antd): 驾驶舱全页面深色主题+系统偏好自动检测+手动切换 #394
- **分支**: feature-issue-394 → dev
- **作者**: wandeyaowu

## 变更范围
- 深色主题CSS: styles/dark-theme.css
- 驾驶舱页面深色主题适配
- 系统偏好自动检测

## 测试结果
**状态**: ❌ 阻塞

### 失败原因
测试登录超时，页面路由从 `/login` 变为 `/auth/code-login`，需要更新测试用例。

### 测试详情
- dark-theme-page.spec.ts: 0/3 通过

## 阻塞原因
前端登录流程变化，测试用例需要更新。

## 需要执行的操作
1. 更新测试用例中的登录流程
2. 重新运行测试

## 关联Issue
- #394
