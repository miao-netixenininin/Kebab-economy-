
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  KEBAB_MARKET_ASSETS, 
  LIVESTOCK_ASSETS, 
  INGREDIENT_ASSETS, 
  EXCHANGE_RATES, 
  KEBAB_FACTORS, 
  CRAFTING_RECIPES,
  BLACK_MARKET_ASSETS,
  BLACK_MARKET_LIVESTOCK,
  BLACK_MARKET_INGREDIENTS
} from '../constants';
import { kebabGuru, NewsItem } from '../services/geminiService';

export type Language = 'it' | 'en' | 'de' | 'ar';
export type Currency = 'EUR' | 'USD' | 'GBP' | 'SAR';

interface PricePoint {
  time: string;
  [key: string]: any;
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
  portions: Record<string, number>;
  isSyncing: boolean;
  isRealMode: boolean;
  isBlackMarketOpen: boolean;
  setBlackMarketOpen: (open: boolean) => void;
  lastSync: string | null;
  currentTime: string;
  buyLocation: any;
  setBuyLocation: (loc: any) => void;
  sellLocation: any;
  setSellLocation: (loc: any) => void;
  sources: { title: string; uri: string }[];
  buyAsset: (id: string, price: number) => void;
  sellAsset: (id: string, price: number) => void;
  assembleKebab: (kebabId: string) => boolean;
  swapAssets: (fromId: string, toId: string, amount: number, fromPrice: number, toPrice: number) => boolean;
  syncWithReality: () => Promise<void>;
  addFunds: (amount: number) => void;
  getFinalPrice: (id: string, location: any) => number;
  resetData: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  // Added translation function to context type
  t: (key: string) => string;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);
const STORAGE_KEY = 'kebab_economy_pro_blackmarket_v1';

