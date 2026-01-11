
import { GoogleGenAI } from "@google/genai";

export const emailService = {
  /**
   * 封装今日信号包并生成 AI 简报
   */
  sendDailyBriefing: async (email: string, signals: any[]) => {
    console.log(`[ALPHA ENGINE] 正在为用户 ${email} 封装今日信号包...`);
    
    // 如果没有信号，直接返回
    if (!signals || signals.length === 0) throw new Error("No signals to send");

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // 准备信号摘要供 AI 撰写
    const signalContext = signals.map(s => `- [${s.type}] ${s.title}: ${s.meaning}`).join('\n');

    const prompt = `
      任务：为 ALPHA 用户撰写一份极其硬核且精美的“每日信号简报”邮件。
      目标邮箱：${email}
      今日信号：
      ${signalContext}
      
      要求：
      1. 使用 HTML 格式撰写，风格要科幻、专业、极简。
      2. 包含一个醒目的标题。
      3. 对每个信号进行 1-2 句的深度点评。
      4. 结尾包含一个免责声明和“ALPHA 系统自动生成”字样。
      5. 必须是中文。
      
      只返回 HTML 代码，不要返回其他描述。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const htmlContent = response.text || "AI 简报生成失败";

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 在真实生产环境，这里会是一个 fetch('https://your-api.com/send-email', { method: 'POST', body: ... })
    const result = {
      success: true,
      timestamp: Date.now(),
      recipient: email,
      subject: `【ALPHA 今日信号】你关注的世界，已经为你筛选完毕`,
      previewBody: htmlContent, // 返回 HTML 供前端预览
      messageId: "ALPHA-OUT-" + Math.random().toString(36).substr(2, 9),
    };

    console.log(`[ALPHA ENGINE] 信号包已成功推送至虚拟网关`, result);
    return result;
  }
};

export const scheduleManager = {
  getNextScanTime: () => {
    const now = new Date();
    const hours = now.getHours();
    const nextScanHour = (Math.floor(hours / 6) + 1) * 6;
    const nextDate = new Date();
    if (nextScanHour >= 24) {
      nextDate.setDate(now.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);
    } else {
      nextDate.setHours(nextScanHour, 0, 0, 0);
    }
    return nextDate.getTime();
  }
};
