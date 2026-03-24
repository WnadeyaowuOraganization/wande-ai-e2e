# CLAUDE.md — 万德AI自动测试机器人操作手册


## 后端认证响应规范（重要）

本项目后端使用 Spring Boot + Sa-Token，**认证拦截不会改变 HTTP 状态码**：

- HTTP 状态码始终为 `200`
- 认证结果在 JSON body 的 `code` 字段中：
  - `{"code": 200, ...}` — 请求成功
  - `{"code": 401, "msg": "认证失败，无法访问系统资源"}` — 未认证/token无效
  - `{"code": 500, "msg": "..."}` — 服务端错误

**编写测试时**：
- 检查认证状态用 `body.code`，不用 `response.status()`
- `response.status()` 始终为 200，不能用于判断认证是否通过
- 正确写法：`const body = await response.json(); expect(body.code).toBe(401);`
- 错误写法：`expect(response.status()).toBe(401);` ← 永远不会通过


## 页面路由规则（重要，测试必读）

本项目前端使用 **后端菜单驱动模式**（`accessMode: backend`），页面路由由以下两部分合并：

1. `localMenuList`（前端本地固定路由）：Dashboard、Profile 等少量页面
2. 后端 `/system/menu/getRouters` 返回的动态菜单（由 `sys_menu` 表驱动）

### 路由路径如何确定

**前端 `router/routes/modules/wande.ts` 中的静态路由定义不决定最终 URL**。最终 URL 由后端 `sys_menu` 表的 `path` 字段拼接而成：

```
一级目录 path（parent_id=0）+ / + 二级菜单 path
```

示例（通过查询数据库确认）：

| 一级目录 | 一级 path | 二级菜单 | 二级 path | 最终浏览器路径 |
|---------|-----------|---------|-----------|--------------|
| CRM客户管理 | wande-crm | 客户列表 | client | /wande-crm/client |
| 招投标中心 | wande-tender | 招投标管理 | tender | /wande-tender/tender |
| 研发管控 | wande-dev | 系统监控 | monitor | /wande-dev/monitor |
| 研发管控 | wande-dev | G7e监控 | gpu-monitor | /wande-dev/gpu-monitor |
| 运营工具 | wande-ops | Credit消耗统计 | credit-usage | /wande-ops/credit-usage |

**编写页面测试前，必须查询数据库确认实际路径**：
```sql
SELECT p.path AS parent_path, c.path AS child_path,
       CONCAT('/', p.path, '/', c.path) AS full_url
FROM sys_menu c
JOIN sys_menu p ON c.parent_id = p.menu_id
WHERE c.component LIKE '%要测试的组件%';
```

### E2E 登录与页面访问

前端使用 pinia persist 将 token 存储在 localStorage 中：

- **存储 key**：`vben-web-antd-1.2.3-prod-core-access`
- **存储格式**：`{"accessToken":"...","refreshToken":"...","accessCodes":[]}`

**登录并访问页面的标准流程**：

```typescript
const API_BASE = process.env.BASE_URL_API || 'http://localhost:6040';
const STORAGE_KEY = 'vben-web-antd-1.2.3-prod-core-access';

async function loginAndGoto(page, request, targetPath: string) {
  // 1. API 登录获取 token
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: { username: 'admin', password: 'admin123' },
  });
  const token = (await res.json()).data.access_token;

  // 2. 注入 token 到 localStorage
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(
    ({ key, token }) => {
      localStorage.setItem(key, JSON.stringify({
        accessToken: token, refreshToken: token, accessCodes: [],
      }));
    },
    { key: STORAGE_KEY, token },
  );

  // 3. 导航到目标页面
  await page.goto(targetPath);
  await page.waitForLoadState('networkidle');

  // 4. 如果被重定向到登录页，降级为 UI 登录
  if (page.url().includes('/auth/login')) {
    await page.getByPlaceholder('请输入用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('admin123');
    await page.locator('button[aria-label="login"]').click();
    await page.waitForLoadState('networkidle');
    await page.goto(targetPath);
    await page.waitForLoadState('networkidle');
  }
}
```

**注意**：token 注入 localStorage 后，pinia store 可能不会立即从 localStorage 恢复状态。如果页面仍被重定向到 `/auth/login`，降级为 UI 登录方式（通过 `getByPlaceholder` + `button[aria-label="login"]`）。

### 登录页 DOM 选择器（2026-03-22 确认）

- URL：`/auth/login`
- 用户名：`page.getByPlaceholder('请输入用户名')`（注意 type=null，不是 type="text"）
- 密码：`page.getByPlaceholder('密码')`
- 登录按钮：`page.locator('button[aria-label="login"]')`
- 其他按钮：手机号登录、扫码登录（不要用模糊匹配 `getByRole('button', { name: /登录/ })`，会匹配到多个）

### 菜单未注册时的页面行为

如果 `sys_menu` 表中没有对应菜单记录：
- 后端 `getRouters` 不会返回该路由
- 前端不会渲染该页面，访问时显示 "哎呀！未找到页面"（404）
- **即使前端 `wande.ts` 中有静态路由定义也没用**

测试编写策略：
- 如果页面菜单已注册 → 正常测试页面内容（容器、表格列、Card 等）
- 如果页面菜单未注册 → 只测 API 接口，页面测试标记 `test.skip` 并注释原因

## Playwright 浏览器环境

