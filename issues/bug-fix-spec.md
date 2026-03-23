# 万德 AI 平台 API 错误修复规格说明书

**生成时间**: 2026-03-23
**测试环境**: G7e dev (API: 6040)
**测试工具**: Playwright + TypeScript
**测试范围**: 29 个模块，146 个接口
**错误接口数**: 69 个

---

## 修复优先级总览

| 优先级 | 错误类型 | 接口数量 | 修复复杂度 |
|--------|---------|---------|-----------|
| P0 | 数据库表缺失 | 11 | 低（执行 SQL） |
| P0 | 字段名冲突（date） | 3 | 中（改 SQL 映射） |
| P1 | Object 转换器缺失 | 6 | 中（加 Java 类） |
| P1 | BO 类缺少属性 | 2 | 低（加字段） |
| P1 | PostgreSQL 函数兼容 | 2 | 低（改 SQL） |
| P2 | 接口参数缺失 | 6 | 中（改 Controller） |

---

## P0 修复项

### 修复项 1: 创建数据库表 `wdpp_discovered_projects`

**影响接口**: 10 个
- `GET /wande/project/mine/list`
- `GET /wande/project/mine/stats`
- `GET /wande/project/mine/{id}`
- `GET /wande/project/mine/g7e/{g7eProjectId}`
- `POST /wande/project/mine`
- `PUT /wande/project/mine`
- `PUT /wande/project/mine/batch-status`
- `POST /wande/project/mine/export`
- `DELETE /wande/project/mine/{ids}`

**错误信息**:
```
ERROR: relation "wdpp_discovered_projects" does not exist
```

**修复动作**: 执行建表 DDL

**建议表结构**（根据 Entity 推断）:
```sql
CREATE TABLE wdpp_discovered_projects (
    id BIGSERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    project_type VARCHAR(100),
    budget DECIMAL(18,2),
    status VARCHAR(50) DEFAULT 'NEW',
    match_grade VARCHAR(50),
    source VARCHAR(100),
    publish_time TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_discovered_projects_company ON wdpp_discovered_projects(company_name);
CREATE INDEX idx_discovered_projects_status ON wdpp_discovered_projects(status);
```

**修复文件**: `script/sql/update/wande-ai/2026-03-23-create-discovered-projects.sql`

---

### 修复项 2: 创建数据库表 `aihuman_real_config`

**影响接口**: 1 个
- `GET /aihuman/aihumanRealConfig/list`

**错误信息**:
```
ERROR: relation "aihuman_real_config" does not exist
```

**修复动作**: 执行建表 DDL

**建议表结构**:
```sql
CREATE TABLE aihuman_real_config (
    id BIGSERIAL PRIMARY KEY,
    config_name VARCHAR(255) NOT NULL,
    config_value TEXT,
    is_active BOOLEAN DEFAULT true,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**修复文件**: `script/sql/update/wande-ai/2026-03-23-create-aihuman-real-config.sql`

---

### 修复项 3: 修复 `date` 列名冲突

**影响接口**: 3 个
- `GET /wande/dashboard/overview`
- `GET /wande/dashboard/quick-stats`
- `GET /wande/tender/list`

**错误信息**:
```
Error attempting to get column 'date' from result set. Bad value for type timestamp/date/time: 游乐设施
```

**问题分析**: 查询结果中 `date` 列被误判为日期类型，实际数据为字符串（如"游乐设施"）。这通常是因为 SQL 中使用了 `AS date` 别名，与数据库关键字冲突。

**修复动作**: 修改 SQL 查询，将 `AS date` 改为 `AS publish_time` 或其他非关键字名称

**涉及文件**:
- `ruoyi-modules-api/wande-ai-api/src/main/resources/mapper/DashboardMapper.xml`
- `ruoyi-modules-api/wande-ai-api/src/main/resources/mapper/TenderDataMapper.xml`

**修复示例**:
```xml
<!-- 修改前 -->
<select id="getOverview" resultType="DashboardOverview">
    SELECT
        id,
        project_name AS name,
        publish_time AS date,  <!-- 冲突 -->
        status
    FROM wdpp_tender_data
</select>

<!-- 修改后 -->
<select id="getOverview" resultType="DashboardOverview">
    SELECT
        id,
        project_name AS name,
        publish_time AS publish_time,  <!-- 使用非关键字 -->
        status
    FROM wdpp_tender_data
