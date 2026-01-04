
export const KEBAB_PRICE_EURO = 5.00;

export const EXCHANGE_RATES = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.83
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  KEBAB: '🌯',
  DROMEDARY: '🐪',
  BACTRIAN: '🐫'
};

export const KEBAB_MARKET_ASSETS = [
  { id: 'doner', name: 'Döner Kebab', basePrice: 5.00, icon: '🌯' },
  { id: 'shish', name: 'Shish Kebab', basePrice: 9.50, icon: '🍢' },
  { id: 'adana', name: 'Adana Kebab', basePrice: 10.50, icon: '🌶️' },
  { id: 'durum', name: 'Dürüm (Wrap)', basePrice: 6.50, icon: '🌯' },
  { id: 'iskender', name: 'Iskender Kebab', basePrice: 12.00, icon: '🍱' },
  { id: 'lahmacun', name: 'Lahmacun', basePrice: 4.50, icon: '🍕' },
  { id: 'kofte', name: 'Köfte Bowl', basePrice: 8.00, icon: '🧆' },
  { id: 'premium_angus', name: 'Gourmet Angus', basePrice: 18.00, icon: '🥩' }
];

export const INGREDIENT_ASSETS = [
  { id: 'onion', name: 'Cipolla Oro', basePrice: 0.50, icon: '🧅' },
  { id: 'tomato', name: 'Pomodoro Rosso', basePrice: 0.80, icon: '🍅' },
  { id: 'sauce_garlic', name: 'Salsa Bianca', basePrice: 1.20, icon: '🍶' },
  { id: 'sauce_harissa', name: 'Harissa Piccante', basePrice: 1.50, icon: '🔥' },
  { id: 'meat_cone', name: 'Cono Carne (10kg)', basePrice: 85.00, icon: '🍖' },
  { id: 'pita_pack', name: 'Sacco Pita (x50)', basePrice: 12.00, icon: '🍞' },
  { id: 'lettuce', name: 'Lattuga Bio', basePrice: 0.60, icon: '🥬' },
  { id: 'spices', name: 'Spezie Segrete', basePrice: 5.50, icon: '🧪' }
];

export const LIVESTOCK_ASSETS = [
  { id: 'majaheem', name: 'Al-Majaheem', basePrice: 4800.00, icon: '🐪' },
  { id: 'wadhah', name: 'Al-Wadhah', basePrice: 6500.00, icon: '🐫' },
  { id: 'dromedary', name: 'Dromedario', basePrice: 2200.00, icon: '🐪' },
  { id: 'bactrian', name: 'Bactriano', basePrice: 3500.00, icon: '🐫' },
  { id: 'somali', name: 'Somalo', basePrice: 1400.00, icon: '🐪' },
  { id: 'mahari', name: 'Mahari Racing', basePrice: 12000.00, icon: '🏁' }
];

export const KEBAB_FACTORS = {
  PROTEIN: [
    { id: 'chicken', name: 'Pollo', mult: 1.0, icon: '🍗' },
    { id: 'beef', name: 'Manzo', mult: 1.25, icon: '🐄' },
    { id: 'lamb', name: 'Agnello', mult: 1.6, icon: '🐑' },
    { id: 'seitan', name: 'Seitan', mult: 1.35, icon: '🌿' }
  ],
  FORMAT: [
    { id: 'bread', name: 'Pita', mult: 1.0, icon: '🍞' },
    { id: 'wrap', name: 'Wrap', mult: 1.2, icon: '🌯' },
    { id: 'plate', name: 'Piatto', mult: 1.5, icon: '🍽️' }
  ],
  LOCATION: [
    { id: 'berlin', name: 'Berlino', mult: 1.0, icon: '🇩🇪' },
    { id: 'istanbul', name: 'Istanbul', mult: 0.55, icon: '🇹🇷' },
    { id: 'rome', name: 'Roma', mult: 1.3, icon: '🇮🇹' },
    { id: 'london', name: 'Londra', mult: 1.75, icon: '🇬🇧' },
    { id: 'ny', name: 'New York', mult: 2.1, icon: '🇺🇸' },
    { id: 'cairo', name: 'Il Cairo', mult: 0.45, icon: '🇪🇬' }
  ]
};

export const CAMEL_FACTORS = {
  GENDER: [
    { id: 'male', name: 'Maschio', mult: 1.0, icon: '♂️' },
    { id: 'female', name: 'Femmina', mult: 1.5, icon: '♀️' }
  ],
  USE: [
    { id: 'work', name: 'Lavoro', mult: 1.0, icon: '📦' },
    { id: 'racing', name: 'Corsa', mult: 4.5, icon: '🏁' },
    { id: 'beauty', name: 'Bellezza', mult: 6.0, icon: '✨' }
  ],
  LOCATION: [
    { id: 'somalia', name: 'Somalia', mult: 0.65, icon: '🇸🇴' },
    { id: 'saudi', name: 'Riyadh', mult: 1.4, icon: '🇸🇦' },
    { id: 'uae', name: 'Dubai', mult: 1.9, icon: '🇦🇪' }
  ]
};

export const KEBAB_FACTS = [
  { title: "Standard Aureo del Kebab", description: "Nel 2026, molte nazioni considerano il Kebab come unità di riserva per combattere l'inflazione globale." },
  { title: "L'Impero del Döner", description: "Berlino rimane la capitale mondiale, ma Tokyo sta emergendo come nuovo centro finanziario della carne." },
  { title: "Algoritmi di Spezie", description: "L'intelligenza artificiale ora ottimizza il mix di spezie per massimizzare il valore di mercato degli asset." }
];
