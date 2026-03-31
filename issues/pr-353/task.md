# PR #353 测试任务

## PR信息
- **仓库**: wande-ai-front
- **PR**: #353
- **标题**: feat(dashboard): 开发效率看板页面 — 核心指标卡片+趋势图+周月切换+明细表 #122
- **关联Issue**: #122
- **状态**: OPEN

## 变更范围
- 新增开发效率看板页面
- 4个核心指标卡片
- 周/月切换器 + 趋势图
- Issue处理明细表格

## 依赖的后端API
- GET `/wande/dashboard/dev-efficiency/stats`

## 阻塞问题
**后端API返回500错误**

验证命令:
```bash
curl -s http://localhost:6040/wande/dashboard/dev-efficiency/stats
# 返回: {"code":500,"msg":"No static resource wande/dashboard/dev-efficiency/stats."}
```

需要后端API部署后才能测试。

## 建议操作
1. 确认后端对应PR
2. 后端API部署后重新测试
