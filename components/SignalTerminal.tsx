
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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-10">
        <div>
           <h2 className="text-3xl font-black tracking-tighter text-white">情报内参 <span className="text-primary/40 font-light ml-2">/ Deep Insights</span></h2>
           <p className="text-[10px] text-white/30 font-mono mt-1 uppercase tracking-widest">Aggregate analysis of X, Reddit & GitHub commits</p>
        </div>
        <button onClick={onRefresh} className="px-5 py-2.5 bg-primary/10 border border-primary/30 rounded-2xl flex items-center gap-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all">
            {ICONS.REFRESH} <span>全网深度重扫</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {signals.length === 0 ? (
          <div className="p-20 text-center border border-dashed border-white/10 rounded-[3rem] text-white/20 font-mono">
            ALPHA 正在穿透各大社区，请稍候...
          </div>
        ) : (
          signals.map(signal => (
            <div 
              key={signal.id} 
              className="bg-accent/40 border border-white/5 rounded-[2.5rem] p-8 hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden"
              onClick={() => onSelect(signal)}
            >
              <div className="flex justify-between items-start mb-4">
                 <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary tracking-widest uppercase">{signal.type.replace('_', ' ')}</span>
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white/40 uppercase">#{signal.id}</span>
                 </div>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onToggleLike(signal.id); }}
                   className={`size-10 rounded-xl flex items-center justify-center border transition-all ${signal.liked ? 'bg-primary text-secondary border-primary shadow-[0_0_15px_#00f0f0]' : 'bg-white/5 border-white/10 text-white/20 hover:text-primary hover:border-primary/40'}`}
                 >
                    <span className="material-symbols-outlined text-lg">{signal.liked ? 'favorite' : 'favorite'}</span>
                 </button>
              </div>

              <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">{signal.title}</h3>
              
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-6">
                 <div className="flex items-center gap-2 mb-2 text-primary/60">
                    <span className="material-symbols-outlined text-sm">forum</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Community Sentiment / 社区反馈</span>
                 </div>
                 <p className="text-white/60 text-xs leading-relaxed italic">
                    {signal.communitySentiment || "暂无深度反馈数据。"}
                 </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/20 font-mono uppercase">Node: {signal.source}</span>
                 </div>
                 <div className="flex gap-3">
                    <span className="text-xs font-bold text-primary flex items-center gap-2">深度解析报告 {ICONS.ARROW_FORWARD}</span>
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