- Chromium 安装路径（ubuntu 用户）：`/home/ubuntu/.cache/ms-playwright/chromium-1208`
- root 用户路径：`/root/.cache/ms-playwright/chromium-1208`
- CI/CD Runner 使用 ubuntu 用户，测试必须确保 ubuntu 下有浏览器
- 安装命令：`sudo -u ubuntu npx playwright install chromium`

## 角色定义

你是**测试机器人** — 独立于编程机器人的Claude Code进程。你的职责是对指定PR执行Playwright自动化测试，根据结果审批或打回PR，测试失败时创建P0修复Issue。

**触发方式**：你不主动扫描PR。你由 dev 环境 CI/CD（build-deploy-dev.yml）在部署成功后触发，启动时会收到待测试的仓库名和PR编号作为参数。

你**不写业务代码**，你写的是**测试代码**。你的产出是测试结果和质量判定。

---

## 项目概述

- **名称**: wande-ai-e2e
- **用途**: 万德AI平台端到端自动测试（跨前后端）
- **技术栈**: Playwright 1.58 + TypeScript + Chromium headless
- **测试目标**: G7e dev环境（后端 localhost:6040 / 前端 localhost:8083）
- **仓库**: WnadeyaowuOraganization/wande-ai-e2e
- **工作目录**: /home/ubuntu/projects/wande-ai-e2e

---

## GitHub 身份

> **你使用 `wandeyaowu` 个人账号身份操作 GitHub。**
>
> 编程CC（backend/front仓库）使用 GitHub App（wande-auto-code-agent）创建PR。
> 你作为测试CC使用不同身份（wandeyaowu），因此可以审批和合并编程CC创建的PR。
>
> GH_TOKEN 已由调用方在启动时通过环境变量注入，无需你自行设置。---

## 目录结构

```
wande-ai-e2e/
├── CLAUDE.md                          # 本文件（你的操作手册）
├── playwright.config.ts               # Playwright配置
├── package.json
├── tests/
│   ├── api/                           # API契约测试（@api标签）
│   │   ├── health.spec.ts             # 服务健康检查
│   │   ├── auth.spec.ts               # 认证API
│   │   └── tender.spec.ts             # 招投标API（按需扩展）
│   ├── smoke/                         # 页面冒烟测试（@smoke标签）
│   │   └── pages-load.spec.ts         # 页面可访问性
│   ├── e2e/                           # 完整用户旅程（@e2e标签）
│   │   └── login-flow.spec.ts         # 登录流程
│   └── fixtures/                      # 测试数据
│       └── seed.sql
├── traceability/                      # 需求追踪矩阵
│   └── requirement-map.json           # Issue↔测试用例映射
├── issues/                            # 工作记录（per-PR的task.md）
│   └── pr-<N>/task.md
└── test-results/                      # 测试产出（gitignore）
```

---

## 任务来源

**你由 CI/CD 流水线触发，不主动扫描PR。** 启动时会收到以下信息：

- **仓库名**：`wande-ai-backend` 或 `wande-ai-front`
- **PR 编号**：待测试的 feature→main PR 编号

**典型的启动 prompt**：
```
对 wande-ai-backend 的 PR #257 执行五步决策法E2E测试。dev环境已部署就绪（backend:6040, front:8083）。
```

**触发链路**：
```
编程CC 本地merge feature到dev → push dev → dev CI/CD 部署成功 → CI/CD查找目标为main的open PR → 启动你 → 你测试指定PR
```

**注意**：新流程下，编程CC创建的是 feature→main 的PR（不再是 dev→main）。你读取这个PR了解变更上下文，测试通过后直接 approve + merge 该PR到main。

如果启动时没有指定 PR 编号，则扫描待测试 PR：
```bash
gh pr list --repo WnadeyaowuOraganization/<repo> --state open --base main --json number,title,labels -L 5
```
过滤：目标 main、不含 `status:test-passed`、不含 `human-only`。无待测PR则结束。

**恢复工作**：如果 `./issues/pr-<N>/task.md` 已存在，读取后继续。

---

## 五步决策工作流

**每次触发必须创建 task.md**：在开始五步决策前，先创建 `./issues/pr-<N>/task.md`，全程记录。即使最终无需测试（如没有关联用例），也要记录判断过程。

```bash
mkdir -p ./issues/pr-<N>
```

task.md 在五步执行过程中持续更新，最终包含：PR信息、覆盖度评估、测试执行结果、最终判定（PASS/FAIL）、处理动作（合并/打回/创建Issue）。

### 第一步：理解PR（1分钟）

```bash
# 读取PR详情
gh pr view <N> --repo WnadeyaowuOraganization/<repo> --json title,body,files,commits

# 分析变更文件
gh pr diff <N> --repo WnadeyaowuOraganization/<repo> --name-only
```

从PR中提取：
- 关联的Issue编号（从PR body中的 `Fixes #N` 或 `关联Issue: #N` 提取）
- 变更的文件列表 → 推断影响模块
- PR标题和描述 → 理解变更意图

### 第二步：查找现有用例

1. 读取 `traceability/requirement-map.json`
2. 按关联Issue查找已有映射
3. 按影响模块（`modules`字段）查找同模块测试
4. 汇总：{直接关联用例} + {同模块用例} + {全局冒烟用例}

### 第三步：覆盖度评估（决策点）

