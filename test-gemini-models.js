import { GoogleGenAI } from "@google/genai";

const API_KEY = "your_gemini_api_key_here";

async function testGeminiModels() {
  console.log('测试 Gemini API Key 和可用模型...\n');
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // 测试不同的模型
  const modelsToTest = [
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`\n测试模型: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: '请用一句话介绍你自己',
        config: {
          maxOutputTokens: 50
        }
      });
      
      const text = response.text || '无响应';
      console.log(`✅ ${modelName} 可用`);
      console.log(`   响应: ${text.slice(0, 100)}`);
    } catch (error) {
      console.log(`❌ ${modelName} 不可用`);
      console.log(`   错误: ${error.message.slice(0, 150)}`);
    }
  }
}

testGeminiModels().catch(console.error);
