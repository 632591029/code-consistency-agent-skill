
// ALPHA 生产环境后端服务 (Node.js/ESM)
import express from 'express';
import { GoogleGenAI, Type } from "@google/genai";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
const CRON_SECRET = process.env.CRON_SECRET || "alpha_secure_trigger_2025";

/**
 * 生产级信号扫描函数
 * 利用 Gemini 3 Pro + Google Search 实时抓取全网真实 Alpha
 */
async function performRealScan(preferences = "AI Productivity, Web3 Infrastructure, GPU Markets") {
    console.log(`[${new Date().toISOString()}] 启动全网深度扫描...`);
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
        作为 ALPHA 情报引擎，利用 Google 搜索获取过去 24 小时内关于以下领域的【真实硬核】进展：
        领域：${preferences}
        
        要求：
        1. 必须是真实发生的项目动态、技术发布或市场异动。
        2. 排除营销软文，只保留技术细节或硬核数据。
        3. 产出 10 条信号，每条信号包含深度研报。
        4. 语言：中文。
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
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
        
        // 生产环境持久化逻辑：
        // await supabase.from('signals').insert(signals.map(s => ({...s, created_at: new Date()})));
        
        return signals;
    } catch (e) {
        console.error("扫描引擎故障:", e);
        throw e;
    }
}

// 接口 1: 获取云端信号（前端调用）
app.get('/api/signals', async (req, res) => {
    // 真实产品中：return res.json(await supabase.from('signals').select('*').order('created_at', { ascending: false }));
    res.json({ message: "DB_SYNC_ACTIVE", note: "请在 server.js 中配置 Supabase URL 后开启真实持久化" });
});

// 接口 2: 自动化定时扫描入口 (Cron Job Trigger)
app.post('/api/cron/scan', async (req, res) => {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${CRON_SECRET}`) return res.status(401).json({ error: "Unauthorized" });

    try {
        const results = await performRealScan();
        res.json({ status: "success", timestamp: Date.now(), count: results.length });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    █████╗ ██╗     ██████╗ ██╗  ██╗ █████╗ 
    ██╔══██╗██║     ██╔══██╗██║  ██║██╔══██╗
    ███████║██║     ██████╔╝███████║███████║
    ██╔══██║██║     ██╔═══╝ ██╔══██║██╔══██║
    ██║  ██║███████╗██║     ██║  ██║██║  ██║
    ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝
    ALPHA Backend Service v4.0 is running on port ${PORT}
    `);
});
