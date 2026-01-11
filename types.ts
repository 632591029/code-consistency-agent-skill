
export enum SignalType {
  AI = 'AI',
  WEB3 = 'WEB3',
  FINANCE = 'FINANCE',
  INFRA = 'INFRA'
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
