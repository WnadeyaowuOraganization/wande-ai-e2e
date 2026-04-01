# PR #87 测试记录

## PR信息
- **仓库**: wande-data-pipeline
- **标题**: add: 添加post-task.sh脚本 #38
- **分支**: feature-issue-38
- **关联Issue**: #38

## 变更文件
- 大量新增文件：competitors管线、domestic_projects测试、post-task.sh等

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
- **结论**: 该失败与 PR #87 的 pipeline 代码无关，属于后端数据库 schema 与代码不同步的外部环境问题。

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
- 失败原因: 后端环境返回 `No static resource dev-api/project/mine/list.`，属于已知后端API/环境问题，与PR #87的pipeline代码无关。
- **结论**: 该失败与 PR #87 无关，属于外部环境问题。

### 当前状态: ⚠️ 合并阻塞
**阻塞原因**: `mergeStateStatus: DIRTY`（分支与base不同步）
**阻塞原因**: 测试因后端环境问题未100%通过，暂不 approve + merge。

---
记录时间: 2026-04-01
