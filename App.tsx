
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SignalType, RiskLevel, Signal, AppState } from './types';
import { ICONS, SYSTEM_VERSION, MOCK_EMAILS } from './constants';
import Dashboard from './components/Dashboard';
import SignalTerminal from './components/SignalTerminal';
import FinanceTerminal from './components/FinanceTerminal';
import Settings from './components/Settings';
import AIAssistant from './components/AIAssistant';
import DetailModal from './components/DetailModal';
import { signalEngine } from './services/signalEngine';
import { emailService } from './services/emailService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    signals: [],
    loading: true,
    activeView: 'dashboard',
    detailSignal: null,
    monitoredSources: {
      twitters: ["SamA", "karpathy", "vitalik.eth", "guillermorauch", "miskohevery"],
      websites: ["GitHub Trends", "Reddit AI", "Product Hunt", "HuggingFace"]
    }
  });
  
  const signalsRef = useRef<Signal[]>([]);

  // 模拟偏好存储
  const getPreferences = () => {
    const liked = state.signals.filter(s => s.liked).map(s => s.title).join(', ');
    return liked ? `用户最近偏好以下主题：${liked}` : "";
  };

  const fetchSignals = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const prefs = getPreferences();
      const data = await signalEngine.generateDailySignals(state.monitoredSources, prefs);
      
      // 合并本地点赞状态
      const storedLikes = JSON.parse(localStorage.getItem('alpha_likes') || '[]');
      const enrichedData = data.map(s => ({
        ...s,
        liked: storedLikes.includes(s.id)
      }));
      
      setState(prev => ({ ...prev, signals: enrichedData, loading: false }));
    } catch (e) {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.monitoredSources]);

  const toggleLike = (id: string) => {
    setState(prev => {
      const newSignals = prev.signals.map(s => s.id === id ? { ...s, liked: !s.liked } : s);
      const likedIds = newSignals.filter(s => s.liked).map(s => s.id);
      localStorage.setItem('alpha_likes', JSON.stringify(likedIds));
      return { ...prev, signals: newSignals };
    });
  };

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const renderContent = () => {
    if (state.loading && state.signals.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative size-24 mb-6">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
          </div>
          <p className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Alpha Engine Synthesizing...</p>
        </div>
      );
    }

    switch (state.activeView) {
      case 'dashboard': return <Dashboard signals={state.signals} onNavigate={v => setState(p => ({...p, activeView: v}))} monitoredSources={state.monitoredSources} />;
      case 'signal': return <SignalTerminal signals={state.signals.filter(s => s.type !== SignalType.FINANCE)} onSelect={s => setState(p => ({...p, detailSignal: s}))} onRefresh={fetchSignals} onToggleLike={toggleLike} />;
      case 'finance': return <FinanceTerminal signals={state.signals.filter(s => s.type === SignalType.FINANCE)} onSelect={s => setState(p => ({...p, detailSignal: s}))} onRefresh={fetchSignals} />;
      case 'settings': return <Settings signals={state.signals} monitoredSources={state.monitoredSources} setMonitoredSources={s => setState(p => ({...p, monitoredSources: s}))} />;
      case 'chat': return <AIAssistant selectedSignal={state.signals.find(s => s.id === state.selectedSignalId)} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-secondary overflow-hidden relative font-display">
      <aside className="hidden lg:flex w-64 border-r border-white/5 flex-col p-6 bg-black/20">
        <div className="mb-10 flex items-center gap-3">
          <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/40 neon-glow">
            <span className="material-symbols-outlined text-primary">hub</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter">ALPHA</h1>
            <p className="text-[10px] text-primary/60 font-mono uppercase tracking-widest">{SYSTEM_VERSION}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => setState(p => ({...p, activeView: 'dashboard'}))} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-white/40 hover:text-white'}`}>{ICONS.DASHBOARD} <span className="text-xs font-bold uppercase tracking-wider">控制台</span></button>
          <button onClick={() => setState(p => ({...p, activeView: 'signal'}))} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === 'signal' ? 'bg-primary/10 text-primary' : 'text-white/40 hover:text-white'}`}>{ICONS.SENSORS} <span className="text-xs font-bold uppercase tracking-wider">情报终端</span></button>
          <button onClick={() => setState(p => ({...p, activeView: 'finance'}))} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === 'finance' ? 'bg-primary/10 text-primary' : 'text-white/40 hover:text-white'}`}>{ICONS.WALLET} <span className="text-xs font-bold uppercase tracking-wider">财富信号</span></button>
          <button onClick={() => setState(p => ({...p, activeView: 'chat'}))} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === 'chat' ? 'bg-primary/10 text-primary' : 'text-white/40 hover:text-white'}`}>{ICONS.ROBOT} <span className="text-xs font-bold uppercase tracking-wider">AI 分析</span></button>
        </nav>
        <button onClick={() => setState(p => ({...p, activeView: 'settings'}))} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === 'settings' ? 'bg-primary/10 text-primary' : 'text-white/40 hover:text-white'}`}>{ICONS.SETTINGS} <span className="text-xs font-bold uppercase tracking-wider">设置</span></button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
                <span className="text-[10px] text-white/40 font-bold uppercase">Learning Status</span>
                <div className="flex items-center gap-2">
                   <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00f0f0]"></div>
                   <span className="text-[10px] font-mono text-primary/80 uppercase">Adapting to your feedback...</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-mono text-white/40 border border-white/10 px-3 py-1 rounded-full">MODE: DEEP SCAN</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-10 scanline-effect">
          {renderContent()}
        </main>
      </div>

      {state.detailSignal && (
        <DetailModal 
            signal={state.detailSignal} 
            onClose={() => setState(p => ({...p, detailSignal: null}))}
            onAskAI={() => setState(p => ({...p, selectedSignalId: state.detailSignal?.id, activeView: 'chat', detailSignal: null}))}
            onToggleLike={toggleLike}
        />
      )}
    </div>
  );
};

export default App;
