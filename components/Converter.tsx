
import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { 
  KEBAB_MARKET_ASSETS, 
  LIVESTOCK_ASSETS, 
  INGREDIENT_ASSETS, 
  EXCHANGE_RATES 
} from '../constants';

const Converter: React.FC = () => {
  const { getFinalPrice, inventory, swapAssets, balance, specs } = useMarket();
  const [sourceAmount, setSourceAmount] = useState<string>('1');
  const [sourceAssetId, setSourceAssetId] = useState<string>('dromedary');
  const [targetAssetId, setTargetAssetId] = useState<string>('doner');
  const [swapStatus, setSwapStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const allAssets = [
    { id: 'EUR', name: 'Euro', icon: '€', type: 'fiat' },
    { id: 'USD', name: 'Dollaro', icon: '$', type: 'fiat' },
    { id: 'GBP', name: 'Sterlina', icon: '£', type: 'fiat' },
    ...KEBAB_MARKET_ASSETS.map(a => ({ ...a, type: 'kebab' })),
    ...LIVESTOCK_ASSETS.map(a => ({ ...a, type: 'livestock' })),
    ...INGREDIENT_ASSETS.map(a => ({ ...a, type: 'ingredient' })),
  ];

  const sourceAsset = allAssets.find(a => a.id === sourceAssetId) || allAssets[0];
  const targetAsset = allAssets.find(a => a.id === targetAssetId) || allAssets[4];

  const sPrice = getFinalPrice(sourceAssetId);
  const tPrice = getFinalPrice(targetAssetId);

  const amountValue = parseFloat(sourceAmount) || 0;
  const resultValue = tPrice > 0 ? (amountValue * sPrice) / tPrice : 0;

  const handleExecuteSwap = () => {
    const success = swapAssets(sourceAssetId, targetAssetId, amountValue, sPrice, tPrice);
    if (success) {
      setSwapStatus('success');
      setTimeout(() => setSwapStatus('idle'), 2000);
    } else {
      setSwapStatus('error');
      setTimeout(() => setSwapStatus('idle'), 2000);
    }
  };

  const isFiat = ['EUR', 'USD', 'GBP'].includes(sourceAssetId);
  const userHasEnough = isFiat ? (balance >= amountValue * sPrice) : ((inventory[sourceAssetId] || 0) >= amountValue);

  return (
    <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-orange-100 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500"></div>
      
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-gray-200">
            💱
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-none">Terminale Swap</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Cambio Diretto Configurato</p>
          </div>
        </div>
        {inventory[sourceAssetId] !== undefined && (
          <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
             <span className="text-[9px] font-black text-orange-400 uppercase block tracking-tighter">Il tuo Saldo</span>
             <span className="text-sm font-black text-orange-600 tabular-nums">{(inventory[sourceAssetId] || 0).toFixed(2)} {sourceAsset.icon}</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Source Input */}
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 transition-all focus-within:ring-2 focus-within:ring-orange-200">
          <div className="flex justify-between items-center mb-4">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Cedi Beni</label>
            <span className="text-[8px] font-black text-gray-300 uppercase">Valutazione: {sPrice.toFixed(2)}€</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              value={sourceAmount}
              onChange={(e) => setSourceAmount(e.target.value)}
              className="bg-transparent text-3xl font-black text-gray-900 outline-none w-full tabular-nums"
              placeholder="0.00"
            />
            <select 
              value={sourceAssetId}
              onChange={(e) => setSourceAssetId(e.target.value)}
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3 font-black text-sm outline-none shadow-sm cursor-pointer hover:bg-orange-50 transition-colors max-w-[150px]"
            >
              {allAssets.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-8 relative z-10">
          <button 
            onClick={() => {
              const temp = sourceAssetId;
              setSourceAssetId(targetAssetId);
              setTargetAssetId(temp);
            }}
            className="w-14 h-14 bg-white border-4 border-gray-50 rounded-full shadow-xl flex items-center justify-center text-orange-600 hover:rotate-180 transition-transform duration-500 active:scale-90"
          >
            ↓↑
          </button>
        </div>

        {/* Target Output */}
        <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl shadow-gray-300 transition-all">
          <div className="flex justify-between items-center mb-4">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Ricevi Beni</label>
            <span className="text-[8px] font-black text-gray-500 uppercase">Valutazione: {tPrice.toFixed(2)}€</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-black tabular-nums truncate w-full text-orange-500">
              {resultValue.toLocaleString('it-IT', { maximumFractionDigits: 3 })}
            </div>
            <select 
              value={targetAssetId}
              onChange={(e) => setTargetAssetId(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 font-black text-sm outline-none shadow-sm cursor-pointer hover:bg-white/10 transition-colors text-white max-w-[150px]"
            >
              {allAssets.map(a => <option key={a.id} value={a.id} className="text-black">{a.icon} {a.name}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={handleExecuteSwap}
          disabled={!userHasEnough || amountValue <= 0 || swapStatus !== 'idle'}
          className={`w-full py-6 rounded-[32px] font-black uppercase text-xs tracking-[0.3em] transition-all shadow-2xl relative overflow-hidden
            ${swapStatus === 'success' ? 'bg-green-500' : swapStatus === 'error' ? 'bg-red-500' : 'bg-orange-600 hover:bg-orange-500 active:scale-95 disabled:opacity-30 disabled:grayscale'}
          `}
        >
          {swapStatus === 'success' ? 'SCAMBIO COMPLETATO!' : swapStatus === 'error' ? 'FONDI INSUFFICIENTI' : userHasEnough ? `SCAMBIA ${sourceAsset.icon} CON ${targetAsset.icon}` : 'ASSET INSUFFICIENTI'}
        </button>
      </div>

      {/* Info dinamiche sul setup corrente */}
      <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Configurazione Carne</span>
          <span className="text-[10px] font-bold text-gray-700">{specs.kebab.protein.icon} {specs.kebab.protein.name} x{specs.kebab.format.name}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Configurazione Bestiame</span>
          <span className="text-[10px] font-bold text-gray-700">{specs.camel.gender.icon} {specs.camel.use.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Converter;
