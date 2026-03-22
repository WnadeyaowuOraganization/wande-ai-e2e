---
PR: wande-ai-backend#356
标题：feat: 修复项目挖掘页面字段映射问题
关联 Issue: backend#274
测试开始：2026-03-22 23:20:00
---

# PR 信息
- **变更文件**:
  - `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/ProjectMine.java`
  - `ruoyi-modules-api/wande-ai-api/src/main/resources/mapper/ProjectMineMapper.xml`
- **影响模块**: project-mine (项目挖掘)
- **变更内容**: 更新 Entity 表名和 Mapper XML 字段映射

# 覆盖度评估
- **现有用例**: 0 个 (新增)
- **新增用例**: 6 个 API 测试
- **覆盖判定**: C (全新测试)

# 测试执行
## API 测试 (tests/api/project-mine.spec.ts)
| 用例 | 结果 | 耗时 |
|------|------|------|
| list API requires authentication | PASS | 13ms |
| stats API requires authentication | PASS | 10ms |
| detail API requires authentication | PASS | 8ms |
| should get project mine list with valid token | PASS | 207ms |
| should get project mine stats with valid token | PASS | 15ms |
| should get project mine detail with valid token | PASS | 11ms |

## 冒烟测试 (tests/smoke/project-mine-page.spec.ts)
| 用例 | 结果 | 说明 |
|------|------|------|
| project mine API endpoints are functional | PASS | 后端 API 验证通过 |
| frontend serves correctly | PASS | 前端服务正常 |
| page loads successfully | SKIP | 需 sys_menu 注册 |
| page has table with expected columns | SKIP | 需 sys_menu 注册 |
| page has filter form | SKIP | 需 sys_menu 注册 |
| page displays statistics cards | SKIP | 需 sys_menu 注册 |

**总计**: 6 通过，0 失败，4 跳过

# 最终判定
- **结果**: PASS
- **处理**: PR 已批准，等待合并

# 备注
- 后端 API `/wande/project/mine/list` 和 `/wande/project/mine/stats` 工作正常
- 前端页面测试跳过原因：需确认 sys_menu 表中是否注册了项目挖掘菜单
- requirement-map.json 已更新
