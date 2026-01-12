/**
 * 混合信号引擎
 * 结合真实数据采集 + AI 深度分析
 */

import { GoogleGenAI, Type } from "@google/genai";
import { collectRealData } from './realDataCollector.js';
import { fetchTwitterSignalsWithFallback } from './twitterCollector.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * 使用 AI 对真实数据进行深度分析
 */
async function enrichSignalsWithAI(rawSignals) {
  console.log(`[AI 分析] 开始对 ${rawSignals.length} 条真实信号进行深度分析...`);
  
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  // 构建分析提示词
  const signalsText = rawSignals.map((s, i) => 
    `${i + 1}. ${s.title}\n   来源: ${s.source}\n   链接: ${s.originalUrl}\n   摘要: ${s.summary}`
  ).join('\n\n');
  
  const prompt = `你是 ALPHA 信号引擎的分析模块。以下是从真实数据源采集到的 ${rawSignals.length} 条技术信号，请对每条信号进行深度分析。

【真实信号数据】
${signalsText}

【分析任务】
对每条信号，提供：
1. meaning: 深度价值分析（200字）- 为什么重要？对开发者/创业者/投资者的启示？
2. communitySentiment: 社区反应评估 - 基于来源和内容推测社区情绪
3. risk: 风险等级（HIGH/MEDIUM/LOW）- 技术风险、市场风险、竞争风险
4. fullContent: 扩展内容（500字）- 背景、影响、趋势分析

【输出要求】
返回 JSON 数组，每个元素包含：
- index: 信号序号（1-${rawSignals.length}）
- meaning: string
- communitySentiment: string
- risk: "HIGH" | "MEDIUM" | "LOW"
- fullContent: string

所有内容使用中文。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              index: { type: Type.NUMBER },
              meaning: { type: Type.STRING },
              communitySentiment: { type: Type.STRING },
              risk: { type: Type.STRING },
              fullContent: { type: Type.STRING }
            }
          }
        },
        maxOutputTokens: 8000
      }
    });
    
    let text = response.text;
    // 移除可能的 Markdown 代码块
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    // 移除控制字符
    text = text.replace(/[\x00-\x1F\x7F]/g, ' ');
    
    const analysis = JSON.parse(text);
    
    // 将 AI 分析结果合并到原始信号中
    const enrichedSignals = rawSignals.map((signal, idx) => {
      const aiData = analysis.find(a => a.index === idx + 1) || {};
      
      return {
        ...signal,
        meaning: aiData.meaning || '暂无深度分析',
        communitySentiment: aiData.communitySentiment || '社区反应积极',
        risk: aiData.risk || 'MEDIUM',
        fullContent: aiData.fullContent || signal.summary
      };
    });
    
    console.log(`[AI 分析] 完成！已为 ${enrichedSignals.length} 条信号添加深度分析`);
    
    return enrichedSignals;
  } catch (error) {
    console.error('[AI 分析] 失败:', error.message);
    
    // 如果 AI 分析失败，返回原始信号（添加默认值）
    return rawSignals.map(signal => ({
      ...signal,
      meaning: `${signal.summary} 这是一个值得关注的技术信号。`,
      communitySentiment: '社区反应积极',
      risk: 'MEDIUM',
      fullContent: signal.summary
    }));
  }
}

/**
 * 主函数：采集真实数据 + AI 深度分析
 */
export async function collectAndAnalyzeSignals(preferences = "AI Productivity, Web3 Infrastructure, GPU Markets, Open Source") {
  console.log('\n========================================');
  console.log('🚀 混合信号引擎启动');
  console.log('========================================\n');
  
  const startTime = Date.now();
  
  // Step 1: 采集真实数据
  console.log('【阶段 1/3】采集真实数据...\n');
  
  const [realData, twitterData] = await Promise.all([
    collectRealData(preferences),
    fetchTwitterSignalsWithFallback(['ai', 'web3', 'tech'])
  ]);
  
  // 合并数据
  let allSignals = [...realData, ...twitterData];
  
  // 去重
  const seen = new Set();
  allSignals = allSignals.filter(signal => {
    if (seen.has(signal.originalUrl)) {
      return false;
    }
    seen.add(signal.originalUrl);
    return true;
  });
  
  // 按重要性排序，取前 15 条
  allSignals.sort((a, b) => b.importance - a.importance);
  const topSignals = allSignals.slice(0, 15);
  
  console.log(`\n✅ 采集完成：共 ${allSignals.length} 条信号，筛选出 ${topSignals.length} 条高质量信号\n`);
  
  // Step 2: AI 深度分析
  console.log('【阶段 2/3】AI 深度分析...\n');
  
  const enrichedSignals = await enrichSignalsWithAI(topSignals);
  
  // Step 3: 最终格式化
  console.log('【阶段 3/3】格式化输出...\n');
  
  const finalSignals = enrichedSignals.map((signal, idx) => ({
    id: signal.id || `ALPHA-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(idx + 1).padStart(3, '0')}`,
    title: signal.title,
    type: signal.type,
    tags: signal.tags,
    importance: Math.round(signal.importance),
    summary: signal.summary,
    meaning: signal.meaning,
    communitySentiment: signal.communitySentiment,
    risk: signal.risk,
    source: signal.source,
    fullContent: signal.fullContent,
    originalUrl: signal.originalUrl,
    metadata: signal.metadata,
    timestamp: signal.timestamp
  }));
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('========================================');
  console.log(`✅ 混合信号引擎完成！`);
  console.log(`   - 总信号数: ${finalSignals.length}`);
  console.log(`   - 数据源: GitHub, HackerNews, Reddit, CoinGecko, Twitter`);
  console.log(`   - 耗时: ${duration}s`);
  console.log('========================================\n');
  
  return finalSignals;
}
