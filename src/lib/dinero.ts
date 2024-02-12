import Dinero from 'dinero.js';

export function formatMoney(x: number): string {
  return Dinero({ amount: x }).toFormat();
}
