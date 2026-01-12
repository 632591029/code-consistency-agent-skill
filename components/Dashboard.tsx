
import React from 'react';
import { Signal } from '../types';

interface DashboardProps {
  signals: Signal[];
  onNavigate: (view: any) => void;
  onRefresh: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ signals, onNavigate, onRefresh }) => {
  const isInitialized = signals.length > 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 核心状态看板 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: '捕捉信号', val: signals.length, sub: 'REAL-TIME INFO', color: 'text-primary' },
          { label: '风险等级', val: signals.filter(s => s.risk === 'HIGH').length, sub: 'HIGH RISK ALERT', color: 'text-accent' },
          { label: '扫描深度', val: '0.82', sub: 'CONFIDENCE SCORE', color: 'text-secondary' },
          { label: '处理时延', val: '142ms', sub: 'NETWORK LATENCY', color: 'text-slate-400' }
        ].map((stat, i) => (
          <div key={i} className="web3-card p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
               <span className="material-symbols-outlined text-4xl">monitoring</span>
            </div>
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className={`text-3xl font-black font-mono ${stat.color}`}>{stat.val}</div>
            <div className="text-[8px] font-mono text-slate-600 mt-2">{stat.sub}</div>
          </div>
        ))}
      </div>

      {!isInitialized ? (
        <div className="web3-card rounded-[40px] p-20 flex flex-col items-center text-center border-dashed border-primary/20 bg-primary/5">
            <div className="size-20 bg-primary/20 rounded-full flex items-center justify-center mb-8 border border-primary/40 animate-pulse">
               <span className="material-symbols-outlined text-4xl text-primary">power_settings_new</span>
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter italic">ALPHA 引擎待命</h2>
            <p className="text-slate-400 max-w-lg mb-12 text-sm leading-relaxed">
              尚未探测到当前周期的 Alpha 信号。点击下方按钮启动全球探测器，我们将穿透社交网络、代码库与市场异动，为您构建实时情报网。
            </p>
            <button 
              onClick={onRefresh}
              className="h-16 px-12 glow-button rounded-2xl font-black text-sm tracking-[0.2em] shadow-[0_10px_40px_rgba(0,240,255,0.3)]"
            >
              启动全网扫描引擎
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 大板块入口 */}
          <div 
            onClick={() => onNavigate('signal')}
            className="lg:col-span-2 web3-card p-10 rounded-[40px] cursor-pointer group hover:scale-[1.01]"
          >
             <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-10">
                   <div className="h-0.5 w-12 bg-primary"></div>
                   <span className="text-[10px] font-mono text-primary font-bold tracking-[0.4em] uppercase">Insight Terminal</span>
                </div>
                <h3 className="text-6xl font-black mb-6 tracking-tighter leading-[0.9] italic">
                   穿透迷雾<br/><span className="text-primary neon-text">捕获 Alpha</span>
                </h3>
                <p className="text-slate-500 max-w-md text-sm leading-relaxed mb-12">
                   基于 Gemini 3 Pro 的自适应过滤算法，每天为您节约 4 小时的社交媒体筛选时间。只提供具备执行价值的底层信号。
                </p>
                <div className="mt-auto flex items-center gap-4 group-hover:gap-6 transition-all duration-500">
                   <span className="text-xs font-black uppercase tracking-widest text-primary">进入情报终端</span>
                   <span className="material-symbols-outlined text-primary">trending_flat</span>
                </div>
             </div>
          </div>

          <div 
            onClick={() => onNavigate('finance')}
            className="web3-card p-10 rounded-[40px] cursor-pointer group hover:bg-secondary/10 hover:border-secondary/40"
          >
             <div className="flex flex-col h-full">
                <div className="size-16 bg-secondary/20 rounded-2xl flex items-center justify-center border border-secondary/40 mb-10 group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-3xl text-secondary">account_balance_wallet</span>
                </div>
                <h3 className="text-3xl font-black italic mb-4 leading-tight">财富<br/>异动监控</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                   监控大额资产流向与衍生品异常。在市场变盘前捕捉关键信号。
                </p>
                <div className="mt-auto text-right">
                   <span className="material-symbols-outlined text-slate-700 group-hover:text-secondary transition-colors text-4xl">radar</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 底部协议说明 */}
      <div className="flex flex-col lg:flex-row items-center justify-between py-10 border-t border-white/5 opacity-50 text-[9px] font-mono uppercase tracking-[0.3em]">
          <span>© 2025 ALPHA PROTOCOL. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 mt-4 lg:mt-0">
             <span>Security Audit: PASSED</span>
             <span>Network: MAINNET-v4</span>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