</select>
```

同时更新对应的 Java VO/DTO 类，将 `date` 字段改为 `publishTime`。

---

## P1 修复项

### 修复项 4: 注册 Object 转换器

**影响接口**: 6 个
- `POST /wande/competitor` - 创建竞品
- `PUT /wande/competitor` - 更新竞品
- `POST /wande/competitor-alert` - 创建告警
- `PUT /wande/competitor-alert` - 更新告警
- `POST /wande/competitor-bid` - 创建投标
- `PUT /wande/competitor-bid` - 更新投标

**错误信息**:
```
cannot find converter from CompetitorBo to Competitor
cannot find converter from CompetitorAlertBo to CompetitorAlert
cannot find converter from CompetitorBidBo to CompetitorBid
```

**修复动作**: 在 ObjectConverterFactory 中注册转换器

**涉及文件**:
- `ruoyi-common/ruoyi-common-core/src/main/java/org/ruoyi/common/factory/ObjectConverterFactory.java`
- `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/bo/CompetitorBo.java`
- `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/Competitor.java`
- （Alert 和 Bid 同理）

**修复示例**:
```java
// ObjectConverterFactory.java
public class ObjectConverterFactory {

    @PostConstruct
    public void init() {
        // 注册现有转换器
        registerConverter(new CompetitorBoToCompetitorConverter());
        registerConverter(new CompetitorAlertBoToCompetitorAlertConverter());
        registerConverter(new CompetitorBidBoToCompetitorBidConverter());
    }
}

// 新增转换器类
@Component
public class CompetitorBoToCompetitorConverter implements Converter<CompetitorBo, Competitor> {
    @Override
    public Competitor convert(CompetitorBo bo) {
        if (bo == null) return null;
        Competitor entity = new Competitor();
        BeanUtils.copyProperties(bo, entity);
        // 处理特殊字段
        entity.setCreatedAt(bo.getCreateTime());
        entity.setUpdatedAt(bo.getUpdateTime());
        return entity;
    }
}
```

---

### 修复项 5: 添加 BO 类缺失属性

**影响接口**: 2 个
- `GET /wande/worklog/list`
- `GET /wande/wecom/stat/list`

**错误信息**:
```
Error evaluating expression 'bo.startDate != null'. Cause: NoSuchPropertyException: WorkLogBo.startDate
Error evaluating expression 'bo.startDate != null'. Cause: NoSuchPropertyException: WecomDailyStatBo.startDate
```

**修复动作**: 在 BO 类中添加 `startDate` 属性

**涉及文件**:
- `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/bo/WorkLogBo.java`
- `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/domain/bo/WecomDailyStatBo.java`

**修复示例**:
```java
// WorkLogBo.java
@Data
public class WorkLogBo {
    private Long id;
    private String userName;
    private String content;

    // 新增字段
    private LocalDate startDate;
    private LocalDate endDate;

    // getter/setter
}

// WecomDailyStatBo.java
@Data
public class WecomDailyStatBo {
    private Long id;
    private Integer userCount;
    private Integer messageCount;

    // 新增字段
    private LocalDate startDate;
    private LocalDate endDate;

    // getter/setter
}
```

---

### 修复项 6: 修复 PostgreSQL 函数兼容性

**影响接口**: 2 个
- `GET /wande/competitor/{id}/profile`
- `GET /wande/competitor/compare`

**错误信息**:
```
ERROR: function group_concat does not exist
```

**修复动作**: 将 `group_concat` 改为 `string_agg`

**涉及文件**:
- `ruoyi-modules-api/wande-ai-api/src/main/resources/mapper/CompetitorMapper.xml`

**修复示例**:
```xml
<!-- 修改前 -->
<select id="getProfile" resultType="CompetitorProfile">
    SELECT
        id,
        group_concat(name SEPARATOR ',') as names
    FROM competitor
    GROUP BY category
</select>

<!-- 修改后 -->
<select id="getProfile" resultType="CompetitorProfile">
    SELECT
        id,
        string_agg(name, ',') as names
    FROM competitor
    GROUP BY category
