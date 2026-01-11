
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
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              信号终端 <span className="text-primary/60 font-light text-sm tracking-widest">SIGNAL TERMINAL</span>
           </h2>
        </div>
        <div className="flex gap-2">
            <button onClick={onRefresh} className="p-2 lg:px-4 lg:py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-xs font-bold hover:border-primary/30 transition-all">
                {ICONS.REFRESH} <span className="hidden lg:inline">刷新</span>
            </button>
            <button className="p-2 lg:px-4 lg:py-2 bg-primary text-secondary rounded-xl flex items-center gap-2 text-xs font-black hover:scale-105 transition-all">
                {ICONS.DOCS} <span className="hidden lg:inline">生成今日报告</span>
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {signals.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-white/10 rounded-3xl text-white/20 font-mono">
            等待信号捕获中...
          </div>
        ) : (
          signals.map(signal => (
            <div 
              key={signal.id} 
              className="bg-accent/40 border border-white/5 rounded-3xl p-6 lg:p-8 hover:border-primary/20 transition-all group cursor-pointer relative overflow-hidden"
              onClick={() => onSelect(signal)}
            >
              {/* Importance Indicator */}
              <div className="absolute top-0 right-0 w-1.5 h-full bg-primary/20">
                 <div className="bg-primary w-full shadow-[0_0_10px_#00f0f0]" style={{ height: `${signal.importance || 0}%` }}></div>
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-primary/10 border border-primary/30 rounded text-[10px] font-bold text-primary tracking-widest">{signal.type}</span>
                  {signal.tags?.map(tag => (
                     <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-white/40">{tag}</span>
                  ))}
                </div>
                <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
                  Captured {signal.timestamp ? new Date(signal.timestamp).toLocaleTimeString() : 'Recent'}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{signal.title}</h3>
              
              <div className="bg-primary/5 rounded-2xl p-4 border-l-2 border-primary mb-6">
                 <p className="text-sm text-primary font-medium leading-relaxed">
                    <span className="opacity-40 uppercase text-[10px] mr-2">Meaning:</span>
                    {signal.meaning}
                 </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-white">
                          <span className="material-symbols-outlined text-sm">link</span> 来源: {signal.source}
                      </button>
                  </div>
                  <div className="flex gap-3">
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest">深挖细节</button>
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                          {ICONS.ROBOT} 问 AI
                      </button>
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