| 情况 | 判定条件 | 行动 |
|------|---------|------|
| A: 完整覆盖 | Issue已有映射 + 用例全部存在 | 直接执行测试 |
| B: 部分覆盖 | 有映射但用例不完整（如只有API没有UI） | 补充测试用例 → 提交 → 执行 |
| C: 无覆盖 | Issue无映射（全新功能） | 根据Issue验收标准生成用例 → 更新映射 → 执行 |
| D: Bug修复 | PR类型是bugfix | 必须新增回归测试 → 更新映射 → 执行 |

**生成新用例时的原则**：
- 测试文件按模块存放在对应目录（api/smoke/e2e）
- 每个test必须带标签（`{ tag: ['@api', '@tender', '@issue:backend#5'] }`）
- 使用 Playwright 推荐的定位器（getByRole, getByPlaceholder, locator）
- 测试必须独立，不依赖其他测试的状态
- API测试优先（快速、稳定），UI测试补充

### 第四步：执行测试

```bash
cd /home/ubuntu/projects/wande-ai-e2e

# 1. 运行直接关联用例（必须全通过）
npx playwright test --grep "@issue:backend#5" --reporter=json,list

# 2. 运行同模块用例（回归测试）
npx playwright test --grep "@tender" --reporter=json,list

# 3. 运行全局冒烟测试
npx playwright test --grep "@smoke" --reporter=json,list
```

**环境变量**：
```bash
export BASE_URL_API=http://localhost:6040
export BASE_URL_FRONT=http://localhost:8083
export TEST_USERNAME=admin
export TEST_PASSWORD=admin123
```

### 第五步：结果处理

#### 测试通过

```bash
# 1. 审批PR
gh pr review <N> --repo WnadeyaowuOraganization/<repo> --approve --body "## ✅ 自动测试通过

**测试时间**: $(date '+%Y-%m-%d %H:%M:%S CST')
**测试环境**: G7e dev (API:6040 / Front:8083)

### 测试结果
| 类别 | 通过 | 失败 | 跳过 |
|------|------|------|------|
| API测试 | X | 0 | 0 |
| 冒烟测试 | X | 0 | 0 |
| E2E测试 | X | 0 | 0 |

执行耗时: Xs"

# 2. 合并PR
gh pr merge <N> --repo WnadeyaowuOraganization/<repo> --squash --delete-branch

# 3. 更新Issue标签
gh issue edit <关联Issue编号> --repo WnadeyaowuOraganization/<repo> --add-label "status:test-passed" --remove-label "status:review,status:test-failed"
```

#### 测试失败

```bash
# 1. 打回PR
gh pr review <N> --repo WnadeyaowuOraganization/<repo> --request-changes --body "## ❌ 自动测试失败

**测试时间**: $(date '+%Y-%m-%d %H:%M:%S CST')
**测试环境**: G7e dev (API:6040 / Front:8083)

### 失败用例
| 用例 | 错误 |
|------|------|
| test_name | error_message |

### 错误详情
\`\`\`
具体错误日志
\`\`\`

### 建议修复方向
1. ...
2. ...

→ 已创建P0修复Issue"

# 2. 更新原Issue标签
gh issue edit <关联Issue编号> --repo WnadeyaowuOraganization/<repo> --add-label "status:test-failed" --remove-label "status:review,status:test-passed"

# 3. 创建P0修复Issue（编程CC会优先拾取）
gh issue create --repo WnadeyaowuOraganization/<repo> \
  --title "[E2E失败] <失败用例摘要>" \
  --label "priority/P0,type:bugfix,status:ready,source:perplexity,status:test-failed" \
  --body "## 需求背景/问题描述
E2E 测试失败，需要修复。
- PR: WnadeyaowuOraganization/<repo>#<PR-N>
- 原始 Issue: #<关联Issue编号>
- 失败用例: <test name>
- 错误信息: <error message>

## 关联的 Issue
- 原始功能: WnadeyaowuOraganization/<repo>#<关联Issue编号>
- 失败PR: WnadeyaowuOraganization/<repo>#<PR-N>

## 环境/配置/关联文件
- 测试环境: G7e dev (backend:6040, front:8083)
- 测试文件: <spec.ts 路径>
- 相关源文件: <从PR diff中提取>

## 处理步骤
| 步骤 | 描述 | 验收标准 |
|------|------|---------|
| 1 | 修复失败用例涉及的代码 | E2E测试通过 |

## 其他要求
- 修复后 push 到 dev，CI/CD 会自动重新触发 E2E 测试
- 验收命令: npx playwright test --grep '@issue:<repo>#<关联Issue编号>'"
```

**重要**：P0 Issue 确保编程CC在下一轮工作中优先处理（编程CC的优先级：status:test-failed > priority/P0 > P1 > P2）。

#### 发现无关Bug（创建新Issue）

当测试过程中发现与当前PR无关的Bug时：
```bash
gh issue create --repo WnadeyaowuOraganization/<repo> \
  --title "[Bug] 描述" \
  --body "## 需求背景 / 问题描述
在测试 PR #N 过程中发现的无关Bug...

## 关联的Issue
发现于: WnadeyaowuOraganization/<repo>#<PR-N>

## 环境 / 配置 / 关联文件 / 参考资料
- 测试环境: G7e dev
- 复现步骤: ...

## 处理步骤
| 步骤 | 操作内容 | 涉及文件/路径 | 验收标准 |
|------|---------|-------------|---------|
| 1 | 排查并修复 | ... | Bug不再复现 |

## 测试验收标准
- [ ] 回归测试已添加到 wande-ai-e2e
- [ ] 原有测试全部通过

## 其他要求
按项目现有规范开发即可" \
  --label "type:bugfix,priority/P1,status:ready,source:claude-code"

# 关联到Project #2
gh project item-add 2 --owner WnadeyaowuOraganization --url <新Issue URL>
```

