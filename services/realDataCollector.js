/**
 * 真实数据采集引擎
 * 从多个真实数据源获取最新的技术信号
 */

/**
 * 1. GitHub Trending 数据采集
 */
export async function fetchGitHubTrending(topic = 'ai', timeRange = 'daily') {
  console.log(`[GitHub] 获取 ${topic} 领域的 Trending 项目...`);
  
  try {
    // GitHub 搜索 API - 按 stars 排序，最近一天创建或更新的项目
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const query = `topic:${topic} pushed:>${since}`;
    
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ALPHA-Signal-Hub'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.items.map(repo => ({
      id: `GITHUB-${repo.id}`,
      title: `${repo.full_name}: ${repo.description || 'No description'}`,
      type: 'OPEN_SOURCE',
      tags: ['GitHub', 'Open Source', topic, ...(repo.topics || []).slice(0, 3)],
      importance: Math.min(10, Math.log10(repo.stargazers_count + 1) * 2),
      summary: `${repo.description || 'No description'}. Stars: ${repo.stargazers_count}, Forks: ${repo.forks_count}`,
      source: 'GitHub Trending',
      originalUrl: repo.html_url,
      metadata: {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        created_at: repo.created_at,
        updated_at: repo.updated_at
      },
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('[GitHub] 采集失败:', error.message);
    return [];
  }
}

/**
 * 2. HackerNews 热门数据采集
 */
export async function fetchHackerNews(limit = 10) {
  console.log('[HackerNews] 获取热门故事...');
  
  try {
    // 获取热门故事 ID
    const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStoryIds = await topStoriesResponse.json();
    
    // 获取前 N 个故事的详情
    const stories = await Promise.all(
      topStoryIds.slice(0, limit).map(async (id) => {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return response.json();
      })
    );
    
    return stories
      .filter(story => story && story.title)
      .map(story => ({
        id: `HN-${story.id}`,
        title: story.title,
        type: 'TECH_NEWS',
        tags: ['HackerNews', 'Tech Discussion'],
        importance: Math.min(10, Math.log10((story.score || 0) + 1) * 2.5),
        summary: story.title + (story.text ? ` - ${story.text.slice(0, 100)}` : ''),
        source: 'HackerNews',
        originalUrl: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        metadata: {
          score: story.score,
          comments: story.descendants || 0,
          author: story.by,
          time: story.time
        },
        timestamp: Date.now()
      }));
  } catch (error) {
    console.error('[HackerNews] 采集失败:', error.message);
    return [];
  }
}

/**
 * 3. Reddit 热门讨论采集
 */
export async function fetchReddit(subreddit = 'MachineLearning', limit = 10) {
  console.log(`[Reddit] 获取 r/${subreddit} 热门帖子...`);
  
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`,
      {
        headers: {
          'User-Agent': 'ALPHA-Signal-Hub/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.data.children
      .filter(post => post.data && post.data.title)
      .map(post => {
        const p = post.data;
        return {
          id: `REDDIT-${p.id}`,
          title: p.title,
          type: 'COMMUNITY',
          tags: ['Reddit', subreddit, ...(p.link_flair_text ? [p.link_flair_text] : [])],
          importance: Math.min(10, Math.log10(p.score + 1) * 2),
          summary: p.selftext ? p.selftext.slice(0, 200) : p.title,
          source: `Reddit r/${subreddit}`,
          originalUrl: `https://reddit.com${p.permalink}`,
          metadata: {
            score: p.score,
            comments: p.num_comments,
            author: p.author,
            created: p.created_utc
          },
          timestamp: Date.now()
        };
      });
  } catch (error) {
    console.error('[Reddit] 采集失败:', error.message);
    return [];
  }
}

/**
 * 4. CoinGecko 加密货币数据采集（Web3 相关）
 */
export async function fetchCryptoTrending() {
  console.log('[CoinGecko] 获取加密货币趋势数据...');
  
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.coins.slice(0, 5).map(coin => {
      const item = coin.item;
      return {
        id: `CRYPTO-${item.id}`,
        title: `${item.name} (${item.symbol}): Trending on CoinGecko`,
        type: 'WEB3_AI',
        tags: ['Crypto', 'Web3', 'Trending', item.symbol],
        importance: 7,
        summary: `${item.name} 正在 CoinGecko 上趋势上升，市值排名 #${item.market_cap_rank || 'N/A'}`,
        source: 'CoinGecko',
        originalUrl: `https://www.coingecko.com/en/coins/${item.id}`,
        metadata: {
          symbol: item.symbol,
          market_cap_rank: item.market_cap_rank,
          thumb: item.thumb
        },
        timestamp: Date.now()
      };
    });
  } catch (error) {
    console.error('[CoinGecko] 采集失败:', error.message);
    return [];
  }
}

/**
 * 主采集函数 - 聚合所有数据源
 */
export async function collectRealData(preferences = "AI Productivity, Web3 Infrastructure, GPU Markets, Open Source") {
  console.log(`\n[真实数据采集] 开始采集，关注领域: ${preferences}\n`);
  
  const startTime = Date.now();
  
  // 并行采集所有数据源
  const [
    githubAI,
    githubWeb3,
    hackerNews,
    redditML,
    redditEthereum,
    cryptoTrending
  ] = await Promise.all([
    fetchGitHubTrending('artificial-intelligence'),
    fetchGitHubTrending('web3'),
    fetchHackerNews(15),
    fetchReddit('MachineLearning', 10),
    fetchReddit('ethereum', 5),
    fetchCryptoTrending()
  ]);
  
  // 合并所有数据
  let allSignals = [
    ...githubAI,
    ...githubWeb3,
    ...hackerNews,
    ...redditML,
    ...redditEthereum,
    ...cryptoTrending
  ];
  
  // 去重（基于 URL）
  const seen = new Set();
  allSignals = allSignals.filter(signal => {
    if (seen.has(signal.originalUrl)) {
      return false;
    }
    seen.add(signal.originalUrl);
    return true;
  });
  
  // 按重要性排序
  allSignals.sort((a, b) => b.importance - a.importance);
  
  // 取前 15 条
  const topSignals = allSignals.slice(0, 15);
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n[真实数据采集] 完成！采集到 ${allSignals.length} 条信号，筛选出 ${topSignals.length} 条高质量信号，耗时 ${duration}s\n`);
  
  return topSignals;
}
