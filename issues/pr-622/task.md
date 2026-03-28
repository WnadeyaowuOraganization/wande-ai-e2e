---
PR: wande-ai-backend#622 - fix(security): 修复 SysNoticeController 未授权访问漏洞
关联Issue: #44
测试开始: 2026-03-28 16:30:00 CST
---

# PR信息

## 变更内容
- 为 SysNoticeController 的 list() 方法添加 @SaCheckPermission("system:notice:query")
- 为 getNotice() 方法添加 @SaCheckPermission("system:notice:query")
- 修复公告列表和详情查询接口的未授权访问漏洞

## 影响模块
- system (系统通知)

## 变更文件
- ruoyi-modules/ruoyi-system/src/main/java/org/ruoyi/system/controller/system/SysNoticeController.java (+2行)

# 覆盖度评估

## 现有用例
- 无 (系统通知模块未覆盖)

## 新增用例需求
1. 验证未认证用户访问 /system/notice/list 返回 401 (body.code)
2. 验证未认证用户访问 /system/notice/{id} 返回 401 (body.code)
3. 验证认证用户可正常访问

## 覆盖判定
**C: 无覆盖** - 安全修复，需新增认证测试

# 测试执行

| 用例 | 结果 | 耗时 |
|------|------|------|
| notice list API requires authentication | PASS | 30ms |
| notice detail API requires authentication | PASS | 31ms |
| notice list API works with valid token | PASS | 27ms |

**测试通过**: 安全修复已生效，未认证访问返回 body.code=401

# 最终判定
- 结果: **PASS**
- 处理: PR已合并
