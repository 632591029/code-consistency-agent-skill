
import { GoogleGenAI, Type } from "@google/genai";
import { Signal, SignalType, RiskLevel } from '../types';

/**
 * 增强版 ALPHA 信号引擎
 * 支持多数据源聚合、智能去重、深度分析
 */
export const signalEngine = {
  /**
   * 主扫描引擎 - 使用 Google Search Grounding 获取全网真实信号
   */
  generateDailySignals: async (sources?: { twitters: string[], websites: string[] }, preferences?: string): Promise<Signal[]> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const currentContext = preferences || "AI 生产力工具发布, Web3 基础设施更新, GPU 算力市场价格, 顶级开源项目变动";
      
      // 优化后的多维度提示词
      const prompt = `
        你是 ALPHA 信号引擎的核心分析模块，负责从全网检测高价值信息信号。

        【扫描任务】
        时间范围：过去 24 小时
        关注领域：${currentContext}
        
        【数据源要求】
        必须从以下渠道获取真实数据：
        1. 技术社区：GitHub Trending、HackerNews、Product Hunt
        2. 行业媒体：TechCrunch、The Verge、Ars Technica
        3. 社交平台：Twitter/X 上的技术 KOL 动态
        4. 开发者博客：官方技术博客、工程师个人博客
        5. 市场数据：CoinGecko、DeFiLlama（如涉及 Web3）
        
        【信号筛选标准】
        ✅ 必须包含：
        - 产品正式发布或重大更新
        - 技术突破或性能提升数据
        - 融资消息或商业合作
        - 开源项目 Star 数激增
        - 社区热议话题（需有数据支撑）
        
        ❌ 必须排除：
        - 纯营销软文
        - 无实质内容的预告
        - 重复或陈旧信息
        - 无法验证的传闻
        
        【输出要求】
        1. 产出 15 条高质量信号
        2. 每条信号必须包含原始链接（originalUrl）
        3. importance 评分基于：影响范围、技术创新度、商业价值
        4. meaning 字段需深度分析对用户的实际价值
        5. communitySentiment 需基于真实评论或数据
        6. 所有内容使用中文
        
        【分析深度】
        - 不仅报告"发生了什么"，更要分析"为什么重要"
        - 识别趋势：是否是某个领域的拐点信号
        - 机会挖掘：对开发者、创业者、投资者的具体启示
      `;

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

      const text = response.text || "[]";
      let rawSignals = JSON.parse(text);

      // 智能去重和质量过滤
      const deduplicatedSignals = this.deduplicateSignals(rawSignals);
      
      // 按重要性排序
      const sortedSignals = deduplicatedSignals.sort((a, b) => b.importance - a.importance);

      return sortedSignals.map((s: any) => ({
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
      if (typeof localStorage !== 'undefined') {
        const cached = localStorage.getItem('alpha_cloud_cache');
        return cached ? JSON.parse(cached) : [];
      }
      return [];
    }
  },

  /**
   * 智能去重算法
   * 基于标题相似度和 URL 域名去重
   */
  deduplicateSignals(signals: any[]): any[] {
    const seen = new Set<string>();
    const result: any[] = [];

    for (const signal of signals) {
      // 提取 URL 域名作为去重依据之一
      const urlKey = this.extractDomain(signal.originalUrl);
      // 标题关键词提取（简化版）
      const titleKey = signal.title.slice(0, 20).toLowerCase();
      const compositeKey = `${urlKey}_${titleKey}`;

      if (!seen.has(compositeKey)) {
        seen.add(compositeKey);
        result.push(signal);
      }
    }

    return result;
  },

  /**
   * 提取 URL 域名
   */
  extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }
};
