---
PR: wande-ai-backend#400
标题：fix: 修复 GPU Monitor realtime API 返回数据字段名不匹配
关联 Issue: #394
测试开始：2026-03-23 21:30:00
---

# PR 信息
- **变更类型**: Bug fix
- **关联 Issue**: #394
- **变更文件**:
  - `ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/domain/gpu/vo/GpuInfoVo.java`
  - `ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/domain/gpu/vo/GpuRealtimeVo.java`
  - `ruoyi-modules/wande-ai/src/main/java/org/ruoyi/wande/service/gpu/impl/GpuMonitorServiceImpl.java`

- **变更内容**: 修复 GPU Monitor API 字段 JSON 序列化名称
  - `index` → `gpuIndex`
  - `memUsedMb` → `memoryUsed`
  - `memTotalMb` → `memoryTotal`
  - `gpuUtilPct` → `utilRate`
  - `tempC` → `temperature`
  - `powerW` → `powerWatts`
  - `gpus` → `gpuList`

# 覆盖度评估
- **现有用例**: 5 个 API 测试 (tests/api/gpu-monitor.spec.ts)
- **测试标签**: @gpu-monitor @issue:backend#255
- **覆盖判定**: D - Bug 修复回归测试

# 测试执行
| 用例 | 结果 | 耗时 |
|------|------|------|
| should get GPU realtime data | PASS | 22ms |
| should get GPU summary data | PASS | 10ms |
| should get GPU alerts | PASS | 15ms |
| should get GPU health status | PASS | 17ms |
| should reject unauthenticated requests | PASS | 9ms |

**测试结果**: 5/5 通过

# 最终判定
- **结果**: PASS
- **处理**: PR 已批准合并
- **测试时间**: 2026-03-23 21:35:00 CST