// Internal translation dictionary
const TRANSLATIONS: Record<Language, Record<string, string>> = {
  it: {
    play: "MINIGIOCO",
    clicker_title: "Kebab Clicker",
    clicker_subtitle: "Affetta la carne per guadagnare centesimi",
    clicker_bonus: "Bonus Pronto",
    bonus_title: "Bonus di Benvenuto",
    bonus_desc: "Riscatta il tuo capitale iniziale per iniziare l'arbitraggio.",
    bonus_claimed: "Bonus Riscattato",
    bonus_claim: "Riscatta 5.00€",
    goals_title: "Obiettivi Mercato",
    goal_chips: "Re delle Patatine",
    goal_chips_desc: "Accumula 100 porzioni di contorno",
    goal_camel: "Magnate del Bestiame",
    goal_camel_desc: "Possiedi 5 cammelli contemporaneamente",
    goal_onion: "Monopolio della Cipolla",
    goal_onion_desc: "Controlla il 50% delle scorte locali"
  },
  en: {
    play: "MINIGAME",
    clicker_title: "Kebab Clicker",
    clicker_subtitle: "Slice the meat to earn cents",
    clicker_bonus: "Bonus Ready",
    bonus_title: "Welcome Bonus",
    bonus_desc: "Claim your starting capital to begin arbitrage.",
    bonus_claimed: "Bonus Claimed",
    bonus_claim: "Claim 5.00€",
    goals_title: "Market Goals",
    goal_chips: "Chips King",
    goal_chips_desc: "Accumulate 100 portions of sides",
    goal_camel: "Livestock Tycoon",
    goal_camel_desc: "Own 5 camels at once",
    goal_onion: "Onion Monopoly",
    goal_onion_desc: "Control 50% of local stock"
  },
  de: {
    play: "MINISPIEL",
    clicker_title: "Kebab Clicker",
    clicker_subtitle: "Fleisch schneiden, um Cents zu verdienen",
    clicker_bonus: "Bonus bereit",
    bonus_title: "Willkommensbonus",
    bonus_desc: "Holen Sie sich Ihr Startkapital, um mit Arbitrage zu beginnen.",
    bonus_claimed: "Bonus erhalten",
    bonus_claim: "5,00€ erhalten",
    goals_title: "Marktziele",
    goal_chips: "Pommes-König",
    goal_chips_desc: "Sammle 100 Portionen Beilagen",
    goal_camel: "Viehmagnat",
    goal_camel_desc: "Besitze 5 Kamele gleichzeitig",
    goal_onion: "Zwiebelmonopol",
    goal_onion_desc: "Kontrolliere 50% des lokalen Bestands"
  },
  ar: {
    play: "لعبة صغيرة",
    clicker_title: "كباب كليكر",
    clicker_subtitle: "قطع اللحم لكسب السنتات",
    clicker_bonus: "مكافأة جاهزة",
    bonus_title: "مكافأة ترحيبية",
    bonus_desc: "طالب برأسمالك الأولي لبدء المراجحة.",
    bonus_claimed: "تمت المطالبة بالمكافأة",
    bonus_claim: "طالب بـ 5.00€",
    goals_title: "أهداف السوق",
    goal_chips: "ملك البطاطس",
    goal_chips_desc: "اجمع 100 حصة من الجوانب",
    goal_camel: "قطب الماشية",
    goal_camel_desc: "امتلك 5 جمال في وقت واحد",
    goal_onion: "احتكار البصل",
    goal_onion_desc: "السيطرة على 50٪ من المخزون المحلي"
  }
};

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [language, setLanguageState] = useState<Language>('it');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [balance, setBalance] = useState<number>(0.00);
  const [isBlackMarketOpen, setBlackMarketOpen] = useState(false);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [portions, setPortions] = useState<Record<string, number>>({ meat: 0, bread: 0, wrap: 0 });
  const [buyLocation, setBuyLocation] = useState(KEBAB_FACTORS.LOCATION[0]);
  const [sellLocation, setSellLocation] = useState(KEBAB_FACTORS.LOCATION[1]);
  const [isRealMode, setIsRealMode] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('it-IT'));
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  
  const allKebabAssets = [...KEBAB_MARKET_ASSETS, ...BLACK_MARKET_ASSETS];
  const allLivestockAssets = [...LIVESTOCK_ASSETS, ...BLACK_MARKET_LIVESTOCK];
  const allIngredientAssets = [...INGREDIENT_ASSETS, ...BLACK_MARKET_INGREDIENTS];

  const [marketState, setMarketState] = useState<MarketState>({
    kebabPrices: Object.fromEntries(allKebabAssets.map(a => [a.id, a.basePrice])),
    livestockPrices: Object.fromEntries(allLivestockAssets.map(a => [a.id, a.basePrice])),
    ingredientPrices: Object.fromEntries(allIngredientAssets.map(a => [a.id, a.basePrice]))
  });
  const [history, setHistory] = useState<PricePoint[]>([]);

  // Implementation of t function
  const t = (key: string): string => {
    return TRANSLATIONS[language][key] || key;
  };

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const p = JSON.parse(data);
        setBalance(p.balance || 0);
        setInventory(p.inventory || {});
        setPortions(p.portions || { meat: 0, bread: 0, wrap: 0 });
        setMarketState(p.marketState || marketState);
        setHistory(p.history || []);
        setIsRealMode(p.isRealMode || false);
        setLanguageState(p.language || 'it');
        setCurrency(p.currency || 'EUR');
        if (p.buyLocation) setBuyLocation(p.buyLocation);
        if (p.sellLocation) setSellLocation(p.sellLocation);
        setBlackMarketOpen(p.isBlackMarketOpen || false);
      } catch (e) { console.error(e); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        balance, inventory, portions, marketState, history: history.slice(-50), isRealMode, language, currency, buyLocation, sellLocation, isBlackMarketOpen
      }));
    }
  }, [isLoaded, balance, inventory, portions, marketState, history, isRealMode, language, currency, buyLocation, sellLocation, isBlackMarketOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('it-IT'));
      setHistory(prev => {
        const newPoint: PricePoint = { time: now.toLocaleTimeString('it-IT'), isReal: isRealMode };
        KEBAB_MARKET_ASSETS.forEach(a => {
           const lastPrice = prev.length > 0 ? prev[prev.length-1][a.id] || a.basePrice : a.basePrice;
           newPoint[a.id] = lastPrice * (0.998 + Math.random() * 0.004);
        });
        return [...prev, newPoint].slice(-50);
      });
    }, 15000);
    return () => clearInterval(timer);
  }, [isRealMode]);

  const getFinalPrice = (id: string, location: any): number => {
    const locMult = location?.mult || 1.0;
    if (EXCHANGE_RATES[id]) return 1 / EXCHANGE_RATES[id];
    const isKebab = allKebabAssets.some(a => a.id === id);
    const isCamel = allLivestockAssets.some(a => a.id === id);
    const base = isKebab ? marketState.kebabPrices[id] : isCamel ? marketState.livestockPrices[id] : marketState.ingredientPrices[id];
    return (base || 1) * locMult;
  };

  const buyAsset = (id: string, price: number) => {
    if (balance >= price) {
      setBalance(b => b - price);
      // Cast to any to handle optional yields/yieldType properties correctly
      const ing = (allIngredientAssets as any[]).find(a => a.id === id);
      if (ing?.yields) {
        setPortions(p => ({ ...p, [ing.yieldType!]: (p[ing.yieldType!] || 0) + ing.yields! }));
      } else {
        setInventory(i => ({ ...i, [id]: (i[id] || 0) + 1 }));
      }
    }
  };

  const assembleKebab = (kebabId: string): boolean => {
    const recipe = CRAFTING_RECIPES[kebabId];
    if (!recipe) return false;
    for (const [ingId, count] of Object.entries(recipe)) {
      if (['meat', 'bread', 'wrap'].includes(ingId)) {
        if ((portions[ingId] || 0) < count) return false;
      } else {
        if ((inventory[ingId] || 0) < count) return false;
      }
    }
    setPortions(p => {
      const newP = { ...p };
      Object.keys(recipe).forEach(ingId => { if (['meat', 'bread', 'wrap'].includes(ingId)) newP[ingId] -= recipe[ingId]; });
      return newP;
    });
    setInventory(i => {
      const newI = { ...i };
      Object.keys(recipe).forEach(ingId => { if (!['meat', 'bread', 'wrap'].includes(ingId)) newI[ingId] -= recipe[ingId]; });
      newI[kebabId] = (newI[kebabId] || 0) + 1;
      return newI;
    });
    return true;
  };

  const syncWithReality = async () => {
    setIsSyncing(true);
    try {
      const date = new Date().toLocaleDateString();
      const [priceData, newsData] = await Promise.all([
        kebabGuru.fetchRealMarketPrices(date),
        kebabGuru.fetchSectorNews(date)
      ]);
      if (newsData) setNews(newsData);
      if (priceData) {
        const kMatches = priceData.text.match(/VALORE_REALE_BERLINO:\s*(\d+\.?\d*)/);
        const cMatches = priceData.text.match(/VALORE_REALE_CAMMELLO:\s*(\d+\.?\d*)/);
        let kRatio = kMatches ? parseFloat(kMatches[1]) / 5.0 : 1.0;
        let cRatio = cMatches ? parseFloat(cMatches[1]) / 2200.0 : 1.0;
        setMarketState(prev => ({
          ...prev,
          kebabPrices: Object.fromEntries(allKebabAssets.map(a => [a.id, a.basePrice * kRatio])),
          livestockPrices: Object.fromEntries(allLivestockAssets.map(a => [a.id, a.basePrice * cRatio])),
          ingredientPrices: Object.fromEntries(allIngredientAssets.map(a => [a.id, a.basePrice * kRatio]))
        }));
        setIsRealMode(true);
        setLastSync(new Date().toLocaleTimeString());
        setSources(priceData.sources);
      }
    } catch (e) { console.error(e); } finally { setIsSyncing(false); }
  };

  return (
    <MarketContext.Provider value={{ 
      marketState, history, news, balance, inventory, portions, isSyncing, isRealMode, lastSync, 
      currentTime, buyLocation, setBuyLocation, sellLocation, setSellLocation, sources, 
      buyAsset, sellAsset: (id, p) => { if(inventory[id]>0) { setBalance(b => b+p); setInventory(i => ({...i, [id]: i[id]-1})) } },
      assembleKebab, syncWithReality, addFunds: (a) => setBalance(b => b + a), getFinalPrice, 
      isBlackMarketOpen, setBlackMarketOpen,
      swapAssets: (f, t, a, fp, tp) => { 
        const val = a * fp;
        if (inventory[f] >= a) { setInventory(i => ({...i, [f]: i[f]-a, [t]: (i[t]||0)+(val/tp)})); return true; }
        return false;
      },
      resetData: () => { localStorage.clear(); window.location.reload(); },
      language, setLanguage: setLanguageState, currency, setCurrency, t
    }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const c = useContext(MarketContext);
  if (!c) throw new Error('Context error');
  return c;
};
