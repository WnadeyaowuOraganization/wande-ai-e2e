# 中层测试记录 - 2026-03-31 21:47

## 测试范围
扫描4个仓库的open PR（base=dev），排除已标记e2e:tested和status:test-failed的PR。

## 待测PR列表

### wande-ai-backend (5个)
| PR | 标题 | Issue | 状态 |
|----|------|-------|------|
| #909 | 审计日志API | #886 | 阻塞 |
| #908 | DORA四指标API | #885 | 阻塞 |
| #907 | Token Pool管理 | #854 | 阻塞 |
| #906 | CC API质量监控 | #698 | 阻塞 |
| #905 | 工具管理API | #567 | 阻塞 |

### wande-ai-front (4个)
| PR | 标题 | Issue | 状态 |
|----|------|-------|------|
| #415 | 深色主题 | #394 | 阻塞 |
| #414 | 键盘快捷键 | #392 | 阻塞 |
| #413 | 首页卡片聚合 | #385 | 阻塞 |
| #409 | DORA看板页面 | #386 | 阻塞 |

## 阻塞原因

后端API未部署到dev环境，所有新API返回500错误：

```
GET /audit-log/list      → 500 No static resource audit-log/list
GET /dora/summary        → 500 No static resource dora/summary
GET /api/admin/tool/list → 500 No static resource api/admin/tool/list
```

这些PR的代码仍在feature分支，需要合并到dev并部署后才能测试。

## 测试执行摘要

- 运行测试：4个spec文件
- 通过：9个（主要是认证相关）
- 失败：20个（新API 404/500）
- 阻塞：9个PR

## 建议操作

1. 编程CC需要先合并这些PR到dev分支
2. 部署dev环境（执行SQL脚本）
3. 重新执行中层测试

## 环境状态

- 后端API: http://localhost:6040/ ✅ 运行中
- 前端页面: http://localhost:8083/ ✅ 运行中
- PostgreSQL: localhost:5433 ✅ 运行中
- Redis: localhost:6380 ✅ 运行中
