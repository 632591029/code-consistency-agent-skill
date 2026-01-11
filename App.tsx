
import React, { useState, useEffect, useCallback } from 'react';
import { SignalType, RiskLevel, Signal, AppState } from './types';
import { ICONS, SYSTEM_VERSION } from './constants';
import Dashboard from './components/Dashboard';
import SignalTerminal from './components/SignalTerminal';
import FinanceTerminal from './components/FinanceTerminal';
import Settings from './components/Settings';
import AIAssistant from './components/AIAssistant';
import DetailModal from './components/DetailModal';
import { signalEngine } from './services/signalEngine';

const CACHE_KEY = 'alpha_signals_cache';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    signals: [],
    loading: false,
    activeView: 'dashboard',
    detailSignal: null,
    monitoredSources: {
      twitters: ["SamA", "karpathy", "vitalik.eth", "guillermorauch", "miskohevery", "rowancheung", "paultoo", "levelsio", "tobi"],
      websites: ["GitHub Trends", "Reddit AI", "Product Hunt", "HuggingFace", "TechCrunch", "The Verge"]
    }
  });
  
  const getPreferences = () => {
    const liked = state.signals.filter(s => s.liked).map(s => s.title).join(', ');
    return liked ? `用户明确感兴趣的主题：${liked}` : "";
  };

  const loadFromCache = useCallback(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.length > 0) {
          const storedLikes = JSON.parse(localStorage.getItem('alpha_likes') || '[]');
          const enrichedData = parsed.map((s: any) => ({
            ...s,
            liked: storedLikes.includes(s.id)
          }));
          setState(prev => ({ ...prev, signals: enrichedData }));
          return true;
        }
      } catch (e) {
        console.error("缓存解析错误", e);
      }
    }
    return false;
  }, []);

  const fetchSignals = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const prefs = getPreferences();
      const data = await signalEngine.generateDailySignals(state.monitoredSources, prefs);
      
      const storedLikes = JSON.parse(localStorage.getItem('alpha_likes') || '[]');
      const enrichedData = data.map(s => ({
        ...s,
        liked: storedLikes.includes(s.id)
      }));
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      setState(prev => ({ ...prev, signals: enrichedData, loading: false }));
    } catch (e) {
      console.error("获取失败:", e);
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
    loadFromCache();
  }, [loadFromCache]);

  const renderContent = () => {
    // 优先级 1: 加载中状态
    if (state.loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-10">
          <div className="relative size-24 mb-6">
              <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-primary font-bold text-lg mb-1">正在生成深度信号...</h3>
            <p className="text-slate-500 text-sm">正在实时分析 X 和 GitHub 的硬核内容</p>
          </div>
        </div>
      );
    }

    // 优先级 2: 设置页面（即使没有数据也应该能进）
    if (state.activeView === 'settings') {
      return <Settings signals={state.signals} monitoredSources={state.monitoredSources} setMonitoredSources={s => setState(p => ({...p, monitoredSources: s}))} />;
    }

    // 优先级 3: AI 聊天
    if (state.activeView === 'chat') {
      return <AIAssistant selectedSignal={state.signals.find(s => s.id === state.selectedSignalId)} onClose={() => setState(p => ({...p, activeView: 'dashboard', selectedSignalId: undefined}))} />;
    }

    // 优先级 4: 检查数据是否存在
    if (state.signals.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-10 max-w-md mx-auto text-center">
          <div className="size-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-slate-500">
             <span className="material-symbols-outlined text-4xl">cloud_off</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">本地无缓存数据</h3>
          <p className="text-slate-400 text-sm mb-8">ALPHA 尚未执行今日扫描。数据只在您主动点击刷新时通过 AI 生成，以节省 Token。</p>
          <button 
            onClick={fetchSignals}
            className="w-full h-14 bg-primary text-slate-900 font-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            立即启动全网扫描
          </button>
        </div>
      );
    }

    // 优先级 5: 常规业务页面
    switch (state.activeView) {
      case 'dashboard': return <Dashboard signals={state.signals} onNavigate={v => setState(p => ({...p, activeView: v}))} monitoredSources={state.monitoredSources} />;
      case 'signal': return <SignalTerminal signals={state.signals.filter(s => s.type !== SignalType.FINANCE)} onSelect={s => setState(p => ({...p, detailSignal: s}))} onRefresh={fetchSignals} onToggleLike={toggleLike} />;
      case 'finance': return <FinanceTerminal signals={state.signals.filter(s => s.type === SignalType.FINANCE)} onSelect={s => setState(p => ({...p, detailSignal: s}))} onRefresh={fetchSignals} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] overflow-hidden relative font-display text-slate-100">
      {/* 侧边栏 - 桌面端 */}
      <aside className="hidden lg:flex w-64 border-r border-slate-800 flex-col p-6 bg-[#0B0F1A]">
        <div className="mb-10 flex items-center gap-3">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
            <span className="material-symbols-outlined font-bold">hub</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">ALPHA</h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{SYSTEM_VERSION}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            { id: 'dashboard', icon: 'grid_view', label: '控制台' },
            { id: 'signal', icon: 'sensors', label: '情报终端' },
            { id: 'finance', icon: 'show_chart', label: '财富信号' },
            { id: 'chat', icon: 'psychology', label: 'AI 分析' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setState(p => ({...p, activeView: item.id as any}))} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === item.id ? 'bg-primary/10 text-primary font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}
            >
              <span className={`material-symbols-outlined text-xl ${state.activeView === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <button 
          onClick={() => setState(p => ({...p, activeView: 'settings'}))} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mt-auto ${state.activeView === 'settings' ? 'bg-primary/10 text-primary font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="text-sm">节点配置</span>
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md shrink-0 z-10">
          <div className="flex items-center gap-4">
             <div className="lg:hidden size-9 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary">hub</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">ALPHA 信号引擎</span>
                <div className="flex items-center gap-1.5">
                   <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
                   <span className="text-[10px] font-mono text-primary/80">引擎待命</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             {state.signals.length > 0 && (
                <button 
                  onClick={fetchSignals} 
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] hover:bg-slate-700 transition-all border border-slate-700"
                >
                  <span className="material-symbols-outlined text-xs">refresh</span>
                  手动刷新数据
                </button>
             )}
             <div className="text-[10px] font-mono text-slate-600 bg-slate-800/50 px-3 py-1 rounded-full uppercase">V4.2 Stealth</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar bg-[#020617]">
          {renderContent()}
        </main>
        
        {/* 移动端导航 */}
        <nav className="lg:hidden flex border-t border-slate-800 bg-[#0B0F1A] px-2 py-2 shrink-0 pb-safe">
           {[
            { id: 'dashboard', icon: 'grid_view', label: '控制台' },
            { id: 'signal', icon: 'sensors', label: '终端' },
            { id: 'finance', icon: 'show_chart', label: '财富' },
            { id: 'chat', icon: 'psychology', label: '分析' },
            { id: 'settings', icon: 'settings', label: '设置' }
           ].map(item => (
             <button key={item.id} onClick={() => setState(p => ({...p, activeView: item.id as any}))} className={`flex-1 flex flex-col items-center py-2 transition-colors ${state.activeView === item.id ? 'text-primary' : 'text-slate-500'}`}>
                <span className={`material-symbols-outlined text-2xl ${state.activeView === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
                <span className="text-[10px] mt-1">{item.label}</span>
             </button>
           ))}
        </nav>
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
