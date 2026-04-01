# PR #912 测试任务

## 状态
- 创建时间: 2026-04-01 02:31
- 测试状态: test-failed
- 结果: 阻塞 - 代码未部署

## PR信息
- 仓库: wande-ai-backend
- PR: #912 - feat(cockpit): CC API调用质量监控 - 输入输出比异常检测+token浪费告警 #698
- 标签: status:test-failed

## 测试执行记录

### 测试轮次1 (2026-04-01 02:31)
- 状态: failed
- SQL执行: ✅ wdpp_cc_api_metrics表已存在
- API测试: ❌ 返回500 - No static resource
- 错误信息: 代码未部署到测试环境

## 阻塞原因
PR代码尚未部署到G7e dev环境，API接口返回404/500错误。
需要编程CC先将代码合并并部署后才能测试。

## 下一步
1. 等待代码部署
2. 重新执行中层测试
