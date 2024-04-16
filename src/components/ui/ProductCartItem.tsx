'use client';

import Image from 'next/image';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi2';
import Link from 'next/link';
import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { formatMoney } from '@/lib/dinero';

interface Props {
  product: ProductCartItemDto;
  incrementAmount(productId: string): Promise<void>;
  decrementAmount(productId: string): Promise<void>;
  removeItem(productId: string): Promise<void>;
}

export default function ProductCartItem({
  product,
  incrementAmount,
  decrementAmount,
  removeItem,
}: Props) {
  return (
    <div className="flex h-24 w-full rounded-md bg-white shadow-md">
      <Link
        href={'/items/' + product.id}
        key={product.id}
        className="relative w-24 rounded-md bg-neutral-100"
      >
        <Image
          src={'/images/' + product.images[0].path}
          alt={`${product.title} image`}
          fill={true}
          className="object-contain"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-around px-2">
        <div className="flex justify-between text-green-800">
          <Link href={'/items/' + product.id} key={product.id}>
            <strong className="uppercase">{product.title}</strong>
          </Link>
          <span>{formatMoney(product.price)}</span>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex items-center justify-center gap-2">
            <button
              className={product.amount > 1 ? '' : 'invisible'}
              onClick={() => decrementAmount(product.id)}
            >
              <HiMinus />
            </button>
            <span>{product.amount}</span>
            <button
              className={product.amount < product.stock ? '' : 'invisible'}
              onClick={() => incrementAmount(product.id)}
            >
              <HiPlus />
            </button>
          </div>
          <button onClick={() => removeItem(product.id)}>
            <HiTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
