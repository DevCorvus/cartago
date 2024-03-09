import Dinero from 'dinero.js';

export function formatMoney(x: number): string {
  return Dinero({ amount: x }).toFormat();
}

interface ItemWithPriceAndAmount {
  price: number;
  amount: number;
}

export function getTotalMoney(items: ItemWithPriceAndAmount[]): number {
  return items
    .reduce(
      (total, item) => {
        return total.add(Dinero({ amount: item.price }).multiply(item.amount));
      },
      Dinero({ amount: 0 }),
    )
    .getAmount();
}

export function getMoneyString(x: number): string {
  return Dinero({ amount: x }).toUnit().toFixed(2);
}
