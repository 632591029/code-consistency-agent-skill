
import { GoogleGenAI, Type } from "@google/genai";
import { Signal, SignalType, RiskLevel } from '../types';

export const signalEngine = {
  /**
   * 真正的 Alpha 探测引擎
   * 使用 Google Search Grounding 获取过去 24h 的全球真实信号
   */
  generateDailySignals: async (sources?: { twitters: string[], websites: string[] }, preferences?: string): Promise<Signal[]> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const currentContext = preferences || "AI 生产力工具发布, Web3 基础设施更新, GPU 算力市场价格, 顶级开源项目变动";
      
      const prompt = `
        任务：ALPHA 探测器启动。
        
        搜索目标：
        检索过去 24 小时内关于 "${currentContext}" 的真实硬核动态。
        
        要求：
        1. 必须基于搜索结果中的真实新闻、推文或 GitHub 提交。
        2. 产出 12 条经过 AI 降噪后的高价值信号。
        3. 必须包含每条信号的 originalUrl。
        4. 战略意义 (meaning) 必须深刻，指出对普通用户的机会。
        5. 语言：中文。
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

      const text = response.text || "[]";
      let rawSignals = JSON.parse(text);

      // 处理每个信号并记录来源（如有 groundingMetadata 可在此提取）
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
      // 如果 API 失败，尝试读取本地缓存
      const cached = localStorage.getItem('alpha_cloud_cache');
      return cached ? JSON.parse(cached) : [];
    }
  }
};
