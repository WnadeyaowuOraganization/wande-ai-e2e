# 中层测试工作记录 — 2026-04-01 09:56

## 扫描范围
- wande-ai-backend
- wande-ai-front
- wande-data-pipeline
- wande-gh-plugins

## 待测PR汇总

### wande-ai-backend
| PR | 标题 | 状态 | 处理结果 |
|----|------|------|---------|
| #836 | feat(project-mine): 项目分配作战信息卡通知 #360 | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |
| #833 | fix(scheduler): GitHub同步修复+增强 #599 | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |
| #783 | feat(执行管理): 扩展角色权限 #38 | APPROVED, e2e:tested, UNSTABLE | **已merge** |
| #778 | feat(dashboard): 用户反馈管理API | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |
| #774 | feat(dashboard-cron): 定时任务操作API | APPROVED, e2e:tested, UNSTABLE | **已merge** |
| #771 | feat(dashboard): G7e claude_monitor | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |

### wande-ai-front
| PR | 标题 | 状态 | 处理结果 |
|----|------|------|---------|
| #378 | feat(dev): 新增前端生成代码模板UI #30 | APPROVED, e2e:tested, UNSTABLE | **已merge** |
| #348 | feat(mine): 业务员待办中心 #163 | APPROVED, e2e:tested, UNSTABLE | **已merge** |
| #347 | feat(dashboard): 告警中心+检测日志页面 #212 | APPROVED, e2e:tested, UNSTABLE | **已merge** |
| #344 | feat(project): 矿场运营仪表盘 #143 | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |
| #340 | feat(super-admin): 定时任务管理看板页面 #338 | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |
| #335 | feat(dashboard): 外部工具健康度卡片 #213 | status:blocked | **跳过**（阻塞标签） |
| #312 | feat(cockpit): 像素办公室升级 #233 | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |
| #308 | feat(cockpit): 排程调度中心 #252 | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |
| #307 | feat(cockpit): 开发者动态+部署管理页面 #31 | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |

### wande-data-pipeline
| PR | 标题 | 状态 | 处理结果 |
|----|------|------|---------|
| #90 | feat(关键词学习): 效果追踪+无效词降权 | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |
| #88 | feat(domestic_projects): 采集引擎配置分离 | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |
| #87 | add: 添加post-task.sh脚本 #38 | APPROVED, e2e:tested, DIRTY | 冲突，无法merge |

### wande-gh-plugins
无open PR。

## 本轮测试执行
- 所有非阻塞PR均已有 `e2e:tested` 标签，表明已通过前期E2E测试。
- 无新增未测试PR，无需补充运行Playwright测试。

## 结果统计
- **成功merge**: 5个 (#783, #774, #378, #348, #347)
- **DIRTY阻塞**: 12个
- **blocked跳过**: 1个 (#335)
- **测试失败**: 0个
- **新建Issue**: 0个

## 下一步
- DIRTY阻塞的PR需要编程CC进行rebase/冲突修复。
- #335 等待外部依赖解除后重新进入测试队列。
