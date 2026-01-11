
import { GoogleGenAI, Type } from "@google/genai";
import { Signal, SignalType, RiskLevel } from '../types';

export const signalEngine = {
  generateDailySignals: async (sources?: { twitters: string[], websites: string[] }, preferences?: string): Promise<Signal[]> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const twitterList = sources?.twitters.join(', ') || 'SamA, karpathy, vitalik.eth, rowancheung, paultoo, levelsio, tbi, GregKamradt';
      
      const prompt = `
        任务：作为 ALPHA 情报引擎，你的目标是从全球 AI 和 Web3 链路中精准捕获 EXACTLY 20 条超高价值信号。
        
        核心标准：
        1. [真实实践]：优先选择“我用这个做了什么”、“我是如何规模化这个的”或“在生产环境中使用 [工具] 的真相”。
        2. [硬核洞察]：寻找那些将 10 小时以上的测试/构建总结成一个推特线程或 GitHub 仓库的内容。
        3. [前沿 Web3]：捕捉去中心化 AI 或早期协议在进入主流新闻之前的技术动作。
        4. [反直觉真相]：寻找社区中主流热度被硬数据或本地测试拆解的讨论。
        
        用户反馈背景：
        ${preferences || "无特定偏好。寻找硬核生产力和 Alpha。"}
        
        要求：
        - 必须包含 20 条信号，且全部使用【中文】输出。
        - 每条信号必须有“实时感”。
        - fullContent 必须是深度内参（不少于 800 字），包含“如何复现”、“精确工作流”以及“为什么这比其他方案更好”。
        
        参考源：${twitterList} 等。
        
        输出：严格 JSON 数组。
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
                title: { type: Type.STRING, description: '中文标题' },
                type: { type: Type.STRING, enum: ['AI_PROD', 'AI_MODELS', 'AI_DEV', 'WEB3_AI', 'FINANCE', 'INFRA'] },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                importance: { type: Type.NUMBER },
                summary: { type: Type.STRING, description: '中文摘要' },
                meaning: { type: Type.STRING, description: '中文战略意义' },
                communitySentiment: { type: Type.STRING, description: '中文社区反馈总结' },
                risk: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
                source: { type: Type.STRING, description: '信息来源' },
                fullContent: { type: Type.STRING, description: '中文深度研报（800字+）' },
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
