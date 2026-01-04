
import React, { useState } from 'react';
import { kebabGuru } from '../services/geminiService';

const GuruChat: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const res = await kebabGuru.askGuru(question);
    setAnswer(res);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-3xl shadow-2xl p-8 text-white">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-inner">
          👳‍♂️
        </div>
        <div>
          <h2 className="text-2xl font-bold">Chiedi al Guru</h2>
          <p className="text-orange-100 text-sm">Saggezza finanziaria a base di carne.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Esempio: Vale la pena investire in 100 Kebab?"
            className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-white/20 outline-none placeholder:text-orange-200 transition-all text-lg"
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-white text-orange-600 px-6 rounded-xl font-bold hover:bg-orange-50 disabled:opacity-50 transition-colors"
          >
            {loading ? '...' : 'Chiedi'}
          </button>
        </div>

        {answer && (
          <div className="bg-white/10 rounded-2xl p-6 border border-white/10 animate-fade-in">
            <p className="leading-relaxed whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuruChat;