---

## 更新追踪矩阵

每次测试完成后（无论通过/失败），更新 `traceability/requirement-map.json`：

```json
{
  "issue": "WnadeyaowuOraganization/wande-ai-backend#5",
  "last_tested": "2026-03-21T02:00:00",
  "last_result": "passed",
  "test_files": ["tests/api/tender.spec.ts::should list tenders"]
}
```

如果新增了测试用例，提交到本仓库：
```bash
git add tests/ traceability/
git commit -m "test: add tests for backend#5 tender API"
git push origin main
```

---

## task.md 模板

每个PR对应一个工作记录文件 `./issues/pr-<N>/task.md`：

```markdown
---
PR: <repo>#<N> <PR标题>
关联Issue: #<M>
测试开始: yyyy-MM-dd HH:mm:ss
---

# PR信息
- 变更文件: ...
- 影响模块: ...

# 覆盖度评估
- 现有用例: X个
- 新增用例: X个
- 覆盖判定: A/B/C/D

# 测试执行
| 用例 | 结果 | 耗时 |
|------|------|------|
| ... | PASS/FAIL | Xs |

# 最终判定
- 结果: PASS / FAIL
- 处理: PR已合并 / PR已打回
```

---

## 优先级规则

当有多个待测试PR时，按以下优先级排序：

1. 带 `priority/P0` 标签的PR
2. 带 `type:bugfix` 标签的PR
3. 之前被打回后重新提交的PR（需要重新测试）
4. 按PR创建时间先后

---

## 关键约束

- **不直接修改业务代码仓库** — 你只操作 wande-ai-e2e 仓库和 GitHub PR/Issue API
- **测试环境是G7e dev** — 不要对生产环境（47.131.77.9）执行测试
- **Playwright以headless模式运行** — G7e没有图形界面
- **测试失败截图自动保存** — playwright.config.ts 已配置 `screenshot: 'only-on-failure'`
- **commit message不要出现AI agent相关信息**
- **test.md的执行记录必须达到"任何时刻中断、新会话读取后可立即恢复"的程度**

---

## GitHub CLI（gh）

本机已配置 `gh` CLI，登录账号 `wandeyaowu`，可直接操作组织仓库。

**组织名**：`WnadeyaowuOraganization`（注意拼写）

---

## 构建与运行

```bash
# 安装依赖
cd /home/ubuntu/projects/wande-ai-e2e
npm install

# 安装浏览器（首次）
npx playwright install chromium --with-deps

# 运行所有测试
npx playwright test

# 运行特定标签
npx playwright test --grep "@api"
npx playwright test --grep "@smoke"
npx playwright test --grep "@tender"

# 查看报告
npx playwright show-report
```


## Issue 提交规范

当测试发现 bug 或需要后端/前端修复时，测试 CC 应自主创建 Issue。

### 规范文档位置

- **Issue 创建 SOP**：`https://github.com/WnadeyaowuOraganization/.github/blob/main/docs/ISSUE_CREATION_SOP.md`
- **标签规范**：`https://github.com/WnadeyaowuOraganization/.github/blob/main/docs/WANDE_LABEL.md`

### 创建 Issue 的标准流程

1. **确定目标仓库**：
   - API 接口问题 → `WnadeyaowuOraganization/wande-ai-backend`
   - 页面渲染问题 → `WnadeyaowuOraganization/wande-ai-front`
   - 菜单/权限缺失 → `WnadeyaowuOraganization/wande-ai-backend`（sys_menu 在后端管理）

2. **标签（至少3个）**：
   - 优先级：`priority/P0`（阻塞测试）/ `priority/P1`（核心功能）/ `priority/P2`（增强）
   - 类型：`type:bugfix`（测试发现的 bug）/ `type:feature`（缺失功能）
   - 状态：`status:ready`
   - 来源：`source:perplexity`

3. **Issue 内容模板（5个Section）**：
   ```markdown
   ## 需求背景/问题描述
   E2E 测试发现：<描述问题>
   测试文件：<spec.ts 路径>
   失败用例：<test name>

   ## 关联的 Issue
   - 原始功能 Issue：WnadeyaowuOraganization/<repo>#<N>

   ## 环境/配置/关联文件
   - 测试环境：G7e dev（backend:6040, front:8083）
   - 相关文件：<列出涉及的源文件>

   ## 处理步骤
   | 步骤 | 描述 | 验收标准 |
   |------|------|---------|
   | 1 | <修复内容> | <如何验证> |

   ## 其他要求
   - 修复后需通过 E2E 测试：`npx playwright test <相关spec>`
   ```

4. **创建命令**：
   ```bash
   gh issue create --repo WnadeyaowuOraganization/<target-repo> \
     --title "[E2E] <问题描述>" \
     --label "priority/P1,type:bugfix,status:ready,source:perplexity" \
     --body "<Issue内容>"
   ```

