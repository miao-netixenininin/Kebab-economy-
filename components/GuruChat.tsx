
import React, { useState } from 'react';
import { kebabGuru } from '../services/geminiService';
import { useMarket } from '../context/MarketContext';

const GuruChat: React.FC = () => {
  const { setBlackMarketOpen } = useMarket();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    let res = await kebabGuru.askGuru(question);
    
    if (res.includes('[ACCESS_BLACK_MARKET]')) {
      res = res.replace('[ACCESS_BLACK_MARKET]', '').trim();
      setBlackMarketOpen(true);
    }
    
    setAnswer(res);
    setLoading(false);
    setQuestion('');
  };

  return (
    <div className="glass-dark rounded-[40px] p-8 border-orange-500/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>
      <div className="flex items-center gap-4 mb-6 relative">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
          👳‍♂️
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">Visir della Borsa</h2>
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Oracolo del Döner Standard</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Chiedi il miglior prezzo..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500/50 outline-none placeholder:text-gray-600 transition-all text-sm text-white"
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-orange-600 text-white px-4 rounded-xl font-black text-[10px] uppercase hover:bg-orange-500 disabled:opacity-50 transition-all"
          >
            {loading ? '...' : 'CHIEDI'}
          </button>
        </div>

        {answer && (
          <div className="bg-orange-500/5 rounded-2xl p-6 border border-orange-500/20 animate-fade-in">
            <p className="text-sm italic text-orange-200 leading-relaxed">"{answer}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuruChat;
