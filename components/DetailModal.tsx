
import React from 'react';
import { Signal, RiskLevel } from '../types';
import { ICONS } from '../constants';

interface DetailModalProps {
  signal: Signal;
  onClose: () => void;
  onAskAI: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ signal, onClose, onAskAI }) => {
  // 安全性检查：如果 signal 是字符串（说明 App.tsx 传递有误）或 null，直接返回
  if (typeof signal !== 'object' || !signal) {
    return null;
  }

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.HIGH: return 'text-red-500';
      case RiskLevel.MEDIUM: return 'text-orange-500';
      case RiskLevel.LOW: return 'text-green-500';
      default: return 'text-primary';
    }
  };

  // 格式化时间戳，增加 fallback
  const formattedDate = signal.timestamp 
    ? new Date(signal.timestamp).toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    : '未知抓取时间';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-accent border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="p-8 lg:p-10 border-b border-white/5 flex justify-between items-start bg-black/20">
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getRiskColor(signal.risk).replace('text-', 'border-').replace('500', '500/30')} ${getRiskColor(signal.risk).replace('text-', 'bg-').replace('500', '500/10')}`}>
                    {signal.risk || 'LOW'} RISK
                 </div>
                 <span className="text-white/20">/</span>
                 <span className="text-[10px] text-primary/60 font-mono font-bold uppercase tracking-widest">Capture ID: {signal.id}</span>
                 <span className="text-white/20">/</span>
                 <div className="flex gap-1">
                    {signal.tags?.map(t => <span key={t} className="text-[9px] bg-white/5 text-white/40 px-2 py-0.5 rounded font-bold uppercase">{t}</span>)}
                 </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black leading-tight tracking-tighter text-white neon-text">{signal.title}</h2>
           </div>
           <button onClick={onClose} className="size-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white group">
              <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
           </button>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 bg-gradient-to-b from-transparent to-black/20">
           
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Main Content */}
              <div className="lg:col-span-8 space-y-10">
                 <section className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                       <span className="material-symbols-outlined text-sm">subject</span>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">深度研报 / Deep Analysis</h3>
                    </div>
                    <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap font-light border-l border-white/5 pl-6">
                       {signal.fullContent || signal.summary || "正在解密深度内容，请稍后..."}
                    </div>
                 </section>

                 <section className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                       <span className="material-symbols-outlined text-sm">psychology</span>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">AI 判定意义 / Impact</h3>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                          <span className="material-symbols-outlined text-4xl">lightbulb</span>
                       </div>
                       <p className="text-primary font-bold italic text-lg leading-relaxed relative z-10">
                          "{signal.meaning}"
                       </p>
                    </div>
                 </section>
              </div>

              {/* Right Column: Metadata & Links */}
              <div className="lg:col-span-4 space-y-8">
                 
                 {/* Links List */}
                 <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 space-y-6">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] text-white/30 font-black uppercase tracking-widest">参考资料 / Sources</h4>
                       <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">{(signal.references?.length || 0) + (signal.originalUrl ? 1 : 0)} Links</span>
                    </div>
                    
                    <div className="space-y-3">
                       {/* Primary Source */}
                       {signal.originalUrl && (
                         <a href={signal.originalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/40 transition-all group">
                            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                               <span className="material-symbols-outlined text-sm">link</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-[10px] text-white/40 uppercase font-black tracking-tighter">主要来源 / Primary</p>
                               <p className="text-xs font-bold truncate text-white/80 group-hover:text-primary">{signal.source || "点击跳转"}</p>
                            </div>
                            <span className="material-symbols-outlined text-sm text-white/20">open_in_new</span>
                         </a>
                       )}

                       {/* Reference Links */}
                       {signal.references?.map((ref, idx) => (
                          <a key={idx} href={ref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/20 transition-all group">
                             <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                                <span className="material-symbols-outlined text-sm">
                                   {ref.includes('twitter.com') || ref.includes('x.com') ? 'share' : 'description'}
                                </span>
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-[9px] text-white/30 uppercase font-bold">参考资料 {idx + 1}</p>
                                <p className="text-[10px] font-mono truncate text-white/50 group-hover:text-white">{ref}</p>
                             </div>
                             <span className="material-symbols-outlined text-[12px] text-white/10">open_in_new</span>
                          </a>
                       ))}
                       
                       {(!signal.originalUrl && (!signal.references || signal.references.length === 0)) && (
                          <p className="text-center py-4 text-[10px] text-white/20 font-mono italic">未捕获到关联链接</p>
                       )}
                    </div>
                 </div>

                 {/* System Metrics */}
                 <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 space-y-4">
                    <h4 className="text-[10px] text-white/30 font-black uppercase tracking-widest">情报权重 / Metrics</h4>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[10px] text-white/40 mb-1 uppercase font-bold">重要程度 Importance</p>
                          <div className="flex items-center gap-2">
                             <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary shadow-[0_0_8px_#00f0f0]" style={{ width: `${signal.importance || 0}%` }}></div>
                             </div>
                             <span className="text-xs font-mono font-bold text-primary">{signal.importance || 0}</span>
                          </div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        </div>

        {/* Footer Actions Section */}
        <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-white/30">
                  <span className="material-symbols-outlined text-sm">history</span>
                  <span className="text-[10px] uppercase font-mono tracking-widest">抓取时间: {formattedDate}</span>
               </div>
               <div className="size-1 w-1 rounded-full bg-white/10"></div>
               <div className="flex items-center gap-2 text-white/30">
                  <span className="material-symbols-outlined text-sm">database</span>
                  <span className="text-[10px] uppercase font-mono tracking-widest">来源节点: {signal.source || 'ALPHA-NODE'}</span>
               </div>
            </div>
            
            <div className="flex gap-4">
               <button 
                  onClick={onAskAI}
                  className="px-8 h-14 bg-primary text-secondary font-black rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,240,240,0.2)]"
               >
                  {ICONS.ROBOT} 咨询 AI 核心深度研报
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