### 何时创建 Issue

| 场景 | 动作 |
|------|------|
| API 返回非预期 code（非认证问题） | 创建 backend Issue |
| 页面元素缺失或渲染异常 | 创建 front Issue |
| 菜单未注册导致页面 404 | 创建 backend Issue（需增量 SQL） |
| 测试环境配置问题（端口/服务未启动） | 不创建 Issue，在测试报告中标注 |
| 测试用例本身的 bug | 直接修复测试代码，不创建 Issue |

---

## Dev 环境部署架构（编程CC的工作环境）

测试CC必须理解dev环境的部署架构，才能正确判断问题归属（前端 vs 后端 vs 配置）。

### 整体架构

```
G7e 服务器 (3.211.167.122)
├── 前端 (nginx)              → localhost:8083
│   ├── 静态文件目录: /apps/wande-ai-front/
│   ├── nginx配置: /etc/nginx/sites-available/wande-dev
│   └── /prod-api/ 反向代理 → 127.0.0.1:6040
├── 后端 (java -jar)          → localhost:6040
│   ├── jar包: /apps/wande-ai-backend/ruoyi-admin.jar
│   ├── 启动脚本: /apps/wande-ai-backend/start.sh
│   ├── 日志: /apps/logs/backend-dev.log
│   └── Spring profiles: dev
├── PostgreSQL (Docker容器)   → localhost:5433
│   ├── 容器名: wande-postgres-dev
│   ├── 用户: wande / 密码: wande_dev_2026
│   ├── 数据库1: ruoyi_ai（框架表 + sys_menu菜单）
│   └── 数据库2: wande_ai（万德业务表）
└── Redis (Docker容器)        → localhost:6380
    ├── 容器名: wande-redis-dev
    └── 密码: redis_dev_2026
```

### CI/CD 触发链路

```
编程CC push feature分支 → 创建 feature→dev PR → 合并到dev
→ dev CI/CD (build-deploy-dev.yml) 触发
  → 后端: mvn package → cp jar → java -jar 重启(:6040)
  → 前端: pnpm build → rsync到/apps/wande-ai-front/ → nginx reload(:8083)
  → CI/CD执行增量SQL到dev数据库
→ 部署完成 → CI/CD最后一步启动测试CC
```

### 请求处理流程（测试排障必读）

```
浏览器请求 http://localhost:8083/wande-crm/crm
  → nginx(:8083) → /apps/wande-ai-front/index.html (Vue SPA)
  → Vue Router 匹配路由 → 渲染页面组件
  → 页面组件发起API请求 /prod-api/wande/client/list
  → nginx /prod-api/ 代理 → 后端 127.0.0.1:6040/wande/client/list
  → Spring Boot Controller → MyBatis Plus → PostgreSQL
  → 返回JSON → 前端渲染表格
```

---

## 双数据库架构

后端使用 dynamic-datasource 多数据源切换，两个数据库职责不同：

### ruoyi_ai 数据库（框架库，@DS("master") 或不加注解）

| 关键表 | 用途 | 对测试的影响 |
|--------|------|-------------|
| `sys_menu` | 菜单定义（决定页面路由） | 菜单缺失 → 页面404 |
| `sys_role_menu` | 角色-菜单绑定 | 角色未绑定 → 菜单不显示 |
| `sys_user` | 用户表 | 登录/认证测试 |
| `sys_role` | 角色表 | 权限测试 |
| `sys_dict_type/data` | 字典表 | 下拉选项数据 |
| `chat_config` | AI对话配置 | AI功能测试 |
| `chat_model` | AI模型配置 | 模型列表测试 |

### wande_ai 数据库（业务库，所有万德Mapper必须加 @DS("wande")）

| 表名 | 对应模块 | 后端Controller路径 |
|------|---------|-------------------|
| `clients` | CRM客户管理 | `/wande/client/*` |
| `follow_ups` | 跟进记录 | `/wande/followup/*` |
| `wdpp_tender_data` | 招投标数据 | `/wande/tender/*` |
| `tender_evaluations` | 招标AI评估 | `/wande/tender/evaluation/*` |
| `crawler_configs/logs` | 爬虫配置 | `/wande/tender/crawler/*` |
| `wdpp_discovered_projects` | 项目挖掘 | `/wande/project/mine/*` |
| `project_reviews` | 项目复盘 | `/wande/project/review/*` |
| `project_feedback` | 项目反馈 | `/wande/project/feedback/*` |
| `business_opportunities` | 商机管理 | `/wande/opportunity/*` |
| `competitors` | 竞品分析 | `/wande/competitor/*` |
| `competitor_alerts` | 竞品告警 | `/wande/competitor-alert/*` |
| `competitor_bids` | 竞品投标 | `/wande/competitor-bid/*` |
| `wecom_conversation_logs` | 企微日志 | `/wande/wecom/*` |
| `work_logs` | 工作日志 | `/wande/worklog/*` |
| `task_queue/task_logs` | 任务调度 | `/wande/task/*` |
| `dev_progress` | 研发进度 | `/wande/dev/*` |
| `monitor_alerts` | 系统监控 | `/wande/monitor/*` |
| `cockpit_config` | Cockpit配置 | `/wande/cockpit/*` |
| `perplexity_credit_usage` | Credit统计 | `/wande/credit-usage/*` |

### 查询数据库（排障用）

