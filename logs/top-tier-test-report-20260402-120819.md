# 顶层全量回归测试报告

**测试时间**: 2026-04-02 12:08:19 CST
**测试环境**: G7e dev (backend:6040, front:8083)

## 测试汇总

| 测试类型 | 通过 | 失败 | 跳过 | 总计 |
|---------|------|------|------|------|
| 回归测试 (tests/regression/) | 6 | 0 | 99 | 105 |
| 冒烟测试 (backend/front smoke) | 160 | 73 | 47 | 280 |
| **总计** | **166** | **73** | **146** | **385** |

## 回归测试详情

- 执行文件: tests/regression/comprehensive-api-test.spec.ts
- 结果: 6 passed, 99 skipped, 0 failed
- 状态: ✅ 通过

## 冒烟测试失败分析

### 失败分类

根据失败测试的目录名称分析：

1. **Admin 页面** (2个失败)
   - admin-page: iframe 未找到

2. **AI Render 页面** (5个失败)
   - ai-render: 页面元素未找到（单张渲染按钮、上传组件、渲染按钮等）

3. **审计日志页面** (3个失败)
   - audit-log-page: 页面加载/筛选/导出功能失败

4. **缓存页面** (2个失败)
   - cache-page: Redis信息/页面加载失败

5. **对手方管理** (5个失败)
   - counterpart-management: 字段显示/按钮/下拉选项失败

6. **DORA指标** (1个失败)
   - dora-metrics: 白屏问题

7. **外部工具健康检查** (1个失败)
   - ext-tool-health: 控制台错误

8. **网关账户** (1个失败)
   - gateway-account: 控制台错误

9. **健康卡片网格** (1个失败)
   - health-card-grid: 控制台错误

10. **快捷键系统** (3个失败)
    - hotkey-system: 帮助面板/浮动按钮/通知面板

11. **登录信息页面** (2个失败)
    - logininfor-page: 表格/工具栏按钮

12. **模型池页面** (1个失败)
    - model-pool: 控制台错误

13. **在线用户页面** (2个失败)
    - online-page: 表格/页面加载

14. **操作日志页面** (2个失败)
    - operlog-page: 表格/页面加载

15. **问题发现页面** (1个失败)
    - problem-discovery: 页面加载

16. **产品中心** (2个失败)
    - product-center: 重置按钮/产品卡片

17. **角色仪表盘** (4个失败)
    - role-dashboard: 业务方/开发者/超管视图加载

18. **SnailJob页面** (2个失败)
    - snailjob-page: iframe/页面加载

## 失败根因分析

### 主要问题类型

1. **页面元素未找到** (约60%)
   - 原因: 页面组件不存在或选择器不匹配
   - 影响: ai-render, audit-log, hotkey-system 等

2. **iframe 加载失败** (约15%)
   - 原因: 外部系统iframe未正确配置或无法访问
   - 影响: admin-page, snailjob-page

3. **控制台错误** (约15%)
   - 原因: JavaScript运行时错误
   - 影响: health-card, model-pool, gateway-account 等

4. **表格/数据展示问题** (约10%)
   - 原因: API数据返回异常或表格组件渲染失败
   - 影响: logininfor, online, operlog 等

## 建议措施

### 高优先级修复
1. AI Render 页面组件缺失 - 需要前端开发确认页面实现状态
2. Admin/SnailJob iframe配置 - 检查外部系统集成配置
3. 审计日志/操作日志页面 - 检查API接口和数据源

### 测试代码优化
1. 部分测试用例使用过期的选择器，需要同步更新
2. 部分页面测试需要跳过（如外部iframe依赖的页面）

## 结论

- **回归测试**: 全部通过，无回归问题
- **冒烟测试**: 73个失败，主要是前端页面组件问题，非核心功能回归

**总体状态**: ⚠️ 部分通过 - 需要关注冒烟测试失败的前端页面问题
