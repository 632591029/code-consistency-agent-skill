
import React, { useState, useRef, useEffect } from 'react';
import { Signal, ChatMessage } from '../types';
import { ICONS } from '../constants';
import { geminiService } from '../services/geminiService';

interface AIAssistantProps {
  selectedSignal?: Signal;
  onClose?: () => void; // 增加关闭/返回的回调
}

const AIAssistant: React.FC<AIAssistantProps> = ({ selectedSignal, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSignal) {
      setMessages([{
        role: 'model',
        text: `我是您的 AI 信号分析助手。我已经为您同步了 "${selectedSignal.title}" 的深度研报。您可以询问我关于该信号的市场影响、风险细节或具体操作建议。`,
        timestamp: Date.now()
      }]);
    } else {
        setMessages([{
            role: 'model',
            text: "我是 ALPHA 引擎的 AI 核心。您可以问我关于 AI、Web3 或今日捕获的任何信号的问题。",
            timestamp: Date.now()
          }]);
    }
  }, [selectedSignal]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
        const responseText = await geminiService.chat(input, selectedSignal);
        const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
        setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error("Chat error:", error);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] lg:h-[calc(100vh-140px)] flex flex-col bg-accent/20 lg:rounded-3xl lg:border border-white/5 overflow-hidden">
      {/* Assistant Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5 shrink-0">
        <div className="flex items-center gap-3">
          {onClose && (
            <button onClick={onClose} className="lg:hidden mr-2 text-white/60">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          )}
          <div className="size-2 rounded-full bg-primary animate-pulse"></div>
          <span className="font-bold text-xs tracking-widest uppercase">ALPHA AI CORE</span>
        </div>
        {selectedSignal && (
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] text-primary font-bold truncate max-w-[150px]">
                {selectedSignal.id}
            </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 lg:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`size-8 rounded-lg lg:rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-primary/10 border-primary/30 text-primary'}`}>
              {msg.role === 'user' ? <span className="material-symbols-outlined text-sm">person</span> : ICONS.ROBOT}
            </div>
            <div className={`max-w-[85%] lg:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-secondary font-bold shadow-lg shadow-primary/10' : 'bg-white/5 text-slate-200 border border-white/5'}`}>
              {msg.text}
              <div className={`text-[9px] mt-1 opacity-40 text-right ${msg.role === 'user' ? 'text-secondary' : 'text-white'}`}>
                 {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex gap-4">
            <div className="size-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 text-primary">
                {ICONS.ROBOT}
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
               <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 lg:p-6 bg-secondary/80 border-t border-white/5 shrink-0">
        <div className="relative flex items-center gap-3">
           <textarea 
             className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary/40 text-white placeholder:text-gray-600 resize-none max-h-32"
             placeholder="询问深度见解..."
             rows={1}
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
           />
           <button 
             onClick={handleSend}
             disabled={isTyping || !input.trim()}
             className="size-10 bg-primary text-secondary rounded-xl flex items-center justify-center hover:brightness-110 disabled:opacity-50 transition-all absolute right-1 shadow-lg shadow-primary/20"
           >
              {ICONS.SEND}
           </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
