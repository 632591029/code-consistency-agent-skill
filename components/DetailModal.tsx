
import React from 'react';
import { Signal } from '../types';

interface DetailModalProps {
  signal: Signal;
  onClose: () => void;
  onAskAI: () => void;
  onToggleLike: (id: string) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ signal, onClose, onAskAI, onToggleLike }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full h-full bg-[#0B0F1A] lg:border border-white/10 lg:rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        <div className="scanline"></div>
        
        {/* Header */}
        <div className="px-10 py-10 border-b border-white/5 flex justify-between items-start shrink-0 relative bg-black/20">
           <div className="space-y-4 max-w-[80%]">
              <div className="flex items-center gap-4">
                 <div className="px-3 py-1 bg-primary/20 border border-primary/40 rounded text-[10px] font-bold text-primary uppercase tracking-widest">{signal.type}</div>
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest italic font-bold">Encrypted Archive #{signal.id.slice(-6)}</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-tight italic neon-text">{signal.title}</h2>
           </div>
           <button onClick={onClose} className="size-14 web3-card rounded-2xl flex items-center justify-center text-slate-500 hover:text-white group">
              <span className="material-symbols-outlined text-3xl group-rotate-90 transition-transform">close</span>
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
           <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
              
              {/* Main Content */}
              <div className="lg:col-span-8 p-12 lg:p-16 space-y-16">
                 <section className="space-y-8">
                    <div className="flex items-center gap-4 text-primary/40">
                       <span className="material-symbols-outlined">description</span>
                       <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] font-mono">Transmission_Details</h3>
                    </div>
                    <div className="text-slate-300 text-lg lg:text-xl font-light leading-relaxed whitespace-pre-wrap tracking-wide border-l-2 border-white/5 pl-10 italic">
                       {signal.fullContent}
                    </div>
                 </section>

                 <div className="web3-card p-10 rounded-[32px] bg-primary/5 border-primary/20 relative group">
                    <span className="material-symbols-outlined absolute -top-4 -left-4 text-4xl text-primary opacity-20">format_quote</span>
                    <h3 className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-6 font-mono font-bold">Strategic_Synthesis</h3>
                    <p className="text-2xl lg:text-4xl font-black text-white italic leading-[1.1]">“{signal.meaning}”</p>
                 </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 bg-black/40 p-12 lg:p-16 border-l border-white/5 space-y-12">
                 <div className="space-y-6">
                    <h4 className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] font-mono">Sentiment_Pulse</h4>
                    <div className="text-sm text-slate-400 leading-relaxed font-mono italic opacity-80">
                       {signal.communitySentiment}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] font-mono">Risk_Vector</h4>
                    <div className="flex items-center gap-4">
                       <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
                          <div className={`h-full rounded-full ${signal.risk === 'HIGH' ? 'bg-accent' : signal.risk === 'MEDIUM' ? 'bg-orange-500' : 'bg-primary'} shadow-[0_0_10px_rgba(0,240,255,0.5)]`} style={{width: signal.risk === 'HIGH' ? '90%' : signal.risk === 'MEDIUM' ? '50%' : '20%'}}></div>
                       </div>
                       <span className="text-xs font-black font-mono text-white italic">{signal.risk}</span>
                    </div>
                 </div>

                 <div className="pt-12 mt-12 border-t border-white/5 space-y-6">
                    <h4 className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] font-mono">Primary_Origin</h4>
                    <a href={signal.originalUrl} target="_blank" className="flex items-center justify-between p-6 web3-card rounded-2xl group">
                       <span className="text-xs font-bold text-primary truncate max-w-[200px]">{signal.source}</span>
                       <span className="material-symbols-outlined text-primary group-hover:rotate-45 transition-transform">north_east</span>
                    </a>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-10 border-t border-white/5 bg-black/40 flex flex-col lg:flex-row gap-6 items-center justify-between shrink-0">
           <div className="font-mono text-[9px] text-slate-600 flex gap-6">
              <span>STATUS: DECRYPTED</span>
              <span>VERIFICATION: GEMINI_FLASH_AUTO</span>
           </div>
           <button 
             onClick={onAskAI}
             className="h-16 px-12 glow-button rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4"
           >
              <span className="material-symbols-outlined">psychology_alt</span>
              <span>Request AI Evaluation</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
