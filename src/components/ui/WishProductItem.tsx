'use client';

import { useWished } from '@/hooks/useWished';
import { FormEvent } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';

interface Props {
  productId: string;
}

export default function WishProductItem({ productId }: Props) {
  const { toggleWishness, isWished } = useWished(productId);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await toggleWishness();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <button
        type="submit"
        title={isWished ? 'Remove from Wish List' : 'Add to Wish List'}
        className={`rounded-full bg-white p-0.5 text-xl shadow-md transition ${isWished ? 'text-rose-400' : 'hover:text-rose-400'}`}
      >
        {isWished ? <HiHeart /> : <HiOutlineHeart />}
      </button>
    </form>
  );
}
