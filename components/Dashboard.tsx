
import React, { useState, useEffect } from 'react';
import { Signal, SignalType } from '../types';
import { ICONS } from '../constants';
import { scheduleManager } from '../services/emailService';

interface DashboardProps {
  signals: Signal[];
  onNavigate: (view: any) => void;
  monitoredSources?: { twitters: string[], websites: string[] };
}

const Dashboard: React.FC<DashboardProps> = ({ signals, onNavigate, monitoredSources }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const signalCount = signals.filter(s => s.type !== SignalType.FINANCE).length;
  const financeCount = signals.filter(s => s.type === SignalType.FINANCE).length;
  const highRiskCount = signals.filter(s => s.risk === 'HIGH').length;

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = scheduleManager.getNextScanTime() - Date.now();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">系统控制台 <span className="text-primary/40 font-light">/ Dashboard</span></h1>
          <div className="h-px w-32 bg-primary"></div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-6">
           <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">距离下次全网扫描</span>
              <span className="text-lg font-mono text-primary font-bold">{timeLeft}</span>
           </div>
           <div className="w-px h-8 bg-white/10"></div>
           <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">下个简报推送</span>
              <span className="text-lg font-mono text-white/80 font-bold">09:00 AM</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Signal Card */}
        <div className="bg-accent/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 lg:p-10 flex flex-col group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden h-auto min-h-[420px]" onClick={() => onNavigate('signal')}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <span className="material-symbols-outlined text-[160px]">sensors</span>
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded text-primary text-[10px] font-bold tracking-wider uppercase">Deep Tech Scanner</span>
              <span className="text-white/20 text-[10px] font-mono">DevTools & Productivity</span>
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter">信息信号 <span className="text-white/30 font-light ml-2">Signal</span></h2>
            
            <div className="flex gap-12 mt-10 mb-8">
               <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">今日实时捕获</p>
                  <p className="text-5xl font-black text-primary neon-text">{signalCount.toString().padStart(2, '0')}</p>
               </div>
               <div className="w-px h-16 bg-white/5"></div>
               <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">关注来源</p>
                  <p className="text-5xl font-black text-white">{(monitoredSources?.twitters.length || 0) + (monitoredSources?.websites.length || 0)}</p>
               </div>
            </div>

            {/* Source Display Area */}
            <div className="bg-black/20 rounded-2xl p-4 border border-white/5 space-y-3">
               <p className="text-[9px] text-white/40 uppercase font-black tracking-widest border-b border-white/5 pb-2">当前监控名单 / Target List</p>
               <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2">
                  {monitoredSources?.twitters.map(t => (
                    <span key={t} className="text-[10px] bg-primary/5 text-primary/60 px-2 py-0.5 rounded border border-primary/10">@{t}</span>
                  ))}
                  {monitoredSources?.websites.map(w => (
                    <span key={w} className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded border border-white/10">{w}</span>
                  ))}
               </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-8">
            <p className="text-white/30 text-xs max-w-[240px]">Gemini 3 Pro 已聚焦于开发者工具更新、开源项目动态及生产力工具进化。</p>
            <button className="size-12 bg-primary text-secondary rounded-2xl flex items-center justify-center neon-glow group-hover:scale-110 transition-all">
                {ICONS.ARROW_FORWARD}
            </button>
          </div>
        </div>

        {/* Finance Card */}
        <div className="bg-accent/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 lg:p-10 flex flex-col group hover:border-risk-medium/30 transition-all cursor-pointer relative overflow-hidden h-auto min-h-[420px]" onClick={() => onNavigate('finance')}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <span className="material-symbols-outlined text-[160px]">account_balance_wallet</span>
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded text-orange-500 text-[10px] font-bold tracking-wider uppercase">Asset Sentinel</span>
              <span className="text-white/20 text-[10px] font-mono">Web3 & Finance Intelligence</span>
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter">理财信号 <span className="text-white/30 font-light ml-2">Finance</span></h2>
            
            <div className="flex gap-12 mt-10">
               <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">高危预警</p>
                  <p className="text-5xl font-black text-orange-500">{highRiskCount.toString().padStart(2, '0')}</p>
               </div>
               <div className="w-px h-16 bg-white/5"></div>
               <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">监控资产</p>
                  <p className="text-5xl font-black text-white">{financeCount.toString().padStart(2, '0')}</p>
               </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-8">
            <p className="text-white/30 text-xs max-w-[240px]">同样的逻辑，用在钱上。侧重于 Web3 投融资动态、代币技术性升级及链上风险。</p>
            <button className="size-12 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-secondary transition-all">
                {ICONS.ARROW_FORWARD}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
