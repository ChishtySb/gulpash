import { CurrencyCode, CurrencyRate } from '../types';

export const CURRENCY_RATES: Record<CurrencyCode, CurrencyRate> = {
  PKR: { code: 'PKR', symbol: 'Rs.', rateAgainstPKR: 1 },
  USD: { code: 'USD', symbol: '$', rateAgainstPKR: 1 / 280 },
  GBP: { code: 'GBP', symbol: '£', rateAgainstPKR: 1 / 355 },
  AED: { code: 'AED', symbol: 'AED', rateAgainstPKR: 1 / 76 },
  EUR: { code: 'EUR', symbol: '€', rateAgainstPKR: 1 / 305 },
  CAD: { code: 'CAD', symbol: 'CA$', rateAgainstPKR: 1 / 205 }
};

export function formatPrice(priceInPKR: number, currency: CurrencyCode = 'PKR'): string {
  const target = CURRENCY_RATES[currency] || CURRENCY_RATES.PKR;
  const converted = priceInPKR * target.rateAgainstPKR;

  if (currency === 'PKR') {
    return `Rs. ${Math.round(priceInPKR).toLocaleString('en-PK')}`;
  }

  return `${target.symbol} ${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
