
import React, { useState } from 'react';
import { MOCK_EMAILS } from '../constants';
import { emailService } from '../services/emailService';
import { Signal } from '../types';

interface SettingsProps {
  signals: Signal[];
  monitoredSources: { twitters: string[], websites: string[] };
  setMonitoredSources: (sources: { twitters: string[], websites: string[] }) => void;
}

const Settings: React.FC<SettingsProps> = ({ signals, monitoredSources, setMonitoredSources }) => {
  const [email, setEmail] = useState(MOCK_EMAILS[0]);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  
  const [newTwitter, setNewTwitter] = useState("");
  const [newWeb, setNewWeb] = useState("");

  const addTwitter = () => {
    if (!newTwitter) return;
    setMonitoredSources({ ...monitoredSources, twitters: [...monitoredSources.twitters, newTwitter] });
    setNewTwitter("");
  };

  const addWeb = () => {
    if (!newWeb) return;
    setMonitoredSources({ ...monitoredSources, websites: [...monitoredSources.websites, newWeb] });
    setNewWeb("");
  };

  const removeSource = (type: 'twitters' | 'websites', item: string) => {
    setMonitoredSources({
      ...monitoredSources,
      [type]: monitoredSources[type].filter(i => i !== item)
    });
  };

  const handleSendTest = async () => {
    if (signals.length === 0) {
      setTestStatus("当前未捕获到任何信号，请先刷新信号流。");
      setTimeout(() => setTestStatus(null), 3000);
      return;
    }

    setIsSendingTest(true);
    setTestStatus("正在封装当前内存中的信号包...");
    try {
      // 关键改进：不再执行 slow fetch，直接发送当前已有的 signals
      await emailService.sendDailyBriefing(email, signals);
      setTestStatus("测试简报已成功发送至: " + email);
    } catch (e) {
      setTestStatus("邮件发送失败，请检查 SMTP 网关配置。");
    } finally {
      setIsSendingTest(false);
      setTimeout(() => setTestStatus(null), 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 uppercase text-white neon-text">系统偏好配置</h2>
          <p className="text-white/40 text-sm font-light">管理 ALPHA 的抓取节点与自动化推送策略。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Source Management */}
          <section className="bg-accent/40 border border-white/5 rounded-[2rem] p-8 space-y-8">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">data_object</span>
                <h3 className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Source Management / 监控源管理</h3>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className="text-xs text-white/40 block mb-2 font-bold uppercase">推特大 V / Twitter Handles</label>
                   <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        placeholder="输入推特用户名 (如 SamA)..." 
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary/50 transition-all text-white"
                        value={newTwitter}
                        onChange={e => setNewTwitter(e.target.value)}
                      />
                      <button onClick={addTwitter} className="px-4 bg-primary text-secondary rounded-xl font-bold text-xs uppercase hover:scale-105 transition-all">添加</button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {monitoredSources.twitters.map(item => (
                         <span key={item} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] flex items-center gap-2 group">
                            @{item}
                            <button onClick={() => removeSource('twitters', item)} className="material-symbols-outlined text-[10px] text-white/20 hover:text-red-500">close</button>
                         </span>
                      ))}
                   </div>
                </div>

                <div>
                   <label className="text-xs text-white/40 block mb-2 font-bold uppercase">重点网站 / Websites</label>
                   <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        placeholder="输入网站地址 (如 TechCrunch.com)..." 
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary/50 transition-all text-white"
                        value={newWeb}
                        onChange={e => setNewWeb(e.target.value)}
                      />
                      <button onClick={addWeb} className="px-4 bg-primary text-secondary rounded-xl font-bold text-xs uppercase hover:scale-105 transition-all">添加</button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {monitoredSources.websites.map(item => (
                         <span key={item} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] flex items-center gap-2">
                            {item}
                            <button onClick={() => removeSource('websites', item)} className="material-symbols-outlined text-[10px] text-white/20 hover:text-red-500">close</button>
                         </span>
                      ))}
                   </div>
                </div>
             </div>
          </section>

          {/* Identity Section */}
          <section className="bg-accent/40 border border-white/5 rounded-[2rem] p-8 space-y-6">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                <h3 className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Briefing Settings / 推送设置</h3>
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-xs text-white/40 font-medium uppercase">简报接收邮箱</label>
                <input 
                  type="email" 
                  className="bg-black/20 border border-white/10 rounded-2xl px-5 h-14 focus:border-primary/50 transition-all text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
             </div>
             <button 
               onClick={handleSendTest}
               disabled={isSendingTest}
               className="w-full h-14 bg-primary text-secondary font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,240,240,0.15)]"
             >
                {isSendingTest ? "正在封装今日情报..." : "立即发送内存信号简报测试"}
             </button>
             {testStatus && <p className="text-[10px] font-mono text-primary text-center animate-pulse">{testStatus}</p>}
          </section>
        </div>

        <div className="space-y-8">
           <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8">
              <h4 className="text-primary font-black text-sm mb-4 uppercase">System Logic</h4>
              <p className="text-white/60 text-xs leading-relaxed font-light">
                 当前的信号缓存中共有 <span className="text-primary font-bold">{signals.length}</span> 条情报。
                 测试按钮将直接提取这些数据进行封装，不会产生额外的 API 消耗，响应时间控制在 2s 内。
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
