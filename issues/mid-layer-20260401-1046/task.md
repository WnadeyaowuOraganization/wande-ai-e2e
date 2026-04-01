# 中层测试工作记录 — 2026-04-01 10:46

## 扫描范围
- wande-ai-backend
- wande-ai-front
- wande-data-pipeline
- wande-gh-plugins

## 待测PR汇总

### wande-ai-backend
| PR | 标题 | 状态 | 处理结果 |
|----|------|------|---------|
| #836 | feat(project-mine): 项目分配作战信息卡通知 #360 | e2e:tested, UNKNOWN | 冲突/无法merge，保持阻塞 |
| #833 | fix(scheduler): GitHub同步修复+增强 — key转换+关闭同步+排序+日志 #599 | e2e:tested, UNKNOWN | 冲突/无法merge，保持阻塞 |
| #771 | feat(dashboard): G7e claude_monitor — Claude Code状态采集+task.md解析+Webhook回调 | e2e:tested, UNSTABLE→MERGEABLE | **已merge** |

### wande-ai-front
| PR | 标题 | 状态 | 处理结果 |
|----|------|------|---------|
| #312 | feat(cockpit): 像素办公室升级 — 动态工位+线路着色+状态详情 #233 | e2e:tested, UNKNOWN | 冲突/无法merge，保持阻塞 |
| #308 | feat(cockpit): 排程调度中心 — 完整队列管理+线路面板+日志流 #252 | e2e:tested, UNSTABLE→MERGEABLE | **已merge** |
| #307 | feat(cockpit): 开发者动态+部署管理页面 — 时间线+CI/CD+一键回滚 #31 | e2e:tested, UNKNOWN | 冲突/无法merge，保持阻塞 |

### wande-data-pipeline
| PR | 标题 | 状态 | 处理结果 |
|----|------|------|---------|
| #90 | feat(关键词学习): 效果追踪+无效词降权+Top20/Bottom20报告 v3.0 | e2e:tested, DIRTY | 冲突/无法merge，保持阻塞 |
| #88 | feat(domestic_projects): 采集引擎配置分离+JSON日志+README #16 | e2e:tested, DIRTY | 冲突/无法merge，保持阻塞 |
| #87 | add: 添加post-task.sh脚本 #38 | e2e:tested, DIRTY | 冲突/无法merge，保持阻塞 |

### wande-gh-plugins
无 open PR。

## 测试执行
- 所有open PR均已带有 `e2e:tested` 标签，无需重新执行Playwright测试。
- 无新增未测试PR。

## 结果统计
- **成功merge**: 2个 (backend#771, front#308)
- **DIRTY/UNKNOWN阻塞**: 7个 (backend#836, #833; front#312, #307; pipeline#90, #88, #87)
- **blocked跳过**: 0个
- **测试失败**: 0个
- **新建Issue**: 0个

## 变化说明
- 上一轮（09:56）时 #771 和 #308 均为DIRTY冲突状态；本轮扫描时其mergeability已恢复为MERGEABLE，成功merge到dev分支。
- 其余PR因与base=dev存在合并冲突（mergeStateStatus=DIRTY/UNKNOWN），`gh pr merge` 报错 "not mergeable: the merge commit cannot be cleanly created"，需编程CC或作者进行rebase/冲突修复。

## 下一步
- 阻塞的7个PR需要解决与dev分支的合并冲突后，才能进入下一轮merge尝试。
