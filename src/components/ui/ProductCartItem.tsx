'use client';

import Image from 'next/image';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi2';
import { useState } from 'react';
import Link from 'next/link';
import { ProductCartItemDto } from '@/shared/dtos/product.dto';

interface Props {
  product: ProductCartItemDto;
}

export default function ProductCartItem({ product }: Props) {
  const [amount, setAmount] = useState(1);

  const decrementAmount = () => {
    setAmount((prev) => {
      if (prev > 0) {
        return prev - 1;
      } else {
        return prev;
      }
    });
  };

  const incrementAmount = () => {
    setAmount((prev) => {
      if (prev < product.stock) {
        return prev + 1;
      } else {
        return prev;
      }
    });
  };

  return (
    <div className="w-full flex rounded-md shadow-md h-24 bg-white">
      <Link
        href={'/items/' + product.id}
        key={product.id}
        className="relative w-24 bg-neutral-100 rounded-md"
      >
        <Image
          src={'/uploads/' + product.images[0].path}
          alt={`${product.title} image`}
          fill={true}
          className="object-contain"
        />
      </Link>
      <div className="flex-1 px-2 flex flex-col justify-around">
        <div className="flex justify-between text-green-800">
          <Link href={'/items/' + product.id} key={product.id}>
            <strong className="uppercase">{product.title}</strong>
          </Link>
          <span>$ {product.price}</span>
        </div>
        <div className="w-full flex justify-between">
          <div className="flex items-center justify-center gap-2">
            <button onClick={decrementAmount}>
              <HiMinus />
            </button>
            <span>{amount}</span>
            <button onClick={incrementAmount}>
              <HiPlus />
            </button>
          </div>
          <button
            onClick={() => {
              // TODO: Handle delete
            }}
          >
            <HiTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
