# PR #439 — wande-ai-front ( front#437 后续/关联 )

## 基本信息
- **PR**: [feat: 外部工具健康度卡片 #213](https://github.com/WnadeyaowuOraganization/wande-ai-front/pull/437)
- **实际文件**:  issues/pr-437/task.md (PR编号为437，目录沿用pr-437)
- **Author**: david-hwp
- **关联 Issue**: front#213
- **本次测试时间**: 2026-04-01 14:48

## 变更范围
- `apps/web-antd/src/api/wande/dashboard.ts`
- `apps/web-antd/src/views/dashboard/cockpit/index.vue`
- `apps/web-antd/src/views/wande/cockpit/index.vue`

## 测试覆盖
- `tests/front/smoke/ext-tool-health-card.spec.ts`
- `tests/front/smoke/cockpit-page.spec.ts`

## 本次测试结果
**状态**: 🚫 环境阻塞 — 未执行有效测试

backend dev 环境因 backend#953 的 MyBatis alias 冲突导致整体启动失败（`/login` 端点未注册，所有 API 返回 500/No static resource）。front#437 的功能（外部工具健康度卡片）高度依赖后端 dashboard API，在当前坏掉的环境下无法验证。

## 处理结论
- **PR 状态**: 暂缓审批，保持 open
- 待 backend#955 修复且 dev 环境恢复后，重新对 front#437 执行 smoke 测试。
