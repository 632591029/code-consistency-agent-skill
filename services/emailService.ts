
export const emailService = {
  /**
   * 模拟真实的邮件发送服务
   * 在生产环境，你可以直接将此函数改为 fetch 到你的后端服务器
   */
  sendDailyBriefing: async (email: string, signals: any[]) => {
    console.log(`[ALPHA ENGINE] 正在为用户 ${email} 封装今日信号包...`);
    
    // 模拟数据封装延迟
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const highImportanceSignals = signals.filter(s => s.importance > 80);
    
    // 这里模拟调用第三方邮件 API (如 Resend 或 Node.js 后端)
    const payload = {
      to: email,
      subject: `【ALPHA 今日信号】你关注的世界，已经为你筛选完毕`,
      body: highImportanceSignals.map(s => `[${s.type}] ${s.title}: ${s.meaning}`).join('\n')
    };

    console.log(`[ALPHA ENGINE] 信号包已成功推送至 SMTP 网关`, payload);
    
    return {
      success: true,
      messageId: "msg_" + Math.random().toString(36).substr(2, 9),
      count: highImportanceSignals.length
    };
  }
};

export const scheduleManager = {
  getNextScanTime: () => {
    const now = new Date();
    const hours = now.getHours();
    // 6小时跑一次：0, 6, 12, 18 点
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
