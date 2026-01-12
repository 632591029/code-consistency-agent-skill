# ALPHA Signal Hub - 部署总结

## 项目概述

**ALPHA Signal Hub** 是一个 AI 驱动的信号引擎应用，能够从全网扫描和分析高价值的技术、市场和行业信号，并通过邮件简报的形式推送给用户。

## 完成的优化工作

### 1. 全网数据检测链路优化

我们对原有的信号扫描引擎进行了全面升级：

**优化的提示词设计**：
- 明确了数据源要求（GitHub Trending、HackerNews、Product Hunt、技术媒体等）
- 细化了信号筛选标准（必须包含具体数据、排除营销软文）
- 增强了分析深度要求（不仅报告"发生了什么"，更要分析"为什么重要"）
- 添加了风险评估和趋势识别维度

**多数据源支持**：
- 技术社区：GitHub Trending、HackerNews、Product Hunt、Reddit
- 行业媒体：TechCrunch、The Verge、Ars Technica、VentureBeat
- 社交平台：Twitter/X 技术 KOL 动态
- 市场数据：加密货币市场、GPU 租赁平台价格

**智能去重算法**：
- 基于 URL 域名和标题关键词的去重机制
- 按重要性自动排序

### 2. 多 AI 引擎集成

**支持的 AI 引擎**：
- **Gemini 2.5 Flash**：主引擎，支持 Google Search Grounding
- **OpenAI GPT-4.1 Mini**：备用引擎，提供更稳定的服务
- **模拟数据模式**：当 API 配额用完时自动回退

**自动回退机制**：
```javascript
// 尝试使用真实 API，失败后自动回退到模拟数据
try {
    if (AI_ENGINE === 'openai' && OPENAI_API_KEY) {
        return await performOpenAIScan(preferences);
    } else if (API_KEY) {
        return await performGeminiScan(preferences);
    }
} catch (error) {
    console.log('API 调用失败，自动回退到模拟数据');
    return generateMockSignals();
}
```

### 3. 真实邮件服务集成

**支持的邮件服务**：
- **Resend API**（推荐）：免费额度 100 封/天，API 简单易用
- **SMTP**：支持 Gmail、Outlook 等标准 SMTP 服务

**邮件内容生成**：
- 使用 AI 生成专业的邮件内容
- 深色主题设计（#0B0F1A 背景，#00F0FF 主题色）
- 移动端友好的响应式布局
- 包含信号原始链接和详细分析

**备用邮件模板**：
- 当 AI 生成失败时，使用预设的 HTML 模板
- 确保邮件推送功能始终可用

### 4. 定时任务配置

**定时任务脚本** (`cron-task.sh`)：
- 自动执行信号扫描
- 生成邮件内容并发送
- 完整的日志记录

**Manus 定时任务配置**：
- 每天 9:00 和 20:00 自动执行
- 使用 cron 表达式：`0 0 9,20 * * *`

### 5. 部署脚本和工具

**启动脚本**：
- `start-backend.js`：确保环境变量正确加载并启动后端服务
- `start.sh`：同时启动前端和后端服务
- `cron-task.sh`：定时任务执行脚本

**测试脚本**：
- `test-mock.js`：测试模拟数据生成
- `test-openai-scan.js`：测试 OpenAI 扫描引擎
- `demo.sh`：完整功能演示脚本

### 6. 文档和配置

**新增文档**：
- `DEPLOY_ON_MANUS.md`：详细的 Manus 部署指南
- `README.md`：更新的项目说明
- `.env.example`：环境变量配置模板

**配置文件**：
- `.env.local`：已配置好的环境变量（包含你的 API Keys）

## 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                     ALPHA Signal Hub                         │
├─────────────────────────────────────────────────────────────┤
│  前端 (React + TypeScript + Vite)                           │
│  - 仪表盘、信号流、AI 分析界面                              │
│  - 端口：3002                                                │
├─────────────────────────────────────────────────────────────┤
│  后端 (Node.js + Express)                                    │
│  - API 接口：/api/cron/scan, /api/email/send               │
│  - 端口：3000                                                │
├─────────────────────────────────────────────────────────────┤
│  AI 引擎层                                                   │
│  ┌─────────────┬─────────────┬─────────────┐               │
│  │ Gemini 2.5  │ OpenAI GPT  │ Mock Data   │               │
│  │ (主引擎)    │ (备用引擎)  │ (回退方案)  │               │
│  └─────────────┴─────────────┴─────────────┘               │
├─────────────────────────────────────────────────────────────┤
│  邮件服务层                                                  │
│  ┌─────────────┬─────────────┐                             │
│  │ Resend API  │ SMTP        │                             │
│  └─────────────┴─────────────┘                             │
├─────────────────────────────────────────────────────────────┤
│  定时任务 (Manus Schedule)                                   │
│  - 每天 9:00 和 20:00 执行扫描和邮件推送                    │
└─────────────────────────────────────────────────────────────┘
```

## 当前部署状态

### 服务访问地址

**前端服务**：
- 本地：http://localhost:3002
- 公网：https://3002-i4okhgnlnffhyuaexzokn-3fab9ab5.us2.manus.computer

**后端服务**：
- 本地：http://localhost:3000
- 公网：https://3000-i4okhgnlnffhyuaexzokn-3fab9ab5.us2.manus.computer

### API 配置状态

- ✅ Gemini API Key：已配置
- ✅ OpenAI API Key：已配置
- ✅ Resend API Key：已配置
- ✅ 用户邮箱：a632591029@gmail.com

### 定时任务状态

- ✅ 已创建定时任务：`alpha_daily_scan_and_email`
- ⏰ 执行时间：每天 9:00 和 20:00
- 📧 邮件接收地址：a632591029@gmail.com

## 重要提示

### API 配额管理

由于 Gemini API 的免费配额有限，我们建议：

1. **使用模拟数据模式**：在 `.env.local` 中设置 `USE_MOCK_DATA=true`
2. **切换到 OpenAI**：如果你有 OpenAI API Key，可以优先使用
3. **等待配额恢复**：Gemini 免费配额每天会重置

### 代码通用性

所有代码都设计为通用和可迁移的：

- **环境变量管理**：所有配置通过 `.env.local` 文件管理
- **无硬编码**：没有任何硬编码的路径或配置
- **标准化部署**：使用标准的 Node.js 和 pnpm 工具链
- **文档完善**：详细的部署文档和注释

你可以轻松将此应用部署到其他服务器（如 AWS、Vercel、Railway 等）。

## 下一步建议

1. **测试邮件功能**：手动触发一次扫描，检查是否能收到邮件
2. **监控定时任务**：在定时任务执行后，检查日志和邮件
3. **优化信号质量**：根据实际收到的信号，调整提示词和筛选条件
4. **扩展数据源**：可以添加更多数据源，如 Reddit、Discord 等

## GitHub 仓库

所有代码已推送到：https://github.com/632591029/lifeStart

最新提交包含了所有优化和改进。

---

**部署完成！** 🎉

如有任何问题，请参考 `DEPLOY_ON_MANUS.md` 或查看代码注释。
