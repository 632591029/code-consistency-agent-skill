# ALPHA Signal Hub v4.1

这是一个经过优化的 AI 信号引擎应用，现在已经准备好在 Manus 上部署。我们对原项目进行了多项改进，包括：

- **多 AI 引擎支持**：集成了 Gemini 和 OpenAI，并增加了在 API 失败时自动回退到模拟数据的功能。
- **增强的提示词**：优化了 AI 提示词，以获取更精准、更深入的信号分析。
- **真实邮件服务**：集成了 Resend API，实现了真实的邮件简报推送功能。
- **详细的部署文档**：创建了 `DEPLOY_ON_MANUS.md`，指导如何在 Manus 环境中部署和运行。
- **健壮的错误处理**：增加了 API 调用失败时的自动回退机制，确保应用始终可用。

## 快速开始

详细的部署步骤请参考 [DEPLOY_ON_MANUS.md](./DEPLOY_ON_MANUS.md)。

### 1. 配置环境

复制 `.env.example` 到 `.env.local` 并填入你的 API Keys。

```bash
cp .env.example .env.local
```

### 2. 安装依赖

```bash
pnpm install
pnpm add nodemailer openai
```

### 3. 启动服务

```bash
# 启动后端
node start-backend.js &

# 启动前端
pnpm run dev &
```

## 核心功能

- **全网信号扫描**：通过 AI 引擎实时扫描全网，获取最新的技术和市场信号。
- **AI 深度分析**：对每个信号进行深度分析，提供价值解读和风险评估。
- **定时邮件简报**：每天定时将最新的信号简报推送到你的邮箱。
- **可交互前端**：提供仪表盘、信号流、AI 分析等多种交互界面。

## 技术栈

- **前端**: React, TypeScript, Vite, TailwindCSS
- **后端**: Node.js, Express
- **AI**: Google Gemini, OpenAI GPT-4
- **邮件**: Resend API

感谢你的项目！我们已经完成了所有的优化和部署准备工作。
