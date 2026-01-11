
import React from 'react';
import { Signal, SignalType } from '../types';

interface DashboardProps {
  signals: Signal[];
  onNavigate: (view: any) => void;
  monitoredSources?: { twitters: string[], websites: string[] };
}

const Dashboard: React.FC<DashboardProps> = ({ signals, onNavigate, monitoredSources }) => {
  const highRiskCount = signals.filter(s => s.risk === 'HIGH').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 lg:px-0 animate-in fade-in duration-500">
      {/* 顶部统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '捕捉信号总数', val: signals.length, icon: 'radar', color: 'text-primary' },
          { label: '活跃监控节点', val: (monitoredSources?.twitters.length || 0), icon: 'sensors', color: 'text-slate-400' },
          { label: '高危预警', val: highRiskCount, icon: 'warning', color: 'text-red-500' },
          { label: '引擎状态', val: '待命', icon: 'bolt', color: 'text-primary' }
        ].map((stat, i) => (
          <div key={i} className="glass p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
            <span className={`material-symbols-outlined absolute -right-2 -bottom-2 text-7xl opacity-5 ${stat.color}`}>{stat.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
            <span className={`text-3xl font-black ${stat.color}`}>{stat.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 情报入口 */}
        <div 
          onClick={() => onNavigate('signal')}
          className="lg:col-span-2 group relative p-10 rounded-3xl overflow-hidden cursor-pointer transition-all border border-slate-800 hover:border-primary/30 bg-slate-900/50"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-[2px] w-8 bg-primary/40"></div>
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">DEEP SCAN ACTIVE</span>
            </div>
            <h2 className="text-5xl font-black mb-4 tracking-tighter leading-[1.1] text-white">
              实时社区<br/><span className="text-primary italic">深度情报</span>
            </h2>
            <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-12">
              ALPHA 正在穿透 X 和开发者社区，为您提取具备【真实落地价值】的硬核实践案例，而非无用的新闻。
            </p>
            <div className="mt-auto flex items-center justify-end">
              <div className="flex items-center gap-4 group-hover:gap-6 transition-all">
                <span className="text-xs font-black uppercase tracking-widest text-primary">进入终端</span>
                <span className="material-symbols-outlined text-primary text-2xl">arrow_right_alt</span>
              </div>
            </div>
          </div>
        </div>

        {/* 财富入口 */}
        <div 
          onClick={() => onNavigate('finance')}
          className="group relative p-10 rounded-3xl overflow-hidden cursor-pointer transition-all border border-slate-800 bg-slate-900/30 hover:bg-slate-800/50"
        >
          <div className="flex flex-col h-full relative z-10">
            <div className="size-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 mb-10">
               <span className="material-symbols-outlined text-3xl text-amber-500">monitoring</span>
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-4 italic text-white">财富<br/>探测器</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              资产异动、跨链流向与安全预警。AI 引擎实时对资产安全性进行审查。
            </p>
            <div className="mt-auto text-right">
              <span className="material-symbols-outlined text-slate-700 group-hover:text-amber-500 transition-colors">trending_up</span>
            </div>
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="glass rounded-2xl p-6 flex items-center justify-between border-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="size-2 rounded-full bg-primary animate-pulse"></div>
          <p className="text-xs font-medium text-slate-400">系统提示：<span className="text-slate-200">引擎目前已通过 Gemini 加固，确保信号去噪率 > 99%</span></p>
        </div>
        <button onClick={() => onNavigate('settings')} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300">配置监控节点</button>
      </div>
    </div>
  );
};

export default Dashboard;