</select>
```

---

## P2 修复项

### 修复项 7: 修复接口参数缺失

#### 7.1 项目挖掘批量状态更新

**接口**: `PUT /wande/project/mine/batch-status`

**错误信息**:
```
Required request parameter 'ids' for method parameter type List is not present
```

**修复动作**: 检查 Controller 方法签名，确保 `@RequestParam` 正确标注

**涉及文件**:
- `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/controller/ProjectMineController.java`

**修复示例**:
```java
// 修改前（可能缺少 @RequestParam 注解）
public R batchStatusUpdate(List<Long> ids, String status) { ... }

// 修改后
public R batchStatusUpdate(@RequestParam("ids") List<Long> ids,
                           @RequestParam("status") String status) { ... }
```

#### 7.2 项目匹配度评级

**接口**: `PUT /wande/project/mine/match-grade/{id}`

**错误信息**:
```
Required request parameter 'matchGrade' for method parameter type String is not present
```

**修复动作**: 确认参数应从 path 变量还是 query 参数传入

**涉及文件**:
- `ruoyi-modules-api/wande-ai-api/src/main/java/org/ruoyi/wande/controller/ProjectMineController.java`

**修复示例**:
```java
// 如果 matchGrade 应该从路径传入
public R updateMatchGrade(@PathVariable Long id, @PathVariable String matchGrade) { ... }

// 或者从请求体传入
public R updateMatchGrade(@PathVariable Long id, @RequestBody MatchGradeRequest request) { ... }
```

#### 7.3 竞品告警标记已读

**接口**: `PUT /wande/competitor-alert/{id}/read`

**错误信息**:
```
Required request parameter 'isRead' is not present
```

**修复动作**: 同上，确认参数来源

#### 7.4 竞品告警批量标记已读

**接口**: `PUT /wande/competitor-alert/batch-read`

**错误信息**:
```
Required request parameter 'ids' for method parameter type List is not present
```

**修复动作**: 同上，确保 `@RequestParam` 正确标注

---

## 已通过接口列表（无需修复）

以下接口测试通过（HTTP 200 + code 200），可作为参考：

### 认证与系统（20 个）
```
/auth/login, /auth/logout, /auth/code
/system/user/getInfo, /system/user/list
/system/menu/getRouters, /system/menu/list
/system/role/list, /system/notice/list
/system/model/list, /system/message/list
/system/session/list, /system/dict/type/list
/system/dict/data/list, /system/config/list
/system/post/list, /system/dept/list
/system/promptTemplate/list, /system/tenant/package/list
/system/payOrder/list
```

### 监控与 GPU（8 个）
```
/api/monitor/gpu/realtime, /api/monitor/gpu/summary
/api/monitor/gpu/alerts, /api/monitor/gpu/health
/monitor/cache, /monitor/online/list
/monitor/logininfor/list, /monitor/operlog/list
```

### 招投标与任务（4 个）
```
/wande/tender/stats
/wande/task/list, /wande/task/stats, /wande/task/engine-status
```

### CRM 与商机（5 个）
```
/wande/credit-usage/list, /wande/credit-usage/summary
/wande/client/list, /wande/opportunity/list, /wande/followup/list
```

### 竞品分析（6 个）
```
/wande/competitor/list
/wande/competitor-alert/list, /wande/competitor-bid/list
DELETE /wande/competitor/{ids}
DELETE /wande/competitor-alert/{ids}, DELETE /wande/competitor-bid/{ids}
```

### 监控告警（4 个）
```
PUT /wande/monitor/alert/{id}/acknowledge
GET /wande/monitor/alert/unacknowledged-count
GET /wande/monitor/alert/list, /wande/monitor/alert/{id}
```

### 资源与知识（4 个）
```
/knowledge/list, /knowledgeRole/list
/knowledgeRoleGroup/list, /resource/oss/list
/resource/oss/config/list
```

---

## 验收测试命令

修复完成后，运行以下命令验证：

```bash
# 设置环境变量
export BASE_URL_API=http://localhost:6040

# 运行完整 API 测试
npx playwright test tests/api/comprehensive-api-test.spec.ts

# 运行项目挖掘 + 竞品测试
npx playwright test tests/api/mine-competitor-api.spec.ts

# 运行招投标测试
npx playwright test tests/api/tender.spec.ts
```

---

## 附录：测试脚本位置

- 综合 API 测试：`tests/api/comprehensive-api-test.spec.ts`
- 项目挖掘 + 竞品测试：`tests/api/mine-competitor-api.spec.ts`
- 招投标测试：`tests/api/tender.spec.ts`
- 详细错误报告：`issues/api-errors.md`
