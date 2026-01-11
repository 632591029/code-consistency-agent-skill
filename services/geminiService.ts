
import { GoogleGenAI } from "@google/genai";
import { Signal } from "../types";

export const geminiService = {
  chat: async (prompt: string, contextSignal?: Signal): Promise<string> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let systemInstruction = "你是 ALPHA，一个专注于 AI、Web3 和金融的高级情报分析助手。你负责帮助用户清晰地理解复杂信号，重点回答“为什么这很重要”以及“应该怎么做”。请保持专业、简洁、且具有前瞻性的语气。请使用中文回答。";
      
      if (contextSignal) {
        systemInstruction += `\n\n上下文情报：\n标题: ${contextSignal.title}\n战略意义: ${contextSignal.meaning}\n摘要: ${contextSignal.summary}\n风险等级: ${contextSignal.risk}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return response.text || "AI 核心未能响应，请检查信号强度。";
    } catch (error) {
      console.error("Gemini service error:", error);
      return "ALPHA 引擎通讯中断，请稍后重试。";
    }
  }
};
