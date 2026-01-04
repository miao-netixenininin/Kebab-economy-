
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
      const prompt = `ANALISI DI MERCATO REALE - ASSET: KEBAB E CAMMELLI.
      Data simulata: ${currentDate}.
      
      Esegui una ricerca su siti specializzati, forum di settore e dati storici (anche non recentissimi) per trovare:
      1. Il prezzo reale del Döner Kebab a Berlino (cerca "Dönerpreis index" o "Prezzo kebab Germania").
      2. Quotazioni di mercato per i cammelli (cerca "Camel market prices Riyadh", "Livestock auction Dubai").
      
      IMPORTANTE: Ignora la politica monetaria generale. Concentrati sui dati dei chioschi e delle aste di bestiame.
      
      Restituisci questo formato preciso:
      VALORE_REALE_BERLINO: [prezzo in euro, es. 7.20]
      VALORE_REALE_CAMMELLO: [prezzo medio in euro, es. 2500]
      NOTE: [Dati trovati nelle ricerche correlate o siti di settore]
      
      Usa i dati delle ricerche correlate per estrapolare un trend realistico.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.map((chunk: any) => ({
        title: chunk.web?.title || "Dati di Mercato Certificati",
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
      const prompt = `CRONACA SETTORIALE - KEBAB & LIVESTOCK.
      Cerca notizie reali (anche degli ultimi anni) su:
      - Festival del Kebab, record mondiali di Döner, o proteste locali sui prezzi (Dönerpreisbremse).
      - Aste di cammelli di bellezza negli Emirati, gare di dromedari, o mercati di bestiame famosi.
      - Innovazione tecnologica nei chioschi o nelle stalle.
      
      EVITA: Politica generale, tassi di interesse, macroeconomia pura.
      
      FORMATO JSON:
      [{ "headline": "Titolo Notizia", "summary": "Sintesi", "source": "Nome Sito/Testata", "impact": "up/down/neutral", "date": "Data", "url": "URL" }]
      
      Usa fonti come "The National News", "Spiegel", o siti locali di Berlino e Dubai.`;

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
