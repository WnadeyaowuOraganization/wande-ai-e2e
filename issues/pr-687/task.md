---
PR: wande-ai-backend#687 删除重复的 HrContract 模块解决 Bean 冲突
关联Issue: #683
测试开始: 2026-03-29 01:30:00 CST
---

# PR信息
- **标题**: fix(#683): 删除重复的 HrContract 模块解决 Bean 冲突
- **变更类型**: Bug修复
- **变更文件**:
  - 删除 `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/HrContract.java`
  - 删除 `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/bo/HrContractBo.java`
  - 删除 `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/vo/HrContractVo.java`
  - 删除 `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/mapper/HrContractMapper.java`
  - 删除 `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/service/IHrContractService.java`
  - 删除 `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/service/impl/HrContractServiceImpl.java`
- **影响模块**: HR合同管理（删除重复Bean定义）

# 覆盖度评估
- **变更性质**: 删除重复代码，解决Bean名称冲突
- **现有用例**: 需查找HR模块相关测试
- **测试策略**: 验证后端服务正常启动，HR相关API正常工作

# 测试执行
