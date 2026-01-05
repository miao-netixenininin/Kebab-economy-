
import React, { useState, useMemo } from 'react';
import { useMarket } from '../context/MarketContext';
import { 
  KEBAB_MARKET_ASSETS, 
  LIVESTOCK_ASSETS, 
  INGREDIENT_ASSETS, 
  EXCHANGE_RATES,
  CURRENCY_SYMBOLS
} from '../constants';

const Converter: React.FC = () => {
  const { getFinalPrice, inventory, swapAssets, balance, currency, language, buyLocation } = useMarket();
  const [sourceAmount, setSourceAmount] = useState<string>('1');
  const [sourceAssetId, setSourceAssetId] = useState<string>('dromedary');
  const [targetAssetId, setTargetAssetId] = useState<string>('doner');
  const [swapStatus, setSwapStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const allAssets = useMemo(() => [
    { id: 'EUR', name: 'Euro', icon: '€', type: 'fiat' },
    { id: 'SAR', name: 'Riyal', icon: '﷼', type: 'fiat' },
    ...KEBAB_MARKET_ASSETS.map(a => ({ ...a, type: 'kebab' })),
    ...LIVESTOCK_ASSETS.map(a => ({ ...a, type: 'livestock' })),
    ...INGREDIENT_ASSETS.map(a => ({ ...a, type: 'ingredient' })),
  ], []);

  const sPrice = getFinalPrice(sourceAssetId, buyLocation);
  const tPrice = getFinalPrice(targetAssetId, buyLocation);

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

  const isFiat = EXCHANGE_RATES[sourceAssetId] !== undefined;
  const userHasEnough = isFiat ? (balance >= amountValue * sPrice) : ((inventory[sourceAssetId] || 0) >= amountValue);

  return (
    <div className="glass rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-black text-white tracking-tighter uppercase">Arbitrage Terminal</h2>
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{buyLocation.name} Market</div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Swap from</label>
            <span className="text-[8px] font-black text-gray-600 uppercase">Val: {(sPrice * EXCHANGE_RATES[currency]).toFixed(2)} {CURRENCY_SYMBOLS[currency]}</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              value={sourceAmount}
              onChange={(e) => setSourceAmount(e.target.value)}
              className="bg-transparent text-2xl font-black text-white outline-none w-full"
              placeholder="0"
            />
            <select value={sourceAssetId} onChange={(e) => setSourceAssetId(e.target.value)} className="bg-[#111] text-xs font-bold text-gray-400 outline-none p-2 rounded-xl">
              {allAssets.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Receive to</label>
            <span className="text-[8px] font-black text-gray-600 uppercase">Val: {(tPrice * EXCHANGE_RATES[currency]).toFixed(2)} {CURRENCY_SYMBOLS[currency]}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-black text-orange-500 w-full truncate">{resultValue.toFixed(2)}</div>
            <select value={targetAssetId} onChange={(e) => setTargetAssetId(e.target.value)} className="bg-[#111] text-xs font-bold text-gray-400 outline-none p-2 rounded-xl">
              {allAssets.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={handleExecuteSwap}
          disabled={!userHasEnough || amountValue <= 0 || swapStatus !== 'idle'}
          className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-500
            ${swapStatus === 'success' ? 'bg-green-500 text-white' : swapStatus === 'error' ? 'bg-red-500 text-white' : 'bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-20'}
          `}
        >
          {swapStatus === 'success' ? 'Arbitrage Completed ✓' : swapStatus === 'error' ? 'Insufficient Balance' : 'Confirm Arbitrage'}
        </button>
      </div>
    </div>
  );
};

export default Converter;
