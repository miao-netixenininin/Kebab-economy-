
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { KEBAB_MARKET_ASSETS, LIVESTOCK_ASSETS, INGREDIENT_ASSETS, KEBAB_FACTORS, CAMEL_FACTORS } from '../constants';
import { kebabGuru, NewsItem } from '../services/geminiService';

interface PricePoint {
  time: string;
  kebab: number;
  livestock: number;
  isReal: boolean;
}

interface AssetSpecs {
  kebab: { protein: any; format: any; location: any };
  camel: { gender: any; use: any; location: any };
}

interface MarketState {
  kebabPrices: Record<string, number>;
  livestockPrices: Record<string, number>;
  ingredientPrices: Record<string, number>;
}

interface MarketContextType {
  marketState: MarketState;
  realityMultipliers: Record<string, any>;
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
  specs: AssetSpecs;
  setSpecs: React.Dispatch<React.SetStateAction<AssetSpecs>>;
  buyAsset: (id: string, price: number) => void;
  sellAsset: (id: string, price: number) => void;
  swapAssets: (fromId: string, toId: string, amount: number, fromPrice: number, toPrice: number) => boolean;
  syncWithReality: () => Promise<void>;
  addFunds: (amount: number) => void;
  getFinalPrice: (id: string) => number;
  resetData: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const STORAGE_KEY = 'kebab_economy_stable_v7_sector_only';

const FALLBACK_NEWS: NewsItem[] = [
  { 
    headline: "Record ad Abu Dhabi: Cammello venduto per 2M di Euro", 
    summary: "Un esemplare raro di Al-Wadhah ha battuto ogni record durante l'asta annuale del festival del bestiame.", 
    source: "The National", 
    impact: "up",
    date: "2024-10-05",
    url: "https://www.thenationalnews.com"
  },
  { 
    headline: "Prezzi Berlino: Chioschi in rivolta contro il caro carne", 
    summary: "Molti proprietari di chioschi segnalano difficoltà nel mantenere il prezzo sotto i 7 euro a causa dell'aumento dei costi logistici.", 
    source: "Tagesspiegel", 
    impact: "down",
    date: "2024-11-12",
    url: "https://www.tagesspiegel.de"
  }
];

const getSimulatedDate = () => {
  const now = new Date();
  return now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [balance, setBalance] = useState<number>(15000.00);
  const [inventory, setInventory] = useState<Record<string, number>>({ 'doner': 10, 'dromedary': 1 });
  const [isRealMode, setIsRealMode] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('it-IT'));
  const [currentDate, setCurrentDate] = useState<string>(getSimulatedDate());
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [news, setNews] = useState<NewsItem[]>(FALLBACK_NEWS);
  
  const [marketState, setMarketState] = useState<MarketState>({
    kebabPrices: Object.fromEntries(KEBAB_MARKET_ASSETS.map(a => [a.id, a.basePrice])),
    livestockPrices: Object.fromEntries(LIVESTOCK_ASSETS.map(a => [a.id, a.basePrice])),
    ingredientPrices: Object.fromEntries(INGREDIENT_ASSETS.map(a => [a.id, a.basePrice]))
  });
  
  const [specs, setSpecs] = useState<AssetSpecs>({
    kebab: { protein: KEBAB_FACTORS.PROTEIN[0], format: KEBAB_FACTORS.FORMAT[0], location: KEBAB_FACTORS.LOCATION[0] },
    camel: { gender: CAMEL_FACTORS.GENDER[0], use: CAMEL_FACTORS.USE[0], location: CAMEL_FACTORS.LOCATION[1] }
  });
  
