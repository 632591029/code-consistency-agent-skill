
import React, { useState, useEffect, useCallback } from 'react';
import { SignalType, RiskLevel, Signal, AppState } from './types';
import Dashboard from './components/Dashboard';
import SignalTerminal from './components/SignalTerminal';
import FinanceTerminal from './components/FinanceTerminal';
import Settings from './components/Settings';
import AIAssistant from './components/AIAssistant';
import DetailModal from './components/DetailModal';
import { signalEngine } from './services/signalEngine';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    signals: [],
    loading: false,
    activeView: 'dashboard',
    detailSignal: null,
    monitoredSources: {
      twitters: ["SamA", "karpathy", "vitalik.eth", "guillermorauch"],
      websites: ["GitHub Trends", "HuggingFace"]
    }
  });

  const [sysStatus, setSysStatus] = useState({
    lastSync: "NEVER",
    logs: ["[SYS] 协议层已就绪", "[SYS] 节点自检完成: OK"]
  });

  const addLog = (msg: string) => {
    setSysStatus(prev => ({
      ...prev,
      logs: [...prev.logs.slice(-5), `[${new Date().toLocaleTimeString()}] ${msg}`]
    }));
  };

  const syncWithCloud = useCallback(async () => {
    if (state.loading) return;
    setState(prev => ({ ...prev, loading: true }));
    addLog("执行深度扫描指令...");
    
    try {
      const data = await signalEngine.generateDailySignals(state.monitoredSources);
      localStorage.setItem('alpha_cloud_cache', JSON.stringify(data));
      setState(prev => ({ ...prev, signals: data, loading: false }));
      setSysStatus(p => ({ ...p, lastSync: new Date().toLocaleTimeString() }));
      addLog(`任务完成: ${data.length} 条情报入库`);
    } catch (e) {
      addLog("探测器故障: 请检查 API 链路");
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.monitoredSources, state.loading]);

  useEffect(() => {
    const cached = localStorage.getItem('alpha_cloud_cache');
    if (cached) {
      const data = JSON.parse(cached);
      setState(prev => ({ ...prev, signals: data }));
      addLog("从本地存储加载了历史快照");
    } else {
      addLog("系统待命。请手动点击启动。");
    }
  }, []);

  const renderContent = () => {
    if (state.loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center h-full space-y-6">
          <div className="relative size-32">
             <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
             <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-primary">SCANNING</div>
          </div>
          <div className="text-center">
            <h3 className="text-primary font-bold tracking-[0.4em] mb-2 uppercase animate-pulse">Alpha Synthesis Active</h3>
            <p className="text-slate-500 text-[10px] font-mono">GOOGLE_SEARCH_GROUNDING_INITIATED...</p>
          </div>
        </div>
      );
    }

    if (state.activeView === 'settings') return <Settings signals={state.signals} monitoredSources={state.monitoredSources} setMonitoredSources={s => setState(p => ({...p, monitoredSources: s}))} />;
    if (state.activeView === 'chat') return <AIAssistant selectedSignal={state.signals.find(s => s.id === state.selectedSignalId)} onClose={() => setState(p => ({...p, activeView: 'dashboard'}))} />;

    switch (state.activeView) {
      case 'dashboard': return <Dashboard signals={state.signals} onNavigate={v => setState(p => ({...p, activeView: v}))} onRefresh={syncWithCloud} />;
      case 'signal': return <SignalTerminal signals={state.signals} onSelect={s => setState(p => ({...p, detailSignal: s}))} onRefresh={syncWithCloud} onToggleLike={() => {}} />;
      case 'finance': return <FinanceTerminal signals={state.signals.filter(s => s.type === SignalType.FINANCE)} onSelect={s => setState(p => ({...p, detailSignal: s}))} onRefresh={syncWithCloud} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 font-display">
      <div className="scanline"></div>
      
      {/* 侧边栏 */}
      <aside className="hidden lg:flex w-72 border-r border-white/5 flex-col p-8 bg-[#0B0F1A]/50 backdrop-blur-3xl z-50">
        <div className="mb-12">
            <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary font-black">token</span>
                </div>
                <div>
                   <h1 className="text-2xl font-black tracking-tighter italic neon-text">ALPHA</h1>
                   <div className="text-[8px] font-mono text-primary/60 uppercase tracking-widest">Signal Hub v4.0.8</div>
                </div>
            </div>
        </div>
        
        <nav className="flex-1 space-y-3">
          {[
            { id: 'dashboard', icon: 'dashboard_customize', label: '控制塔' },
            { id: 'signal', icon: 'stream', label: '情报流' },
            { id: 'finance', icon: 'currency_exchange', label: '资产探测' },
            { id: 'chat', icon: 'smart_toy', label: 'AI 分析' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setState(p => ({...p, activeView: item.id as any}))} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group ${state.activeView === item.id ? 'bg-primary text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'text-slate-500 hover:text-primary hover:bg-primary/5'}`}
            >
              <span className={`material-symbols-outlined text-xl ${state.activeView === item.id ? '' : 'group-hover:scale-110 transition-transform'}`}>{item.icon}</span>
              <span className="text-xs font-bold tracking-wider uppercase">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-6 pt-6 border-t border-white/5">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-[9px] font-bold text-slate-500 uppercase">系统实时日志</span>
                   <div className="size-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></div>
                </div>
                <div className="space-y-1.5 font-mono text-[9px]">
                    {sysStatus.logs.map((log, i) => (
                        <div key={i} className="text-slate-400 truncate opacity-80">{log}</div>
                    ))}
                </div>
            </div>
            
            <button onClick={() => setState(p => ({...p, activeView: 'settings'}))} className="w-full flex items-center justify-between text-slate-500 hover:text-white transition-colors">
               <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
               <span className="material-symbols-outlined text-sm">settings_input_component</span>
            </button>
        </div>
      </aside>

      {/* 主工作区 */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#020617]/80 backdrop-blur-xl z-40">
           <div className="flex items-center gap-10">
              <div className="flex flex-col">
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Node Status</span>
                 <span className="text-xs font-bold text-primary flex items-center gap-2">
                    <span className="size-1.5 bg-primary rounded-full"></span>
                    ACTIVE_MAINNET_01
                 </span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Sync Hash</span>
                 <span className="text-[10px] font-mono text-slate-400">0x8F2C...E4B1</span>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                 <div className="text-[9px] text-slate-500 font-bold uppercase">Last Sync</div>
                 <div className="text-xs font-mono text-slate-200">{sysStatus.lastSync}</div>
              </div>
              <button 
                onClick={syncWithCloud}
                className="h-10 px-6 glow-button rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2"
              >
                 <span className="material-symbols-outlined text-sm">rocket_launch</span>
                 <span>强制扫描</span>
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10 bg-gradient-to-br from-background via-background to-secondary/5">
           {renderContent()}
        </div>
      </main>

      {state.detailSignal && (
        <DetailModal 
            signal={state.detailSignal} 
            onClose={() => setState(p => ({...p, detailSignal: null}))}
            onAskAI={() => setState(p => ({...p, selectedSignalId: state.detailSignal?.id, activeView: 'chat', detailSignal: null}))}
            onToggleLike={() => {}}
        />
      )}
    </div>
  );
};

export default App;
