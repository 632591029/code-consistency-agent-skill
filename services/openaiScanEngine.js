import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * 使用 OpenAI 的信号扫描引擎（备用方案）
 */
export async function performOpenAIScan(preferences = "AI Productivity, Web3 Infrastructure, GPU Markets, Open Source") {
  console.log(`[${new Date().toISOString()}] 🚀 启动 OpenAI 信号扫描...`);
  
  const prompt = `你是 ALPHA 信号引擎的核心分析模块，负责生成高价值信息信号。

【扫描任务】
关注领域：${preferences}

【数据源要求】
基于你的知识，生成这些领域的典型高价值信号，可以包括：
1. 技术社区：GitHub Trending、HackerNews、Product Hunt、Reddit r/programming
2. 行业媒体：TechCrunch、The Verge、Ars Technica、VentureBeat
3. 社交平台：Twitter/X 上的技术 KOL 动态
4. 开发者博客：官方技术博客、工程师个人博客
5. 市场数据：加密货币市场、GPU 租赁平台价格

【信号筛选标准】
✅ 必须包含：
- 产品正式发布或重大更新（需有版本号或具体功能）
- 技术突破或性能提升数据（需有具体指标）
- 融资消息或商业合作（需有金额或合作方）
- 开源项目重大更新或 Star 数激增
- 社区热议话题（需有讨论量或转发数）
- 价格异动或市场趋势（需有具体数据）

❌ 必须排除：
- 纯营销软文或广告
- 无实质内容的预告
- 重复或陈旧信息
- 无法验证的传闻

【输出要求】
产出 15 条高质量信号，每条信号包含：
- id: 唯一标识符（格式：ALPHA-YYYYMMDD-XXX）
- title: 信号标题（简洁有力，50字以内）
- type: 信号类型（AI_PROD/AI_MODELS/AI_DEV/WEB3_AI/FINANCE/INFRA）
- tags: 标签数组（3-5个关键词）
- importance: 重要性评分（1-10，基于影响范围、技术创新度、商业价值）
- summary: 简要摘要（100字以内）
- meaning: 深度分析（200字左右，说明为什么重要、对用户的实际价值）
- communitySentiment: 社区反馈（基于真实数据或合理推测）
- risk: 风险等级（HIGH/MEDIUM/LOW）
- source: 信息来源（媒体名称或平台）
- fullContent: 完整内容（500字左右，包含背景、细节、影响分析）
- originalUrl: 原始链接（真实可访问的 URL）

所有内容使用中文。

请以以下 JSON 格式输出：
{
  "signals": [
    {
      "id": "ALPHA-20260112-001",
      "title": "...",
      "type": "AI_PROD",
      ...
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的科技信号分析专家，擅长从全网检测高价值信息并进行深度分析。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 8000
    });

    const content = response.choices[0].message.content;
    console.log('OpenAI 返回内容:', content.slice(0, 200));
    
    const data = JSON.parse(content);
    console.log('解析后的数据键:', Object.keys(data));
    
    // 处理返回的数据，确保格式正确
    let signals = data.signals || data.data || data.items || [];
    if (!Array.isArray(signals)) {
      // 如果 data 本身就是信号对象，尝试提取所有值
      signals = Object.values(data).filter(v => typeof v === 'object' && v.title);
    }
    
    if (signals.length === 0) {
      console.warn('未找到信号数据，尝试使用整个 data 对象');
      signals = [data];
    }

    // 添加时间戳
    signals = signals.map(s => ({
      ...s,
      timestamp: Date.now(),
      liked: false,
      disliked: false
    }));

    console.log(`[${new Date().toISOString()}] ✅ OpenAI 扫描完成: ${signals.length} 条情报`);
    return signals;
  } catch (error) {
    console.error('❌ OpenAI 扫描引擎故障:', error);
    throw error;
  }
}

/**
 * 使用 OpenAI 生成邮件内容
 */
export async function generateEmailWithOpenAI(signals) {
  const signalContext = signals.slice(0, 10).map((s, i) => `
    ${i + 1}. [${s.type}] ${s.title}
       重要性: ${s.importance}/10
       核心价值: ${s.meaning}
       社区反馈: ${s.communitySentiment}
       风险等级: ${s.risk}
       来源: ${s.originalUrl}
  `).join('\n');

  const prompt = `任务：撰写一份【ALPHA 深度信号内参】邮件。

风格要求：
- 极简、硬核、冷峻、专业
- 直击要点，避免废话
- 数据驱动，理性分析

内容结构：
1. 开篇：用一句话总结"今日最值得关注的核心信号"
2. 信号聚合：按类别（AI/Web3/基础设施等）分组展示
3. 深度点评：对每个重要信号给出硬核分析和可操作建议
4. 趋势洞察：识别跨信号的趋势和机会
5. 风险提示：标注需要警惕的信号

信号数据：
${signalContext}

输出要求：
- HTML 格式
- 使用深色背景风格（#0B0F1A 背景，#00F0FF 主题色）
- 包含信号原始链接
- 移动端友好
- 总字数控制在 1500-2000 字

请直接输出完整的 HTML 代码，包含 <!DOCTYPE html> 声明。`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的科技内容撰写专家，擅长撰写简洁有力的分析报告。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 6000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('❌ OpenAI 邮件生成失败:', error);
    throw error;
  }
}
