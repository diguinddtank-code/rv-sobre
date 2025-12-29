import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateConciergeResponse = async (userQuery: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: `Você é 'AURA', a assistente virtual pessoal de Rodrigo Vieira.
        Perfil do Rodrigo: Gestor de Tráfego, Web Designer, Editor de Vídeo e Especialista em Automações.
        Tom: Profissional, futurista, conciso.
        Idioma: Português do Brasil.
        Contexto: O usuário está no portfólio interativo do Rodrigo.
        Missão: Responder sobre as habilidades do Rodrigo e detalhes dos projetos listados.
        Regra: Respostas curtas (máximo 2 frases).`,
      }
    });
    return response.text || "Conexão instável. Tente novamente.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sistema offline. Por favor, envie um email.";
  }
};