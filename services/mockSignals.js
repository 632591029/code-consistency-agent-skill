/**
 * 模拟信号数据生成器
 * 用于演示和测试，当 API 配额用完时使用
 */

export function generateMockSignals() {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
  return [
    {
      id: `ALPHA-${date}-001`,
      title: "OpenAI 发布 GPT-5 预览版：推理能力提升 300%",
      type: "AI_MODELS",
      tags: ["OpenAI", "GPT-5", "大模型", "推理能力"],
      importance: 9.5,
      summary: "OpenAI 正式发布 GPT-5 预览版，在数学推理、代码生成和多模态理解方面实现重大突破，推理准确率相比 GPT-4 提升 300%。",
      meaning: "这标志着大语言模型进入新阶段。对开发者而言，意味着更强大的 AI 助手和自动化工具；对企业而言，可以构建更复杂的智能应用；对投资者而言，AI 基础设施和应用层都将迎来新一轮增长。",
      communitySentiment: "HackerNews 热度 2000+ 点赞，Twitter 上 AI 研究者普遍认为这是年度最重要的技术突破。部分开发者担心成本问题。",
      risk: "MEDIUM",
      source: "OpenAI 官方博客",
      fullContent: "OpenAI 在今日凌晨发布了 GPT-5 的预览版本，这是继 GPT-4 之后最重要的模型更新。根据官方测试数据，GPT-5 在 MATH 数学推理基准上达到 95.2% 的准确率，相比 GPT-4 的 42.5% 提升了 124%。在代码生成方面，HumanEval 基准测试得分从 67% 提升到 92.3%。更重要的是，GPT-5 引入了全新的 \"思维链\" 架构，能够在复杂问题上展示完整的推理过程。定价方面，输入 token 为 $0.03/1K，输出 token 为 $0.12/1K，相比 GPT-4 Turbo 提高约 50%。OpenAI CEO Sam Altman 表示，GPT-5 的训练使用了超过 10 万块 H100 GPU，训练数据量是 GPT-4 的 5 倍。业界普遍认为这将推动 AI 应用进入新阶段，尤其是在科研、教育和企业自动化领域。",
      originalUrl: "https://openai.com/blog/gpt-5-preview",
      timestamp: Date.now(),
      liked: false,
      disliked: false
    },
    {
      id: `ALPHA-${date}-002`,
      title: "Anthropic Claude 3.5 Opus 上线：超越 GPT-4 的多模态能力",
      type: "AI_MODELS",
      tags: ["Anthropic", "Claude", "多模态", "竞争"],
      importance: 8.8,
      summary: "Anthropic 发布 Claude 3.5 Opus，在图像理解、长文本处理和代码生成方面全面超越 GPT-4，支持 200K context window。",
      meaning: "AI 模型竞争白热化，对用户是利好。Claude 的优势在于更长的上下文窗口和更强的安全性，适合处理大型文档和企业级应用。开发者应该关注多模型策略，根据场景选择最优模型。",
      communitySentiment: "开发者社区反响热烈，许多人表示将从 GPT-4 切换到 Claude 3.5。企业用户特别看重其安全性和可控性。",
      risk: "LOW",
      source: "Anthropic 官网",
      fullContent: "Anthropic 今日发布 Claude 3.5 Opus，这是 Claude 系列的最新旗舰模型。在多个基准测试中，Claude 3.5 Opus 表现优异：MMLU 得分 89.2%（GPT-4 为 86.4%），HumanEval 代码生成得分 88.0%，图像理解任务准确率提升 40%。最引人注目的是其 200K token 的上下文窗口，相当于可以处理约 150,000 字的文档，远超 GPT-4 的 128K。定价方面，Claude 3.5 Opus 的输入为 $0.015/1K tokens，输出为 $0.075/1K tokens，比 GPT-4 Turbo 便宜约 50%。Anthropic 强调了模型的安全性和可解释性，特别适合金融、医疗等对合规要求高的行业。目前已有多家财富 500 强企业在测试使用。",
      originalUrl: "https://www.anthropic.com/claude-3-5",
      timestamp: Date.now(),
      liked: false,
      disliked: false
    },
    {
      id: `ALPHA-${date}-003`,
      title: "Vercel 推出 v0.dev 2.0：AI 生成完整 Web 应用",
      type: "AI_PROD",
      tags: ["Vercel", "AI 开发工具", "前端", "低代码"],
      importance: 8.5,
      summary: "Vercel 升级 v0.dev 到 2.0 版本，现在可以通过自然语言描述生成完整的 React + Next.js 应用，包括后端 API 和数据库设计。",
      meaning: "AI 辅助开发进入实用阶段。对前端开发者而言，可以大幅提升原型开发速度；对非技术创业者而言，降低了 MVP 开发门槛。但这也意味着初级开发者需要向更高层次的架构和产品能力转型。",
      communitySentiment: "前端社区讨论激烈，有人认为这是革命性工具，也有人担心代码质量和可维护性。实际使用者反馈生成的代码质量超出预期。",
      risk: "MEDIUM",
      source: "Vercel 官方博客",
      fullContent: "Vercel 今日发布 v0.dev 2.0，这是一个基于 AI 的 Web 应用生成平台。用户只需用自然语言描述需求，v0.dev 就能生成完整的 React + Next.js 应用代码，包括组件、页面、API 路由和数据库 schema。新版本引入了 \"智能重构\" 功能，可以根据用户反馈迭代优化代码。在内部测试中，v0.dev 2.0 生成的代码通过率达到 85%，即 85% 的代码可以直接使用或仅需少量修改。定价采用订阅制：免费版每月 10 次生成，Pro 版 $20/月无限生成。Vercel CEO Guillermo Rauch 表示，v0.dev 的目标是让每个人都能构建 Web 应用。目前已有超过 50,000 名开发者使用 v0.dev 创建了超过 100,000 个项目。",
      originalUrl: "https://vercel.com/blog/v0-dev-2-0",
      timestamp: Date.now(),
      liked: false,
      disliked: false
    },
    {
      id: `ALPHA-${date}-004`,
      title: "Cursor IDE 融资 6000 万美元：AI 编程工具估值达 4 亿",
      type: "FINANCE",
      tags: ["Cursor", "融资", "AI 编程", "IDE"],
      importance: 7.8,
      summary: "AI 代码编辑器 Cursor 完成 6000 万美元 B 轮融资，由 a16z 领投，估值达到 4 亿美元。月活用户突破 100 万。",
      meaning: "AI 编程工具赛道获得资本认可，预示着开发工具市场的重大变革。对投资者而言，开发者工具是值得关注的方向；对开发者而言，掌握 AI 辅助编程将成为必备技能。",
      communitySentiment: "开发者社区普遍看好 Cursor，许多人已从 VS Code 切换。投资圈认为这是继 GitHub Copilot 后最有潜力的 AI 编程工具。",
      risk: "LOW",
      source: "TechCrunch",
      fullContent: "AI 代码编辑器 Cursor 今日宣布完成 6000 万美元 B 轮融资，由 Andreessen Horowitz (a16z) 领投，Stripe、OpenAI 创始人等跟投。此轮融资后，Cursor 估值达到 4 亿美元。Cursor 是一款基于 VS Code 的 AI 代码编辑器，集成了 GPT-4 和 Claude 等多个大模型，支持智能代码补全、重构、调试等功能。数据显示，Cursor 月活用户已突破 100 万，其中付费用户超过 15 万，年化收入约 3600 万美元。Cursor CEO Aman Sanger 表示，新融资将用于扩大团队、优化模型性能和开发企业版功能。Cursor 的成功反映了 AI 编程工具的巨大市场需求，也预示着传统 IDE 市场将面临重大变革。",
      originalUrl: "https://techcrunch.com/2026/01/12/cursor-raises-60m",
      timestamp: Date.now(),
      liked: false,
      disliked: false
    },
    {
      id: `ALPHA-${date}-005`,
      title: "Ethereum 完成 Dencun 升级：Gas 费降低 90%",
      type: "WEB3_AI",
      tags: ["Ethereum", "Layer2", "Gas 费", "升级"],
      importance: 8.2,
      summary: "以太坊主网成功完成 Dencun 升级，引入 EIP-4844 (Proto-Danksharding)，Layer 2 交易成本降低 90% 以上。",
      meaning: "这是以太坊扩容路线图的重要里程碑。对 DeFi 用户而言，交易成本大幅降低；对 Layer 2 项目而言，竞争力显著提升；对开发者而言，可以构建更复杂的链上应用。长期来看，这将推动以太坊生态的大规模采用。",
      communitySentiment: "加密社区普遍认为这是以太坊历史上最重要的升级之一。Layer 2 项目方欢呼雀跃，用户期待更低的交易成本。",
      risk: "LOW",
      source: "Ethereum Foundation",
      fullContent: "以太坊主网于区块高度 19,426,587 成功完成 Dencun 升级，这是继 The Merge 后最重要的网络升级。Dencun 升级的核心是 EIP-4844，引入了 \"blob\" 数据类型，专门用于 Layer 2 的数据可用性。升级后，Arbitrum、Optimism 等 Layer 2 网络的交易成本降低了 90% 以上。例如，在 Arbitrum 上进行一笔 Uniswap 交易，Gas 费从约 $1.50 降至 $0.10。以太坊基金会表示，这是实现完整 Danksharding 的第一步，未来还将进一步提升数据可用性。升级过程非常顺利，没有出现任何技术问题。链上数据显示，升级后 24 小时内，Layer 2 交易量增长了 40%。Vitalik Buterin 在 Twitter 上表示，Dencun 升级标志着以太坊进入 \"Rollup-centric\" 时代。",
      originalUrl: "https://blog.ethereum.org/2026/01/12/dencun-mainnet",
      timestamp: Date.now(),
      liked: false,
      disliked: false
    },
    {
      id: `ALPHA-${date}-006`,
      title: "NVIDIA H200 GPU 租赁价格暴跌 40%：AI 算力过剩信号？",
      type: "INFRA",
      tags: ["NVIDIA", "GPU", "算力", "价格"],
      importance: 7.5,
      summary: "云服务商 H200 GPU 租赁价格在过去一周下跌 40%，从 $4.50/小时降至 $2.70/小时，市场出现算力供给过剩迹象。",
      meaning: "GPU 价格下跌对 AI 创业公司是重大利好，训练和推理成本大幅降低。但也可能预示着 AI 投资热度降温，或者新一代更高效的芯片即将推出。对投资者而言，需要警惕 AI 基础设施过热风险。",
      communitySentiment: "AI 创业者欢迎价格下跌，但投资圈出现担忧情绪。部分分析师认为这是市场正常调整，也有人认为是需求放缓信号。",
      risk: "MEDIUM",
      source: "GPU 租赁平台数据聚合",
      fullContent: "根据多个云服务商的数据，NVIDIA H200 GPU 的租赁价格在过去一周出现大幅下跌。AWS、Azure、GCP 等主流云平台的 H200 实例价格从 $4.50/小时降至 $2.70/小时，跌幅达 40%。Lambda Labs、RunPod 等专业 GPU 租赁平台的价格跌幅更大，部分达到 50%。价格下跌的原因可能包括：1) NVIDIA 产能提升，H200 供应增加；2) 部分大型 AI 公司完成模型训练，释放出租赁的 GPU；3) 市场对 AI 的投资热度有所降温。对 AI 创业公司而言，这是重大利好，可以大幅降低训练和推理成本。但也有分析师担心，这可能预示着 AI 需求增长放缓，或者 NVIDIA 即将推出更高效的新一代芯片（如 B100）。",
      originalUrl: "https://gpupricing.com/trends/h200-price-drop",
      timestamp: Date.now(),
      liked: false,
      disliked: false
    }
  ];
}
