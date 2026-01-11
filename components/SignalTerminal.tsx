
import React from 'react';
import { Signal, SignalType } from '../types';
import { ICONS } from '../constants';

interface SignalTerminalProps {
  signals: Signal[];
  onSelect: (signal: Signal) => void;
  onRefresh: () => void;
}

const SignalTerminal: React.FC<SignalTerminalProps> = ({ signals, onSelect, onRefresh }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
           <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              聚合信号终端 <span className="text-primary/60 font-light text-sm tracking-widest">INTELLIGENCE TERMINAL</span>
           </h2>
           <p className="text-[10px] text-white/30 font-mono mt-1 uppercase tracking-widest">Multidimensional synthesis from 20+ sources</p>
        </div>
        <div className="flex gap-2">
            <button onClick={onRefresh} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-xs font-bold hover:border-primary/30 transition-all">
                {ICONS.REFRESH} <span>全网重新扫描</span>
            </button>
        </div>
      </div>

      <div className="space-y-6">
        {signals.length === 0 || (signals.length === 1 && signals[0].id === 'SYS-BOOT-001') ? (
          <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-[3rem] space-y-4 bg-white/[0.02]">
            <div className="size-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/40 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">正在执行多维数据聚合中...</p>
          </div>
        ) : (
          signals.map(signal => (
            <div 
              key={signal.id} 
              className="bg-accent/40 border border-white/5 rounded-[2rem] p-6 lg:p-8 hover:border-primary/20 transition-all group cursor-pointer relative overflow-hidden flex flex-col md:flex-row gap-6"
              onClick={() => onSelect(signal)}
            >
              {/* Importance Sidebar */}
              <div className="hidden md:flex flex-col items-center justify-center w-12 shrink-0 border-r border-white/5 pr-6">
                 <span className="text-[10px] text-white/20 font-black uppercase vertical-text tracking-widest mb-4">Importance</span>
                 <div className="w-1.5 flex-1 bg-white/5 rounded-full overflow-hidden flex flex-col justify-end">
                    <div className="bg-primary shadow-[0_0_15px_#00f0f0]" style={{ height: `${signal.importance || 0}%` }}></div>
                 </div>
                 <span className="text-xs font-mono font-bold text-primary mt-4">{signal.importance}</span>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-primary/10 border border-primary/30 rounded text-[9px] font-black text-primary tracking-widest uppercase">{signal.type.replace('_', ' ')}</span>
                    {signal.tags?.slice(0, 3).map(tag => (
                       <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-white/40 uppercase">#{tag}</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
                    Captured {new Date(signal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">{signal.title}</h3>
                
                <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                    {signal.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="size-6 bg-white/5 rounded-full flex items-center justify-center">
                           <span className="material-symbols-outlined text-[12px] text-primary">hub</span>
                        </div>
                        <span className="text-[10px] font-bold text-white/40 truncate max-w-[200px]">聚合源: {signal.source}</span>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                           {ICONS.EXPLORE} 深度解析
                        </button>
                        <button className="size-10 bg-primary/20 text-primary border border-primary/20 rounded-xl flex items-center justify-center hover:bg-primary hover:text-secondary transition-all">
                           <span className="material-symbols-outlined text-sm">smart_toy</span>
                        </button>
                    </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SignalTerminal;
