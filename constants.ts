
export const KEBAB_PRICE_EURO = 5.00;

export const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.84,
  SAR: 4.07
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  SAR: '﷼',
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

// Added missing LIVESTOCK_ASSETS
export const LIVESTOCK_ASSETS = [
  { id: 'dromedary', name: 'Dromedario', basePrice: 1200.00, icon: '🐪' },
  { id: 'bactrian', name: 'Cammello Bactriano', basePrice: 2500.00, icon: '🐫' },
  { id: 'lamb', name: 'Agnello Pregiato', basePrice: 450.00, icon: '🐑' },
  { id: 'calf', name: 'Vitello da Taglio', basePrice: 850.00, icon: '🐄' }
];

export const BLACK_MARKET_ASSETS = [
  { id: 'dark_matter_doner', name: 'Döner Materia Oscura', basePrice: 1.50, icon: '🌑', special: true },
  { id: 'neon_adana', name: 'Cyber Adana 2077', basePrice: 2.20, icon: '🛸', special: true },
  { id: 'gold_kebab', name: 'Kebab Oro 24K', basePrice: 45.00, icon: '📀', special: true }
];

export const BLACK_MARKET_LIVESTOCK = [
  { id: 'ghost_camel', name: 'Cammello Fantasma', basePrice: 150.00, icon: '👻' },
  { id: 'cyber_camel', name: 'Cyber-Camel X', basePrice: 800.00, icon: '🤖' }
];

export const BLACK_MARKET_INGREDIENTS = [
  { id: 'stardust_spice', name: 'Polvere di Stelle', basePrice: 0.10, icon: '✨' },
  { id: 'void_sauce', name: 'Salsa del Vuoto', basePrice: 0.05, icon: '🖤' }
];

export const INGREDIENT_ASSETS = [
  { id: 'meat_cone', name: 'Cono Carne', basePrice: 85.00, icon: '🍖', yields: 100, yieldType: 'meat' },
  { id: 'pita_pack', name: 'Sacco Pita', basePrice: 12.00, icon: '🍞', yields: 50, yieldType: 'bread' },
  { id: 'wrap_pack', name: 'Sacco Wrap', basePrice: 10.00, icon: '🌯', yields: 40, yieldType: 'wrap' },
  { id: 'onion', name: 'Cipolla Oro', basePrice: 0.50, icon: '🧅' },
  { id: 'tomato', name: 'Pomodoro Rosso', basePrice: 0.80, icon: '🍅' },
  { id: 'sauce_garlic', name: 'Salsa Bianca', basePrice: 1.20, icon: '🍶' },
  { id: 'sauce_harissa', name: 'Harissa Piccante', basePrice: 1.50, icon: '🔥' },
  { id: 'lettuce', name: 'Lattuga Bio', basePrice: 0.60, icon: '🥬' },
  { id: 'spices', name: 'Spezie Segrete', basePrice: 5.50, icon: '🧪' }
];

export const CRAFTING_RECIPES: Record<string, Record<string, number>> = {
  doner: { meat: 1, bread: 1, onion: 1, tomato: 1, lettuce: 1, sauce_garlic: 1 },
  durum: { meat: 1, wrap: 1, onion: 1, tomato: 1, lettuce: 1, sauce_harissa: 1 },
  shish: { meat: 2, bread: 1, onion: 2, spices: 1 },
  adana: { meat: 2, bread: 1, sauce_harissa: 1, spices: 2 },
  iskender: { meat: 2, bread: 1, tomato: 2, sauce_garlic: 1 },
  lahmacun: { meat: 1, wrap: 1, tomato: 1, spices: 1 },
  kofte: { meat: 1, lettuce: 2, tomato: 1, onion: 1 },
  premium_angus: { meat: 3, bread: 1, spices: 3, onion: 1 },
  dark_matter_doner: { meat: 1, bread: 1, spices: 5 },
  neon_adana: { meat: 2, wrap: 1, spices: 2 }
};

export const KEBAB_FACTORS = {
  LOCATION: [
    { id: 'berlin', name: 'Berlino', mult: 1.0, icon: '🇩🇪' },
    { id: 'istanbul', name: 'Istanbul', mult: 0.55, icon: '🇹🇷' },
    { id: 'rome', name: 'Roma', mult: 1.3, icon: '🇮🇹' },
    { id: 'london', name: 'Londra', mult: 1.75, icon: '🇬🇧' },
    { id: 'ny', name: 'New York', mult: 2.1, icon: '🇺🇸' },
    { id: 'dubai', name: 'Dubai', mult: 1.9, icon: '🇦🇪' },
    { id: 'black_market', name: 'Deep Web', mult: 0.15, icon: '🕶️' }
  ]
};
