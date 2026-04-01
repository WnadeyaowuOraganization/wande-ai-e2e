# PR #832 测试任务 — 修复任意文件上传漏洞

## PR信息
- **Repository**: wande-ai-backend
- **PR**: #832
- **Title**: fix(security): 修复任意文件上传漏洞，防止路径遍历攻击 #9
- **Branch**: feature-issue-9
- **Base**: dev
- **Author**: david-hwp

## 变更摘要
- 修复 `FileUtils.java` 路径遍历漏洞
- 修复 `SseServiceImpl.java` 文件上传处理
- 新增单元测试 `FileUploadSecurityTest.java`

## 测试执行记录

### 2026-04-01 09:22
**环境**: G7e dev (http://localhost:6040)

**执行测试**:
```bash
npx playwright test tests/backend/api/file-upload-security.spec.ts
```

**结果**: 1 passed, 7 failed

| 测试用例 | 结果 | 备注 |
|---------|------|------|
| SSE upload rejects path traversal | ❌ | 返回500 `No static resource` |
| SSE upload endpoint requires authentication | ❌ | 返回500而非401 |
| upload with null bytes in filename | ❌ | 返回500 |
| upload with extremely long filename | ✅ | 通过 |

## 结论

**状态**: ⚠️ 环境阻塞

**原因**: Dev环境被PR #850的变更破坏，所有 `/wande/*` 和 `/chat/*` 路径返回500 `No static resource`。这不是 #832 本身的问题，而是环境-wide故障。

**建议**:
1. 等待 #850 修复并重新部署dev环境
2. 环境恢复后重新测试 #832

## 下一步行动
- [ ] 等待 #850 修复部署
- [ ] 重新执行本测试
- [ ] 通过后approve并merge
