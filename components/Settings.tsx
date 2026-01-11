
import React, { useState } from 'react';
import { MOCK_EMAILS, ICONS } from '../constants';
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
  const [testResult, setTestResult] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const [newTwitter, setNewTwitter] = useState("");

  const handleSendTest = async () => {
    if (signals.length === 0) return;
    setIsSendingTest(true);
    try {
      const result = await emailService.sendDailyBriefing(email, signals);
      setTestResult(result);
      setShowPreview(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-black tracking-tight mb-2 uppercase text-white">系统节点配置</h2>
        <p className="text-slate-500 text-sm font-light">管理 ALPHA 的抓取路径与自动化推送策略。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Source Management */}
          <section className="glass rounded-3xl p-8 space-y-8">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">sensors</span>
                <h3 className="text-slate-100 text-sm font-bold uppercase tracking-wider">监控源管理</h3>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className="text-xs text-slate-500 block mb-2 font-bold uppercase tracking-widest">活跃监控 X/Twitter 账号</label>
                   <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        placeholder="用户名 (如 SamA)..." 
                        className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/40 transition-all"
                        value={newTwitter}
                        onChange={e => setNewTwitter(e.target.value)}
                      />
                      <button onClick={() => {
                        if(newTwitter) setMonitoredSources({...monitoredSources, twitters: [...monitoredSources.twitters, newTwitter]});
                        setNewTwitter("");
                      }} className="px-5 bg-primary text-secondary rounded-xl font-black text-xs">添加</button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {monitoredSources.twitters.map(t => (
                        <span key={t} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-400 flex items-center gap-2 group">
                           @{t}
                           <button onClick={() => setMonitoredSources({...monitoredSources, twitters: monitoredSources.twitters.filter(x => x !== t)})} className="text-slate-600 hover:text-red-500">×</button>
                        </span>
                      ))}
                   </div>
                </div>
             </div>
          </section>

          {/* Email Settings */}
          <section className="glass rounded-3xl p-8 space-y-6">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                <h3 className="text-slate-100 text-sm font-bold uppercase tracking-wider">推送首选项</h3>
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">简报接收邮箱</label>
                <input 
                  type="email" 
                  className="bg-slate-900/50 border border-slate-800 rounded-xl px-5 h-14 text-white focus:border-primary/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
             </div>
             <button 
               onClick={handleSendTest}
               disabled={isSendingTest || signals.length === 0}
               className="w-full h-14 bg-primary text-secondary font-black rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
             >
                {isSendingTest ? "撰写今日内参中..." : "生成并发送预览简报"}
             </button>
          </section>
        </div>

        <div className="space-y-6">
           <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
              <h4 className="text-primary font-black text-xs mb-3 uppercase tracking-widest">技术声明</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                 ALPHA 引擎每次深度扫描都会耗费一定的 LLM Token。为节省资源，建议使用缓存数据阅读。重新扫描将通过 Gemini 3 Pro 穿透全球链路实时获取。
              </p>
           </div>
        </div>
      </div>

      {showPreview && testResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowPreview(false)}></div>
           <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8">
              <div className="bg-slate-100 px-6 py-4 border-b flex justify-between items-center text-slate-900">
                 <h3 className="font-bold text-sm italic">发件人: ALPHA Signal Engine</h3>
                 <button onClick={() => setShowPreview(false)} className="text-slate-400">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>
              <div className="flex-1 h-[500px] overflow-y-auto bg-white p-8 prose prose-slate max-w-none">
                 <div dangerouslySetInnerHTML={{ __html: testResult.previewBody }}></div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
