import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = "your_gemini_api_key_here";

async function testGeminiScan() {
  console.log('测试 Gemini 真实扫描功能（带 Google Search）...\n');
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `你是 ALPHA 信号引擎，请使用 Google Search 扫描过去24小时的 AI Productivity 领域的重要信号。

请返回 3 条高质量信号，每条包含：
- id: 唯一标识（格式：ALPHA-YYYYMMDD-NNN）
- title: 标题
- type: 类型（AI_PROD）
- tags: 标签数组
- importance: 重要性评分（1-10的数字）
- summary: 简短摘要（100字左右）
- meaning: 深度分析（200字左右）
- communitySentiment: 社区反应
- risk: 风险等级（HIGH/MEDIUM/LOW）
- source: 信息来源
- fullContent: 完整内容（500字左右）
- originalUrl: 原始链接

返回 JSON 数组格式。`;

  try {
    console.log('正在调用 Gemini API（这可能需要 10-30 秒）...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
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
        maxOutputTokens: 4000
      }
    });
    
    let text = response.text;
    console.log('\n✅ Gemini API 调用成功！');
    console.log('\n原始返回内容（前 200 字符）:');
    console.log(text.slice(0, 200));
    
    // 移除 Markdown 代码块标记和前缀文本
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    // 如果以中文开头，尝试找到 JSON 数组的开始
    const jsonStart = text.indexOf('[');
    if (jsonStart > 0) {
      text = text.slice(jsonStart);
    }
    // 移除控制字符
    text = text.replace(/[\x00-\x1F\x7F]/g, '');
    
    console.log('\n处理后的内容（前 200 字符）:');
    console.log(text.slice(0, 200));
    
    // 保存到文件
    import('fs').then(fs => {
      fs.writeFileSync('/home/ubuntu/lifeStart/gemini-response.json', text);
      console.log('\n完整内容已保存到 gemini-response.json');
    });
    
    // 解析 JSON
    const signals = JSON.parse(text);
    console.log(`\n✅ 获取到 ${signals.length} 条信号\n`);
    
    signals.forEach((s, i) => {
      console.log(`${i + 1}. ${s.title}`);
      console.log(`   类型: ${s.type} | 重要性: ${s.importance}/10`);
      console.log(`   来源: ${s.source}`);
      console.log(`   链接: ${s.originalUrl}`);
      console.log(`   摘要: ${s.summary.slice(0, 80)}...`);
      console.log('');
    });
    
    console.log('✅ 测试成功！Gemini 扫描功能正常工作。');
    
  } catch (error) {
    console.log('\n❌ Gemini API 调用失败');
    console.log('错误类型:', error.constructor.name);
    console.log('错误信息:', error.message.slice(0, 500));
  }
}

testGeminiScan();
