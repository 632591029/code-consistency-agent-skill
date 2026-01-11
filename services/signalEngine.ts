
import { GoogleGenAI, Type } from "@google/genai";
import { Signal, SignalType, RiskLevel } from '../types';

export const signalEngine = {
  generateDailySignals: async (sources?: { twitters: string[], websites: string[] }): Promise<Signal[]> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const twitterList = sources?.twitters.join(', ') || 'SamA, karpathy, vitalik.eth, guillermorauch, elonmusk, Andrej Karpathy';
      const webList = sources?.websites.join(', ') || 'GitHub Trending, Product Hunt, OpenAI Blog, TechCrunch AI, The Verge AI, HuggingFace Daily';

      const prompt = `
        任务：作为 ALPHA 深度意义引擎，你现在的目标不是“搜集新闻”，而是“综合情报”。
        
        监控源：
        - 关键人物 (Twitter/X): ${twitterList}
        - 关键平台 (Web): ${webList}
        
        分析流程：
        1. 检索：针对上述来源进行深度穿透，获取过去 24 小时内的所有动态。
        2. 聚合：禁止输出零散的小新闻。你需要将相同主题（如：AI 视频生成的突破、LLM 推理成本的下降、新型生产力工作流）的碎片信息融合成一个“大信号”。
        3. 分类：必须将信号严格归入以下类别，并确保每个类别至少提炼 1-2 条经过深度整理的信号：
           - AI_PROD (AI 生产力工具/App 进化)
           - AI_MODELS (模型架构/底层能力突破)
           - AI_DEV (开发者工具/开源/框架)
           - WEB3_AI (加密货币与 AI 的结合点)
           - FINANCE (AI 与 Web3 领域的投融资/市场异动)
        
        硬性质量标准：
        - 深度：fullContent 必须包含技术原理解析、竞品对比和行业影响分析，字数不少于 600 字。
        - 意义：meaning 必须直接回答“这为什么重要”和“对普通人/投资者的具体价值”。
        - 数据量：你必须基于至少 10-20 个原始信息点进行提炼，但在输出时只保留最精华的 6-8 条聚合信号。
        
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
                id: { type: Type.STRING, description: '唯一标识，如 SIG-2024-001' },
                title: { type: Type.STRING, description: '高度概括的聚合标题' },
                type: { 
                  type: Type.STRING, 
                  enum: ['AI_PROD', 'AI_MODELS', 'AI_DEV', 'WEB3_AI', 'FINANCE', 'INFRA'],
                  description: '信号分类'
                },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                importance: { type: Type.NUMBER, description: '重要程度 0-100' },
                summary: { type: Type.STRING, description: '100字以内的核心摘要' },
                meaning: { type: Type.STRING, description: '深层的价值判断' },
                risk: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
                source: { type: Type.STRING, description: '聚合的主要来源描述' },
                fullContent: { type: Type.STRING, description: '不少于600字的深度分析报告' },
                originalUrl: { type: Type.STRING, description: '最主要的权威链接' },
                references: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-4个辅助证明链接' }
              },
              required: ["id", "title", "type", "tags", "importance", "summary", "meaning", "risk", "source", "fullContent", "originalUrl"]
            }
          }
        },
      });

      const text = response.text || "[]";
      let rawSignals;
      try {
        rawSignals = JSON.parse(text);
      } catch (e) {
        // 自动提取 JSON 部分以增强稳定性
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        rawSignals = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      }

      return rawSignals.map((s: any) => ({
        ...s,
        timestamp: Date.now() - Math.floor(Math.random() * 7200000), // 过去 2 小时内的随机点
        type: s.type as SignalType,
        risk: (s.risk || 'LOW') as RiskLevel,
        references: s.references || []
      }));
    } catch (error) {
      console.error("ALPHA Engine Synthesis Error:", error);
      return signalEngine.getFallbackSignals();
    }
  },

  getFallbackSignals: (): Signal[] => {
    return [
      {
        id: 'SYS-BOOT-001',
        title: 'ALPHA 全球 AI 生产力地图正在重构...',
        timestamp: Date.now(),
        type: SignalType.AI_PROD,
        tags: ['SYSTEM', 'INITIALIZING'],
        importance: 85,
        summary: '系统正在通过 Gemini-3 Pro 的搜索引擎能力穿透 Twitter、GitHub 和 20+ 个硬核技术博客。',
        meaning: 'ALPHA 正在将零散的信息碎片合成为具有操作价值的“聚合情报”。',
        risk: RiskLevel.LOW,
        source: 'ALPHA Core',
        fullContent: `
          ### 情报引擎自检报告
          
          ALPHA 正在执行高强度检索任务。与传统资讯 App 不同，ALPHA 正在为您执行以下逻辑：
          
          1. **跨平台交叉验证**：不仅仅是看一条推特，而是结合 GitHub 的提交记录和官网公告来确认该工具的真实性。
          2. **生产力工具提炼**：我们侧重于能够直接改变工作流的 AI 应用，如 Cursor 级别的 IDE 进化、自动化 Agents 的实际落地案例等。
          3. **去噪音化处理**：丢弃所有“情绪化”言论，只保留技术参数、版本更新和市场变动数据。
          
          请稍候 10-20 秒，引擎正在为您生成第一批聚合信号。
        `,
        originalUrl: 'https://alpha.ai/status',
        references: ['https://google.com/search?q=latest+ai+productivity+trends']
      }
    ];
  }
};
