
# 在 Manus 上部署 ALPHA Signal Hub

本文档将指导你如何在 Manus 的免费环境中部署和运行 ALPHA Signal Hub 应用。由于免费环境的限制（如 API 配额、服务休眠等），我们已经对应用进行了优化，增加了自动回退和模拟数据功能，以确保应用始终可用。

## 1. 准备工作

在开始之前，请确保你拥有以下 API Keys：

- **Gemini API Key**：用于 AI 信号扫描和内容生成。  
  *获取地址*：[https://ai.google.dev/](https://ai.google.dev/)
- **Resend API Key**：用于发送真实的邮件简报。  
  *获取地址*：[https://resend.com/](https://resend.com/) (免费额度：100 封/天)
- **OpenAI API Key** (可选)：作为备用 AI 引擎。  
  *获取地址*：[https://platform.openai.com/](https://platform.openai.com/)

## 2. 环境配置

项目使用 `.env.local` 文件管理环境变量。你可以从 `.env.example` 复制一份并填入你的 API Keys。

```bash
# 复制模板文件
cp .env.example .env.local
```

然后，编辑 `.env.local` 文件，填入你的密钥：

```dotenv
# .env.local

# ===== AI API Keys =====
GEMINI_API_KEY=your_gemini_api_key_here
API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# ===== 邮件服务配置 =====
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=alpha@yourdomain.com

# ===== 用户配置 =====
USER_EMAIL=your_email@example.com

# ===== 模拟数据模式 =====
# 当 API 配额用完时，设置为 true 使用模拟数据
USE_MOCK_DATA=true
```

**重要提示**：由于免费 Gemini API 配额容易用尽，我们已将 `USE_MOCK_DATA` 默认设置为 `true`。部署成功后，你可以将其改为 `false` 来使用真实 API。

## 3. 安装和运行

我们使用 `pnpm` 作为包管理器。

```bash
# 安装所有依赖
pnpm install

# 安装邮件服务依赖
pnpm add nodemailer openai
```

### 启动后端服务

我们创建了一个 `start-backend.js` 脚本来确保环境变量正确加载。

```bash
# 启动后端服务（默认端口 3000）
node start-backend.js &
```

### 启动前端服务

前端使用 Vite 运行。

```bash
# 启动前端开发服务器（会自动寻找可用端口，如 3002）
pnpm run dev &
```

### 暴露服务到公网

使用 Manus 的 `expose` 工具将服务暴露到公网。

```bash
# 暴露后端服务
expose 3000

# 暴露前端服务
expose 3002
```

## 4. 配置定时任务

我们创建了一个 `cron-task.sh` 脚本来执行每日的信号扫描和邮件推送。你可以使用 Manus 的 `schedule` 工具来配置定时任务。

```bash
# 确保脚本有执行权限
chmod +x cron-task.sh

# 配置每天 9:00 和 20:00 执行的定时任务
schedule create cron \
  --name "alpha_daily_scan" \
  --cron "0 0 9,20 * * *" \
  --prompt "执行 ALPHA Signal Hub 的每日信号扫描和邮件推送任务，运行脚本 /home/ubuntu/lifeStart/cron-task.sh"
```

## 5. 故障排查和说明

- **API 配额问题**：如果你的 Gemini API 免费配额用完，后端服务会自动回退到使用模拟数据，确保应用核心功能可用。你可以在 `.env.local` 中将 `USE_MOCK_DATA` 设置为 `false` 来重新尝试使用真实 API。

- **AI 引擎切换**：我们已经集成了 Gemini 和 OpenAI 双引擎。在 `server.js` 中，你可以修改 `AI_ENGINE` 常量来选择使用的引擎。当前逻辑是优先使用 OpenAI（如果配置了 Key），否则使用 Gemini。

- **日志查看**：
  - 后端日志：`tail -f backend.log`
  - 前端日志：`tail -f frontend.log`

- **手动测试**：
  - 测试扫描接口：`curl -X POST http://localhost:3000/api/cron/scan -H "Authorization: Bearer your_cron_secret"`

部署已经完成，所有优化和修复都已提交到你的 GitHub 仓库。
