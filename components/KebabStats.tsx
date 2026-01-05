
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMarket } from '../context/MarketContext';
import { KEBAB_MARKET_ASSETS, LIVESTOCK_ASSETS, KEBAB_FACTORS } from '../constants';

const KebabStats: React.FC = () => {
  // Fix: homeLocation and setHomeLocation were not defined in MarketContextType. Using buyLocation and setBuyLocation as the primary market display.
  const { history, buyLocation, setBuyLocation, isRealMode, syncWithReality, isSyncing } = useMarket();
  const [trackedAsset, setTrackedAsset] = useState(KEBAB_MARKET_ASSETS[0].id);

  const chartData = useMemo(() => history.map(p => ({
    time: p.time,
    value: p[trackedAsset] || 0,
    isReal: p.isReal
  })), [history, trackedAsset]);

  const allTrackable = [...KEBAB_MARKET_ASSETS, ...LIVESTOCK_ASSETS.slice(0, 4)];

  return (
    <div className="glass rounded-[32px] p-8 flex flex-col h-[520px] relative overflow-hidden shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Market Feed</h2>
          </div>
          <div className="flex gap-2">
             <select 
               // Fix: Updated to use buyLocation from context
               value={buyLocation.id}
               // Fix: Updated to use setBuyLocation from context
               onChange={(e) => setBuyLocation(KEBAB_FACTORS.LOCATION.find(l => l.id === e.target.value))}
               className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] font-bold text-gray-400 outline-none hover:bg-white/10 transition-all"
             >
               {KEBAB_FACTORS.LOCATION.map(l => <option key={l.id} value={l.id} className="bg-[#111]">{l.icon} {l.name}</option>)}
             </select>
             <select 
               value={trackedAsset}
               onChange={(e) => setTrackedAsset(e.target.value)}
               className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-1.5 text-[10px] font-bold text-orange-500 outline-none hover:bg-orange-500/20 transition-all"
             >
               {allTrackable.map(a => <option key={a.id} value={a.id} className="bg-[#111]">{a.icon} {a.name}</option>)}
             </select>
          </div>
        </div>

        <button 
          onClick={syncWithReality} 
          disabled={isSyncing}
          className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all duration-500 btn-soft ${isRealMode ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`}
        >
          {isSyncing ? '📡 Sincronizzazione...' : isRealMode ? '✓ Dati Reali' : 'Sincronizza Gemini'}
        </button>
      </div>

      <div className="flex-grow opacity-90">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ background: 'rgba(10,10,12,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px', color: '#fff' }}
              itemStyle={{ color: '#f97316', fontWeight: '800' }}
              cursor={{ stroke: 'rgba(249,115,22,0.2)', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#f97316" 
              strokeWidth={4} 
              fill="url(#colorVal)" 
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
         <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Volatility Status</span>
            <div className="text-sm font-black text-white mt-1 uppercase tracking-tighter">Stable Flow</div>
         </div>
         <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Market Sentiment</span>
            <div className="text-sm font-black text-orange-500 mt-1 uppercase tracking-tighter">Bullish Spice</div>
         </div>
      </div>
    </div>
  );
};

export default KebabStats;
