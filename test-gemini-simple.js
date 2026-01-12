import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = "your_gemini_api_key_here";

async function testGeminiSimple() {
  console.log('测试 Gemini 简化扫描（不使用 Google Search）...\n');
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `你是 ALPHA 信号引擎。基于你的知识，生成 3 条 AI Productivity 领域的典型高质量信号。

每条信号包含：
- id: 唯一标识（格式：ALPHA-20260112-NNN）
- title: 标题
- type: AI_PROD
- tags: 标签数组
- importance: 重要性（1-10的数字）
- summary: 简短摘要（100字）
- meaning: 深度分析（200字）
- communitySentiment: 社区反应
- risk: HIGH/MEDIUM/LOW
- source: 信息来源
- fullContent: 完整内容（500字）
- originalUrl: 原始链接

返回 JSON 数组。`;

  try {
    console.log('正在调用 Gemini API...');
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
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              importance: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              meaning: { type: Type.STRING },
              communitySentiment: { type: Type.STRING },
              risk: { type: Type.STRING },
              source: { type: Type.STRING },
              fullContent: { type: Type.STRING },
              originalUrl: { type: Type.STRING }
            }
          }
        },
        maxOutputTokens: 8000
      }
    });
    
    const signals = JSON.parse(response.text);
    console.log(`\n✅ 获取到 ${signals.length} 条信号\n`);
    
    signals.forEach((s, i) => {
      console.log(`${i + 1}. ${s.title}`);
      console.log(`   类型: ${s.type} | 重要性: ${s.importance}/10`);
      console.log(`   来源: ${s.source}`);
      console.log(`   摘要: ${s.summary.slice(0, 80)}...`);
      console.log('');
    });
    
    console.log('✅ 测试成功！Gemini 扫描功能正常工作。');
    
  } catch (error) {
    console.log('\n❌ Gemini API 调用失败');
    console.log('错误:', error.message.slice(0, 500));
  }
}

testGeminiSimple();
