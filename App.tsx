
import React, { useState, useEffect } from 'react';
import Converter from './components/Converter';
import KebabStats from './components/KebabStats';
import GuruChat from './components/GuruChat';
import MarketView from './components/MarketView';
import Minigames from './components/Minigames';
import { MarketProvider, useMarket, Language } from './context/MarketContext';
import { KEBAB_FACTS, EXCHANGE_RATES, CURRENCY_SYMBOLS } from './constants';

type View = 'dashboard' | 'market' | 'play';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useMarket();
  const langs: { id: Language; flag: string; label: string }[] = [
    { id: 'it', flag: '🇮🇹', label: 'ITA' },
    { id: 'en', flag: '🇺🇸', label: 'ENG' }
  ];

  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl shadow-inner">
      {langs.map((l) => (
        <button
          key={l.id}
          onClick={() => setLanguage(l.id)}
          className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 ${
            language === l.id ? 'bg-white text-orange-600 shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span>{l.flag}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
};

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [needsKey, setNeedsKey] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { balance, addFunds, currentTime, currentDate, resetData, language, currency, t, syncWithReality, isSyncing, isRealMode } = useMarket();

  useEffect(() => {
    const checkKeyStatus = async () => {
      try {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) setNeedsKey(true);
        }
      } catch (err) {
        console.warn("AI Studio API non disponibile");
      }
    };
    checkKeyStatus();
  }, []);

  const handleOpenKeySelection = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setNeedsKey(false);
    }
  };

  const displayBalance = balance * EXCHANGE_RATES[currency];

  return (
    <div className="min-h-screen pb-4 bg-[#fdf8f6] selection:bg-orange-100 flex flex-col relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {needsKey && (
        <div className="bg-orange-600 text-white px-4 py-3 flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider sticky top-0 z-[60] shadow-lg">
          <span>⚠️ {t('apiWarning')}</span>
          <button onClick={handleOpenKeySelection} className="bg-white text-orange-600 px-4 py-1.5 rounded-full hover:bg-orange-50 transition-all shadow-md">
            API Key
          </button>
        </div>
      )}

      <div className="bg-white border-b border-orange-50 py-2 px-4 flex items-center justify-between sticky top-0 z-40 gap-4 shadow-sm">
        <LanguageSelector />
        <button 
          onClick={syncWithReality} 
          disabled={isSyncing}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all shadow-md active:scale-95 ${
            isRealMode ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-orange-600 text-white hover:bg-orange-500'
          }`}
        >
          {isSyncing ? t('syncing') : t('sync')}
        </button>
      </div>

      {isAboutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={() => setIsAboutOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden border border-orange-100 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-red-600"></div>
            <button 
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black hover:bg-orange-600 hover:text-white transition-all"
            >
              ✕
            </button>
            <div className="p-10 md:p-14">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl">📜</span>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                  {t('aboutVision')}
                </h2>
              </div>
              <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
                <p className="text-lg">{t('about_p1')}</p>
                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                  <p className="text-sm font-bold text-orange-800">{t('about_p2')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-[50px] md:top-0 z-40 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-20">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <span className="text-4xl">🌯</span>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">
                KEBAB<span className="text-orange-500">ECONOMY</span>
              </h1>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] font-black text-orange-400 uppercase tracking-tighter">{currentTime}</span>
              </div>
            </div>
          </div>
          
          <nav className="flex gap-4 md:gap-8">
            <button onClick={() => setActiveView('dashboard')} className={`text-[10px] md:text-xs font-black uppercase transition-all ${activeView === 'dashboard' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}>{t('dashboard')}</button>
            <button onClick={() => setActiveView('market')} className={`text-[10px] md:text-xs font-black uppercase transition-all ${activeView === 'market' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}>{t('exchange')}</button>
            <button onClick={() => setActiveView('play')} className={`text-[10px] md:text-xs font-black uppercase transition-all ${activeView === 'play' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}>{t('play')}</button>
          </nav>

          <div className="group relative">
            <div className="bg-gray-900 px-4 py-2 rounded-2xl flex flex-col items-end shadow-xl border border-gray-800 cursor-pointer min-w-[120px]">
              <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest">{t('portfolio')}</span>
              <span className="text-base font-black text-white tabular-nums">
                {displayBalance.toLocaleString(language, { maximumFractionDigits: 2 })} {CURRENCY_SYMBOLS[currency]}
              </span>
            </div>
            <button onClick={resetData} className="absolute -bottom-8 right-0 hidden group-hover:block bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded shadow-lg">RESET</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-12 flex-grow w-full">
        {activeView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="flex flex-col gap-8">
              <Converter />
              <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-orange-100 relative overflow-hidden">
                <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2 text-xs uppercase tracking-widest">
                   <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                   {t('market_analysis')}
                </h3>
                <div className="space-y-8">
                  {KEBAB_FACTS.map((fact, i) => (
                    <div key={i}>
                      <h4 className="font-black text-orange-600 text-sm mb-1 uppercase tracking-tight">{fact.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">{fact.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <KebabStats />
              <GuruChat />
            </div>
          </div>
        )}

        {activeView === 'market' && <MarketView />}
        {activeView === 'play' && <Minigames onWin={addFunds} />}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-16 mt-12 w-full flex flex-col items-center">
        <div className="relative mb-4 cursor-pointer group active:scale-95" onClick={() => setIsAboutOpen(true)}>
          <div className="w-24 h-24 border-2 border-dashed border-orange-300 rounded-full flex items-center justify-center animate-[spin_30s_linear_infinite] opacity-50">
            <span className="text-[6px] font-black text-orange-600 uppercase tracking-[0.4em]">vision ● whitepaper ● vision ●</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl group-hover:scale-125 transition-transform">📜</span>
          </div>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{t('footer_original')}</p>
        <p className="text-[8px] font-black text-orange-400 uppercase tracking-widest opacity-60">powered by gemini neural network</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <MarketProvider>
    <AppContent />
  </MarketProvider>
);

export default App;
