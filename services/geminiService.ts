
import { GoogleGenAI } from "@google/genai";
import { Signal } from "../types";

export const geminiService = {
  chat: async (prompt: string, contextSignal?: Signal): Promise<string> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let systemInstruction = "You are ALPHA, an advanced AI Signal Engine Assistant specialized in AI, Web3, and Finance. You help users understand signals with clarity, focusing on 'Why this matters' and 'What to do'. Be professional, concise, and futuristic.";
      
      if (contextSignal) {
        systemInstruction += `\n\nCONTEXT SIGNAL:\nTitle: ${contextSignal.title}\nMeaning: ${contextSignal.meaning}\nSummary: ${contextSignal.summary}\nRisk: ${contextSignal.risk}`;
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