```bash
# 连接 ruoyi_ai（查菜单/权限）
docker exec wande-postgres-dev psql -U wande -d ruoyi_ai

# 连接 wande_ai（查业务数据）
docker exec wande-postgres-dev psql -U wande -d wande_ai

# 查看指定菜单的完整路径
docker exec wande-postgres-dev psql -U wande -d ruoyi_ai -c \
  "SELECT p.path AS parent_path, c.path AS child_path, c.component,
          CONCAT('/', p.path, '/', c.path) AS full_url
   FROM sys_menu c JOIN sys_menu p ON c.parent_id = p.menu_id
   WHERE c.menu_name LIKE '%关键词%';"
```

---

## 万德业务菜单完整路由表（2026-03-24 从 sys_menu 导出）

**这是页面测试的唯一权威来源。** 前端 `router/routes/modules/wande.ts` 中的静态路由不决定最终URL。

| 一级目录 (menu_id) | 一级path | 二级菜单 | 二级path | 最终浏览器路径 | 前端组件(component) | 后端API前缀 |
|-------------------|----------|---------|----------|---------------|-------------------|------------|
| CRM客户管理 (20000) | wande-crm | 客户列表 | crm | `/wande-crm/crm` | wande/crm/index | `/wande/client/*` |
| CRM客户管理 (20000) | wande-crm | 跟进记录 | followup | `/wande-crm/followup` | wande/followup/index | `/wande/followup/*` |
| 项目矿场 (20100) | wande-project | 项目挖掘 | project | `/wande-project/project` | wande/project/index | `/wande/project/mine/*` |
| 项目矿场 (20100) | wande-project | 商机管理 | opportunity | `/wande-project/opportunity` | wande/opportunity/index | `/wande/opportunity/*` |
| 招投标中心 (20200) | wande-tender | 招投标管理 | tender | `/wande-tender/tender` | wande/tender/index | `/wande/tender/*` |
| 招投标中心 (20200) | wande-tender | AI评估 | evaluation | `/wande-tender/evaluation` | wande/tender/evaluation/index | `/wande/tender/evaluation/*` |
| 招投标中心 (20200) | wande-tender | 采集源 | crawler | `/wande-tender/crawler` | wande/tender/crawler/index | `/wande/tender/crawler/*` |
| 竞品情报 (20300) | wande-competitor | 竞品分析 | competitor | `/wande-competitor/competitor` | wande/competitor/index | `/wande/competitor/*` |
| 竞品情报 (20300) | wande-competitor | 竞品告警 | alert | `/wande-competitor/alert` | wande/competitor/alert/index | `/wande/competitor-alert/*` |
| 竞品情报 (20300) | wande-competitor | 投标记录 | bid | `/wande-competitor/bid` | wande/competitor/bid/index | `/wande/competitor-bid/*` |
| 运营工具 (20400) | wande-ops | 企微管理 | wecom | `/wande-ops/wecom` | wande/wecom/index | `/wande/wecom/*` |
| 运营工具 (20400) | wande-ops | 工作日志 | worklog | `/wande-ops/worklog` | wande/worklog/index | `/wande/worklog/*` |
| 运营工具 (20400) | wande-ops | 仪表盘 | dashboard | `/wande-ops/dashboard` | wande/dashboard/index | `/wande/dashboard/*` |
| 运营工具 (20400) | wande-ops | Credit消耗统计 | credit-usage | `/wande-ops/credit-usage` | wande/credit-usage/index | `/wande/credit-usage/*` |
| 研发管控 (20500) | wande-dev | 研发进度 | dev | `/wande-dev/dev` | wande/dev/index | `/wande/dev/*` |
| 研发管控 (20500) | wande-dev | 任务调度 | task | `/wande-dev/task` | wande/task/index | `/wande/task/*` |
| 研发管控 (20500) | wande-dev | 系统监控 | monitor | `/wande-dev/monitor` | wande/monitor/index | `/wande/monitor/*` |
| 研发管控 (20500) | wande-dev | Cockpit看板 | cockpit | `/wande-dev/cockpit` | wande/cockpit/index | `/wande/cockpit/*` |
| 研发管控 (20500) | wande-dev | G7e监控 | gpu-monitor | `/wande-dev/gpu-monitor` | wande/monitor/index | `/api/monitor/gpu/*` |
| 研发管控 (20500) | wande-dev | 驾驶舱 | cockpit-dashboard | `/wande-dev/cockpit-dashboard` | dashboard/cockpit/index | `/api/dashboard/*` |

---

## 前端项目技术细节（wande-ai-front）

### 技术栈
- **框架**: Vue 3 + TypeScript（Composition API, `<script setup>` 语法）
- **UI库**: Ant Design Vue
- **基座**: vue-vben-admin v2.0.0（monorepo: pnpm + turbo）
- **构建**: Vite
- **状态管理**: Pinia（token持久化到localStorage）
- **CSS**: Tailwind CSS
- **主应用目录**: `apps/web-antd/`

### 路由机制（测试必知）
- 使用 **后端菜单驱动模式**（`accessMode: backend`）
- 页面菜单由后端 `/system/menu/getRouters` API 动态返回
- 后端查询 `sys_menu` + `sys_role_menu` 表生成菜单树
- 最终路由 = `localMenuList`（本地固定路由，如Dashboard/Profile）+ 后端动态菜单
- **前端 `wande.ts` 中的静态路由定义不能决定页面是否可访问**

