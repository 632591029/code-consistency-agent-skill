
import React from 'react';
import { Signal, SignalType } from '../types';
import { ICONS } from '../constants';

interface SignalTerminalProps {
  signals: Signal[];
  onSelect: (signal: Signal) => void;
  onRefresh: () => void;
  onToggleLike: (id: string) => void;
}

const SignalTerminal: React.FC<SignalTerminalProps> = ({ signals, onSelect, onRefresh, onToggleLike }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8 sticky top-0 z-20 bg-[#020617]/80 backdrop-blur py-4 -mx-4 px-4 border-b border-slate-800">
        <div>
           <h2 className="text-2xl font-black tracking-tight text-white italic">情报终端</h2>
           <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">正在处理 20 个实时社区节点</p>
        </div>
        <button 
          onClick={onRefresh} 
          className="h-10 px-5 bg-primary text-secondary rounded-xl flex items-center gap-2 text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-primary/10"
        >
            <span className="material-symbols-outlined text-sm">refresh</span> 
            <span>全网扫描</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {signals.map(signal => (
          <div 
            key={signal.id} 
            className="group glass border border-slate-800 rounded-2xl p-6 hover:border-primary/20 transition-all cursor-pointer relative flex flex-col h-full"
            onClick={() => onSelect(signal)}
          >
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20 uppercase tracking-tight">{signal.type}</span>
                  <span className="text-[10px] font-mono text-slate-600 uppercase">#{signal.id.slice(-4)}</span>
               </div>
               <button 
                 onClick={(e) => { e.stopPropagation(); onToggleLike(signal.id); }}
                 className={`size-8 rounded-lg flex items-center justify-center border transition-all ${signal.liked ? 'bg-primary text-secondary border-primary shadow-[0_0_10px_#39FF14]' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-primary'}`}
               >
                  <span className="material-symbols-outlined text-lg">favorite</span>
               </button>
            </div>

            <h3 className="text-xl font-bold mb-4 leading-snug group-hover:text-primary transition-colors pr-4">{signal.title}</h3>
            
            <p className="text-slate-400 text-xs line-clamp-2 mb-6 flex-1 font-light">
               {signal.summary}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50 mt-auto">
               <div>
                  <span className="text-[9px] text-slate-600 font-bold uppercase block mb-1">来源节点</span>
                  <span className="text-[11px] font-bold text-slate-400 truncate block">{signal.source}</span>
               </div>
               <div className="text-right">
                  <span className="text-[9px] text-slate-600 font-bold uppercase block mb-1">相关性评分</span>
                  <div className="flex justify-end gap-0.5">
                     {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-3 h-1 rounded-full ${i < (signal.importance || 0) / 20 ? 'bg-primary' : 'bg-slate-800'}`}></div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignalTerminal;
