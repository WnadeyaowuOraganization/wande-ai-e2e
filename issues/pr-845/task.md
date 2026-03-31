# PR #845 测试任务

## PR信息
- **仓库**: wande-ai-backend
- **PR**: #845
- **标题**: feat(scheduler): API SQLite迁移+调度器去重+僵尸检测 #602
- **关联Issue**: #602

## 变更范围
- API server.py 从 CSV 迁移到 SQLite
- cc_scheduler.py 删除重复调度代码，统一调用 `_schedule_ext_line()`
- 新增 `detect_zombies()` 僵尸检测函数
- `check_zombie_lines()` 重写
- 新增 `/api/schedule/export/csv` 备份接口

## 测试策略
1. 验证SQLite数据库迁移成功
2. 测试调度器API端点
3. 验证僵尸检测功能
4. 测试CSV导出接口

## 测试结果
- [ ] 测试执行中
- [ ] 结果记录

## 阻塞问题
**PR状态: DIRTY (有合并冲突)**

该PR无法合并，需要先解决冲突。

## 建议操作
1. 通知编程CC解决合并冲突
2. 冲突解决后重新执行中层测试

## 备注
该PR在wande-ai-backend仓库，但只包含task.md文件变更。实际代码变更可能在其他PR中。
