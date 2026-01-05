
import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { 
  KEBAB_MARKET_ASSETS, 
  LIVESTOCK_ASSETS, 
  INGREDIENT_ASSETS, 
  KEBAB_FACTORS, 
  CAMEL_FACTORS,
  CURRENCY_SYMBOLS,
  EXCHANGE_RATES
} from '../constants';

const MarketView: React.FC = () => {
  const { 
    inventory, getFinalPrice, t, currency, language, buyAsset, sellAsset
  } = useMarket();

  // Arbitrage Locations
  const [buyLoc, setBuyLoc] = useState(KEBAB_FACTORS.LOCATION[0]); // Default: Berlin
  const [sellLoc, setSellLoc] = useState(KEBAB_FACTORS.LOCATION[4]); // Default: NY

  // Specs (Meat for Kebab, Gender/Use for Camels)
  const [kebabSpec, setKebabSpec] = useState({ protein: KEBAB_FACTORS.PROTEIN[0], format: KEBAB_FACTORS.FORMAT[0] });
  const [camelSpec, setCamelSpec] = useState({ gender: CAMEL_FACTORS.GENDER[0], use: CAMEL_FACTORS.USE[0] });

  // Currently selected assets
  const [buyKebab, setBuyKebab] = useState(KEBAB_MARKET_ASSETS[0]);
  const [sellKebab, setSellKebab] = useState(KEBAB_MARKET_ASSETS[0]);
  const [buyCamel, setBuyCamel] = useState(LIVESTOCK_ASSETS[0]);
  const [sellCamel, setSellCamel] = useState(LIVESTOCK_ASSETS[0]);
  const [buyIng, setBuyIng] = useState(INGREDIENT_ASSETS[0]);
  const [sellIng, setSellIng] = useState(INGREDIENT_ASSETS[0]);

  const displayPrice = (p: number) => (p * EXCHANGE_RATES[currency]).toLocaleString(language, { maximumFractionDigits: 2 }) + CURRENCY_SYMBOLS[currency];

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      {/* MARKET TICKER */}
      <div className="bg-black py-4 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="flex animate-[scroll_50s_linear_infinite] whitespace-nowrap gap-16 text-white font-black uppercase text-[10px] tracking-[0.2em] px-8">
          <span className="text-red-500">🚨 ARBITRAGE WATCH: NY-ISTANBUL GAP OPEN</span>
          {KEBAB_MARKET_ASSETS.slice(0, 4).map(a => (
            <span key={a.id} className="text-orange-400">{a.icon} {t(a.id)}: {displayPrice(getFinalPrice(a.id, buyLoc, kebabSpec))}</span>
          ))}
          <span className="text-amber-500">🐫 CAMEL AUCTIONS HOT IN RIYADH</span>
          <span className="text-green-500">🧅 ONION FUTURES RISING</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BUYING TERMINAL */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-[48px] p-10 border border-blue-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{t('buyingTerminal')}</h2>
                <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">Acquista al prezzo locale della sorgente</p>
              </div>
              <div className="text-right">
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">{t('location')}</label>
                <select 
                  value={buyLoc.id}
                  onChange={(e) => setBuyLoc(KEBAB_FACTORS.LOCATION.find(l => l.id === e.target.value)!)}
                  className="bg-blue-50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer text-blue-700"
                >
                  {KEBAB_FACTORS.LOCATION.map(l => <option key={l.id} value={l.id}>{l.icon} {t(l.id)}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {/* Kebab Buy Section */}
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  {KEBAB_MARKET_ASSETS.map(a => (
                    <button key={a.id} onClick={() => setBuyKebab(a)} className={`w-10 h-10 rounded-xl text-xl transition-all shadow-sm ${buyKebab.id === a.id ? 'bg-blue-500 text-white scale-110' : 'bg-white grayscale hover:grayscale-0'}`} title={t(a.id)}>
                      {a.icon}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-grow">
                    <h4 className="text-lg font-black text-gray-800">{t(buyKebab.id)}</h4>
                    <div className="text-2xl font-black text-blue-600">{displayPrice(getFinalPrice(buyKebab.id, buyLoc, kebabSpec))}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[8px] font-black text-gray-400 uppercase">Carne</label>
                    <select 
                      value={kebabSpec.protein.id}
                      onChange={(e) => setKebabSpec(prev => ({ ...prev, protein: KEBAB_FACTORS.PROTEIN.find(p => p.id === e.target.value)! }))}
                      className="bg-white border border-blue-100 rounded-lg px-2 py-1 text-[10px] font-black uppercase text-gray-500 outline-none shadow-sm"
                    >
                      {KEBAB_FACTORS.PROTEIN.map(p => <option key={p.id} value={p.id}>{p.icon} {t(p.id)}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => buyAsset(buyKebab.id, getFinalPrice(buyKebab.id, buyLoc, kebabSpec))} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-blue-200 active:scale-95 transition-transform">
                  {t('buy')}
                </button>
              </div>

              {/* Camel Buy Section */}
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  {LIVESTOCK_ASSETS.map(a => (
                    <button key={a.id} onClick={() => setBuyCamel(a)} className={`w-10 h-10 rounded-xl text-xl transition-all shadow-sm ${buyCamel.id === a.id ? 'bg-blue-500 text-white scale-110' : 'bg-white grayscale hover:grayscale-0'}`} title={t(a.id)}>
                      {a.icon}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <h4 className="text-lg font-black text-gray-800">{t(buyCamel.id)}</h4>
                    <div className="text-2xl font-black text-blue-600">{displayPrice(getFinalPrice(buyCamel.id, buyLoc, camelSpec))}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <select 
                        value={camelSpec.gender.id}
                        onChange={(e) => setCamelSpec(prev => ({ ...prev, gender: CAMEL_FACTORS.GENDER.find(g => g.id === e.target.value)! }))}
                        className="bg-white border border-blue-100 rounded-lg px-2 py-1 text-[9px] font-black uppercase text-gray-500 outline-none shadow-sm"
                      >
                        {CAMEL_FACTORS.GENDER.map(g => <option key={g.id} value={g.id}>{g.icon} {t(g.id)}</option>)}
                     </select>
                     <select 
                        value={camelSpec.use.id}
                        onChange={(e) => setCamelSpec(prev => ({ ...prev, use: CAMEL_FACTORS.USE.find(u => u.id === e.target.value)! }))}
                        className="bg-white border border-blue-100 rounded-lg px-2 py-1 text-[9px] font-black uppercase text-gray-500 outline-none shadow-sm"
                      >
                        {CAMEL_FACTORS.USE.map(u => <option key={u.id} value={u.id}>{u.icon} {t(u.id)}</option>)}
                     </select>
                  </div>
                </div>
                <button onClick={() => buyAsset(buyCamel.id, getFinalPrice(buyCamel.id, buyLoc, camelSpec))} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-blue-200 active:scale-95 transition-transform">
                  {t('buy')}
                </button>
              </div>

              {/* Raw Goods Buy Section */}
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-4">{t('raw_goods')}</div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {INGREDIENT_ASSETS.map(a => (
                    <button key={a.id} onClick={() => setBuyIng(a)} className={`w-full aspect-square rounded-xl text-lg flex items-center justify-center transition-all ${buyIng.id === a.id ? 'bg-blue-500 text-white scale-105 shadow-md' : 'bg-white grayscale hover:grayscale-0 shadow-sm'}`} title={t(a.id)}>
                      {a.icon}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-grow">
                    <h4 className="text-sm font-black text-gray-800 uppercase">{t(buyIng.id)}</h4>
                    <div className="text-xl font-black text-blue-600">{displayPrice(getFinalPrice(buyIng.id, buyLoc))}</div>
                  </div>
                </div>
                <button onClick={() => buyAsset(buyIng.id, getFinalPrice(buyIng.id, buyLoc))} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-[9px] uppercase shadow-md active:scale-95 transition-transform">
                  {t('buy')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SELLING TERMINAL */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-[48px] p-10 border border-orange-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-orange-500"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{t('sellingTerminal')}</h2>
                <p className="text-[10px] font-bold text-orange-500 uppercase mt-1">Vendi al prezzo locale della destinazione</p>
              </div>
              <div className="text-right">
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">{t('location')}</label>
                <select 
                  value={sellLoc.id}
                  onChange={(e) => setSellLoc(KEBAB_FACTORS.LOCATION.find(l => l.id === e.target.value)!)}
                  className="bg-orange-50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer text-orange-700"
                >
                  {KEBAB_FACTORS.LOCATION.map(l => <option key={l.id} value={l.id}>{l.icon} {t(l.id)}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {/* Kebab Sell Section */}
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  {KEBAB_MARKET_ASSETS.map(a => (
                    <button key={a.id} onClick={() => setSellKebab(a)} className={`w-10 h-10 rounded-xl text-xl transition-all shadow-sm ${sellKebab.id === a.id ? 'bg-orange-500 text-white scale-110' : 'bg-white grayscale hover:grayscale-0'}`} title={t(a.id)}>
                      {a.icon}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-grow">
                    <h4 className="text-lg font-black text-gray-800">{t(sellKebab.id)}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">In Stock: {inventory[sellKebab.id] || 0}</span>
                    </div>
                    <div className="text-2xl font-black text-orange-600">{displayPrice(getFinalPrice(sellKebab.id, sellLoc, kebabSpec))}</div>
                  </div>
                </div>
                <button onClick={() => sellAsset(sellKebab.id, getFinalPrice(sellKebab.id, sellLoc, kebabSpec))} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-orange-200 active:scale-95 transition-transform disabled:opacity-30 disabled:grayscale" disabled={!inventory[sellKebab.id]}>
                  {t('sell')}
                </button>
              </div>

              {/* Camel Sell Section */}
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  {LIVESTOCK_ASSETS.map(a => (
                    <button key={a.id} onClick={() => setSellCamel(a)} className={`w-10 h-10 rounded-xl text-xl transition-all shadow-sm ${sellCamel.id === a.id ? 'bg-orange-500 text-white scale-110' : 'bg-white grayscale hover:grayscale-0'}`} title={t(a.id)}>
                      {a.icon}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <h4 className="text-lg font-black text-gray-800">{t(sellCamel.id)}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">In Stock: {inventory[sellCamel.id] || 0}</span>
                    </div>
                    <div className="text-2xl font-black text-orange-600">{displayPrice(getFinalPrice(sellCamel.id, sellLoc, camelSpec))}</div>
                  </div>
                </div>
                <button onClick={() => sellAsset(sellCamel.id, getFinalPrice(sellCamel.id, sellLoc, camelSpec))} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-orange-200 active:scale-95 transition-transform disabled:opacity-30 disabled:grayscale" disabled={!inventory[sellCamel.id]}>
                  {t('sell')}
                </button>
              </div>

              {/* Raw Goods Sell Section */}
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-4">{t('raw_goods')}</div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {INGREDIENT_ASSETS.map(a => (
                    <button key={a.id} onClick={() => setSellIng(a)} className={`w-full aspect-square rounded-xl text-lg flex items-center justify-center transition-all ${sellIng.id === a.id ? 'bg-orange-500 text-white scale-105 shadow-md' : 'bg-white grayscale hover:grayscale-0 shadow-sm'}`} title={t(a.id)}>
                      {a.icon}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-grow">
                    <h4 className="text-sm font-black text-gray-800 uppercase">{t(sellIng.id)}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">In Stock: {inventory[sellIng.id] || 0}</span>
                    </div>
                    <div className="text-xl font-black text-orange-600">{displayPrice(getFinalPrice(sellIng.id, sellLoc))}</div>
                  </div>
                </div>
                <button onClick={() => sellAsset(sellIng.id, getFinalPrice(sellIng.id, sellLoc))} className="w-full bg-orange-600 text-white py-3 rounded-xl font-black text-[9px] uppercase shadow-md active:scale-95 transition-transform disabled:opacity-30 disabled:grayscale" disabled={!inventory[sellIng.id]}>
                  {t('sell')}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketView;
