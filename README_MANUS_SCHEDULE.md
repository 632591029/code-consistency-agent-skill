# ALPHA Signal Hub - Manus Schedule 版本

## 项目简介

ALPHA Signal Hub 是一个基于真实数据源的 AI 信号引擎，每天自动采集全网最新的技术信号，并通过邮件推送到你的邮箱。

## 核心功能

### 1. 真实数据采集

从以下数据源采集最新技术信号：

- **GitHub Trending**：AI 和 Web3 领域的热门开源项目
- **HackerNews**：技术社区的热门讨论
- **Reddit**：r/MachineLearning 和 r/ethereum 的热门帖子
- **CoinGecko**：加密货币市场趋势
- **Twitter**：技术 KOL 的最新推文（可选）

### 2. AI 深度分析

使用 Gemini 2.5 Flash 对采集到的真实信号进行深度分析：

- **价值分析**：为什么这个信号重要？
- **社区反应**：社区对此的情绪和讨论
- **风险评估**：潜在的技术风险和市场风险
- **趋势识别**：是否是某个领域的拐点信号

### 3. 邮件推送

每天 **9:00** 和 **20:00** 自动发送邮件简报到你的邮箱，包含：

- 15 条高质量技术信号
- 每条信号的详细分析
- 原始链接和数据来源

## 部署方式：Manus Schedule

本项目使用 **Manus Schedule** 实现定时任务，无需维护服务器：

### 优势

- ✅ **完全免费**：无需付费服务器
- ✅ **自动执行**：每天定时运行，无需人工干预
- ✅ **资源高效**：只在需要时运行，不占用持续资源
- ✅ **易于维护**：代码托管在 GitHub，随时可以更新

### 定时任务配置

已创建两个定时任务：

1. **ALPHA信号采集-早间**：每天 9:00 执行
2. **ALPHA信号采集-晚间**：每天 20:00 执行

## 项目结构

```
lifeStart/
├── services/
│   ├── realDataCollector.js      # 真实数据采集引擎
│   ├── twitterCollector.js       # Twitter 数据采集
│   ├── hybridSignalEngine.js     # 混合信号引擎（数据采集 + AI 分析）
│   └── emailService.js            # 邮件服务
├── daily-signal-task.js           # 定时任务执行脚本
├── .env.local                     # 环境变量配置
├── .env.example                   # 环境变量模板
└── README_MANUS_SCHEDULE.md       # 本文档
```

## 环境变量配置

在 `.env.local` 文件中配置以下环境变量：

```env
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Resend API Key（邮件服务）
RESEND_API_KEY=your_resend_api_key

# 接收邮件的邮箱
USER_EMAIL=your_email@gmail.com

# 扫描偏好
SCAN_PREFERENCES="AI Productivity, Web3 Infrastructure, GPU Markets, Open Source"
```

## 手动测试

如果想手动测试数据采集功能：

```bash
cd /home/ubuntu/lifeStart
node daily-signal-task.js
```

## 数据源说明

### GitHub API
- 免费，无需认证（有速率限制）
- 获取最近 7 天更新的热门项目

### HackerNews API
- 完全免费，无需认证
- 获取实时热门故事

### Reddit API
- 免费，无需认证（只读）
- 获取热门帖子和讨论

### CoinGecko API
- 免费额度：50 calls/min
- 获取加密货币趋势数据

### Twitter
- 使用 Nitter（Twitter 镜像）尝试采集
- 如果失败，不影响其他数据源

## 注意事项

1. **API 配额**：
   - Gemini API 有每日免费配额
   - 如果配额用完，任务会失败，第二天自动恢复

2. **邮件服务**：
   - Resend 免费额度：100 封/天
   - 每天发送 2 封邮件，完全够用

3. **数据质量**：
   - 所有数据都是真实的，有准确的链接和时间戳
   - AI 分析基于真实数据，不是凭空生成

## 未来优化方向

1. **增加更多数据源**：
   - Product Hunt
   - Dev.to
   - Medium 技术博客

2. **优化 Twitter 采集**：
   - 使用更稳定的 Twitter API
   - 或使用浏览器自动化

3. **数据持久化**：
   - 将历史信号保存到 GitHub
   - 或使用 Notion/Airtable API

4. **个性化推荐**：
   - 根据用户反馈调整信号权重
   - 学习用户偏好

## 技术栈

- **Node.js**：运行环境
- **Gemini 2.5 Flash**：AI 分析
- **Resend API**：邮件服务
- **Manus Schedule**：定时任务调度

## 联系方式

如有问题或建议，请在 GitHub 上提 Issue。

---

**享受每天的技术信号简报！** 📧✨
