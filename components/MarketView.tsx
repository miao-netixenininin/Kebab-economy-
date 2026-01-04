
import React, { useState, useMemo } from 'react';
import { useMarket } from '../context/MarketContext';
import { 
  KEBAB_MARKET_ASSETS, 
  LIVESTOCK_ASSETS, 
  INGREDIENT_ASSETS, 
  KEBAB_FACTORS, 
  CAMEL_FACTORS 
} from '../constants';

type TradeMode = 'buy' | 'sell';

const MarketView: React.FC = () => {
  const { 
    news, isSyncing, syncWithReality, buyAsset, sellAsset, inventory,
    specs, setSpecs, getFinalPrice, marketState
  } = useMarket();

  const [kebabMode, setKebabMode] = useState<TradeMode>('buy');
  const [camelMode, setCamelMode] = useState<TradeMode>('buy');

  const [selKebab, setSelKebab] = useState(KEBAB_MARKET_ASSETS[0]);
  const [selCamel, setSelCamel] = useState(LIVESTOCK_ASSETS[0]);
  const [selIng, setSelIng] = useState(INGREDIENT_ASSETS[0]);

  const kPrice = useMemo(() => getFinalPrice(selKebab.id), [selKebab.id, marketState, specs]);
  const cPrice = useMemo(() => getFinalPrice(selCamel.id), [selCamel.id, marketState, specs]);

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      {/* TICKER LIVE */}
      <div className="bg-black py-4 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="flex animate-[scroll_50s_linear_infinite] will-change-transform whitespace-nowrap gap-16 text-white font-black uppercase text-[10px] tracking-[0.2em] px-8">
          <span className="text-red-500">🚨 MONITORAGGIO BERLINO: DÖNERPREIS WATCH ATTIVO</span>
          <span className="text-orange-500">FONTI CERTIFICATE: BERLINO CAPUT MUNDI, QUOTIDIANO.NET</span>
          <span className="flex items-center gap-2">💹 LIVE 1 {selCamel.icon} = {(cPrice / kPrice).toFixed(1)} {selKebab.icon}</span>
          {KEBAB_MARKET_ASSETS.slice(0, 4).map(a => (
            <span key={a.id} className="text-orange-400">{a.icon} {a.name}: {getFinalPrice(a.id).toFixed(2)}€</span>
          ))}
        </div>
      </div>

      {/* SELECTION PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* KEBAB CONFIG */}
        <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-xl">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-orange-500"></span>
             Configurazione Asset Kebab
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div>
               <label className="text-[9px] font-black text-gray-400 uppercase block mb-2">Tipo Carne</label>
               <select 
                 value={specs.kebab.protein.id}
                 onChange={(e) => {
                   const val = KEBAB_FACTORS.PROTEIN.find(p => p.id === e.target.value);
                   setSpecs(prev => ({ ...prev, kebab: { ...prev.kebab, protein: val } }));
                 }}
                 className="w-full bg-orange-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none cursor-pointer"
               >
                 {KEBAB_FACTORS.PROTEIN.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
               </select>
             </div>
             <div>
               <label className="text-[9px] font-black text-gray-400 uppercase block mb-2">Località Shop</label>
               <select 
                 value={specs.kebab.location.id}
                 onChange={(e) => {
                   const val = KEBAB_FACTORS.LOCATION.find(p => p.id === e.target.value);
                   setSpecs(prev => ({ ...prev, kebab: { ...prev.kebab, location: val } }));
                 }}
                 className="w-full bg-orange-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none cursor-pointer"
               >
                 {KEBAB_FACTORS.LOCATION.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
               </select>
             </div>
             <div>
               <label className="text-[9px] font-black text-gray-400 uppercase block mb-2">Presentazione</label>
               <select 
                 value={specs.kebab.format.id}
                 onChange={(e) => {
                   const val = KEBAB_FACTORS.FORMAT.find(p => p.id === e.target.value);
                   setSpecs(prev => ({ ...prev, kebab: { ...prev.kebab, format: val } }));
                 }}
                 className="w-full bg-orange-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none cursor-pointer"
               >
                 {KEBAB_FACTORS.FORMAT.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
               </select>
             </div>
           </div>
        </div>

        {/* CAMEL CONFIG */}
        <div className="bg-white rounded-[40px] p-8 border border-amber-100 shadow-xl">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-amber-500"></span>
             Specifica Cammelli (Livestock)
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div>
               <label className="text-[9px] font-black text-gray-400 uppercase block mb-2">Sesso</label>
               <select 
                 value={specs.camel.gender.id}
                 onChange={(e) => {
                   const val = CAMEL_FACTORS.GENDER.find(p => p.id === e.target.value);
                   setSpecs(prev => ({ ...prev, camel: { ...prev.camel, gender: val } }));
                 }}
                 className="w-full bg-amber-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none cursor-pointer"
               >
                 {CAMEL_FACTORS.GENDER.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
               </select>
             </div>
             <div>
               <label className="text-[9px] font-black text-gray-400 uppercase block mb-2">Impiego</label>
               <select 
                 value={specs.camel.use.id}
                 onChange={(e) => {
                   const val = CAMEL_FACTORS.USE.find(p => p.id === e.target.value);
                   setSpecs(prev => ({ ...prev, camel: { ...prev.camel, use: val } }));
                 }}
                 className="w-full bg-amber-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none cursor-pointer"
               >
                 {CAMEL_FACTORS.USE.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
               </select>
             </div>
             <div>
               <label className="text-[9px] font-black text-gray-400 uppercase block mb-2">Regione</label>
               <select 
                 value={specs.camel.location.id}
                 onChange={(e) => {
                   const val = CAMEL_FACTORS.LOCATION.find(p => p.id === e.target.value);
                   setSpecs(prev => ({ ...prev, camel: { ...prev.camel, location: val } }));
                 }}
                 className="w-full bg-amber-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none cursor-pointer"
               >
                 {CAMEL_FACTORS.LOCATION.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
               </select>
             </div>
           </div>
        </div>
      </div>

      {/* TERMINALS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KEBAB */}
        <div className="bg-[#0b0b0b] rounded-[48px] p-8 border border-white/5 text-white shadow-2xl flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black">KEBAB <span className="text-orange-500">PRO™</span></h3>
            <div className="flex bg-white/5 p-1 rounded-2xl">
              <button onClick={()=>setKebabMode('buy')} className={`px-5 py-2 rounded-xl text-[10px] font-black ${kebabMode === 'buy' ? 'bg-orange-600' : 'text-gray-500'}`}>Acquista</button>
              <button onClick={()=>setKebabMode('sell')} className={`px-5 py-2 rounded-xl text-[10px] font-black ${kebabMode === 'sell' ? 'bg-red-600' : 'text-gray-500'}`}>Vendi</button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {KEBAB_MARKET_ASSETS.map(a => (
              <button key={a.id} onClick={() => setSelKebab(a)} className={`p-3 rounded-2xl border ${selKebab.id === a.id ? 'border-orange-500 bg-orange-500/20' : 'border-white/5 bg-white/5'}`}>
                <div className="text-xl">{a.icon}</div>
              </button>
            ))}
          </div>
          <div className="bg-white/5 rounded-[32px] p-7 mt-auto border border-white/10">
            <div className="flex justify-between items-end mb-5">
              <div>
                 <span className="text-[9px] font-black text-gray-500 uppercase block mb-1">Prezzo Unità</span>
                 <div className="text-4xl font-black">{kPrice.toFixed(2)}€</div>
              </div>
              <div className="text-right">
                 <span className="text-[9px] font-black text-gray-500 uppercase block mb-1">In Possesso</span>
                 <div className="text-lg font-black text-orange-500">{inventory[selKebab.id] || 0}</div>
              </div>
            </div>
            <button onClick={() => kebabMode === 'buy' ? buyAsset(selKebab.id, kPrice) : sellAsset(selKebab.id, kPrice)} className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] ${kebabMode === 'buy' ? 'bg-orange-600' : 'bg-red-600'}`}>
              {kebabMode === 'buy' ? 'Esegui Scambio' : 'Vendi Asset'}
            </button>
          </div>
        </div>

        {/* CAMEL */}
        <div className="bg-[#0b0b0b] rounded-[48px] p-8 border border-white/5 text-white shadow-2xl flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black">CAMEL <span className="text-amber-500">X™</span></h3>
            <div className="flex bg-white/5 p-1 rounded-2xl">
              <button onClick={()=>setCamelMode('buy')} className={`px-5 py-2 rounded-xl text-[10px] font-black ${camelMode === 'buy' ? 'bg-amber-600' : 'text-gray-500'}`}>Acquista</button>
              <button onClick={()=>setCamelMode('sell')} className={`px-5 py-2 rounded-xl text-[10px] font-black ${camelMode === 'sell' ? 'bg-red-600' : 'text-gray-500'}`}>Vendi</button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {LIVESTOCK_ASSETS.map(a => (
              <button key={a.id} onClick={() => setSelCamel(a)} className={`p-3 rounded-2xl border ${selCamel.id === a.id ? 'border-amber-500 bg-amber-500/20' : 'border-white/5 bg-white/5'}`}>
                <div className="text-xl">{a.icon}</div>
              </button>
            ))}
          </div>
          <div className="bg-white/5 rounded-[32px] p-7 mt-auto border border-white/10">
            <div className="flex justify-between items-end mb-5">
              <div>
                 <span className="text-[9px] font-black text-gray-500 uppercase block mb-1">Valore Mercato</span>
                 <div className="text-4xl font-black">{cPrice.toFixed(0)}€</div>
              </div>
              <div className="text-right">
                 <span className="text-[9px] font-black text-gray-500 uppercase block mb-1">In Stalla</span>
                 <div className="text-lg font-black text-amber-500">{inventory[selCamel.id] || 0}</div>
              </div>
            </div>
            <button onClick={() => camelMode === 'buy' ? buyAsset(selCamel.id, cPrice) : sellAsset(selCamel.id, cPrice)} className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] ${camelMode === 'buy' ? 'bg-amber-600' : 'bg-red-600'}`}>
              Acquisisci / Liquida
            </button>
          </div>
        </div>

        {/* RAW GOODS */}
        <div className="bg-[#0b0b0b] rounded-[48px] p-8 border border-white/5 text-white shadow-2xl flex flex-col min-h-[500px]">
          <h3 className="text-xl font-black mb-6">MATERIE <span className="text-green-500">PRIME™</span></h3>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {INGREDIENT_ASSETS.map(a => (
              <button key={a.id} onClick={() => setSelIng(a)} className={`p-4 rounded-3xl border ${selIng.id === a.id ? 'border-green-500 bg-green-500/20' : 'border-white/5 bg-white/5'}`}>
                <div className="text-2xl">{a.icon}</div>
              </button>
            ))}
          </div>
          <div className="bg-white/5 rounded-[32px] p-8 mt-auto border border-white/10">
            <div className="flex justify-between items-end mb-5">
              <div>
                 <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">Prezzo Ingrosso</span>
                 <div className="text-4xl font-black">{(marketState.ingredientPrices[selIng.id] || 0.50).toFixed(2)}€</div>
              </div>
              <div className="text-right">
                 <span className="text-[9px] font-black text-gray-500 uppercase block mb-1">Stock</span>
                 <div className="text-lg font-black text-green-500">{inventory[selIng.id] || 0}</div>
              </div>
            </div>
            <button onClick={() => buyAsset(selIng.id, marketState.ingredientPrices[selIng.id])} className="w-full py-5 rounded-2xl font-black uppercase text-[11px] bg-green-600">
              Rifornisci Materia Prima
            </button>
          </div>
        </div>
      </div>

      {/* REAL NEWS TERMINAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[40px] p-10 border border-orange-100 shadow-xl h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div>
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Terminale Notizie Verificate</h4>
              <p className="text-[9px] text-orange-500 font-bold uppercase tracking-widest mt-1">Dati Reali - 2024/2026</p>
            </div>
          </div>
          <div className="space-y-4 overflow-y-auto pr-4 scrollbar-hide">
            {news.map((item, i) => (
              <div key={i} className="group flex gap-5 items-start p-5 rounded-3xl hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100">
                <div className="shrink-0 flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full mt-2 ${item.impact === 'up' ? 'bg-green-500' : item.impact === 'down' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <div className="w-[1px] h-full bg-gray-100 mt-2"></div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs font-black text-gray-900 uppercase leading-tight">{item.headline}</div>
                    <span className="text-[8px] font-black bg-gray-100 px-2 py-0.5 rounded text-gray-400 whitespace-nowrap ml-2">{item.date}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-3">{item.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">FONTE: {item.source}</span>
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-[9px] font-black text-orange-500 hover:text-orange-600 uppercase flex items-center gap-1">
                      Leggi Articolo ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[48px] p-12 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="text-9xl">📡</span>
           </div>
           <div className="relative z-10">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-10">Sincronizzatore Mercato Globale</h4>
              <p className="text-3xl font-black leading-tight tracking-tighter">
                Accedi ai dati reali sulla crisi del Kebab a Berlino e alle quotazioni del bestiame certificato.
              </p>
           </div>
           <button onClick={syncWithReality} disabled={isSyncing} className="w-full bg-orange-600 text-white py-7 rounded-[32px] font-black uppercase text-xs tracking-[0.2em] mt-12 hover:bg-orange-500 transition-all shadow-xl disabled:opacity-50">
             {isSyncing ? '📡 ANALIZZANDO FONTI REALI...' : '🔄 SINCRONIZZA DATI REALI'}
           </button>
        </div>
      </div>

      <style>{`
        @keyframes scroll { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MarketView;
