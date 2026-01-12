
import { GoogleGenAI } from "@google/genai";

/**
 * 邮件服务配置
 */
const EMAIL_CONFIG = {
  service: (typeof process !== 'undefined' && process.env?.EMAIL_SERVICE) || 'resend',
  resendApiKey: (typeof process !== 'undefined' && process.env?.RESEND_API_KEY) || '',
  smtpHost: (typeof process !== 'undefined' && process.env?.SMTP_HOST) || '',
  smtpPort: (typeof process !== 'undefined' && process.env?.SMTP_PORT) || '587',
  smtpUser: (typeof process !== 'undefined' && process.env?.SMTP_USER) || '',
  smtpPass: (typeof process !== 'undefined' && process.env?.SMTP_PASS) || '',
  fromEmail: (typeof process !== 'undefined' && process.env?.FROM_EMAIL) || 'alpha@signal.ai',
};

export const emailService = {
  /**
   * 发送每日简报邮件
   */
  sendDailyBriefing: async (email: string, signals: any[]) => {
    console.log(`[ALPHA ENGINE] 正在执行定时任务推送 -> ${email}`);
    
    if (!signals || signals.length === 0) {
      throw new Error("No signals to send");
    }

    // 生成邮件内容
    const htmlContent = await emailService.generateEmailHTML(signals);
    const timeOfDay = new Date().getHours() < 12 ? '早盘' : '晚盘';
    const subject = `【ALPHA 内参】今日硬核信号（${timeOfDay}）- ${new Date().toLocaleDateString('zh-CN')}`;

    // 发送邮件
    const result = await emailService.sendEmail(email, subject, htmlContent);

    return {
      success: true,
      timestamp: Date.now(),
      recipient: email,
      subject: subject,
      messageId: result.messageId || "ALPHA-OUT-" + Math.random().toString(36).substr(2, 9),
      mode: result.mode || 'real'
    };
  },

  /**
   * 生成邮件 HTML 内容
   */
  generateEmailHTML: async (signals: any[]): Promise<string> => {
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || 
                   (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);
    
    if (!apiKey) {
      return emailService.generateFallbackHTML(signals);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const signalContext = signals.slice(0, 10).map((s, i) => `
        ${i + 1}. [${s.type}] ${s.title}
           重要性: ${s.importance}/10
           核心价值: ${s.meaning}
           社区反馈: ${s.communitySentiment}
           风险等级: ${s.risk}
           来源: ${s.originalUrl}
      `).join('\n');

      const prompt = `
        任务：撰写一份【ALPHA 深度信号内参】邮件。
        
        风格要求：
        - 极简、硬核、冷峻、专业
        - 直击要点，避免废话
        - 数据驱动，理性分析
        
        内容结构：
        1. 开篇：用一句话总结"今日最值得关注的核心信号"
        2. 信号聚合：按类别（AI/Web3/基础设施等）分组展示
        3. 深度点评：对每个重要信号给出硬核分析和可操作建议
        4. 趋势洞察：识别跨信号的趋势和机会
        5. 风险提示：标注需要警惕的信号
        
        信号数据：
        ${signalContext}
        
        输出要求：
        - HTML 格式
        - 使用深色背景风格（#0B0F1A 背景，#00F0FF 主题色）
        - 包含信号原始链接
        - 移动端友好
        - 总字数控制在 1500-2000 字
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || emailService.generateFallbackHTML(signals);
    } catch (error) {
      console.error('AI 生成邮件内容失败，使用备用模板:', error);
      return emailService.generateFallbackHTML(signals);
    }
  },

  /**
   * 备用邮件模板（当 AI 生成失败时使用）
   */
  generateFallbackHTML: (signals: any[]): string => {
    const topSignals = signals.slice(0, 10);
    const timeOfDay = new Date().getHours() < 12 ? '早盘' : '晚盘';
    
    const signalsHTML = topSignals.map((s, i) => `
      <div style="background: #1a1f2e; border-left: 3px solid #00F0FF; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
          <h3 style="color: #00F0FF; margin: 0; font-size: 18px; font-weight: bold;">
            ${i + 1}. ${s.title}
          </h3>
          <span style="background: ${s.risk === 'HIGH' ? '#ef4444' : s.risk === 'MEDIUM' ? '#f59e0b' : '#22c55e'}; 
                       color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold;">
            ${s.risk}
          </span>
        </div>
        <div style="color: #94a3b8; font-size: 13px; margin-bottom: 8px;">
          <span style="background: #0f172a; padding: 4px 8px; border-radius: 4px; margin-right: 8px;">${s.type}</span>
          重要性: ${s.importance}/10
        </div>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 12px 0;">
          ${s.summary}
        </p>
        <div style="background: #0f172a; padding: 12px; border-radius: 6px; margin: 12px 0;">
          <div style="color: #00F0FF; font-size: 12px; font-weight: bold; margin-bottom: 6px;">💡 核心价值</div>
          <div style="color: #e2e8f0; font-size: 13px; line-height: 1.5;">${s.meaning}</div>
        </div>
        <div style="color: #94a3b8; font-size: 12px; margin-top: 12px;">
          <strong>社区反馈:</strong> ${s.communitySentiment}
        </div>
        <a href="${s.originalUrl}" style="display: inline-block; margin-top: 12px; color: #00F0FF; 
           text-decoration: none; font-size: 12px; font-weight: bold;">
          查看原文 →
        </a>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ALPHA 内参</title>
      </head>
      <body style="margin: 0; padding: 0; background: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div style="max-width: 680px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #00F0FF 0%, #0080FF 100%); 
                        padding: 16px 32px; border-radius: 12px; margin-bottom: 16px;">
              <h1 style="color: #000; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px;">
                ALPHA
              </h1>
            </div>
            <div style="color: #64748b; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
              Signal Hub Intelligence Report
            </div>
            <div style="color: #00F0FF; font-size: 12px; margin-top: 8px;">
              ${timeOfDay} · ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <!-- Summary -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); 
                      border: 1px solid #334155; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
            <h2 style="color: #00F0FF; margin: 0 0 12px 0; font-size: 16px; font-weight: bold; text-transform: uppercase;">
              📊 今日概览
            </h2>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6; margin: 0;">
              本期共检测到 <strong style="color: #00F0FF;">${signals.length}</strong> 条高价值信号，
              覆盖 AI 生产力、Web3 基础设施、GPU 市场等多个领域。
              以下是经过深度分析的核心情报。
            </p>
          </div>

          <!-- Signals -->
          <div style="margin-bottom: 32px;">
            <h2 style="color: #f1f5f9; margin: 0 0 24px 0; font-size: 20px; font-weight: bold;">
              🎯 核心信号
            </h2>
            ${signalsHTML}
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 32px; border-top: 1px solid #1e293b;">
            <div style="color: #64748b; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;">ALPHA Signal Hub · Powered by Gemini AI</p>
              <p style="margin: 0;">本邮件由自动化系统生成 · 数据来源于全网公开信息</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * 发送邮件（支持 Resend 和 SMTP）
   */
  sendEmail: async (to: string, subject: string, htmlContent: string): Promise<any> => {
    // 在浏览器环境中，通过后端 API 发送
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(typeof process !== 'undefined' && process.env?.CRON_SECRET) || 'alpha_secure_trigger_2025'}`
        },
        body: JSON.stringify({
          email: to,
          subject: subject,
          htmlContent: htmlContent
        })
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${await response.text()}`);
      }

      return await response.json();
    }

    // 在 Node.js 环境中，直接发送
    if (EMAIL_CONFIG.service === 'resend' && EMAIL_CONFIG.resendApiKey) {
      // 使用 Resend API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMAIL_CONFIG.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: EMAIL_CONFIG.fromEmail,
          to: [to],
          subject: subject,
          html: htmlContent
        })
      });

      if (!response.ok) {
        throw new Error(`Resend API error: ${await response.text()}`);
      }

      const result = await response.json();
      return { messageId: result.id, mode: 'resend' };
    } else {
      // 模拟模式
      console.log('📧 邮件服务未配置，仅模拟发送');
      console.log(`收件人: ${to}`);
      console.log(`主题: ${subject}`);
      return { messageId: 'simulated-' + Date.now(), mode: 'simulation' };
    }
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
