/**
 * Twitter 数据采集模块
 * 
 * 策略：由于 Twitter API 需要付费，我们使用以下方案：
 * 1. 使用 Nitter（Twitter 前端镜像）- 免费且无需认证
 * 2. 或者使用浏览器自动化直接访问 Twitter
 * 
 * 本模块实现 Nitter 方案（更稳定）
 */

/**
 * Twitter KOL 列表
 */
const TWITTER_KOLS = {
  ai: [
    { username: 'sama', name: 'Sam Altman', category: 'AI' },
    { username: 'karpathy', name: 'Andrej Karpathy', category: 'AI' },
    { username: 'ylecun', name: 'Yann LeCun', category: 'AI' },
    { username: 'goodfellow_ian', name: 'Ian Goodfellow', category: 'AI' },
    { username: 'drfeifei', name: 'Fei-Fei Li', category: 'AI' }
  ],
  web3: [
    { username: 'VitalikButerin', name: 'Vitalik Buterin', category: 'Web3' },
    { username: 'cz_binance', name: 'CZ', category: 'Web3' },
    { username: 'naval', name: 'Naval Ravikant', category: 'Web3' }
  ],
  tech: [
    { username: 'elonmusk', name: 'Elon Musk', category: 'Tech' },
    { username: 'pmarca', name: 'Marc Andreessen', category: 'Tech' },
    { username: 'paulg', name: 'Paul Graham', category: 'Tech' },
    { username: 'balajis', name: 'Balaji Srinivasan', category: 'Tech' }
  ]
};

/**
 * Nitter 实例列表（公共镜像）
 */
const NITTER_INSTANCES = [
  'https://nitter.net',
  'https://nitter.poast.org',
  'https://nitter.privacydev.net'
];

/**
 * 从 Nitter 获取用户最新推文
 */
async function fetchTweetsFromNitter(username, instance = NITTER_INSTANCES[0]) {
  try {
    const response = await fetch(`${instance}/${username}/rss`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (!response.ok) {
      throw new Error(`Nitter error: ${response.status}`);
    }
    
    const rssText = await response.text();
    
    // 简单的 RSS 解析（提取 item 标签）
    const items = rssText.match(/<item>[\s\S]*?<\/item>/g) || [];
    
    const tweets = items.slice(0, 3).map(item => {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || '';
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || '';
      
      return {
        title: title.slice(0, 200),
        link: link.replace('nitter.net', 'twitter.com').replace('nitter.poast.org', 'twitter.com'),
        pubDate,
        description: description.replace(/<[^>]*>/g, '').slice(0, 300)
      };
    });
    
    return tweets;
  } catch (error) {
    console.error(`[Twitter/${username}] Nitter 采集失败:`, error.message);
    return [];
  }
}

/**
 * 采集所有 KOL 的最新推文
 */
export async function fetchTwitterSignals(categories = ['ai', 'web3', 'tech']) {
  console.log('[Twitter] 开始采集 KOL 推文...');
  
  // 收集要采集的 KOL
  const kolsToFetch = [];
  categories.forEach(cat => {
    if (TWITTER_KOLS[cat]) {
      kolsToFetch.push(...TWITTER_KOLS[cat]);
    }
  });
  
  console.log(`[Twitter] 将采集 ${kolsToFetch.length} 位 KOL 的推文`);
  
  // 并行采集（限制并发数避免被封）
  const batchSize = 3;
  const allTweets = [];
  
  for (let i = 0; i < kolsToFetch.length; i += batchSize) {
    const batch = kolsToFetch.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(kol => fetchTweetsFromNitter(kol.username))
    );
    
    batch.forEach((kol, idx) => {
      const tweets = batchResults[idx];
      tweets.forEach(tweet => {
        allTweets.push({
          kol,
          tweet
        });
      });
    });
    
    // 避免请求过快
    if (i + batchSize < kolsToFetch.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // 转换为信号格式
  const signals = allTweets
    .filter(item => item.tweet.title && item.tweet.link)
    .map(item => {
      const { kol, tweet } = item;
      
      // 计算重要性（基于 KOL 影响力）
      let importance = 7;
      if (['sama', 'karpathy', 'VitalikButerin', 'elonmusk'].includes(kol.username)) {
        importance = 9;
      } else if (['ylecun', 'pmarca', 'paulg'].includes(kol.username)) {
        importance = 8;
      }
      
      return {
        id: `TWITTER-${kol.username}-${Date.now()}`,
        title: `${kol.name}: ${tweet.title}`,
        type: kol.category === 'AI' ? 'AI_PROD' : kol.category === 'Web3' ? 'WEB3_AI' : 'TECH_NEWS',
        tags: ['Twitter', kol.category, kol.name],
        importance,
        summary: tweet.description || tweet.title,
        source: `Twitter @${kol.username}`,
        originalUrl: tweet.link,
        metadata: {
          author: kol.name,
          username: kol.username,
          category: kol.category,
          pubDate: tweet.pubDate
        },
        timestamp: Date.now()
      };
    });
  
  console.log(`[Twitter] 采集完成，获取到 ${signals.length} 条推文信号`);
  
  return signals;
}

/**
 * 备用方案：如果 Nitter 不可用，返回空数组
 * 未来可以实现浏览器自动化方案
 */
export async function fetchTwitterSignalsWithFallback(categories = ['ai', 'web3', 'tech']) {
  try {
    const signals = await fetchTwitterSignals(categories);
    if (signals.length > 0) {
      return signals;
    }
  } catch (error) {
    console.error('[Twitter] 主方案失败，尝试备用方案...');
  }
  
  // 备用方案：返回空数组，不影响其他数据源
  console.log('[Twitter] 暂时跳过 Twitter 数据采集');
  return [];
}
