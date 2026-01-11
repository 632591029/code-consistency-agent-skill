
import React from 'react';
import { Signal, RiskLevel } from '../types';
import { ICONS } from '../constants';

interface FinanceTerminalProps {
  signals: Signal[];
  onSelect: (signal: Signal) => void;
  onRefresh: () => void;
}

const FinanceTerminal: React.FC<FinanceTerminalProps> = ({ signals, onSelect, onRefresh }) => {
  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.HIGH: return 'text-red-500';
      case RiskLevel.MEDIUM: return 'text-orange-500';
      case RiskLevel.LOW: return 'text-green-500';
      default: return 'text-white';
    }
  };

  const getRiskBg = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.HIGH: return 'bg-red-500/10 border-red-500/20';
      case RiskLevel.MEDIUM: return 'bg-orange-500/10 border-orange-500/20';
      case RiskLevel.LOW: return 'bg-green-500/10 border-green-500/20';
      default: return 'bg-white/5 border-white/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              理财终端 <span className="text-orange-500/60 font-light text-sm tracking-widest">FINANCE HUB</span>
           </h2>
        </div>
        <div className="flex gap-2">
            <button onClick={onRefresh} className="p-2 lg:px-4 lg:py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-xs font-bold hover:border-orange-500/30 transition-all">
                {ICONS.REFRESH} <span className="hidden lg:inline">更新行情</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {signals.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-white/10 rounded-3xl text-white/20 font-mono">
            等待金融信号解密中...
          </div>
        ) : (
          signals.map(signal => (
            <div 
              key={signal.id} 
              className="bg-accent/40 border border-white/5 rounded-3xl p-6 lg:p-8 hover:border-orange-500/20 transition-all group cursor-pointer"
              onClick={() => onSelect(signal)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${getRiskColor(signal.risk)}`}>
                      #{signal.id?.toUpperCase() || 'FIN'} • {signal.risk || 'UNKNOWN'} RISK
                  </span>
                  <h3 className="text-2xl font-black">{signal.title}</h3>
                </div>
                <div className="flex gap-1">
                   {[...Array(5)].map((_, i) => (
                      <div 
                          key={i} 
                          className={`w-2 h-6 rounded-sm ${i < (signal.importance || 0) / 20 ? 'bg-orange-500' : 'bg-white/5'}`}
                      ></div>
                   ))}
                </div>
              </div>

              <p className="text-white/40 text-sm leading-relaxed mb-6">
                 {signal.summary}
              </p>

              <div className={`p-4 rounded-2xl border ${getRiskBg(signal.risk)} mb-6`}>
                  <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-sm">psychology_alt</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">AI Decision Logic</span>
                  </div>
                  <p className="text-white text-sm font-bold">结论：{signal.meaning}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">
                    Capture: {signal.timestamp ? new Date(signal.timestamp).toLocaleTimeString() : 'Recent'}
                  </span>
                  <button className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest">
                      详情分析 {ICONS.ARROW_FORWARD}
                  </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FinanceTerminal;
