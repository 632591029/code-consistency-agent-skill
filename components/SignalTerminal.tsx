
import React from 'react';
import { Signal } from '../types';

interface SignalTerminalProps {
  signals: Signal[];
  onSelect: (signal: Signal) => void;
  onRefresh: () => void;
  onToggleLike: (id: string) => void;
}

const SignalTerminal: React.FC<SignalTerminalProps> = ({ signals, onSelect, onRefresh, onToggleLike }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-white/5 pb-8">
        <div>
           <div className="text-primary font-mono text-[10px] tracking-[0.5em] uppercase mb-2">Operational Interface</div>
           <h2 className="text-5xl font-black italic tracking-tighter">情报终端</h2>
        </div>
        <div className="flex gap-4">
           <button onClick={onRefresh} className="p-4 web3-card rounded-xl flex items-center justify-center hover:text-primary">
              <span className="material-symbols-outlined text-xl">refresh</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {signals.length === 0 ? (
          <div className="col-span-full py-40 text-center web3-card rounded-[40px] border-dashed border-white/10">
             <div className="text-slate-600 font-mono text-sm tracking-widest uppercase mb-4 italic">No Signal Detected in Memory</div>
             <button onClick={onRefresh} className="text-primary font-bold text-xs uppercase underline decoration-dashed underline-offset-8">Run Global Scan</button>
          </div>
        ) : (
          signals.map(signal => (
            <div 
              key={signal.id} 
              className="web3-card p-8 rounded-3xl cursor-pointer group relative overflow-hidden flex flex-col h-full"
              onClick={() => onSelect(signal)}
            >
              <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className="flex flex-col gap-1">
                    <div className="text-[10px] font-mono text-slate-600 uppercase">HASH: {signal.id.slice(0, 12)}</div>
                    <div className="flex items-center gap-2">
                       <span className="size-1.5 bg-primary rounded-full"></span>
                       <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{signal.type}</span>
                    </div>
                 </div>
                 <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs group-hover:border-primary/40 transition-colors">
                    {signal.importance}
                 </div>
              </div>

              <h3 className="text-2xl font-bold mb-4 leading-tight text-white group-hover:text-primary transition-colors italic pr-6">{signal.title}</h3>
              
              <p className="text-slate-400 text-sm line-clamp-2 mb-8 flex-1 font-light leading-relaxed">
                 {signal.summary}
              </p>

              <div className="pt-6 border-t border-white/5 mt-auto flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-slate-600 font-bold uppercase mb-1">Source Node</span>
                    <span className="text-xs font-bold text-slate-300">{signal.source}</span>
                 </div>
                 <span className="material-symbols-outlined text-slate-700 group-hover:translate-x-2 transition-transform text-primary/40">arrow_right_alt</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SignalTerminal;
