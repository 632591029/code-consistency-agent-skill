
import { GoogleGenAI, Type } from "@google/genai";
import { Signal, SignalType, RiskLevel } from '../types';

export const signalEngine = {
  generateDailySignals: async (sources?: { twitters: string[], websites: string[] }, preferences?: string): Promise<Signal[]> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const twitterList = sources?.twitters.join(', ') || 'SamA, karpathy, vitalik.eth, guillermorauch, elonmusk';
      
      const prompt = `
        任务：作为 ALPHA 深度内参引擎，你现在的目标是挖掘【高成本/真实实践】的 AI 信号。
        
        用户历史偏好学习（极其重要）：
        ${preferences || "目前无特定偏好，请全维搜索最硬核的 AI 生产力与 Web3 早期信号。"}
        
        检索与聚合准则：
        1. 【拒绝官方通稿】：不要看 OpenAI 说了什么，去看推特上开发者用它做了什么（搜索 "actually works", "my workflow", "the truth about"）。
        2. 【穿透社区回响】：在 X.com 和 Reddit 上寻找关于 ${twitterList} 等人最新言论下方的【高点赞深度评论】。
        3. 【侧重 AI 生产力】：重点关注：Cursor/Windsurf 的最新骚操作、自动化 Agent 的真实踩坑经验、本地 LLM 的性能对比、AI 改变具体行业（如法律、编程、设计）的真实案例。
        4. 【Web3 早期嗅觉】：寻找还在“极客圈”流传的代币技术升级、空投逻辑变化、或链上异常异动，过滤掉已经上热搜的陈旧新闻。
        
        聚合策略：
        - 将 30+ 碎片点聚合为 6-8 条聚合信号。
        - 每一条信号必须包含“社区真实体感”：大家是在嘲笑它、在悄悄部署它、还是在警告它？
        
        输出格式：严格 JSON 数组。
      `;

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
                summary: { type: Type.STRING, description: '包含核心动作的摘要' },
                meaning: { type: Type.STRING, description: '回答：这能省多少时间或赚多少钱？' },
                communitySentiment: { type: Type.STRING, description: '推特/Reddit上的硬核反馈总结（含反对意见）' },
                risk: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
                source: { type: Type.STRING, description: '聚合的主要 X 账号或社区' },
                fullContent: { type: Type.STRING, description: '不少于800字的内参报告，包含具体的操作步骤或技术逻辑' },
                originalUrl: { type: Type.STRING }
              },
              required: ["id", "title", "type", "tags", "importance", "summary", "meaning", "communitySentiment", "risk", "source", "fullContent", "originalUrl"]
            }
          }
        },
      });

      const text = response.text || "[]";
      let rawSignals = JSON.parse(text);

      return rawSignals.map((s: any) => ({
        ...s,
        timestamp: Date.now(),
        type: s.type as SignalType,
        risk: (s.risk || 'LOW') as RiskLevel,
        liked: false,
        disliked: false
      }));
    } catch (error) {
      console.error("ALPHA Synthesis Error:", error);
      return [];
    }
  }
};
