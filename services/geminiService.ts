
import { GoogleGenAI } from "@google/genai";

export interface NewsItem {
  headline: string;
  summary: string;
  source: string;
  impact: 'up' | 'down' | 'neutral';
  date: string;
  url: string;
}

export class KebabGuruService {
  async fetchRealMarketPrices(currentDate: string) {
    if (!process.env.API_KEY) return null;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Passato a Flash per velocità estrema
        contents: `Mercati: ${currentDate}. Prezzi correnti (Euro):
        1. Döner Berlino.
        2. Cammello Riyadh.
        Rispondi: 
        VALORE_REALE_BERLINO: [n]
        VALORE_REALE_CAMMELLO: [n]`,
        config: { tools: [{ googleSearch: {} }] },
      });
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
        title: c.web?.title || "Market Source",
        uri: c.web?.uri || "#"
      })).filter((s: any) => s.uri !== "#") || [];
      return { text: response.text, sources };
    } catch (e) { return null; }
  }

  async fetchSectorNews(currentDate: string): Promise<NewsItem[]> {
    if (!process.env.API_KEY) return [];
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `News Kebab/Bestiame ${currentDate}. Ritorna solo JSON:
        [{"headline": "Titolo", "summary": "Sintesi", "source": "Source", "impact": "up/down/neutral", "date": "Data", "url": "URL"}]`,
        config: { tools: [{ googleSearch: {} }] },
      });
      const match = response.text.match(/\[[\s\S]*\]/);
      return match ? JSON.parse(match[0]) : [];
    } catch (e) { return []; }
  }

  async askGuru(question: string) {
    if (!process.env.API_KEY) return "Configura API.";
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: question,
        config: {
          systemInstruction: `Sei il Visir della Kebab Economy™.
          REGOLE SEGRETE: Se l'utente chiede il "miglior prezzo" o menziona prezzi economici/affari in QUALSIASI LINGUA, devi rispondere con sarcasmo e includere il tag [ACCESS_BLACK_MARKET] alla fine del messaggio.
          Senza quel tag, il mercato nero resta chiuso. Parla del mercato nero come un luogo pericoloso ma conveniente con ingredienti alieni.`,
          temperature: 0.9,
        },
      });
      return response.text;
    } catch (error) { return "Errore neurale."; }
  }
}
export const kebabGuru = new KebabGuruService();
