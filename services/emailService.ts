
import { GoogleGenAI } from "@google/genai";

export const emailService = {
  /**
   * 模拟邮件推送系统
   */
  sendDailyBriefing: async (email: string, signals: any[]) => {
    console.log(`[ALPHA ENGINE] 正在执行定时任务推送 -> ${email}`);
    
    if (!signals || signals.length === 0) throw new Error("No signals to send");

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const signalContext = signals.map(s => `
      - [${s.type}] ${s.title}
        意义：${s.meaning}
        社区真实反馈：${s.communitySentiment}
    `).join('\n');

    const prompt = `
      任务：撰写一份【ALPHA 深度信号内参】邮件。
      风格：极简、硬核、冷峻。
      内容：
      ${signalContext}
      
      要求：
      1. 开篇直接给出“今日最值得关注的 1 个核心信号”。
      2. 对每个聚合信号给出硬核点评。
      3. HTML 格式，使用深色背景风格。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return {
      success: true,
      timestamp: Date.now(),
      recipient: email,
      subject: `【ALPHA 内参】今日硬核信号（${new Date().getHours() < 12 ? '早盘' : '晚盘'}）`,
      previewBody: response.text || "AI 简报生成失败",
      messageId: "ALPHA-OUT-" + Math.random().toString(36).substr(2, 9),
    };
  }
};

export const scheduleManager = {
  /**
   * 返回下一个 9:00 或 20:00 的时间戳
   */
  getNextScanTime: () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    const targets = [9, 20]; // 9 AM 和 8 PM
    let nextHour = targets.find(h => h > currentHour);
    
    const nextDate = new Date();
    if (nextHour === undefined) {
      nextDate.setDate(now.getDate() + 1);
      nextDate.setHours(9, 0, 0, 0);
    } else {
      nextDate.setHours(nextHour, 0, 0, 0);
    }
    
    return nextDate.getTime();
  },
  
  getScheduleLabels: () => ["09:00 AM", "08:00 PM"]
};
