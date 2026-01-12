import { GoogleGenAI } from "@google/genai";

const API_KEY = "your_gemini_api_key_here";

async function testGeminiScan() {
  console.log('测试 Gemini 真实扫描功能...\n');
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `你是 ALPHA 信号引擎，请扫描过去24小时的 AI Productivity 领域的重要信号。

请返回 3 条高质量信号，每条包含：
- id: 唯一标识
- title: 标题
- type: 类型（如 AI_PROD）
- importance: 重要性评分（1-10）
- summary: 简短摘要
- originalUrl: 原始链接

以 JSON 格式返回。`;

  try {
    console.log('正在调用 Gemini API...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        maxOutputTokens: 2000
      }
    });
    
    const text = response.text;
    console.log('\n✅ Gemini API 调用成功！');
    console.log('\n返回内容（前 500 字符）:');
    console.log(text.slice(0, 500));
    
    // 尝试解析 JSON
    try {
      const data = JSON.parse(text);
      console.log('\n✅ JSON 解析成功');
      console.log('信号数量:', Array.isArray(data) ? data.length : Object.keys(data).length);
    } catch (e) {
      console.log('\n⚠️  JSON 解析失败，但 API 调用成功');
    }
    
  } catch (error) {
    console.log('\n❌ Gemini API 调用失败');
    console.log('错误:', error.message.slice(0, 300));
  }
}

testGeminiScan();
