
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMarket } from '../context/MarketContext';
import { CURRENCY_SYMBOLS, EXCHANGE_RATES } from '../constants';

const CustomTooltip = ({ active, payload, label, currency, language }: any) => {
  if (active && payload && payload.length) {
    const isReal = payload[0].payload.isReal;
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl p-5 shadow-2xl rounded-3xl border border-white/10 min-w-[220px]">
        <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
           {isReal && <span className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">LIVE FEED</span>}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-white text-[10px] font-black uppercase tracking-tight">Kebab Index</span>
            </div>
            <span className="text-orange-500 text-sm font-black">
              {(payload[0].value * EXCHANGE_RATES[currency]).toFixed(2)}{CURRENCY_SYMBOLS[currency]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-white text-[10px] font-black uppercase tracking-tight">Camel Index</span>
            </div>
            <span className="text-amber-500 text-sm font-black">
              {(payload[1].value * EXCHANGE_RATES[currency]).toFixed(0)}{CURRENCY_SYMBOLS[currency]}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const KebabStats: React.FC = () => {
  const { history, isRealMode, isSyncing, currency, language, t } = useMarket();
  const lastPoint = history.length > 0 ? history[history.length - 1] : { kebab: 5, livestock: 2200 };

  // Filtriamo i dati per assicurarci che siano validi per il grafico
  const chartData = React.useMemo(() => {
    return history.map(p => ({
      ...p,
      kebab: Number(p.kebab.toFixed(2)),
      livestock: Number(p.livestock.toFixed(0))
    }));
  }, [history]);

  return (
    <div className="bg-white rounded-[48px] shadow-2xl p-8 border border-orange-100 flex flex-col relative overflow-hidden h-[600px]">
      {!isRealMode && !isSyncing && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-10 flex items-center justify-center p-8 text-center">
           <div className="bg-gray-900 p-8 rounded-[40px] shadow-2xl border border-white/10 max-w-xs transform scale-100 hover:scale-105 transition-all">
              <span className="text-5xl mb-4 block animate-bounce">📡</span>
              <p className="text-sm font-black text-white uppercase leading-tight mb-2">{t('sync')}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t('apiWarning')}</p>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 tracking-tighter uppercase">
            {t('stats_ticker')}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${isRealMode ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('stats_update')}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-grow min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorKebab" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCamel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 8, fontWeight: 700}}
              interval="preserveStartEnd"
            />
            <YAxis yAxisId="kebab" hide domain={['auto', 'auto']} />
            <YAxis yAxisId="livestock" hide domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip currency={currency} language={language} />} />
            <Area 
              yAxisId="kebab"
              type="monotone" 
              dataKey="kebab" 
              stroke="#f97316" 
              strokeWidth={4}
              fill="url(#colorKebab)"
              activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Area 
              yAxisId="livestock"
              type="monotone" 
              dataKey="livestock" 
              stroke="#f59e0b" 
              strokeWidth={3}
              strokeDasharray="5 5"
              fill="url(#colorCamel)"
              activeDot={{ r: 4, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 flex flex-col items-center">
          <div className="text-[9px] font-black text-orange-400 uppercase mb-1">Kebab Index</div>
          <div className="text-xl font-black text-orange-700 tabular-nums">
            {(lastPoint.kebab * EXCHANGE_RATES[currency]).toFixed(2)}{CURRENCY_SYMBOLS[currency]}
          </div>
        </div>
        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 flex flex-col items-center">
          <div className="text-[9px] font-black text-amber-500 uppercase mb-1">Camel Value</div>
          <div className="text-xl font-black text-amber-700 tabular-nums">
            {(lastPoint.livestock * EXCHANGE_RATES[currency]).toFixed(0)}{CURRENCY_SYMBOLS[currency]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KebabStats;
