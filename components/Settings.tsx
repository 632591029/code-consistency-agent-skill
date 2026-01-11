
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
  const [newWeb, setNewWeb] = useState("");

  const handleSendTest = async () => {
    if (signals.length === 0) return;

    setIsSendingTest(true);
    setTestResult(null);
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
                        placeholder="用户名 (如 SamA)..." 
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                        value={newTwitter}
                        onChange={e => setNewTwitter(e.target.value)}
                      />
                      <button onClick={() => {
                        if(newTwitter) setMonitoredSources({...monitoredSources, twitters: [...monitoredSources.twitters, newTwitter]});
                        setNewTwitter("");
                      }} className="px-4 bg-primary text-secondary rounded-xl font-bold text-xs">添加</button>
                   </div>
                </div>
                {/* 列表略，保持原有逻辑 */}
             </div>
          </section>

          {/* Email Settings */}
          <section className="bg-accent/40 border border-white/5 rounded-[2rem] p-8 space-y-6">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                <h3 className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Briefing Settings / 推送设置</h3>
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-xs text-white/40 font-medium uppercase">简报接收邮箱</label>
                <input 
                  type="email" 
                  className="bg-black/20 border border-white/10 rounded-2xl px-5 h-14 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
             </div>
             <button 
               onClick={handleSendTest}
               disabled={isSendingTest || signals.length === 0}
               className="w-full h-14 bg-primary text-secondary font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
             >
                {isSendingTest ? (
                  <>
                    <div className="size-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                    正在由 AI 撰写今日简报...
                  </>
                ) : "立即生成并发送简报测试"}
             </button>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6">
              <h4 className="text-primary font-black text-xs mb-3 uppercase">技术声明</h4>
              <p className="text-white/40 text-[11px] leading-relaxed">
                 当前为浏览器端 ALPHA 演示环境，由于无 SMTP 服务器权限，邮件发送将通过 **虚拟网关** 完成。
                 点击发送后，您将看到由 **Gemini 3 Pro** 实时撰写的邮件预览。
              </p>
           </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {showPreview && testResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowPreview(false)}></div>
           <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8">
              <div className="bg-slate-100 px-6 py-4 border-b flex justify-between items-center">
                 <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">虚拟网关已拦截出站包 - 预览模式</p>
                    <h3 className="text-slate-900 font-bold text-sm">发件人: ALPHA Signal Engine &lt;system@alpha.ai&gt;</h3>
                 </div>
                 <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-slate-900">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>
              <div className="p-4 bg-slate-50 border-b space-y-1">
                 <p className="text-xs text-slate-500"><strong>收件人:</strong> {testResult.recipient}</p>
                 <p className="text-xs text-slate-500"><strong>主题:</strong> {testResult.subject}</p>
                 <p className="text-[9px] text-slate-400"><strong>ID:</strong> {testResult.messageId}</p>
              </div>
              <div className="flex-1 h-[500px] overflow-y-auto bg-white p-8 prose prose-slate max-w-none">
                 <div dangerouslySetInnerHTML={{ __html: testResult.previewBody }}></div>
              </div>
              <div className="p-6 bg-slate-50 border-t flex justify-center">
                 <button onClick={() => setShowPreview(false)} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase">确认并关闭预览</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
