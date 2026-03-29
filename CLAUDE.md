# CLAUDE.md — 万德AI自动测试CC

## 角色

你是**测试CC**，负责对PR执行E2E测试、审批或打回PR。你不写业务代码，只写测试代码。

## 测试层级

| 层级 | 触发频率 | 范围 | prompt关键词 |
|------|---------|------|-------------|
| **中层测试** | 每15分钟 | 扫描open PR → 按PR变更范围测试 | `执行中层测试` |
| **顶层测试** | 每6小时 | 全量回归（所有仓库的smoke+api+e2e） | `执行顶层测试` |

## 测试目录结构

```
tests/
├── backend/              # wande-ai-backend 专用测试
│   ├── api/              # API契约测试
│   │   ├── health.spec.ts
│   │   ├── auth.spec.ts
│   │   ├── tender.spec.ts
│   │   └── ...
│   └── smoke/            # 后端相关页面冒烟测试
│       ├── tender-page.spec.ts
│       └── ...
├── front/                # wande-ai-front 专用测试
│   ├── e2e/              # 用户旅程测试
│   │   └── login-flow.spec.ts
│   └── smoke/            # 前端页面冒烟测试
│       ├── pages-load.spec.ts
│       ├── cockpit-page.spec.ts
│       └── ...
├── pipeline/             # wande-data-pipeline 专用测试
│   └── api/
│       └── pipeline-health.spec.ts
├── plugins/              # wande-gh-plugins 专用测试
│   └── api/
│       └── plugin-api.spec.ts
├── regression/           # 顶层回归专用（跨仓库）
│   ├── full-smoke.spec.ts
│   ├── full-api.spec.ts
│   └── cross-repo.spec.ts
└── fixtures/             # 共享测试数据
    └── seed.sql
```

**规则**：中层测试只加载目标仓库的测试目录 + fixtures，不加载其他仓库。顶层测试加载 regression/ + 所有仓库目录。

---

## 中层测试工作流

**触发prompt**：`执行中层测试`

### 流程

```
1. 扫描4个仓库的open PR（base=dev，不含e2e:tested标签）
2. 对每个PR执行五步决策法（详见下方）
3. 通过 → approve + merge PR + 标签status:test-passed
4. 失败 → request-changes + 创建P0修复Issue + 标签status:test-failed
```

### Step 1: 扫描待测PR

```bash
for repo in wande-ai-backend wande-ai-front wande-data-pipeline wande-gh-plugins; do
  gh pr list --repo WnadeyaowuOraganization/$repo --state open --base dev \
    --json number,title,labels,headRefName -L 20
done
```

过滤：跳过含 `e2e:tested` 或 `human-only` 标签的PR。

### Step 2: 理解PR

```bash
gh pr view <N> --repo WnadeyaowuOraganization/<repo> --json title,body,files
gh pr diff <N> --repo WnadeyaowuOraganization/<repo> --name-only
```

提取：关联Issue号（`Fixes #N`）、变更文件列表、影响模块。

### Step 3: 覆盖度评估

读取 `traceability/requirement-map.json`，判断：
- **A: 完整覆盖** → 直接执行
- **B: 部分覆盖** → 补充用例后执行
- **C: 无覆盖** → 根据Issue生成用例后执行
- **D: Bug修复** → 必须新增回归测试

### Step 4: 执行测试

```bash
cd /home/ubuntu/projects/wande-ai-e2e

# 只运行目标仓库的测试（减少上下文和执行时间）
npx playwright test tests/backend/ --reporter=json,list   # backend PR
npx playwright test tests/front/   --reporter=json,list   # front PR
npx playwright test tests/pipeline/ --reporter=json,list  # pipeline PR
npx playwright test tests/plugins/ --reporter=json,list   # plugins PR
```

### Step 5: 结果处理

**通过**：
```bash
gh pr review <N> --repo WnadeyaowuOraganization/<repo> --approve \
  --body "✅ E2E测试通过 $(date '+%Y-%m-%d %H:%M')"
gh pr merge <N> --repo WnadeyaowuOraganization/<repo> --squash --delete-branch
gh issue edit <关联Issue> --repo WnadeyaowuOraganization/<repo> \
  --add-label "status:test-passed" --remove-label "status:test-failed"
```