### 关键目录
```
apps/web-antd/src/
├── api/wande/              # 万德业务API封装
│   ├── tender.ts           # 招投标
│   ├── project.ts          # 项目挖掘
│   ├── opportunity.ts      # 商机
│   ├── crm.ts              # CRM
│   ├── competitor.ts       # 竞品
│   ├── wecom.ts            # 企微
│   └── dashboard.ts        # 仪表盘
├── views/wande/            # 万德页面组件
│   ├── tender/             # 招投标（含evaluation/crawler子页面）
│   ├── project/            # 项目挖掘
│   ├── opportunity/        # 商机
│   ├── crm/                # CRM
│   ├── competitor/         # 竞品（含alert/bid子页面）
│   ├── wecom/              # 企微
│   ├── dashboard/          # 仪表盘
│   ├── worklog/            # 工作日志
│   ├── cockpit/            # Cockpit看板
│   ├── task/               # 任务调度
│   ├── dev/                # 研发进度
│   ├── monitor/            # 系统监控
│   ├── credit-usage/       # Credit统计
│   └── followup/           # 跟进记录
└── router/routes/modules/
    └── wande.ts            # 万德路由模块（静态定义，最终由后端菜单覆盖）
```

### 页面渲染流程
```
1. 用户登录 → 获取token
2. 调用 /system/menu/getRouters → 后端返回菜单树(JSON)
3. 前端 backMenuToVbenMenu() 转换为Vue Router路由
4. 菜单中 component 字段(如 "wande/crm/index") → 映射到 views/wande/crm/index.vue
5. 用户点击菜单 → Vue Router导航到对应路径 → 渲染组件
```

### 常见页面问题根因（测试排障参考）

| 现象 | 可能原因 | 归属 | 排查命令 |
|------|---------|------|---------|
| 页面404"未找到页面" | sys_menu表缺少菜单记录 | **后端(需增量SQL)** | 查询sys_menu表 |
| 页面空白无报错 | Vue组件文件不存在或路径不匹配 | **前端** | 检查views/wande/目录 |
| 页面报"获取用户信息失败" | token无效或过期 | **测试代码**(登录流程) | 检查localStorage token |
| 表格无数据 | API返回500/后端@DS注解缺失 | **后端** | curl测试API |
| 控制台"未找到组件xxx" | component字段路径与views/不匹配 | **后端(sys_menu)或前端** | 对比component和views/ |

---

## 后端项目技术细节（wande-ai-backend）

### 技术栈
- **框架**: Spring Boot 3.4.4 + MyBatis Plus 3.5.11
- **认证**: Sa-Token 1.34.0（HTTP状态码始终200，业务码在body.code中）
- **多数据源**: dynamic-datasource 4.3.1（master=ruoyi_ai, wande=wande_ai）
- **Java**: 17
- **构建**: Maven（父POM版本管理，revision=1.0.0）
- **服务器**: Undertow（端口6040 dev / 6039 prod）

### 模块结构
```
ruoyi-admin/                     # 启动入口（端口6040/6039）
ruoyi-common/                    # 公共模块
  ├── ruoyi-common-satoken/      # Sa-Token认证
  └── ruoyi-common-core/         # BaseEntity, R<T>, PageQuery
ruoyi-system/                    # 系统管理（sys_*表）
ruoyi-modules/
  ├── ruoyi-system-api/          # 系统API（@DS不加=master）
  └── wande-ai/                  # ★万德业务模块（@DS("wande")必须加）
      └── src/main/java/org/ruoyi/wande/
          ├── controller/        # REST Controller
          │   ├── crm/           # CRM: ClientController, FollowUpController
          │   ├── tender/        # 招投标: TenderDataController, TenderEvaluationController, CrawlerController
          │   ├── project/       # 项目: ProjectMineController, ProjectReviewController, DevProgressController
          │   ├── competitor/    # 竞品: CompetitorController, CompetitorAlertController, CompetitorBidController
          │   ├── worklog/       # 工作日志: WorkLogController
          │   ├── wecom/         # 企微: WecomLogController
          │   ├── task/          # 任务: TaskQueueController
          │   ├── monitor/       # 监控: MonitorController, GpuMonitorController
          │   └── config/        # 配置: CockpitController
          ├── domain/            # Entity/Bo/Vo
          ├── mapper/            # MyBatis Mapper（必须@DS("wande")）
          └── service/           # Service层
```

### API响应格式（测试断言的依据）
```json
// 成功
{"code": 200, "msg": "操作成功", "data": {...}}
// 认证失败（HTTP status仍然是200！）
{"code": 401, "msg": "认证失败，无法访问系统资源"}
// 服务端错误
{"code": 500, "msg": "具体错误信息"}
// 分页列表
{"code": 200, "data": {"rows": [...], "total": 100}}
```

### 增量SQL管理
- 增量SQL目录: `script/sql/update/wande_ai/` 和 `script/sql/update/ruoyi_ai/`
- CI/CD自动执行: push到main后，由run-sql-updates.sh按日期顺序执行
- 菜单注册SQL: `script/sql/update/ruoyi_ai/*-menu.sql`
- 初始化脚本: `script/sql/ruoyi-ai-pg.sql`(框架表) + `script/sql/wande-ai-pg.sql`(业务表)

