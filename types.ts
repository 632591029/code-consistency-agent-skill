
export enum SignalType {
  AI_PROD = 'AI_PROD',      // AI 生产力工具与应用
  AI_MODELS = 'AI_MODELS',  // 大模型、研究与架构
  AI_DEV = 'AI_DEV',        // 开发者工具与开源项目
  WEB3_AI = 'WEB3_AI',      // Web3 与 AI 融合
  FINANCE = 'FINANCE',      // 金融与市场信号
  INFRA = 'INFRA'           // 基础设施与算力
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Signal {
  id: string;
  title: string;
  timestamp: number;
  type: SignalType;
  tags: string[];
  importance: number; // 1-100
  summary: string;
  meaning: string;
  risk: RiskLevel;
  source: string;
  fullContent: string; // 详情内容
  originalUrl: string; // 原始主链接
  references?: string[]; // 参考资料列表
  liked?: boolean;      // 用户点赞，用于反馈系统
  disliked?: boolean;   // 用户踩，用于过滤
  communitySentiment?: string; // 社区讨论热度与情绪摘要
}

export interface AppState {
  signals: Signal[];
  loading: boolean;
  activeView: 'dashboard' | 'signal' | 'finance' | 'settings' | 'chat';
  selectedSignalId?: string;
  detailSignal?: Signal | null;
  monitoredSources: {
    twitters: string[];
    websites: string[];
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
