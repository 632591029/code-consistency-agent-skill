
// ALPHA 生产环境后端服务 (Node.js/ESM)
import express from 'express';
import { GoogleGenAI, Type } from "@google/genai";
import cors from 'cors';
import nodemailer from 'nodemailer';
import { performOpenAIScan, generateEmailWithOpenAI } from './services/openaiScanEngine.js';
import { generateMockSignals } from './services/mockSignals.js';

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET || "alpha_secure_trigger_2025";

// 邮件服务配置
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'resend';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'alpha@signal.ai';

// 选择使用的 AI 引擎：'gemini' 或 'openai' 或 'mock'
const AI_ENGINE = process.env.USE_MOCK_DATA === 'true' ? 'mock' : (OPENAI_API_KEY ? 'openai' : 'gemini');

/**
 * 增强版信号扫描函数 - Gemini 版本
 */
async function performGeminiScan(preferences = "AI Productivity, Web3 Infrastructure, GPU Markets, Open Source") {
    console.log(`[${new Date().toISOString()}] 🚀 启动 Gemini 全网深度扫描...`);
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
        你是 ALPHA 信号引擎的核心分析模块，负责从全网检测高价值信息信号。

        【扫描任务】
        时间范围：过去 24 小时
        关注领域：${preferences}
        
        【数据源要求】
        必须从以下渠道获取真实数据：
        1. 技术社区：GitHub Trending、HackerNews、Product Hunt、Reddit r/programming
        2. 行业媒体：TechCrunch、The Verge、Ars Technica、VentureBeat
        3. 社交平台：Twitter/X 上的技术 KOL 动态（Sam Altman、Andrej Karpathy、Vitalik 等）
        4. 开发者博客：官方技术博客、工程师个人博客
        5. 市场数据：CoinGecko、DeFiLlama（如涉及 Web3）、GPU 租赁平台价格
        
        【信号筛选标准】
        ✅ 必须包含：
        - 产品正式发布或重大更新（需有版本号或具体功能）
        - 技术突破或性能提升数据（需有具体指标）
        - 融资消息或商业合作（需有金额或合作方）
        - 开源项目 Star 数激增或重大 PR（需有数据）
        - 社区热议话题（需有讨论量或转发数）
        - 价格异动或市场趋势（需有具体数据）
        
        ❌ 必须排除：
        - 纯营销软文或广告
        - 无实质内容的预告或 Coming Soon
        - 重复或陈旧信息（超过 24 小时）
        - 无法验证的传闻或小道消息
        
        【输出要求】
        1. 产出 15 条高质量信号
        2. 每条信号必须包含原始链接（originalUrl）
        3. importance 评分（1-10）基于：影响范围、技术创新度、商业价值
        4. meaning 字段需深度分析对用户的实际价值和可操作建议
        5. communitySentiment 需基于真实评论或数据，包含具体情绪指标
        6. risk 评估基于：技术成熟度、市场接受度、潜在风险
        7. 所有内容使用中文
        
        【分析深度】
        - 不仅报告"发生了什么"，更要分析"为什么重要"
        - 识别趋势：是否是某个领域的拐点信号
        - 机会挖掘：对开发者、创业者、投资者的具体启示
        - 风险提示：潜在的技术风险、市场风险或竞争风险
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['AI_PROD', 'AI_MODELS', 'AI_DEV', 'WEB3_AI', 'FINANCE', 'INFRA'] },
                            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                            importance: { type: Type.NUMBER },
                            summary: { type: Type.STRING },
                            meaning: { type: Type.STRING },
                            communitySentiment: { type: Type.STRING },
                            risk: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
                            source: { type: Type.STRING },
                            fullContent: { type: Type.STRING },
                            originalUrl: { type: Type.STRING }
                        },
                        required: ["id", "title", "type", "tags", "importance", "summary", "meaning", "risk", "source", "fullContent", "originalUrl"]
                    }
                }
            },
        });

        const signals = JSON.parse(response.text);
        console.log(`[${new Date().toISOString()}] ✅ Gemini 扫描完成: ${signals.length} 条情报入库`);
        
        return signals;
    } catch (e) {
        console.error("❌ Gemini 扫描引擎故障:", e);
        throw e;
    }
}

/**
 * 统一的扫描入口（带自动回退）
 */
async function performRealScan(preferences) {
    // 如果明确设置为模拟模式，直接返回模拟数据
    if (AI_ENGINE === 'mock') {
        console.log(`[${new Date().toISOString()}] 🎭 使用模拟数据模式`);
        return generateMockSignals();
    }
    
    // 尝试使用真实 API，失败后自动回退到模拟数据
    try {
        if (AI_ENGINE === 'openai' && OPENAI_API_KEY) {
            return await performOpenAIScan(preferences);
        } else if (API_KEY) {
            return await performGeminiScan(preferences);
        } else {
            console.log(`[${new Date().toISOString()}] ⚠️  未配置 API Key，使用模拟数据`);
            return generateMockSignals();
        }
    } catch (error) {
        console.log(`[${new Date().toISOString()}] ⚠️  API 调用失败，自动回退到模拟数据: ${error.message.slice(0, 100)}`);
        return generateMockSignals();
    }
}

