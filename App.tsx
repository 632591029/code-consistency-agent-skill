
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
      websites: ["GitHub Trends", "Product Hunt", "The Block", "OpenAI Blog"]
    }
  });
  const [lastEmailSent, setLastEmailSent] = useState<string | null>(null);
  const signalsRef = useRef<Signal[]>([]);

  // 同步 ref，用于定时任务闭包中获取最新数据
  useEffect(() => {
    signalsRef.current = state.signals;
  }, [state.signals]);

  const fetchSignals = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const data = await signalEngine.generateDailySignals(state.monitoredSources);
      setState(prev => ({ ...prev, signals: data, loading: false }));
    } catch (e) {
      console.error("Fetch failed", e);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.monitoredSources]);

  useEffect(() => {
    fetchSignals();
    // 6小时刷新一次数据
    const scanInterval = setInterval(fetchSignals, 1000 * 60 * 60 * 6); 
    
    // 每日 9 点推送逻辑
    const emailChecker = setInterval(async () => {
        const now = new Date();
        if (now.getHours() === 9 && now.getMinutes() === 0) {
            console.log("[ALPHA System] Sending scheduled briefing from cached signals...");
            await emailService.sendDailyBriefing(MOCK_EMAILS[0], signalsRef.current);
            setLastEmailSent(new Date().toLocaleTimeString());
        }
    }, 60000);

    return () => { clearInterval(scanInterval); clearInterval(emailChecker); };
  }, [fetchSignals]);

  const setView = (view: AppState['activeView']) => setState(prev => ({ ...prev, activeView: view }));
  
  const showDetail = (signal: Signal) => {
    setState(prev => ({ ...prev, detailSignal: signal }));
  };

  const askAI = (signalId: string) => {
    setState(prev => ({ 
        ...prev, 
        selectedSignalId: signalId,
        activeView: 'chat',
        detailSignal: null 
    }));
  };

  const renderContent = () => {
    if (state.loading && state.signals.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
              <div className="size-32 border border-primary/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 size-32 border-t-2 border-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="material-symbols-outlined text-primary text-4xl animate-bounce">language</span>
              </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-primary font-mono tracking-[0.3em] text-xs uppercase">ALPHA Meaning Engine v4</p>
            <p className="text-white/20 text-[10px] font-mono uppercase">Scanning DevTools, GitHub, & Web3 Finance</p>
          </div>
        </div>
      );
    }

    switch (state.activeView) {
      case 'dashboard': return <Dashboard signals={state.signals} onNavigate={setView} monitoredSources={state.monitoredSources} />;
      case 'signal': return <SignalTerminal signals={state.signals.filter(s => s.type !== SignalType.FINANCE)} onSelect={showDetail} onRefresh={fetchSignals} />;
      case 'finance': return <FinanceTerminal signals={state.signals.filter(s => s.type === SignalType.FINANCE)} onSelect={showDetail} onRefresh={fetchSignals} />;
      case 'settings': return (
        <Settings 
          signals={state.signals} 
          monitoredSources={state.monitoredSources} 
          setMonitoredSources={(sources) => setState(prev => ({...prev, monitoredSources: sources}))} 
        />
      );
      case 'chat': return <AIAssistant selectedSignal={state.signals.find(s => s.id === state.selectedSignalId)} />;
      default: return <Dashboard signals={state.signals} onNavigate={setView} monitoredSources={state.monitoredSources} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-secondary overflow-hidden relative">
      <aside className="hidden lg:flex w-64 border-r border-white/5 flex-col p-6 bg-black/20">
        <div className="mb-10 flex items-center gap-3" onClick={() => setView('dashboard')}>
          <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/40 neon-glow cursor-pointer">
            <span className="material-symbols-outlined text-primary">hub</span>
          </div>
          <div className="cursor-pointer">
            <h1 className="text-lg font-black tracking-tighter">ALPHA</h1>
            <p className="text-[10px] text-primary/60 font-mono uppercase tracking-widest">{SYSTEM_VERSION}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === 'dashboard' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{ICONS.DASHBOARD} <span className="text-sm font-bold uppercase tracking-wider">控制台</span></button>
          <button onClick={() => setView('signal')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === 'signal' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{ICONS.SENSORS} <span className="text-sm font-bold uppercase tracking-wider">信号流</span></button>
          <button onClick={() => setView('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === 'finance' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{ICONS.WALLET} <span className="text-sm font-bold uppercase tracking-wider">理财信号</span></button>
          <button onClick={() => setView('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === 'chat' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{ICONS.ROBOT} <span className="text-sm font-bold uppercase tracking-wider">AI 助手</span></button>
        </nav>
        <div className="mt-auto">
          <button onClick={() => setView('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.activeView === 'settings' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{ICONS.SETTINGS} <span className="text-sm font-bold uppercase tracking-wider">设置</span></button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative min-w-0">
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
          <div className="flex lg:hidden items-center gap-2"><span className="text-primary font-black tracking-tighter text-xl">ALPHA</span></div>
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 font-bold uppercase">Scanner Status</span>
              <div className="flex items-center gap-2">
                <div className={`size-2 rounded-full ${state.loading ? 'bg-yellow-500 animate-pulse' : 'bg-primary shadow-[0_0_8px_#00f0f0]'}`}></div>
                <span className="text-xs font-mono text-primary/80 uppercase">{state.loading ? 'Scanning...' : 'Online'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {lastEmailSent && <span className="hidden md:inline text-[9px] text-primary/60 font-mono border border-primary/20 px-2 py-1 rounded">Last Email Sent: {lastEmailSent}</span>}
             <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/632591029/100/100" className="opacity-70" alt="user" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scanline-effect p-4 lg:p-10">
          {renderContent()}
        </main>
      </div>

      {state.detailSignal && (
        <DetailModal 
            signal={state.detailSignal} 
            onClose={() => setState(prev => ({ ...prev, detailSignal: null }))}
            onAskAI={() => askAI(state.detailSignal!.id)}
        />
      )}
    </div>
  );
};

export default App;
