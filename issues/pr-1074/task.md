# 中层E2E测试工作记录 - PR #1074

## 执行时间
2026-04-02 13:34:00

## PR信息
- **PR**: #1074 - fix(tender): 修复 has_embedding 类型不匹配导致后端500错误
- **关联Issue**: #858
- **作者**: wandeyaowu
- **分支**: feature-issue-858

## 测试结果

### 环境状态
❌ **API未部署**

当前后端部署分支: `feature-issue-171`
PR #1074 分支: `feature-issue-858` (未部署)

### 错误确认
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:6040/wande/tender/list?pageNum=1&pageSize=10"
```

返回:
```json
{
  "code": 500,
  "msg": "Error attempting to get column 'has_embedding' from result set.  Cause: org.postgresql.util.PSQLException: Bad value for type int : t\n; Bad value for type int : t"
}
```

### 测试结论
此PR修复的是后端500错误问题，但由于API尚未部署到测试环境，无法执行E2E验证。

### 阻塞原因
- 后端dev环境当前运行的是 `feature-issue-171` 分支
- PR #1074 的修复代码在 `feature-issue-858` 分支
- 需要部署后才能进行E2E测试

### 建议操作
1. 等待后端dev环境部署 `feature-issue-858` 分支
2. 重新执行中层E2E测试
3. 验证 tender/list API 不再返回500错误

### 关联Issue状态
- Issue #858 保持 `status:in-progress` 标签
- 添加注释说明API未部署阻塞
