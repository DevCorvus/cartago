'use client';

import { useCartItem } from '@/hooks/useCartItem';
import Link from 'next/link';
import { FormEvent } from 'react';
import { HiOutlineShoppingCart, HiShoppingCart } from 'react-icons/hi2';

interface Props {
  productId: string;
}

export default function AddCartItem({ productId }: Props) {
  const { addCartItem, inCart } = useCartItem(productId);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addCartItem();
  };

  return (
    <>
      {!inCart ? (
        <form onSubmit={handleSubmit} className="flex items-center">
          <button
            type="submit"
            title="Add to Shopping Cart"
            className="rounded-full bg-white p-1 text-xl shadow-md transition hover:text-cyan-500"
          >
            <HiOutlineShoppingCart />
          </button>
        </form>
      ) : (
        <Link
          href="/cart"
          title="View in Shopping Cart"
          className="rounded-full bg-white p-1 text-xl text-cyan-600 shadow-md transition hover:text-cyan-500"
        >
          <HiShoppingCart />
        </Link>
      )}
    </>
  );
}
