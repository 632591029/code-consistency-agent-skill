const OPENAI_API_KEY = "your_openai_api_key_here";

async function testOpenAIDirect() {
  console.log('直接测试 OpenAI API...\n');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: '请用一句话介绍你自己' }
        ],
        max_tokens: 50
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ OpenAI API 可用');
      console.log('响应:', data.choices[0].message.content);
    } else {
      console.log('❌ OpenAI API 返回错误');
      console.log('状态码:', response.status);
      console.log('错误信息:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('❌ 请求失败');
    console.log('错误:', error.message);
  }
}

testOpenAIDirect();
