# 中层测试报告 — 2026-04-02

**执行时间**: 2026-04-02 16:35+08:00  
**测试CC**: 自动执行

---

## 扫描结果

### 待测PR扫描（base=dev）

| 仓库 | Open PR数量 (base=dev) | 状态 |
|------|------------------------|------|
| wande-ai-backend | 0 | 无待测PR |
| wande-ai-front | 0 | 无待测PR |
| wande-data-pipeline | 0 | 无待测PR |
| wande-gh-plugins | 0 | 无待测PR |

### 其他Open PR（base=main，跳过）

**wande-ai-front**: 15个PR（base=main）
- #467 fix(web-antd): 修复 AI 渲染助手 E2E smoke 测试失败
- #466 feat(@vben/web-antd): 业务员待办中心 — 我的项目页面优化 (#163)
- #465 feat: 驾驶舱首页KPI聚合重构三区域卡片+健康度总览+Drill-down
- #464 feat: 问题发现主页面 — 问题列表+筛选+详情抽屉
- #460 feat(project): 集成 good_lead/bad_lead 快捷反馈按钮
- #459 feat: 矿场客户详情页添加转入 CRM 按钮
- #458 feat: add intl_mine.html with stats, filters, cards and export
- #452 feat: Issue看板增强 — 跨仓库统一视图+角色筛选+Claude Code进度关联
- #442 feat: 通知中心组件 NotificationPanel + SSE实时接收 #371
- #441 feat: 全平台操作审计日志页面 — 补充类型定义 (#387)
- #440 fix: DORA API 路径不匹配导致 500 错误 #418
- #438 feat: 外部工具健康度卡片 #213
- #436 feat: 聚合分支合并 — GPU监控面板+驾驶舱扩展+多模块页面 (#188等)
- #435 feat: 定时任务管理看板页面 — 总览卡片+任务列表+执行日志+健康状态 #338
- #434 feat(dashboard): 模块真实可用性审计页面 — 31模块健康矩阵+雷达图+成熟度色块 #339

**wande-data-pipeline**: 1个PR（base=main）
- #35 feat(products): 新增 S3 产品参数批量入库脚本

> 注：中层测试只处理base=dev的PR，base=main的PR由人工或其他流程处理。

---

## 环境健康检查

```
npx playwright test tests/backend/api/health.spec.ts
```

**结果**: ✅ 5 passed, 0 failed

- backend service is reachable ✓
- backend returns valid JSON on error ✓
- auth login endpoint exists ✓
- tender list API requires auth ✓
- system user list API requires auth ✓

---

## 结论

**本次中层测试无待处理PR**。

所有4个仓库均无base=dev的open PR。测试环境健康，API服务正常运行。

### 建议

1. 关注wande-ai-front的15个base=main的PR，可能需要创建dev→main的合并PR
2. wande-data-pipeline的#35需要确认是否已准备好合并到main
3. 下次中层测试扫描时间：15分钟后

---

## 历史记录

- 2026-04-02 16:30: PR #958 已合并（backend#955 MyBatis alias冲突修复）
- 2026-04-02 16:35: 本次扫描完成，无待测PR