  const [history, setHistory] = useState<PricePoint[]>([{
    time: new Date().toLocaleTimeString('it-IT'), kebab: 5.0, livestock: 2200, isReal: false
  }]);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const p = JSON.parse(data);
        if (p.balance !== undefined) setBalance(p.balance);
        if (p.inventory) setInventory(p.inventory);
        if (p.news) setNews(p.news);
        if (p.marketState) setMarketState(p.marketState);
        if (p.history) setHistory(p.history);
        if (p.isRealMode !== undefined) setIsRealMode(p.isRealMode);
        if (p.lastSync) setLastSync(p.lastSync);
        if (p.specs) setSpecs(p.specs);
        if (p.sources) setSources(p.sources);
      } catch (e) { console.error("Recupero dati fallito", e); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      balance, inventory, news, marketState, history: history.slice(-50), isRealMode, lastSync, specs, sources
    }));
  }, [isLoaded, balance, inventory, news, marketState, history, isRealMode, lastSync, specs, sources]);

  const stateRef = useRef(marketState);
  useEffect(() => { stateRef.current = marketState; }, [marketState]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('it-IT')), 1000);
    return () => clearInterval(timer);
  }, []);

  const getFinalPrice = (id: string): number => {
    if (['EUR', 'USD', 'GBP'].includes(id)) return 1;
    
    const isKebab = KEBAB_MARKET_ASSETS.some(a => a.id === id);
    const isCamel = LIVESTOCK_ASSETS.some(a => a.id === id);
    
    if (isKebab) {
      const base = marketState.kebabPrices[id] || 5;
      return base * specs.kebab.protein.mult * specs.kebab.format.mult * specs.kebab.location.mult;
    }
    if (isCamel) {
      const base = marketState.livestockPrices[id] || 2200;
      return base * specs.camel.gender.mult * specs.camel.use.mult * specs.camel.location.mult;
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
      
      if (newsData && newsData.length > 0) {
        setNews(newsData);
      }

      if (priceData) {
        const kebabMatches = priceData.text.match(/VALORE_REALE_BERLINO:\s*(\d+\.?\d*)/);
        const camelMatches = priceData.text.match(/VALORE_REALE_CAMMELLO:\s*(\d+\.?\d*)/);
        
        let kebabRatio = 1.0;
        let camelRatio = 1.0;

        if (kebabMatches) {
          kebabRatio = parseFloat(kebabMatches[1]) / 5.0;
        }
        if (camelMatches) {
          camelRatio = parseFloat(camelMatches[1]) / 2200.0;
        }
        
        setMarketState(prev => ({
          ...prev,
          kebabPrices: Object.fromEntries(KEBAB_MARKET_ASSETS.map(a => [a.id, a.basePrice * kebabRatio])),
          livestockPrices: Object.fromEntries(LIVESTOCK_ASSETS.map(a => [a.id, a.basePrice * camelRatio]))
        }));
        
        setIsRealMode(true);
        setLastSync(new Date().toLocaleTimeString('it-IT'));
        setSources(priceData.sources);
      }
    } catch (e) {
      console.error("Errore sincronizzazione dati reali di settore:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const tick = setInterval(() => {
      setMarketState(prev => {
        const fluct = (val: number) => val * (0.9997 + Math.random() * 0.0006);
        return {
          kebabPrices: Object.fromEntries(Object.entries(prev.kebabPrices).map(([id, p]) => [id, fluct(p as number)])),
          livestockPrices: Object.fromEntries(Object.entries(prev.livestockPrices).map(([id, p]) => [id, fluct(p as number)])),
          ingredientPrices: Object.fromEntries(Object.entries(prev.ingredientPrices).map(([id, p]) => [id, fluct(p as number)]))
        };
      });
      
      setHistory(prev => {
        const currentKebab = (Object.values(stateRef.current.kebabPrices)[0] as number) || 5.0;
        const currentLivestock = (Object.values(stateRef.current.livestockPrices)[0] as number) || 2200;
        return [...prev, { 
          time: new Date().toLocaleTimeString('it-IT'), 
          kebab: currentKebab, 
          livestock: currentLivestock, 
          isReal: isRealMode 
        }].slice(-50);
      });
    }, 15000);
    return () => clearInterval(tick);
  }, [isRealMode]);

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
    const totalValue = amount * fromPrice;
    if (['EUR', 'USD', 'GBP'].includes(fromId)) {
      if (balance >= totalValue) {
        setBalance(prev => prev - totalValue);
        const received = totalValue / toPrice;
        setInventory(prev => ({ ...prev, [toId]: (prev[toId] || 0) + received }));
        return true;
      }
    } else if ((inventory[fromId] || 0) >= amount) {
      const received = totalValue / toPrice;
      setInventory(prev => ({ 
        ...prev, 
        [fromId]: (prev[fromId] || 0) - amount, 
        [toId]: (prev[toId] || 0) + received 
      }));
      return true;
    }
    return false;
  };

  return (
    <MarketContext.Provider value={{ 
      marketState, realityMultipliers: {}, history, news, balance, inventory, 
      isSyncing, isRealMode, lastSync, currentTime, currentDate, sources, specs, setSpecs, buyAsset, sellAsset, swapAssets, syncWithReality, addFunds: (a) => setBalance(b => b + a), getFinalPrice, resetData: () => { localStorage.clear(); window.location.reload(); }
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
