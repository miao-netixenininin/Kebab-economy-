
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { useMarket } from '../context/MarketContext';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isReal = payload[0].payload.isReal;
    return (
      <div className="bg-white/95 backdrop-blur-md p-5 shadow-2xl rounded-3xl border border-orange-100 min-w-[200px] animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
           {isReal && <span className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">LIVE</span>}
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-orange-600 text-[10px] font-black uppercase tracking-tight">Kebab Index</span>
            <span className="text-gray-900 text-sm font-black">{payload[0].value.toFixed(3)}€</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-tight">Camel Index</span>
            <span className="text-gray-900 text-sm font-black">{payload[1].value.toFixed(0)}€</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const KebabStats: React.FC = () => {
  const { history, isRealMode, isSyncing } = useMarket();

  // Prendi l'ultimo punto della storia in modo sicuro
  const lastPoint = history.length > 0 ? history[history.length - 1] : { kebab: 5, livestock: 2200 };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100 h-full flex flex-col relative overflow-hidden group">
      {!isRealMode && !isSyncing && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-10 flex items-center justify-center p-8 text-center transition-all duration-500">
           <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-orange-100 max-w-xs transform group-hover:scale-105 transition-transform">
              <span className="text-5xl mb-4 block animate-bounce">📡</span>
              <p className="text-sm font-black text-gray-800 uppercase leading-tight mb-2">Connettiti ai Mercati Reali</p>
              <p className="text-[10px] font-bold text-gray-400">Clicca "Sincronizza" nel mercato per attivare il feed live del 2025.</p>
           </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <span className="text-3xl">📊</span> Ticker Live
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update ogni 5s</span>
            {isRealMode && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>}
          </div>
        </div>
        
        {isRealMode && (
          <div className="flex flex-col items-end gap-1">
            <div className="bg-green-50 px-3 py-1 rounded-full flex items-center gap-2 border border-green-100">
               <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Prezzi Web-Verified</span>
            </div>
            <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">Powered by Gemini Search</span>
          </div>
        )}
      </div>
      
      <div className="h-80 w-full flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f8fafc" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              hide={history.length < 5}
              tick={{fill: '#94a3b8', fontSize: 8, fontWeight: 800}} 
            />
            <YAxis yAxisId="kebab" hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
            <YAxis yAxisId="livestock" hide domain={['dataMin - 200', 'dataMax + 200']} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
            
            <Line 
              yAxisId="kebab"
              type="monotone" 
              name="Kebab"
              dataKey="kebab" 
              stroke="#f97316" 
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, fill: '#f97316', strokeWidth: 3, stroke: '#fff' }}
              isAnimationActive={true}
              animationDuration={600}
            />
            <Line 
              yAxisId="livestock"
              type="monotone" 
              name="Cammelli"
              dataKey="livestock" 
              stroke="#f59e0b" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={true}
              animationDuration={800}
            />
            
            <ReferenceLine yAxisId="kebab" y={5} stroke="#e2e8f0" strokeWidth={1} label={{ position: 'right', value: 'Legacy 5€', fill: '#cbd5e1', fontSize: 8, fontWeight: 900 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100/50">
          <div className="text-[9px] font-black text-orange-400 uppercase mb-1 tracking-widest">Kebab Index</div>
          <div className="text-lg font-black text-orange-700 tabular-nums">
            {lastPoint.kebab.toFixed(2)}€
          </div>
        </div>
        <div className="bg-amber-50/50 p-4 rounded-3xl border border-amber-100/50">
          <div className="text-[9px] font-black text-amber-500 uppercase mb-1 tracking-widest">Camel AVG</div>
          <div className="text-lg font-black text-amber-700 tabular-nums">
            {lastPoint.livestock.toFixed(0)}€
          </div>
        </div>
      </div>
    </div>
  );
};

export default KebabStats;