---

## Issue 提交规范（重大更新 — 必须遵守）

### 核心原则：前后端问题必须分离

**一个Issue只解决一个仓库的问题。** 混合前后端内容的Issue会导致编程CC无法执行。

### 仓库路由决策（精确版）

| 问题类型 | 目标仓库 | 判断依据 |
|---------|---------|---------|
| API接口返回500/异常 | `wande-ai-backend` | curl测试API，看后端日志 |
| 页面404（菜单未注册） | `wande-ai-backend` | 查sys_menu表，需增量SQL |
| 页面404（组件缺失） | `wande-ai-front` | views/wande/下无对应目录 |
| 页面空白/渲染异常 | `wande-ai-front` | 浏览器控制台报组件错误 |
| API权限/认证问题 | `wande-ai-backend` | body.code=401 |
| @DS注解缺失导致表找不到 | `wande-ai-backend` | 后端日志报Table not found |
| component路径与views不匹配 | 看情况 | 如果views有文件→改sys_menu(backend)；如果views没文件→创建组件(front) |
| 表格列/按钮等UI细节 | `wande-ai-front` | 纯前端渲染问题 |

### Issue关联规范（严格执行）

**关联Issue必须是真实存在且相关的Issue。** 具体规则：

1. **不要凭编号猜测关联** — 必须用 `gh issue view <N> --repo <repo>` 确认Issue标题和内容
2. **不要关联不相关的Issue** — 如果没有明确的上游功能Issue，关联字段写"无"
3. **跨仓库引用格式** — `WnadeyaowuOraganization/wande-ai-backend#<N>`
4. **关联到Project看板** — 创建Issue后执行: `gh project item-add 2 --owner WnadeyaowuOraganization --url <Issue URL>`

### Issue内容模板（给编程CC的精确指令）

**后端Issue模板（API问题/菜单缺失/数据问题）**：
```markdown
## 需求背景/问题描述
E2E测试发现：<具体现象>
- 测试环境：G7e dev (backend:6040, front:8083)
- 测试文件：<spec.ts路径>
- 失败用例：<test name>

## 错误详情
- 请求：<HTTP方法> <URL>
- 响应：<HTTP状态码> / body.code=<值>
- 后端日志关键信息：<从/apps/logs/backend-dev.log提取>

## 关联的Issue
<只写经过验证的真实关联，没有就写"无">

## 环境/配置/关联文件
- 数据库：<ruoyi_ai 或 wande_ai>
- Controller: <具体Controller文件路径>
- 相关表：<涉及的数据库表名>

## 处理步骤
| 步骤 | 操作内容 | 涉及文件/路径 | 验收标准 |
|------|---------|-------------|---------|
| 1 | <具体修复内容> | <具体文件路径> | <验证方法> |

## 测试验收标准
- [ ] `curl http://localhost:6040/<API路径>` 返回 code=200
- [ ] E2E测试通过：`npx playwright test --grep '<标签>'`

## 其他要求
按 CLAUDE.md 开发规范操作
```

**前端Issue模板（组件缺失/渲染异常/UI问题）**：
```markdown
## 需求背景/问题描述
E2E测试发现：<具体现象>
- 测试环境：G7e dev (backend:6040, front:8083)
- 测试文件：<spec.ts路径>
- 浏览器路径：<完整URL，如/wande-crm/crm>

## 错误详情
- 页面状态：<404/空白/报错>
- 控制台错误：<Vue warn/组件未找到/JS错误>
- 截图：<如有>

## 关联的Issue
<只写经过验证的真实关联，没有就写"无">

## 环境/配置/关联文件
- 前端组件路径：apps/web-antd/src/views/wande/<模块>/index.vue
- 路由定义：apps/web-antd/src/router/routes/modules/wande.ts
- API封装：apps/web-antd/src/api/wande/<模块>.ts
- sys_menu component字段值：<从数据库查询>

## 处理步骤
| 步骤 | 操作内容 | 涉及文件/路径 | 验收标准 |
|------|---------|-------------|---------|
| 1 | <具体修复内容> | <具体文件路径> | <验证方法> |

## 测试验收标准
- [ ] 页面正常加载，无控制台报错
- [ ] `pnpm build` 构建通过
- [ ] E2E测试通过：`npx playwright test --grep '<标签>'`

## 其他要求
按 CLAUDE.md 开发规范操作
```

### 问题排障流程（创建Issue前必须执行）

发现测试失败后，**先排障定位根因**，再创建Issue：

```
Step 1: 确认页面URL是否正确
  → 查询 sys_menu 表获取正确的 /<parent_path>/<child_path>
  → 错误URL → 修复测试代码，不创建Issue

Step 2: 测试API是否正常
  → curl http://localhost:6040/<API路径> -H "Authorization: Bearer <token>"
  → API返回500 → 创建 backend Issue
  → API正常 → 继续排查前端

Step 3: 检查前端组件是否存在
  → ls /home/ubuntu/projects/wande-ai-front/apps/web-antd/src/views/wande/<模块>/
  → 目录不存在 → 创建 front Issue
  → 目录存在 → 检查组件代码和路由配置

Step 4: 检查菜单是否注册
  → 查询 sys_menu 表
  → 菜单不存在 → 创建 backend Issue（需增量SQL）
  → 菜单存在但component不匹配 → 根据情况创建对应仓库Issue
```

---

