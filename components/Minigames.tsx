
import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';

interface MinigamesProps {
  onWin: (amount: number) => void;
}

const Minigames: React.FC<MinigamesProps> = ({ onWin }) => {
  const { t, language } = useMarket();
  const [clickCount, setClickCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);
    
    onWin(0.05);

    if (clickCount > 0 && clickCount % 20 === 0) {
      onWin(1.00);
    }
  };

  const claimBonus = () => {
    if (!bonusClaimed) {
      onWin(5.00);
      setBonusClaimed(true);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Kebab Clicker Game */}
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-orange-100 flex flex-col items-center text-center">
        <div className="mb-2">
          <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">{t('play')}</span>
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">{t('clicker_title')}</h2>
        <p className="text-gray-400 text-sm mb-8">{t('clicker_subtitle')}</p>
        
        <div className="relative mb-10 cursor-pointer group" onClick={handleClick}>
          <div className={`text-[120px] transition-transform duration-75 select-none ${isAnimating ? 'scale-90 rotate-3' : 'scale-100 group-hover:scale-110'}`}>
            🌯
          </div>
          <div className={`absolute -top-4 ${language === 'ar' ? '-left-4' : '-right-4'} bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-black shadow-lg`}>
            +5¢
          </div>
        </div>

        <div className="w-full bg-gray-50 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Progress</span>
            <span className="text-xs font-black text-orange-600">{clickCount % 20}/20 {t('clicker_bonus')}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-300" 
              style={{ width: `${(clickCount % 20) / 20 * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bonus & Trading center */}
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white shadow-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🎁</span> {t('bonus_title')}
          </h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {t('bonus_desc')}
          </p>
          <button 
            disabled={bonusClaimed}
            onClick={claimBonus}
            className={`w-full py-4 rounded-2xl font-black transition-all ${bonusClaimed ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-900/20'}`}
          >
            {bonusClaimed ? t('bonus_claimed') : t('bonus_claim')}
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎯</span> {t('goals_title')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 opacity-50">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">🍟</div>
              <div>
                <div className="text-sm font-bold text-gray-800">{t('goal_chips')}</div>
                <div className="text-[10px] text-gray-400 uppercase">{t('goal_chips_desc')}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 opacity-50">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">🐪</div>
              <div>
                <div className="text-sm font-bold text-gray-800">{t('goal_camel')}</div>
                <div className="text-[10px] text-gray-400 uppercase">{t('goal_camel_desc')}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 opacity-50">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">💸</div>
              <div>
                <div className="text-sm font-bold text-gray-800">{t('goal_onion')}</div>
                <div className="text-[10px] text-gray-400 uppercase">{t('goal_onion_desc')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minigames;