/**
 * 发送邮件函数
 */
async function sendEmail(to, subject, htmlContent) {
    if (EMAIL_SERVICE === 'resend' && RESEND_API_KEY) {
        // 使用 Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: [to],
                subject: subject,
                html: htmlContent
            })
        });
        
        if (!response.ok) {
            throw new Error(`Resend API error: ${await response.text()}`);
        }
        
        return await response.json();
    } else if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
        // 使用 SMTP
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT),
            secure: SMTP_PORT === '465',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        });
        
        return await transporter.sendMail({
            from: FROM_EMAIL,
            to: to,
            subject: subject,
            html: htmlContent
        });
    } else {
        console.log('📧 邮件服务未配置，仅模拟发送');
        console.log(`收件人: ${to}`);
        console.log(`主题: ${subject}`);
        return { success: true, mode: 'simulation' };
    }
}

/**
 * 生成邮件内容
 */
async function generateEmailContent(signals) {
    if (AI_ENGINE === 'openai' && OPENAI_API_KEY) {
        return await generateEmailWithOpenAI(signals);
    }
    
    // Gemini 版本
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const signalContext = signals.slice(0, 10).map((s, i) => `
        ${i + 1}. [${s.type}] ${s.title}
           重要性: ${s.importance}/10
           核心价值: ${s.meaning}
           社区反馈: ${s.communitySentiment}
           风险等级: ${s.risk}
           来源: ${s.originalUrl}
    `).join('\n');

    const prompt = `
        任务：撰写一份【ALPHA 深度信号内参】邮件。
        
        风格要求：
        - 极简、硬核、冷峻、专业
        - 直击要点，避免废话
        - 数据驱动，理性分析
        
        内容结构：
        1. 开篇：用一句话总结"今日最值得关注的核心信号"
        2. 信号聚合：按类别（AI/Web3/基础设施等）分组展示
        3. 深度点评：对每个重要信号给出硬核分析和可操作建议
        4. 趋势洞察：识别跨信号的趋势和机会
        5. 风险提示：标注需要警惕的信号
        
        信号数据：
        ${signalContext}
        
        输出要求：
        - HTML 格式
        - 使用深色背景风格（#0B0F1A 背景，#00F0FF 主题色）
        - 包含信号原始链接
        - 移动端友好
        - 总字数控制在 1500-2000 字
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text;
}

// 接口 1: 获取云端信号（前端调用）
app.get('/api/signals', async (req, res) => {
    res.json({ 
        message: "DB_SYNC_ACTIVE", 
        note: "请在 server.js 中配置数据库后开启真实持久化",
        timestamp: Date.now()
    });
});

// 接口 2: 自动化定时扫描入口 (Cron Job Trigger)
app.post('/api/cron/scan', async (req, res) => {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${CRON_SECRET}`) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const preferences = req.body.preferences || "AI Productivity, Web3 Infrastructure, GPU Markets, Open Source";
        const results = await performRealScan(preferences);
        res.json({ 
            status: "success", 
            timestamp: Date.now(), 
            count: results.length,
            signals: results,
            engine: AI_ENGINE
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 接口 3: 发送邮件简报
app.post('/api/email/send', async (req, res) => {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${CRON_SECRET}`) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { email, signals } = req.body;
        
        if (!email || !signals || signals.length === 0) {
            return res.status(400).json({ error: "Missing email or signals" });
        }

        const htmlContent = await generateEmailContent(signals);
        const timeOfDay = new Date().getHours() < 12 ? '早盘' : '晚盘';
        const subject = `【ALPHA 内参】今日硬核信号（${timeOfDay}）- ${new Date().toLocaleDateString('zh-CN')}`;
        
        const result = await sendEmail(email, subject, htmlContent);
        
        res.json({
            success: true,
            timestamp: Date.now(),
            recipient: email,
            messageId: result.id || result.messageId || 'simulated',
            mode: result.mode || 'real'
        });
    } catch (e) {
        console.error('邮件发送失败:', e);
        res.status(500).json({ error: e.message });
    }
});

// 接口 4: 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: Date.now(),
        version: '4.1.0',
        engine: AI_ENGINE,
        services: {
            gemini: !!API_KEY,
            openai: !!OPENAI_API_KEY,
            email: !!(RESEND_API_KEY || (SMTP_HOST && SMTP_USER))
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    █████╗ ██╗     ██████╗ ██╗  ██╗ █████╗ 
    ██╔══██╗██║     ██╔══██╗██║  ██║██╔══██╗
    ███████║██║     ██████╔╝███████║███████║
    ██╔══██║██║     ██╔═══╝ ██╔══██║██╔══██║
    ██║  ██║███████╗██║     ██║  ██║██║  ██║
    ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝
    
    🚀 ALPHA Backend Service v4.1.0
    📡 Server running on port ${PORT}
    🤖 AI Engine: ${AI_ENGINE.toUpperCase()}
    🔑 Gemini API: ${API_KEY ? '✅' : '❌'}
    🔑 OpenAI API: ${OPENAI_API_KEY ? '✅' : '❌'}
    📧 Email Service: ${RESEND_API_KEY || (SMTP_HOST && SMTP_USER) ? '✅' : '❌ (Simulation Mode)'}
    `);
});
