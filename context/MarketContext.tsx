import React, { createContext, useContext, useState, useEffect } from 'react';
import { KEBAB_MARKET_ASSETS, LIVESTOCK_ASSETS, INGREDIENT_ASSETS, EXCHANGE_RATES } from '../constants';
import { kebabGuru, NewsItem } from '../services/geminiService';

export type Language = 'it' | 'en' | 'de' | 'ar';
export type Currency = 'EUR' | 'USD' | 'GBP' | 'SAR';

interface PricePoint {
  time: string;
  kebab: number;
  livestock: number;
  isReal: boolean;
}

interface MarketState {
  kebabPrices: Record<string, number>;
  livestockPrices: Record<string, number>;
  ingredientPrices: Record<string, number>;
}

interface MarketContextType {
  marketState: MarketState;
  history: PricePoint[];
  news: NewsItem[];
  balance: number;
  inventory: Record<string, number>;
  isSyncing: boolean;
  isRealMode: boolean;
  lastSync: string | null;
  currentTime: string;
  currentDate: string;
  sources: { title: string; uri: string }[];
  buyAsset: (id: string, price: number) => void;
  sellAsset: (id: string, price: number) => void;
  swapAssets: (fromId: string, toId: string, amount: number, fromPrice: number, toPrice: number) => boolean;
  syncWithReality: () => Promise<void>;
  addFunds: (amount: number) => void;
  getFinalPrice: (id: string, location: any, assetSpecs?: any) => number;
  resetData: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const STORAGE_KEY = 'kebab_economy_v16_final';

const translations: Record<Language, Record<string, string>> = {
  it: {
    dashboard: "Dashboard", exchange: "Borsa", play: "Minigioco", portfolio: "Asset Totali",
    sync: "Live Sync Gemini", syncing: "Analisi Mercati...", swapTerminal: "Terminale di Conversione",
    cedi: "Asset in Uscita", ricevi: "Asset in Entrata", execute: "Esegui Arbitraggio",
    buy: "Acquista", sell: "Vendi", buyingTerminal: "Market di Origine (Buy)", sellingTerminal: "Market di Destinazione (Sell)",
    marketNews: "Flash News Settore", aboutVision: "Whitepaper Kebab Economy™", apiWarning: "Richiede API Key per dati di mercato real-time",
    stats_ticker: "Market Ticker", stats_update: "Aggiornamento 15s", stats_verified: "Dati Web-Verified",
    clicker_title: "Master Slicer Pro", clicker_subtitle: "Ottimizza il taglio per generare liquidità!",
    clicker_bonus: "alla prossima tranche", bonus_claim: "Bonus Benvenuto 5.00€", bonus_claimed: "Bonus Attivo ✓",
    bonus_title: "Iniezione di Capitale", bonus_desc: "Fondi speculativi per accelerare la tua scalata al mercato globale.",
    goals_title: "Achievement Finanziari", goal_chips: "Barone del Sale", goal_chips_desc: "Gestisci 50 porzioni",
    goal_camel: "Emiro dei Cammelli", goal_camel_desc: "Possiedi un Al-Wadhah", goal_onion: "Magnate del Döner",
    goal_onion_desc: "Patrimonio > 1.000€", about_p1: "Kebab Economy™ non è solo un software di trading, è il manifesto di una nuova era finanziaria basata sul valore reale della proteina.",
    about_p2: "Utilizzando la potenza di Gemini 3, monitoriamo costantemente i prezzi per fornirti opportunità di arbitraggio senza precedenti.",
    market_analysis: "Stato dei Mercati", balance: "Liquidità", footer_original: "KEBAB ECONOMY ORIGINAL - EST. 2026",
    doner: "Döner Kebab", shish: "Shish Kebab", adana: "Adana Kebab", durum: "Dürüm Wrap",
    iskender: "Iskender Kebab", lahmacun: "Lahmacun", kofte: "Köfte Bowl", premium_angus: "Gourmet Angus",
    majaheem: "Al-Majaheem", wadhah: "Al-Wadhah", hamra: "Al-Hamra", sofor: "Al-Sofor", malha: "Al-Malha", shual: "Al-Shual", dromedary: "Dromedario Standard", bactrian: "Bactriano Reale", somali: "Cammello Somalo", mahari: "Mahari Racing",
    onion: "Cipolla Oro", tomato: "Pomodoro Rosso", sauce_garlic: "Salsa Bianca", sauce_harissa: "Harissa Piccante",
    meat_cone: "Cono Carne", pita_pack: "Sacco Pita", lettuce: "Lattuga Bio", spices: "Spezie Segrete",
    chicken: "Pollo", beef: "Manzo", lamb: "Agnello", turkey: "Tacchino", seitan: "Seitan", bread: "Pita", wrap: "Wrap", plate: "Piatto",
    berlin: "Berlino", istanbul: "Istanbul", rome: "Roma", london: "Londra", ny: "New York", cairo: "Il Cairo",
    male: "Maschio", female: "Femmina", work: "Lavoro", racing: "Corsa", beauty: "Bellezza",
    somalia: "Somalia", saudi: "Riyadh", uae: "Dubai", EUR: "Euro", USD: "Dollaro", GBP: "Sterlina", SAR: "Riyal"
  },
  en: {
    dashboard: "Dashboard", exchange: "Exchange", play: "Play", portfolio: "Total Assets",
    sync: "Gemini Live Sync", syncing: "Analyzing Markets...", swapTerminal: "Conversion Terminal",
    cedi: "Outgoing Asset", ricevi: "Incoming Asset", execute: "Execute Arbitrage",
    buy: "Buy", sell: "Sell", buyingTerminal: "Source Market (Buy)", sellingTerminal: "Target Market (Sell)",
    marketNews: "Sector News", aboutVision: "Kebab Economy™ Whitepaper", apiWarning: "Real-time market data requires API Key",
    stats_ticker: "Market Ticker", stats_update: "15s Refresh", stats_verified: "Web-Verified Data",
    clicker_title: "Master Slicer Pro", clicker_subtitle: "Optimize the cut to generate liquidity!",
    clicker_bonus: "to next tranche", bonus_claim: "5.00€ Welcome Bonus", bonus_claimed: "Bonus Active ✓",
    bonus_title: "Capital Injection", bonus_desc: "Speculative funds to accelerate your climb in the global market.",
    goals_title: "Financial Achievements", goal_chips: "Salt Baron", goal_chips_desc: "Handle 50 portions",
    goal_camel: "Camel Emir", goal_camel_desc: "Own an Al-Wadhah", goal_onion: "Doner Tycoon",
    goal_onion_desc: "Net Worth > 1,000€", about_p1: "Kebab Economy™ is not just trading software; it's a manifesto.",
    about_p2: "Using the power of Gemini 3, we monitor prices constantly.",
    market_analysis: "Market Status", balance: "Liquidity", footer_original: "KEBAB ECONOMY ORIGINAL - EST. 2026",
    doner: "Doner Kebab", shish: "Shish Kebab", adana: "Adana Kebab", durum: "Durum",
    iskender: "Iskender Kebab", lahmacun: "Lahmacun", kofte: "Kofte", premium_angus: "Gourmet Angus",
    majaheem: "Al-Majaheem", wadhah: "Al-Wadhah", hamra: "Al-Hamra", sofor: "Al-Sofor", malha: "Al-Malha", shual: "Al-Shual", dromedary: "Dromedary", bactrian: "Bactrian", somali: "Somali Camel", mahari: "Racing Mahari",
    onion: "Golden Onion", tomato: "Red Tomato", sauce_garlic: "White Sauce", sauce_harissa: "Spicy Harissa", meat_cone: "Meat Cone",
    pita_pack: "Pita Sack", lettuce: "Bio Lettuce", spices: "Secret Spices",
    chicken: "Chicken", beef: "Beef", lamb: "Lamb", turkey: "Turkey", seitan: "Seitan", bread: "Pita", wrap: "Wrap", plate: "Plate",
    berlin: "Berlin", istanbul: "Istanbul", rome: "Rome", london: "London", ny: "New York", cairo: "Cairo",
    male: "Male", female: "Female", work: "Work", racing: "Racing", beauty: "Beauty",
    somalia: "Somalia", saudi: "Riyadh", uae: "Dubai", EUR: "Euro", USD: "Dollar", GBP: "Pound", SAR: "Riyal"
  },
  de: {
    dashboard: "Dashboard", exchange: "Börse", play: "Minispiel", portfolio: "Gesamtvermögen",
    sync: "Gemini Live Sync", syncing: "Analysiere Märkte...", swapTerminal: "Konvertierungsterminal",
    cedi: "Ausgehender Wert", ricevi: "Eingehender Wert", execute: "Arbitrage Ausführen",
    buy: "Kaufen", sell: "Verkaufen", buyingTerminal: "Quellmarkt (Kauf)", sellingTerminal: "Zielmarkt (Verkauf)",
    marketNews: "Sektor News", aboutVision: "Kebab Economy™ Whitepaper", apiWarning: "API Key erforderlich",
    stats_ticker: "Markt Ticker", stats_update: "15s Refresh", stats_verified: "Daten Web-Verifiziert",
    clicker_title: "Master Slicer Pro", clicker_subtitle: "Optimiere den Schnitt!",
    clicker_bonus: "bis zur nächsten Tranche", bonus_claim: "5.00€ Willkommensbonus", bonus_claimed: "Bonus Aktiv ✓",
    bonus_title: "Kapitalinjektion", bonus_desc: "Spekulative Mittel.",
    goals_title: "Ziele", goal_chips: "Salzbaron", goal_chips_desc: "50 Portionen",
    goal_camel: "Kamel Emir", goal_camel_desc: "Besitze einen Al-Wadhah", goal_onion: "Döner Tycoon",
    goal_onion_desc: "Vermögen > 1.000€", about_p1: "Kebab Economy™ ist mehr als nur Software.",
    about_p2: "Dank Gemini 3 haben wir die Märkte im Blick.",
    market_analysis: "Marktanalyse", balance: "Liquidität", footer_original: "KEBAB ECONOMY ORIGINAL - EST. 2026",
    doner: "Döner Kebab", shish: "Schaschlik", adana: "Adana Kebab", durum: "Dürüm",
    iskender: "Iskender Kebab", lahmacun: "Lahmacun", kofte: "Köfte", premium_angus: "Gourmet Angus",
    majaheem: "Al-Majaheem", wadhah: "Al-Wadhah", hamra: "Al-Hamra", sofor: "Al-Sofor", malha: "Al-Malha", shual: "Al-Shual", dromedary: "Dromedar", bactrian: "Baktrisch", somali: "Somali Kamel", mahari: "Renn-Mahari",
    onion: "Goldene Zwiebel", tomato: "Rote Tomate", sauce_garlic: "Weiße Soße", sauce_harissa: "Scharfe Harissa", meat_cone: "Fleischkegel",
    pita_pack: "Pita Sack", lettuce: "Bio Salat", spices: "Geheimgeveürze",
    chicken: "Hähnchen", beef: "Rind", lamb: "Lamm", turkey: "Truthahn", seitan: "Seitan", bread: "Pita", wrap: "Dürüm", plate: "Teller",
    berlin: "Berlin", istanbul: "Istanbul", rome: "Rom", london: "London", ny: "New York", cairo: "Kairo",
    male: "Männlich", female: "Weiblich", work: "Arbeit", racing: "Rennen", beauty: "Schönheit",
    somalia: "Somalia", saudi: "Riyadh", uae: "Dubai", EUR: "Euro", USD: "Dollar", GBP: "Pfund", SAR: "Riyal"
  },
  ar: {
    dashboard: "لوحة القيادة", exchange: "البورصة", play: "لعبة", portfolio: "إجمالي الأصول",
    sync: "مزامنة Gemini", syncing: "تحليل الأسواق...", swapTerminal: "محطة التحويل",
    cedi: "الأصل الصادر", ricevi: "الأصل الوارد", execute: "تنفيذ التحكيم",
    buy: "شراء", sell: "بيع", buyingTerminal: "سوق المصدر", sellingTerminal: "سوق الهدف",
    marketNews: "أخبار القطاع", aboutVision: "الكتاب الأبيض", apiWarning: "مفتاح API مطلوب",
    stats_ticker: "مؤشر السوق", stats_update: "تحديث 15 ثانية", stats_verified: "بيانات موثقة",
    clicker_title: "ماستر سلايسر برو", clicker_subtitle: "حسّن القطع!",
    clicker_bonus: "للشريحة القادمة", bonus_claim: "مكافأة 5.00€", bonus_claimed: "نشط ✓",
    bonus_title: "ضخ رأس المال", bonus_desc: "أموال للمضاربة.",
    goals_title: "الأهداف", goal_chips: "بارون الملح", goal_chips_desc: "إدارة 50 حصة",
    goal_camel: "أمير الإبل", goal_camel_desc: "امتلك الوضح", goal_onion: "تايكون الدونر",
    goal_onion_desc: "صافي الثروة > 1,000€", about_p1: "اقتصاد الكباب هو مستقبل التمويل.",
    about_p2: "نراقب الأسعار باستخدام Gemini 3.",
    market_analysis: "حالة السوق", balance: "السيولة", footer_original: "اقتصاد الكباب الأصلي - 2026",
    doner: "دونر كباب", shish: "شيش كباب", adana: "أضنة كباب", durum: "دوروم",
    iskender: "إسكندر كباب", lahmacun: "لحم بعجين", kofte: "كفتة", premium_angus: "أنغوس فاخر",
    majaheem: "المجاهيم", wadhah: "الوضح", hamra: "الحمراء", sofor: "الصفر", malha: "الملحة", shual: "الشعل", dromedary: "جمل وحيد السنام", bactrian: "جمل ثنائي السنام", somali: "جمل صومالي", mahari: "مهاري للسباق",
    onion: "بصل ذهبي", tomato: "طماطم حمراء", sauce_garlic: "صلصة بيضاء", sauce_harissa: "هريسة حارة", meat_cone: "سيخ لحم",
    pita_pack: "كيس بيتا", lettuce: "خس عضوي", spices: "توابل سرية",
    chicken: "دجاج", beef: "لحم بقر", lamb: "لحم ضأن", turkey: "ديك رومي", seitan: "سيتان", bread: "بيتا", wrap: "لفافة", plate: "طبق",
    berlin: "برلين", istanbul: "إسطنبول", rome: "روما", london: "لندن", ny: "نيويورك", cairo: "القاهرة",
    male: "ذكر", female: "أنثى", work: "عمل", racing: "سباق", beauty: "جمال",
    somalia: "الصومال", saudi: "الرياض", uae: "دبي", EUR: "يورو", USD: "دولار", GBP: "جنيه إسترليني", SAR: "ريال"
  }
};

const generateInitialHistory = (): PricePoint[] => {
  const points: PricePoint[] = [];
  const now = Date.now();
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now - i * 15000).toLocaleTimeString('it-IT');
    points.push({
      time,
      kebab: 5.0 + (Math.random() - 0.5) * 0.5,
      livestock: 2200 + (Math.random() - 0.5) * 200,
      isReal: false
    });
  }
  return points;
};

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [language, setLanguageState] = useState<Language>('it');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [balance, setBalance] = useState<number>(0.00);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [isRealMode, setIsRealMode] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('it-IT'));
  const [currentDate, setCurrentDate] = useState<string>(new Date().toLocaleDateString('it-IT'));
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [marketState, setMarketState] = useState<MarketState>({
    kebabPrices: Object.fromEntries(KEBAB_MARKET_ASSETS.map(a => [a.id, a.basePrice])),
    livestockPrices: Object.fromEntries(LIVESTOCK_ASSETS.map(a => [a.id, a.basePrice])),
    ingredientPrices: Object.fromEntries(INGREDIENT_ASSETS.map(a => [a.id, a.basePrice]))
  });
  const [history, setHistory] = useState<PricePoint[]>(generateInitialHistory());

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const p = JSON.parse(data);
        if (p.balance !== undefined) setBalance(p.balance);
        if (p.inventory) setInventory(p.inventory);
        if (p.marketState) setMarketState(p.marketState);
        if (p.history && p.history.length > 0) setHistory(p.history);
        if (p.isRealMode !== undefined) setIsRealMode(p.isRealMode);
        if (p.language) setLanguageState(p.language);
        if (p.currency) setCurrency(p.currency);
      } catch (e) { console.error("Restore failed", e); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      balance, inventory, marketState, history: history.slice(-50), isRealMode, lastSync, language, currency
    }));
  }, [isLoaded, balance, inventory, marketState, history, isRealMode, lastSync, language, currency]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('it-IT'));
      
      setHistory(prev => {
        const last = prev[prev.length - 1];
        const nextKebab = last.kebab * (0.995 + Math.random() * 0.01);
        const nextLive = last.livestock * (0.995 + Math.random() * 0.01);
        return [...prev, {
          time: now.toLocaleTimeString('it-IT'),
          kebab: nextKebab,
          livestock: nextLive,
          isReal: isRealMode
        }].slice(-50);
      });
    }, 15000);
    return () => clearInterval(timer);
  }, [isRealMode]);

  const t = (key: string) => (translations[language] as any)[key] || (translations['en'] as any)[key] || key;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (lang === 'ar') setCurrency('SAR');
    else if (lang === 'en') setCurrency('USD');
    else setCurrency('EUR');
  };

  const getFinalPrice = (id: string, location: any, assetSpecs?: any): number => {
    if (EXCHANGE_RATES[id]) return 1 / EXCHANGE_RATES[id];
    const isKebab = KEBAB_MARKET_ASSETS.some(a => a.id === id);
    const isCamel = LIVESTOCK_ASSETS.some(a => a.id === id);
    const locMult = location ? location.mult : 1.0;
    if (isKebab) {
      const base = marketState.kebabPrices[id] || 5;
      const prot = assetSpecs?.protein?.mult || 1.0;
      return base * prot * locMult;
    }
    if (isCamel) {
      const base = marketState.livestockPrices[id] || 2200;
      const g = assetSpecs?.gender?.mult || 1.0;
      const u = assetSpecs?.use?.mult || 1.0;
      return base * g * u * locMult;
    }
    return marketState.ingredientPrices[id] || 0.5;
  };

  const syncWithReality = async () => {
    setIsSyncing(true);
    try {
      const [priceData, newsData] = await Promise.all([
        kebabGuru.fetchRealMarketPrices(currentDate),
        kebabGuru.fetchSectorNews(currentDate)
      ]);
      if (newsData) setNews(newsData);
      if (priceData) {
        const kMatches = priceData.text.match(/VALORE_REALE_BERLINO:\s*(\d+\.?\d*)/);
        const cMatches = priceData.text.match(/VALORE_REALE_CAMMELLO:\s*(\d+\.?\d*)/);
        let kRatio = kMatches ? parseFloat(kMatches[1]) / 5.0 : 1.0;
        let cRatio = cMatches ? parseFloat(cMatches[1]) / 2200.0 : 1.0;
        setMarketState(prev => ({
          ...prev,
          kebabPrices: Object.fromEntries(KEBAB_MARKET_ASSETS.map(a => [a.id, a.basePrice * kRatio])),
          livestockPrices: Object.fromEntries(LIVESTOCK_ASSETS.map(a => [a.id, a.basePrice * cRatio]))
        }));
        setIsRealMode(true);
        setLastSync(new Date().toLocaleTimeString('it-IT'));
        setSources(priceData.sources);
      }
    } catch (e) { console.error(e); } finally { setIsSyncing(false); }
  };

  const buyAsset = (id: string, price: number) => {
    if (balance >= price) {
      setBalance(prev => prev - price);
      setInventory(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  };

  const sellAsset = (id: string, price: number) => {
    if (inventory[id] && inventory[id] > 0) {
      setBalance(prev => prev + price);
      setInventory(prev => ({ ...prev, [id]: prev[id] - 1 }));
    }
  };

  const swapAssets = (fromId: string, toId: string, amount: number, fromPrice: number, toPrice: number): boolean => {
    const totalVal = amount * fromPrice;
    if (EXCHANGE_RATES[fromId]) {
      if (balance >= totalVal) {
        setBalance(prev => prev - totalVal);
        setInventory(prev => ({ ...prev, [toId]: (prev[toId] || 0) + (totalVal / toPrice) }));
        return true;
      }
    } else if ((inventory[fromId] || 0) >= amount) {
      setInventory(prev => ({ ...prev, [fromId]: prev[fromId] - amount, [toId]: (prev[toId] || 0) + (totalVal / toPrice) }));
      return true;
    }
    return false;
  };

  return (
    <MarketContext.Provider value={{ 
      marketState, history, news, balance, inventory, 
      isSyncing, isRealMode, lastSync, currentTime, currentDate, sources, buyAsset, sellAsset, swapAssets, syncWithReality, addFunds: (a) => setBalance(b => b + a), getFinalPrice, resetData: () => { localStorage.clear(); window.location.reload(); },
      language, setLanguage, currency, setCurrency, t
    }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const c = useContext(MarketContext);
  if (!c) throw new Error('Uso errato di MarketContext');
  return c;
};