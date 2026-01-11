
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-accent border border-white/10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-8 lg:p-12 border-b border-white/5 flex justify-between items-start bg-black/20">
           <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-lg text-[10px] font-black text-primary tracking-widest uppercase">{signal.type}</div>
                 <span className="text-white/20">/</span>
                 <span className="text-[10px] text-white/30 font-mono">CAPTURE_TS: {new Date(signal.timestamp).toLocaleString()}</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[1.1]">{signal.title}</h2>
           </div>
           <div className="flex gap-3">
              <button 
                onClick={() => onToggleLike(signal.id)}
                className={`size-14 rounded-2xl flex items-center justify-center border transition-all ${signal.liked ? 'bg-primary text-secondary border-primary shadow-[0_0_20px_#00f0f0]' : 'bg-white/5 border-white/10 text-white/40 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-2xl">{signal.liked ? 'favorite' : 'favorite'}</span>
              </button>
              <button onClick={onClose} className="size-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 space-y-12">
                 <section className="space-y-6">
                    <div className="flex items-center gap-3 text-primary/40">
                       <span className="material-symbols-outlined text-sm">article</span>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">ALPHA INTERNAL REPORT / 情报详报</h3>
                    </div>
                    <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-light max-w-none">
                       <div className="text-lg whitespace-pre-wrap">{signal.fullContent}</div>
                    </div>
                 </section>

                 <section className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><span className="material-symbols-outlined text-8xl">psychology</span></div>
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-6">Deep Meaning / AI 判断意义</h3>
                    <p className="text-2xl font-bold text-white leading-snug italic">"{signal.meaning}"</p>
                 </section>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-white/5 rounded-3xl p-8 space-y-6 border border-white/5">
                    <h4 className="text-[10px] text-white/30 font-black uppercase tracking-widest">Community Echo / 社区回响</h4>
                    <p className="text-sm text-white/60 leading-relaxed font-light">{signal.communitySentiment}</p>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] text-white/30 font-black uppercase tracking-widest">Metadata / 溯源</h4>
                    <a href={signal.originalUrl} target="_blank" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-primary/40 transition-all">
                       <span className="text-xs font-bold truncate max-w-[200px]">{signal.source}</span>
                       <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-1 transition-transform">open_in_new</span>
                    </a>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-white/5 bg-black/40 flex justify-end">
           <button 
             onClick={onAskAI}
             className="px-10 h-16 bg-primary text-secondary font-black rounded-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,240,240,0.3)]"
           >
              {ICONS.ROBOT} 咨询 AI 核心关于此信号的策略建议
           </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
