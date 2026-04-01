# 中层测试记录 - 2026-04-01 18:15

## 扫描结果

### wande-ai-backend
| PR | 标题 | 标签 | 状态 |
|----|------|------|------|
| #982 | fix(scheduler): GitHub同步修复+增强 #599 | status:test-passed | OPEN |
| #981 | feat(notification): 通知中心查询API #871 | size/XL | OPEN - 待测 |
| #978 | feat(notification): 事件采集Service #869 | size/XL | OPEN - 待测 |
| #977 | feat(notification): SSE实时推送服务 #870 | size/L | OPEN - 待测 |
| #961 | fix(dealer): 修复 E2E 测试失败 #840 | status:test-passed | OPEN |
| #958 | fix(alias-conflict): 删除重复类解决 MyBatis alias 冲突 #955 | size/XL, status:test-passed | OPEN |

### wande-ai-front
| PR | 标题 | 标签 | 状态 |
|----|------|------|------|
| #456 | refactor(front): 10个列表页按UI-GUIDE.md规范改造 #408 | status:test-passed | OPEN |
| #437 | feat: 外部工具健康度卡片 #213 | status:test-passed | OPEN |

### wande-data-pipeline
| PR | 标题 | 标签 | 状态 |
|----|------|------|------|
| #90 | feat(关键词学习): 效果追踪+无效词降权+Top20/Bottom20报告 v3.0 | e2e:tested | OPEN |
| #88 | feat(domestic_projects): 采集引擎配置分离+JSON日志+README #16 | e2e:tested | OPEN |

### wande-gh-plugins
无待测PR

## 测试结果汇总

### PR #981 (backend#871) - 通知中心查询API
**状态**: ⚠️ 阻塞 - API端点未部署

**测试执行**: 2026-04-01 18:20

**失败原因**:
- API端点 `/wande/notification/list` 返回 500
- 错误信息: `No static resource wande/notification/list`
- 原因分析: PR尚未合并，测试环境(dev分支)没有部署此API

**测试用例**: 10个
- 通过: 2个 (处理无效ID、权限检查边界情况)
- 失败: 8个 (核心API端点不存在)
- 跳过: 1个

**结论**: 此PR需要先合并到dev分支并部署后才能进行E2E测试。

---

### 已标记test-passed但无法合并的PR

所有以下PR都已通过测试，但存在合并冲突需要解决：

| 仓库 | PR | 标题 | 状态 |
|------|----|------|------|
| backend | #982 | GitHub同步修复+增强 #599 | CONFLICTING |
| backend | #961 | TIMESTAMPTZ类型兼容修复 #840 | CONFLICTING |
| backend | #958 | MyBatis alias冲突修复 #955 | CONFLICTING |
| front | #456 | 10个列表页UI改造 #408 | UNKNOWN (可能冲突) |
| front | #437 | 外部工具健康度卡片 #213 | UNKNOWN (可能冲突) |

**建议**: 需要编程CC解决这些PR的合并冲突后才能合并。

---

## 关键发现

### 1. 可立即合并的PR（已标记test-passed）
- **backend#982**: GitHub同步修复 - 已通过测试，待合并
- **backend#961**: TIMESTAMPTZ类型兼容修复 - 已通过测试，待合并
- **backend#958**: MyBatis alias冲突修复 - 已通过测试，待合并
- **front#456**: 10个列表页UI改造 - 已通过测试，待合并
- **front#437**: 外部工具健康度卡片 - 已通过测试，待合并

### 2. 设计冲突 - 需要协调
**PR #978 和 #977 存在类冲突：**

两个PR都创建了相同的类：
- `org.ruoyi.wande.event.NotificationCreatedEvent`

| PR | 文件路径 | 说明 |
|----|----------|------|
| #978 | `ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/event/NotificationCreatedEvent.java` | 事件采集Service使用 |
| #977 | `ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/event/NotificationCreatedEvent.java` | SSE推送服务使用 |

**影响：** 如果先合并其中一个，另一个将产生冲突。

### 3. 依赖关系分析
```
#977 (SSE推送) 依赖 NotificationCreatedEvent 来监听事件
#978 (事件采集) 依赖 NotificationCreatedEvent 来发布事件
#981 (查询API) 独立，只依赖数据库表
```

**建议处理顺序：**
1. 先协调 #978 和 #977，统一 NotificationCreatedEvent 定义
2. 然后测试 #981（查询API，独立无依赖）
3. 最后合并所有已通过测试的PR

## 下一步行动

1. [ ] 协调 #978 和 #977 的 NotificationCreatedEvent 冲突
2. [ ] 测试 #981（通知查询API）
3. [ ] 合并已标记test-passed的PR

---
测试时间: 2026-04-01 18:15
