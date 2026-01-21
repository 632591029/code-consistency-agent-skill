import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "your_openai_api_key_here";

async function testOpenAI() {
  console.log('测试 OpenAI API Key...\n');
  
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });
  
  // 测试不同的模型
  const modelsToTest = [
    'gpt-4.1-mini',
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-3.5-turbo'
  ];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`\n测试模型: ${modelName}`);
      const response = await openai.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'user', content: '请用一句话介绍你自己' }
        ],
        max_tokens: 50
      });
      
      const text = response.choices[0].message.content;
      console.log(`✅ ${modelName} 可用`);
      console.log(`   响应: ${text.slice(0, 100)}`);
    } catch (error) {
      console.log(`❌ ${modelName} 不可用`);
      console.log(`   错误: ${error.message.slice(0, 150)}`);
    }
  }
}

testOpenAI().catch(console.error);
