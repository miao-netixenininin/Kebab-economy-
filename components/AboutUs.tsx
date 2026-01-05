
import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 soft-entry">
      <div className="glass p-10 rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
        
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-6">
          The <span className="text-orange-500">Döner Standard</span> Vision
        </h2>
        
        <div className="space-y-6 text-gray-400 leading-relaxed font-medium">
          <p>
            Benvenuti in <span className="text-white font-bold text-orange-400">Kebab Economy Pro</span>, il primo terminale finanziario al mondo che ha abbandonato l'oro e le crypto per abbracciare l'unica riserva di valore indistruttibile: la proteina rotante.
          </p>
          
          <p>
            Fondata a Berlino nel 2026, la nostra missione è democratizzare l'arbitraggio globale. Crediamo che il prezzo di un Döner a Kreuzberg sia l'indicatore di inflazione più onesto mai esistito. Monitoriamo costantemente i mercati dei cammelli di Riyadh e le quotazioni delle cipolle oro per permettervi di scalare la classifica del benessere globale.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <div className="text-2xl mb-2">📡</div>
              <h4 className="text-white font-black text-xs uppercase mb-1">Grounded AI</h4>
              <p className="text-[10px]">Dati estratti in tempo reale tramite Google Gemini 3 per la massima precisione operativa.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <div className="text-2xl mb-2">🐫</div>
              <h4 className="text-white font-black text-xs uppercase mb-1">Livestock Index</h4>
              <p className="text-[10px]">Il valore dei cammelli Majaheem integrato direttamente nel vostro portafoglio liquidità.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="text-white font-black text-xs uppercase mb-1">Sovereign Data</h4>
              <p className="text-[10px]">Salvataggio locale sicuro. I vostri kebab sono protetti dai protocolli di persistenza browser.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 py-10 opacity-50">
        <div className="h-px w-20 bg-orange-500/30"></div>
        <p className="text-[9px] font-black tracking-[0.5em] text-gray-600 uppercase">Progettato per la stabilità gastronomica mondiale</p>
      </div>
    </div>
  );
};

export default AboutUs;
