
import React, { useState } from 'react';
import Converter from './components/Converter';
import KebabStats from './components/KebabStats';
import GuruChat from './components/GuruChat';
import MarketView from './components/MarketView';
import Minigames from './components/Minigames';
import AboutUs from './components/AboutUs';
import { MarketProvider, useMarket } from './context/MarketContext';
import { CURRENCY_SYMBOLS, EXCHANGE_RATES } from './constants';

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'market' | 'play' | 'about'>('dashboard');
  const { balance, addFunds, currency, buyLocation, isBlackMarketOpen } = useMarket();

  const displayBalance = balance * EXCHANGE_RATES[currency];

  return (
    <div className={`min-h-screen pb-10 flex flex-col selection:bg-orange-500/30 transition-colors duration-1000 ${isBlackMarketOpen ? 'bg-[#050508]' : 'bg-[#0a0a0c]'}`}>
      
      <header className="glass sticky top-0 z-50 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => setActiveView('dashboard')}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 ${isBlackMarketOpen ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/10 text-orange-500'}`}>
              🌯
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-white tracking-tighter leading-none uppercase">
                KEBAB<span className={isBlackMarketOpen ? 'text-purple-500' : 'text-orange-500'}>PRO</span>
              </h1>
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-0.5">{buyLocation.name} TERMINAL</span>
            </div>
          </div>
          
          <nav className="hidden md:flex bg-white/5 p-1 rounded-2xl border border-white/5 gap-1">
            {['dashboard', 'market', 'play', 'about'].map(view => (
              <button 
                key={view}
                onClick={() => setActiveView(view as any)} 
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${activeView === view ? (isBlackMarketOpen ? 'bg-purple-600 shadow-purple-500/20' : 'bg-orange-500 shadow-orange-500/20') + ' text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {view}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-xl border border-white/10">
              <span className={`text-md font-black tabular-nums ${isBlackMarketOpen ? 'text-purple-400' : 'text-white'}`}>
                {displayBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })} {CURRENCY_SYMBOLS[currency]}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white/[0.01] border-b border-white/5 py-2 overflow-hidden">
         <div className="flex animate-scroll whitespace-nowrap gap-24">
            {['DONER INDEX STABLE', 'CAMEL FUTURES SURGE', 'DEEP WEB ARBITRAGE OPEN', 'BERLIN MARKET OPTIMAL', 'SAR EXCHANGE PEGGED'].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-1 h-1 rounded-full ${isBlackMarketOpen ? 'bg-purple-500' : 'bg-orange-500'}`}></span>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">{t}</span>
              </div>
            ))}
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-10 w-full flex-grow soft-entry">
        {activeView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-8">
               <Converter />
               <div className="glass p-8 rounded-[32px]">
                 <div className="flex items-center gap-3 mb-6">
                    <div className={`w-1 h-6 rounded-full ${isBlackMarketOpen ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Sovereign Intel</h3>
                 </div>
                 <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                   <p className="text-xs font-medium text-gray-400 leading-relaxed italic">"Chi compra l'oro mangia metallo. Chi compra kebab mangia il futuro."</p>
                   <span className="text-[8px] font-bold text-gray-600 uppercase block mt-2">— Proverbio Deep Web</span>
                 </div>
               </div>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <KebabStats />
              <GuruChat />
            </div>
          </div>
        )}

        {activeView === 'market' && <MarketView />}
        {activeView === 'play' && <Minigames onWin={addFunds} />}
        {activeView === 'about' && <AboutUs />}
      </main>

      <footer className="mt-20 py-10 flex flex-col items-center opacity-30">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">KEBAB ECONOMY ORIGINAL ● EST. 2026</p>
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
