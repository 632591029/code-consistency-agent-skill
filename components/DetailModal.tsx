
import React from 'react';
import { Signal, RiskLevel } from '../types';
import { ICONS } from '../constants';

interface DetailModalProps {
  signal: Signal;
  onClose: () => void;
  onAskAI: () => void;
  onToggleLike: (id: string) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ signal, onClose, onAskAI, onToggleLike }) => {
  if (typeof signal !== 'object' || !signal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center lg:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/95" onClick={onClose}></div>
      
      <div className="relative w-full h-full lg:h-auto lg:max-w-6xl lg:max-h-[95vh] bg-secondary lg:border border-slate-800 lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        
        {/* Header */}
        <div className="px-6 lg:px-10 py-8 border-b border-slate-800 flex justify-between items-start shrink-0 bg-slate-900/50">
           <div className="space-y-3 max-w-[85%]">
              <div className="flex items-center gap-3">
                 <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-bold text-primary uppercase tracking-widest">{signal.type}</div>
                 <span className="text-[10px] text-slate-500 font-mono">节点ID: {signal.id.slice(-8)}</span>
              </div>
              <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tight leading-tight italic">{signal.title}</h2>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => onToggleLike(signal.id)}
                className={`size-10 rounded-xl flex items-center justify-center border transition-all ${signal.liked ? 'bg-primary text-secondary border-primary shadow-[0_0_20px_#39FF14]' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
              >
                <span className="material-symbols-outlined text-xl">{signal.liked ? 'favorite' : 'favorite'}</span>
              </button>
              <button onClick={onClose} className="size-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-px bg-slate-800/50">
              
              {/* Main Body */}
              <div className="lg:col-span-8 bg-secondary p-8 lg:p-12 space-y-12">
                 <section className="space-y-6">
                    <div className="flex items-center gap-3 text-primary/60">
                       <span className="material-symbols-outlined text-sm">article</span>
                       <h3 className="text-[10px] font-bold uppercase tracking-[0.4em]">深度内参研报</h3>
                    </div>
                    <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed lg:prose-p:text-lg max-w-none">
                       <div className="whitespace-pre-wrap font-light tracking-wide">{signal.fullContent}</div>
                    </div>
                 </section>

                 <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/40"></div>
                    <h3 className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mb-4">AI 核心战略结论</h3>
                    <p className="text-xl lg:text-2xl font-bold text-white italic leading-snug">"{signal.meaning}"</p>
                 </section>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 bg-[#0B0F1A] p-8 lg:p-10 space-y-8">
                 <div className="space-y-4">
                    <h4 className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">社区回响</h4>
                    <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 text-xs lg:text-sm text-slate-400 leading-relaxed font-light italic">
                       {signal.communitySentiment}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">风险评估</h4>
                    <div className="flex items-center gap-3">
                       <div className={`h-2 flex-1 rounded-full ${signal.risk === 'HIGH' ? 'bg-risk-high' : signal.risk === 'MEDIUM' ? 'bg-risk-medium' : 'bg-risk-low'}`}></div>
                       <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{signal.risk}</span>
                    </div>
                 </div>

                 <div className="pt-8 mt-8 border-t border-slate-800 space-y-4">
                    <h4 className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">信息溯源</h4>
                    <a href={signal.originalUrl} target="_blank" className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl group hover:border-primary/40 transition-all">
                       <span className="text-[10px] font-bold text-slate-500 truncate max-w-[150px]">{signal.source}</span>
                       <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-1 transition-transform">north_east</span>
                    </a>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 lg:p-10 border-t border-slate-800 bg-[#0B0F1A] flex flex-col lg:flex-row gap-4 lg:items-center justify-between shrink-0">
           <div className="flex items-center gap-4 text-[10px] font-mono text-slate-600">
              <span>状态: 分析完成</span>
              <span className="hidden lg:inline">•</span>
              <span>核心验证: GEMINI_3.0</span>
           </div>
           <button 
             onClick={onAskAI}
             className="px-8 h-14 bg-primary text-secondary font-black rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-primary/10"
           >
              {ICONS.ROBOT} <span>咨询 AI 深度分析建议</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