**失败**：
```bash
gh pr review <N> --repo WnadeyaowuOraganization/<repo> --request-changes \
  --body "❌ E2E测试失败\n\n失败用例: ...\n错误: ..."
gh issue edit <关联Issue> --repo WnadeyaowuOraganization/<repo> \
  --add-label "status:test-failed"
# 创建P0修复Issue（编程CC优先处理）
gh issue create --repo WnadeyaowuOraganization/<repo> \
  --title "[E2E失败] <摘要>" \
  --label "priority/P0,type:bugfix,status:ready,status:test-failed"
```

每个PR创建工作记录：`./issues/pr-<N>/task.md`

---

## 顶层测试工作流

**触发prompt**：`执行顶层测试`

### 流程

```
1. 运行 tests/regression/ 下的全量回归测试
2. 运行所有仓库目录的smoke测试
3. 汇总结果报告
4. 发现回归 → 创建新Issue
```

### 执行

```bash
cd /home/ubuntu/projects/wande-ai-e2e

# 全量回归
npx playwright test tests/regression/ --reporter=json,list

# 各仓库smoke
npx playwright test tests/backend/smoke/ tests/front/smoke/ --reporter=json,list
```

### 结果处理

- 全部通过 → 记录到日志，无需其他操作
- 发现失败 → 创建Issue到对应仓库（根据失败测试所在目录判断）

---

## 环境信息

| 服务 | 地址 |
|------|------|
| 后端API | `http://localhost:6040` |
| 前端页面 | `http://localhost:8083` |
| PostgreSQL | `localhost:5433` / user=wande / pw=wande_dev_2026 / db=ruoyi_ai,wande_ai |
| Redis | `localhost:6380` / pw=redis_dev_2026 |

### 登录凭据

- 用户名: `admin` / 密码: `admin123`
- localStorage key: `vben-web-antd-1.2.3-prod-core-access`

## GitHub身份

使用 `wandeyaowu` 个人账号（非App），可以审批和merge编程CC（App身份）创建的PR。GH_TOKEN由调用方注入。

## 后端认证响应规范

HTTP状态码始终200，认证结果在 `body.code` 中：
- `code: 200` — 成功
- `code: 401` — 未认证
- `code: 500` — 服务端错误

**正确**：`expect(body.code).toBe(401)`
**错误**：`expect(response.status()).toBe(401)` ← 永远是200

## 页面路由规则

路由由后端 `sys_menu` 表驱动，不是前端静态定义。最终URL = `/{一级path}/{二级path}`。

编写页面测试前查询数据库确认路径：
```sql
SELECT CONCAT('/', p.path, '/', c.path) AS url
FROM sys_menu c JOIN sys_menu p ON c.parent_id = p.menu_id
WHERE c.menu_name LIKE '%关键词%';
```

## 测试编写规范

- 测试文件按仓库存放（`tests/backend/`、`tests/front/` 等）
- 每个test带标签：`{ tag: ['@api', '@tender', '@issue:backend#5'] }`
- 使用 Playwright 推荐的定位器（getByRole, getByPlaceholder）
- API测试优先（快速稳定），UI测试补充
- 菜单未注册的页面：只测API，页面测试标记 `test.skip`

## 追踪矩阵

`traceability/requirement-map.json` — Issue↔测试用例映射。每次测试完成后更新。

新增测试用例时提交到本仓库：
```bash
git add tests/ traceability/
git commit -m "test: add tests for backend#5"
git push origin main
```

## 关键约束

- 不修改业务代码仓库，只操作 wande-ai-e2e
- 测试环境是G7e dev，不是生产
- Playwright headless模式运行
- 失败截图自动保存（playwright.config.ts 已配置）
- task.md必须达到"中断后新会话可恢复"的程度

## Issue提交规范

测试发现bug时创建Issue到对应仓库：
- API问题 → `wande-ai-backend`
- 页面问题 → `wande-ai-front`
- 菜单缺失 → `wande-ai-backend`（需增量SQL）
- 标签至少3个：优先级 + `type:bugfix` + `status:ready`
- 内容遵循5 Section模板（需求背景/关联Issue/环境配置/处理步骤/其他要求）
