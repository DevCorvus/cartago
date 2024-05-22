'use client';

import Image from 'next/image';
import { HiMinus, HiOutlineTrash, HiPlus } from 'react-icons/hi2';
import Link from 'next/link';
import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { formatMoney } from '@/lib/dinero';
import { ChangeEvent, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface Props {
  product: ProductCartItemDto;
  setItemAmount(productId: string, amount: number): void;
  removeItem(productId: string): void;
}

export default function ProductCartItem({
  product,
  setItemAmount,
  removeItem,
}: Props) {
  const [input, setInput] = useState(product.amount);
  const debouncedInput = useDebounce(input);

  const canDecreaseAmount = input > 1;
  const canIncreaseAmount = input < product.stock;

  const noStock = product.stock === 0;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInput(Math.min(Math.max(value, 1), product.stock));
  };

  if (debouncedInput !== product.amount) {
    setItemAmount(product.id, debouncedInput);
  }

  return (
    <div className="flex h-20 w-full rounded-md bg-slate-50/75 shadow-md">
      <Link
        href={'/items/' + product.id}
        key={product.id}
        className="size-20 relative rounded-md bg-neutral-100"
      >
        <Image
          src={'/images/' + product.images[0].path}
          alt={`${product.title} image`}
          fill={true}
          className="object-contain"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-around px-2">
        <div className="flex items-center justify-between gap-1">
          <Link
            href={'/items/' + product.id}
            key={product.id}
            className="line-clamp-1 font-medium text-slate-700"
          >
            {product.title}
          </Link>
          <span className="rounded-xl bg-slate-100 px-1 font-semibold text-slate-700 shadow-sm">
            {formatMoney(product.price)}
          </span>
        </div>
        <div className="flex w-full justify-between">
          {noStock ? (
            <span className="rounded-full bg-red-50 px-1.5 py-0.5 font-semibold text-red-400 shadow-sm">
              Out of stock
            </span>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-full bg-slate-100 text-slate-700">
              <button
                className={`rounded-full p-1 text-xs transition ${canDecreaseAmount ? 'bg-slate-300/50 hover:bg-red-100 hover:text-red-700 hover:shadow-sm' : 'text-slate-400'}`}
                onClick={() => setInput((prev) => prev - 1)}
                disabled={!canDecreaseAmount}
              >
                <HiMinus />
              </button>
              <input
                type="text"
                className="w-6 bg-transparent text-center text-sm font-semibold text-slate-700"
                value={input}
                onChange={handleInputChange}
              />
              <button
                className={`rounded-full p-1 text-xs transition ${canIncreaseAmount ? 'bg-slate-300/50 hover:bg-green-100 hover:text-green-700 hover:shadow-sm' : 'text-slate-400'}`}
                onClick={() => setInput((prev) => prev + 1)}
                disabled={!canIncreaseAmount}
              >
                <HiPlus />
              </button>
            </div>
          )}
          <button
            onClick={() => removeItem(product.id)}
            title="Remove item"
            className="text-slate-500 transition hover:text-red-500 focus:text-red-500"
          >
            <HiOutlineTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
