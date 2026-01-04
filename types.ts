
export interface ConversionHistory {
  id: string;
  fromValue: number;
  fromUnit: 'EUR' | 'KEBAB';
  toValue: number;
  toUnit: 'EUR' | 'KEBAB';
  timestamp: Date;
}

export interface KebabFact {
  title: string;
  description: string;
}
