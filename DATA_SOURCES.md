# 真实数据源架构设计

## 数据源选择（基于项目关注领域）

### 1. AI Productivity
**数据源**：
- GitHub Trending (AI/ML repositories)
- HackerNews (AI/productivity discussions)
- Product Hunt (AI productivity tools)
- Twitter (AI researchers & founders)
- Reddit r/MachineLearning, r/LocalLLaMA

### 2. Web3 Infrastructure
**数据源**：
- GitHub Trending (blockchain/web3 repos)
- CoinGecko API (crypto market data)
- Twitter (Vitalik, crypto founders)
- Reddit r/ethereum, r/cryptocurrency

### 3. GPU Markets
**数据源**：
- GPU rental platforms (RunPod, Lambda Labs pricing)
- Twitter (NVIDIA news, GPU availability)
- Reddit r/LocalLLaMA (GPU discussions)

### 4. Open Source
**数据源**：
- GitHub Trending (all languages)
- HackerNews (open source projects)
- Product Hunt (open source tools)

---

## API 选择和实现策略

### ✅ 免费且稳定的 API

1. **GitHub API**
   - 端点: `https://api.github.com/search/repositories`
   - 无需认证（有限额）
   - 可获取：Trending repos, stars, forks, issues

2. **HackerNews API**
   - 端点: `https://hacker-news.firebaseio.com/v0/`
   - 完全免费，无需认证
   - 可获取：Top stories, new stories, comments

3. **Reddit API**
   - 端点: `https://www.reddit.com/r/{subreddit}/hot.json`
   - 无需认证（只读）
   - 可获取：热门帖子、评论数、upvotes

4. **CoinGecko API**
   - 端点: `https://api.coingecko.com/api/v3/`
   - 免费额度：50 calls/min
   - 可获取：价格、市值、24h 变化

### ⚠️ 需要特殊处理的数据源

5. **Twitter/X**
   - 官方 API 需要付费（$100/月）
   - **替代方案**：
     - 使用 Nitter（Twitter 前端镜像）
     - 或使用我的浏览器能力直接访问 Twitter
     - 关注特定 KOL 的最新推文

6. **Product Hunt**
   - 需要 OAuth 认证
   - **替代方案**：使用浏览器抓取或 RSS feed

---

## Twitter KOL 列表（重点关注）

### AI/ML 领域
- @sama (Sam Altman - OpenAI CEO)
- @karpathy (Andrej Karpathy - AI researcher)
- @ylecun (Yann LeCun - Meta AI)
- @goodfellow_ian (Ian Goodfellow - GAN inventor)
- @drfeifei (Fei-Fei Li - Stanford AI Lab)

### Web3/Crypto 领域
- @VitalikButerin (Ethereum founder)
- @cz_binance (Binance CEO)
- @SBF_FTX (crypto industry)
- @naval (investor, crypto advocate)

### Tech/Startup 领域
- @elonmusk (Tesla, SpaceX, X)
- @pmarca (Marc Andreessen - a16z)
- @paulg (Paul Graham - Y Combinator)
- @balajis (Balaji Srinivasan)

---

## 实现策略

### Phase 1: 核心数据采集
实现 GitHub + HackerNews + Reddit 的真实数据采集

### Phase 2: Twitter 特别关注
使用浏览器自动化访问 Twitter，获取 KOL 最新推文

### Phase 3: AI 分析整合
使用 Gemini 对真实数据进行深度分析和价值解读
