'use client';
import Image from 'next/image';
import { CartProduct } from '../types';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi2';
import { useState } from 'react';

interface Props {
  product: CartProduct;
  i: number;
  handleDelete: (id: string) => void;
}

export default function ProductCartItem({ product, i, handleDelete }: Props) {
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
    <div className="w-full flex rounded-md shadow-md max-h-32">
      <div className="relative h-auto w-32 bg-neutral-100 rounded-md">
        <Image
          src={product.image}
          alt={`${product.title} image #${i + 1}`}
          fill={true}
          object-fit="contain"
        />
      </div>
      <div className="w-full px-2 flex flex-col gap-4">
        <div className="flex justify-between">
          <strong className="uppercase">{product.title}</strong>
          <span>{product.price}</span>
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
          <button onClick={() => handleDelete(product.id)}>
            <HiTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
