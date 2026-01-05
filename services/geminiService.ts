
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
      const prompt = `RICERCA DI MERCATO REALE - DATA ATTUALE: ${currentDate}.
      Trova i prezzi reali correnti per i seguenti indicatori:
      1. Prezzo medio di un Döner Kebab a Berlino (cerca "Dönerpreis Berlin 2024 2025" o "Kebab price Germany").
      2. Prezzo medio di un cammello da allevamento o dromedario nei mercati di Riyadh o Dubai (cerca "Camel price Saudi Arabia" o "Livestock auction UAE").
      
      Restituisci ESATTAMENTE questo formato nel testo della risposta, senza markdown:
      VALORE_REALE_BERLINO: [prezzo numerico in EUR, es: 7.50]
      VALORE_REALE_CAMMELLO: [prezzo numerico in EUR, es: 2800]
      NOTE: [Una breve spiegazione dei dati trovati, es: 'Aumento del 10% a Kreuzberg' o 'Asta record a Riyadh']
      
      Usa Google Search per trovare i dati più recenti disponibili online.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Uso Pro per maggiore precisione nella ricerca
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.map((chunk: any) => ({
        title: chunk.web?.title || "Fonte Mercato Certificata",
        uri: chunk.web?.uri || "#"
      })).filter((s: any) => s.uri !== "#");

      return { text, sources };
    } catch (e) {
      console.error("Errore fetch prezzi reali:", e);
      return null;
    }
  }

  async fetchSectorNews(currentDate: string): Promise<NewsItem[]> {
    if (!process.env.API_KEY) return [];
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const prompt = `NEWS SETTORIALI - KEBAB & LIVESTOCK.
      Cerca notizie reali dell'ultimo anno su:
      - Tendenze gastronomiche kebab, festival, o variazioni di prezzo famose (es. Dönerpreisbremse).
      - Mercati di cammelli, gare di mahari, o fiere del bestiame in Medio Oriente.
      
      Restituisci un array JSON di 3-4 oggetti con:
      [{ "headline": "Titolo", "summary": "Sintesi", "source": "Sito", "impact": "up/down/neutral", "date": "Data", "url": "Link" }]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
         try {
           return JSON.parse(jsonMatch[0]);
         } catch(e) {
           return [];
         }
      }
      return [];
    } catch (e) {
      console.error("Errore recupero news settore:", e);
      return [];
    }
  }

  async askGuru(question: string) {
    if (!process.env.API_KEY) return "Configura la tua API Key per consultare il Visir.";
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: question,
        config: {
          systemInstruction: `Sei il Visir della Kebab Economy™, un esperto finanziario che usa il prezzo del kebab e il valore dei cammelli come unici indicatori di salute globale. 
          Parli in modo tecnico ma focalizzato esclusivamente su carne, spezie e bestiame. 
          Ignora la politica tradizionale. La tua unica politica è il 'Döner Standard'.`,
          temperature: 0.8,
        },
      });
      return response.text;
    } catch (error) {
      return "Il Visir sta analizzando il mercato dei cammelli a Riyadh. Riprova tra poco.";
    }
  }
}

export const kebabGuru = new KebabGuruService();
