# PR #908 测试任务

## PR信息
- **仓库**: wande-ai-backend
- **标题**: feat(dora): DORA四指标统计API — 部署频率/变更前置时间/变更失败率/恢复时间 #885
- **分支**: feature-issue-885 → dev
- **作者**: wandeyaowu

## 变更范围
- DORA四指标：部署频率、变更前置时间、变更失败率、恢复时间
- SQL迁移: 2026-03-31-create-dora-metrics-tables.sql

## 测试结果
**状态**: ❌ 阻塞

### 失败原因
```
GET /dora/summary → code: 500
GET /dora/trend → code: 500
GET /dora/breakdown → code: 500
GET /dora/level → code: 500
错误: 数据库表 wdpp_dora_metrics 不存在
```

## 阻塞原因
PR包含SQL迁移文件，但测试环境未执行迁移。

## 需要执行的操作
1. 执行SQL迁移: `script/sql/update/wande_ai/2026-03-31-create-dora-metrics-tables.sql`
2. 重新运行测试

## 关联Issue
- #885
