
import React from 'react';
import { useMarket } from '../context/MarketContext';
import { 
  KEBAB_MARKET_ASSETS, 
  BLACK_MARKET_ASSETS,
  LIVESTOCK_ASSETS,
  BLACK_MARKET_LIVESTOCK,
  INGREDIENT_ASSETS, 
  BLACK_MARKET_INGREDIENTS,
  EXCHANGE_RATES, 
  CURRENCY_SYMBOLS, 
  KEBAB_FACTORS, 
  CRAFTING_RECIPES 
} from '../constants';

const MarketView: React.FC = () => {
  const { 
    news, inventory, portions, getFinalPrice, currency, sources, buyAsset, sellAsset, assembleKebab,
    buyLocation, setBuyLocation, sellLocation, setSellLocation, isBlackMarketOpen
  } = useMarket();

  const currentKebabs = isBlackMarketOpen ? [...KEBAB_MARKET_ASSETS, ...BLACK_MARKET_ASSETS] : KEBAB_MARKET_ASSETS;
  const currentLivestock = isBlackMarketOpen ? [...LIVESTOCK_ASSETS, ...BLACK_MARKET_LIVESTOCK] : LIVESTOCK_ASSETS;
  const currentIngredients = isBlackMarketOpen ? [...INGREDIENT_ASSETS, ...BLACK_MARKET_INGREDIENTS] : INGREDIENT_ASSETS;

  const getRecipeStatus = (kebabId: string) => {
    const recipe = CRAFTING_RECIPES[kebabId];
    if (!recipe) return [];
    return Object.entries(recipe).map(([ingId, required]) => {
      const isPortion = ['meat', 'bread', 'wrap'].includes(ingId);
      const current = isPortion ? (portions[ingId] || 0) : (inventory[ingId] || 0);
      // Cast to any to safely check yieldType which exists on some ingredient assets
      const meta = (currentIngredients as any[]).find(a => (a.id === ingId || a.yieldType === ingId));
      return { id: ingId, name: meta?.name || ingId, icon: meta?.icon || '📦', required, current, satisfied: current >= required };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 soft-entry">
      <div className="lg:col-span-8 space-y-12">
        
        {/* Market Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white uppercase tracking-widest">Sede d'Acquisto</label>
            <select 
              value={buyLocation.id}
              onChange={(e) => setBuyLocation(KEBAB_FACTORS.LOCATION.find(l => l.id === e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-gray-300 outline-none transition-all"
            >
              {KEBAB_FACTORS.LOCATION.map(l => (
                <option key={l.id} value={l.id} className="bg-[#111]" disabled={l.id === 'black_market' && !isBlackMarketOpen}>
                  {l.icon} {l.name} {l.id === 'black_market' && !isBlackMarketOpen ? '(Locked)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white uppercase tracking-widest">Sede di Vendita</label>
            <select 
              value={sellLocation.id}
              onChange={(e) => setSellLocation(KEBAB_FACTORS.LOCATION.find(l => l.id === e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-gray-300 outline-none transition-all"
            >
              {KEBAB_FACTORS.LOCATION.map(l => <option key={l.id} value={l.id} className="bg-[#111]">{l.icon} {l.name}</option>)}
            </select>
          </div>
        </div>

        {isBlackMarketOpen && (
          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-1 rounded-3xl animate-pulse">
            <div className="bg-black/80 p-6 rounded-[22px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">🕶️</span>
                <div>
                  <h3 className="text-lg font-black text-purple-400 tracking-tighter uppercase">Deep Web Active</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Prices unlocked: 85% discount enabled</p>
                </div>
              </div>
              <div className="text-purple-500/50 text-xs font-mono">X-ACCESS-GRANTED</div>
            </div>
          </div>
        )}

        {/* Master Kebab Catalog */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentKebabs.map(a => {
              const bPrice = getFinalPrice(a.id, buyLocation);
              const sPrice = getFinalPrice(a.id, sellLocation);
              const recipe = getRecipeStatus(a.id);
              const craftable = recipe.length > 0 && recipe.every(r => r.satisfied);
              const isBlack = BLACK_MARKET_ASSETS.some(ba => ba.id === a.id);

              return (
                <div key={a.id} className={`glass p-8 rounded-[40px] flex flex-col transition-all duration-500 ${isBlack ? 'border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : ''}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${isBlack ? 'bg-purple-500/10' : 'bg-white/5'}`}>{a.icon}</div>
                    <div className="text-right">
                      <h4 className={`text-xl font-black tracking-tighter ${isBlack ? 'text-purple-400' : 'text-white'}`}>{a.name}</h4>
                      <span className="text-[10px] font-black text-gray-500 uppercase">Stock: {inventory[a.id] || 0}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 text-center">
                      <span className="text-[8px] font-black text-gray-500 uppercase block">Buy</span>
                      <span className="text-sm font-black text-white">{(bPrice * EXCHANGE_RATES[currency]).toFixed(2)}{CURRENCY_SYMBOLS[currency]}</span>
                    </div>
                    <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 text-center">
                      <span className="text-[8px] font-black text-gray-500 uppercase block">Sell</span>
                      <span className="text-sm font-black text-green-500">{(sPrice * EXCHANGE_RATES[currency]).toFixed(2)}{CURRENCY_SYMBOLS[currency]}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {recipe.map(r => (
                      <div key={r.id} className={`px-2 py-1 rounded-lg border text-[9px] font-bold ${r.satisfied ? 'border-green-500/30 text-green-400 bg-green-500/5' : 'border-red-500/30 text-red-400 bg-red-500/5'}`}>
                        {r.icon} {r.required} {r.satisfied ? '✓' : '✕'}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto space-y-2">
                    <div className="flex gap-2">
                      <button onClick={() => buyAsset(a.id, bPrice)} className="flex-grow py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10">Acquista</button>
                      <button onClick={() => sellAsset(a.id, sPrice)} className="flex-grow py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500/10 text-green-500">Vendi</button>
                    </div>
                    <button onClick={() => assembleKebab(a.id)} disabled={!craftable} className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${craftable ? 'bg-orange-600 hover:bg-orange-500 shadow-xl' : 'bg-white/5 text-gray-600 opacity-50 cursor-not-allowed'}`}>
                      {craftable ? 'Assembla Kebab 🛠️' : 'Ingredienti Insufficienti'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Raw Goods Market</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentIngredients.map(a => {
              const price = getFinalPrice(a.id, buyLocation);
              const isBM = BLACK_MARKET_INGREDIENTS.some(i => i.id === a.id);
              return (
                <div key={a.id} className={`glass p-4 rounded-3xl flex flex-col items-center gap-2 ${isBM ? 'border-purple-500/30' : ''}`}>
                  <div className="text-3xl">{a.icon}</div>
                  <div className="text-[10px] font-black text-white text-center h-8 leading-tight">{a.name}</div>
                  <span className="text-[10px] font-black text-orange-400">{(price * EXCHANGE_RATES[currency]).toFixed(2)}{CURRENCY_SYMBOLS[currency]}</span>
                  <button onClick={() => buyAsset(a.id, price)} className="w-full py-1.5 bg-white/5 rounded-xl text-[8px] font-black uppercase">Import</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-4 space-y-8">
        <div className="glass p-8 rounded-[40px] border-orange-500/10 shadow-2xl sticky top-28">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-8">Intelligence Feed</h2>
          <div className="space-y-8">
            {news.map((n, i) => (
              <div key={i} className="group border-l-2 border-white/5 pl-5 py-1 hover:border-orange-500 transition-all">
                <h4 className="text-xs font-black text-white leading-tight mb-2 group-hover:text-orange-500">{n.headline}</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-4">{n.summary}</p>
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Intel Source →</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketView;
