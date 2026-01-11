
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
      const nextTime = scheduleManager.getNextScanTime();
      const diff = nextTime - Date.now();
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
          <h1 className="text-4xl font-black tracking-tight mb-2">情报中心 <span className="text-primary/40 font-light">/ Command Center</span></h1>
          <p className="text-white/30 text-xs uppercase tracking-widest font-mono">Real-time AI/Web3 Community Penetration</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-8">
           <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">距离下一波推送</span>
              <span className="text-2xl font-mono text-primary font-black drop-shadow-[0_0_8px_rgba(0,240,240,0.5)]">{timeLeft}</span>
           </div>
           <div className="w-px h-10 bg-white/10"></div>
           <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">固定调度时间</span>
              <div className="flex gap-2 mt-1">
                 {scheduleManager.getScheduleLabels().map(label => (
                   <span key={label} className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono text-white/60">{label}</span>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Signal Card */}
        <div className="bg-accent/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 flex flex-col group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden h-auto min-h-[450px]" onClick={() => onNavigate('signal')}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <span className="material-symbols-outlined text-[180px]">hub</span>
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-primary text-secondary rounded text-[10px] font-black tracking-wider uppercase">DEEP SCAN ACTIVE</span>
              <span className="text-white/20 text-[10px] font-mono tracking-widest">X-THREADS / REDDIT / GITHUB</span>
            </div>
            <h2 className="text-4xl font-black mb-6 tracking-tighter">聚合信号 <span className="text-white/20 font-light block text-lg tracking-normal mt-1">AI Productivity & Innovation</span></h2>
            
            <div className="flex gap-16 mb-10">
               <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase tracking-widest mb-2">已提炼情报</span>
                  <span className="text-6xl font-black text-primary neon-text leading-none">{signalCount}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase tracking-widest mb-2">活跃节点</span>
                  <span className="text-6xl font-black text-white leading-none">{(monitoredSources?.twitters.length || 0)}</span>
               </div>
            </div>

            <div className="bg-black/40 rounded-3xl p-5 border border-white/5 space-y-4">
               <div className="flex justify-between items-center">
                  <p className="text-[10px] text-primary/60 uppercase font-black tracking-widest">当前扫描偏好</p>
                  <span className="text-[9px] text-white/20 uppercase font-mono tracking-tighter">Dynamic adaptation on</span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {monitoredSources?.twitters.slice(0, 5).map(t => (
                    <span key={t} className="text-[10px] bg-white/5 text-white/50 px-3 py-1 rounded-full border border-white/10 hover:border-primary/40 transition-colors">@{t}</span>
                  ))}
               </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-10">
            <p className="text-white/30 text-xs leading-relaxed max-w-[280px]">
               基于您的反馈，引擎当前优先检索【真实生产力工具实践】与【早期 Web3 异动】。
            </p>
            <div className="size-14 bg-primary text-secondary rounded-2xl flex items-center justify-center neon-glow group-hover:rotate-45 transition-all">
                {ICONS.ARROW_FORWARD}
            </div>
          </div>
        </div>

        {/* Finance Card */}
        <div className="bg-accent/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 flex flex-col group hover:border-risk-medium/30 transition-all cursor-pointer relative overflow-hidden h-auto min-h-[450px]" onClick={() => onNavigate('finance')}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <span className="material-symbols-outlined text-[180px]">monitoring</span>
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded text-orange-500 text-[10px] font-black tracking-wider uppercase">Alpha Hunter</span>
            </div>
            <h2 className="text-4xl font-black mb-6 tracking-tighter">理财预警 <span className="text-white/20 font-light block text-lg tracking-normal mt-1">Web3 & Asset Security</span></h2>
            
            <div className="flex gap-16">
               <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase tracking-widest mb-2">高危情报</span>
                  <span className="text-6xl font-black text-orange-500 leading-none">{highRiskCount}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase tracking-widest mb-2">监控广度</span>
                  <span className="text-6xl font-black text-white leading-none">{financeCount}</span>
               </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-10">
            <p className="text-white/30 text-xs leading-relaxed max-w-[280px]">
               同样的逻辑用在资产。侧重早期投融资、技术升级诱发的泵感，以及潜在的安全风险穿透。
            </p>
            <div className="size-14 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all">
                {ICONS.ARROW_FORWARD}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
