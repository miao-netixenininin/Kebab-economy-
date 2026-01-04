
import React, { useState, useEffect } from 'react';
import Converter from './components/Converter';
import KebabStats from './components/KebabStats';
import GuruChat from './components/GuruChat';
import MarketView from './components/MarketView';
import Minigames from './components/Minigames';
import { MarketProvider, useMarket } from './context/MarketContext';
import { KEBAB_FACTS } from './constants';

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

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [needsKey, setNeedsKey] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { balance, addFunds, currentTime, currentDate, resetData } = useMarket();

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

  return (
    <div className="min-h-screen pb-4 bg-[#fdf8f6] selection:bg-orange-100 flex flex-col relative">
      {needsKey && (
        <div className="bg-orange-600 text-white px-4 py-3 flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider sticky top-0 z-[60] shadow-lg">
          <span>⚠️ Il Guru richiede una chiave API valida per i dati reali</span>
          <button onClick={handleOpenKeySelection} className="bg-white text-orange-600 px-4 py-1.5 rounded-full hover:bg-orange-50 transition-all shadow-md">
            Seleziona API Key
          </button>
        </div>
      )}

      {/* MODALE CHI SIAMO */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsAboutOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden border border-orange-100 animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
            <button 
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black hover:bg-orange-100 transition-colors"
            >
              ✕
            </button>
            <div className="p-10 md:p-14">
              <span className="text-5xl mb-6 block">🌯</span>
              <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                La Visione <span className="text-orange-500">Kebab Economy™</span>
              </h2>
              <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
                <p>
                  Nata dall'intuizione del <strong>Visir della Carne</strong> e del <strong>Guru del Döner</strong>, Kebab Economy™ non è solo un'applicazione, ma il primo terminale di arbitraggio globale basato sul <em>"Döner Standard"</em>.
                </p>
                <p>
                  In un mondo flagellato dall'iperinflazione, abbiamo capito che il prezzo di un panino a Berlino è l'indicatore economico più onesto del pianeta. Monitoriamo in tempo reale i mercati del bestiame, le fluttuazioni del prezzo delle cipolle e le politiche della <em>Dönerpreisbremse</em> per offrirti dati certi.
                </p>
                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                  <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">La Nostra Tecnologia</h4>
                  <p className="text-xs text-orange-800/70">
                    Utilizziamo <strong>Gemini AI</strong> per scansionare i feed web globali e certificare che ogni singola quotazione sia verificata. Dai circuiti di corsa di Dubai ai chioschi di Kreuzberg, siamo i tuoi occhi sul mercato.
                  </p>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fondazione</span>
                  <span className="text-sm font-bold text-gray-900">Berlino-Dubai, 2026</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Stato Marchio</span>
                  <span className="text-sm font-bold text-green-600 uppercase tracking-tighter">Attivo & Certificato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 px-4 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('dashboard')}>
              <span className="text-4xl">🌯</span>
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-none flex items-start">
                  KEBAB<span className="text-orange-500">ECONOMY</span>
                  <span className="text-[10px] ml-0.5 font-black text-gray-400">™</span>
                </h1>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter tabular-nums">{currentDate}</span>
                  <span className="text-[8px] text-gray-300">|</span>
                  <span className="text-[9px] font-black text-orange-400 uppercase tracking-tighter tabular-nums">{currentTime}</span>
                </div>
              </div>
            </div>
          </div>
          
          <nav className="flex gap-4 md:gap-8">
            <button onClick={() => setActiveView('dashboard')} className={`text-[10px] md:text-sm font-black uppercase tracking-tighter transition-all ${activeView === 'dashboard' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}>Dashboard</button>
            <button onClick={() => setActiveView('market')} className={`text-[10px] md:text-sm font-black uppercase tracking-tighter transition-all ${activeView === 'market' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}>Exchange</button>
            <button onClick={() => setActiveView('play')} className={`text-[10px] md:text-sm font-black uppercase tracking-tighter transition-all ${activeView === 'play' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}>Play</button>
          </nav>

          <div className="group relative">
            <div className="bg-gray-900 px-5 py-2.5 rounded-2xl flex flex-col items-end shadow-xl border border-gray-800 cursor-pointer">
              <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest opacity-80">Portfolio</span>
              <span className="text-lg md:text-xl font-black text-white leading-tight tabular-nums tracking-tighter">{balance.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            <button 
              onClick={resetData}
              className="absolute -bottom-10 right-0 hidden group-hover:block bg-red-600 text-white text-[8px] font-black uppercase px-3 py-1.5 rounded-lg shadow-xl hover:bg-red-700 transition-all z-50"
            >
              Ripristina Dati
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-12 flex-grow w-full">
        {activeView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="flex flex-col gap-8">
              <Converter />
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <span className="text-8xl">📊</span>
                </div>
                <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2 text-xs uppercase tracking-widest">
                   <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                   Analisi di Mercato
                </h3>
                <div className="space-y-6">
                  {KEBAB_FACTS.map((fact, i) => (
                    <div key={i} className="group cursor-default">
                      <h4 className="font-extrabold text-orange-600 text-sm group-hover:text-orange-500 transition-colors mb-1">{fact.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">{fact.description}</p>
                      {i < KEBAB_FACTS.length - 1 && <hr className="mt-6 border-gray-50" />}
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

      {/* FOOTER CON MARCHIO DI FABBRICA INTERATTIVO */}
      <footer className="max-w-6xl mx-auto px-4 py-20 border-t border-orange-100 mt-12 w-full flex flex-col items-center justify-center">
        <div 
          className="relative mb-8 cursor-pointer group active:scale-95 transition-transform" 
          onClick={() => setIsAboutOpen(true)}
          title="Clicca per scoprire chi siamo"
        >
          {/* SIGILLO DI GARANZIA */}
          <div className="w-24 h-24 border-2 border-dashed border-orange-200 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite] group-hover:opacity-100 group-hover:border-orange-400 opacity-40 transition-all">
            <span className="text-[6px] font-black text-orange-500 uppercase tracking-[0.3em]">certified ● original ● certified ● original ●</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center grayscale group-hover:grayscale-0 transition-all">
            <span className="text-3xl">🌯</span>
            <span className="text-[6px] font-black text-orange-500 mt-1 uppercase tracking-tighter">Chi Siamo</span>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <span className="h-[1px] w-12 bg-gray-100"></span>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] select-none">
              kebab economy-original
            </p>
            <span className="h-[1px] w-12 bg-gray-100"></span>
          </div>
          
          <p className="text-[9px] font-bold text-orange-400/70 uppercase tracking-[0.2em]">
            powered by gemini ai studio
          </p>
          
          <div className="pt-8">
            <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.8em]">
              © 2026 OFFICIAL TRADEMARK™
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => (
  <MarketProvider>
    <AppContent />
  </MarketProvider>
);

export default App;
