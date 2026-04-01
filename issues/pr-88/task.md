# PR #88 测试记录

## PR信息
- **仓库**: wande-data-pipeline
- **标题**: feat(domestic_projects): 采集引擎配置分离+JSON日志+README #16
- **分支**: feature-issue-16
- **关联Issue**: #16

## 变更文件
- `pipelines/domestic_projects/README.md` (新增)
- `pipelines/domestic_projects/config.yaml` (新增配置分离)
- `pipelines/domestic_projects/smart_project_discovery.py` (配置分离改造)

## 中层测试执行记录（2026-04-01 12:19）

### 测试命令
```bash
npx playwright test tests/pipeline/ --reporter=json,list
```

### 测试结果
- **13/14 通过，1 失败**
- 失败用例: `project mine API returns data with valid token`
- 失败原因: 后端 `ProjectMineMapper.xml` 查询了 `wdpp_discovered_projects` 表中**不存在的 `status` 列**，导致后端返回 HTTP 500。
  - 错误详情: `org.postgresql.util.PSQLException: ERROR: column "status" does not exist`
  - 根因分析: `wande-ai-backend` 在 commit `2d50f669` (PR #875) 中引入了 `status` 字段，但增量 SQL `2026-03-31-add-project-mine-feedback-columns.sql` 未包含该列。
- **结论**: 该失败与 PR #88 的 pipeline 代码无关，属于后端数据库 schema 与代码不同步的外部环境问题。

### 当前状态: ⚠️ 合并阻塞
**阻塞原因**: `mergeStateStatus: DIRTY`（分支与base不同步）
**阻塞原因**: 测试因后端环境问题未100%通过，暂不 approve + merge。

### 建议操作
1. 等待后端 P0 Issue 修复 `status` 列缺失问题后，重新执行中层测试
2. 编程CC解决 DIRTY 状态（同步 base 分支）
3. 测试100%通过后执行 approve + squash merge

## 中层测试执行记录（2026-04-01 12:30）

### 测试命令
```bash
npx playwright test tests/pipeline/ --reporter=json,list
```

### 测试结果
- **13/14 通过，1 失败**
- 失败用例: `project mine API returns data with valid token`
- 失败原因: 后端环境返回 `No static resource dev-api/project/mine/list.`，属于已知后端API/环境问题，与PR #88的pipeline代码无关。
- **结论**: 该失败与 PR #88 无关，属于外部环境问题。

### 当前状态: ⚠️ 合并阻塞
**阻塞原因**: `mergeStateStatus: DIRTY`（分支与base不同步）
**阻塞原因**: 测试因后端环境问题未100%通过，暂不 approve + merge。

---
记录时间: 2026-04-01
