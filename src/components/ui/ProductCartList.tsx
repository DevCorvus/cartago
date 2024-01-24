'use client';

import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from './ProductCartItem';
import { useEffect, useState } from 'react';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { localStorageCart } from '@/utils/localStorageCart';

interface Props {
  products: ProductCartItemDto[];
}

export default function ProductCartList({ products }: Props) {
  const isAuthenticated = useIsAuthenticated();
  const [cartProducts, setCartProducts] =
    useState<ProductCartItemDto[]>(products);

  useEffect(() => {
    if (!isAuthenticated) {
      setCartProducts(localStorageCart.get());
    }
  }, [isAuthenticated]);

  return (
    <div className="max-w-md flex flex-col gap-6 mx-auto">
      <div>
        <h1 className="text-green-800 font-bold text-2xl">
          Shopping cart ({cartProducts.length})
        </h1>
      </div>
      <div className="w-full flex flex-col gap-4">
        {cartProducts.map((product) => (
          <ProductCartItem key={product.id} product={product} />
        ))}
      </div>
      <p className="text-right">Total: $ 34</p>
      <button
        type="submit"
        className="bg-green-800 p-3 w-full rounded-3xl text-slate-50 shadow-lg flex items-center justify-center gap-2"
      >
        <HiOutlineShoppingCart />
        Checkout
      </button>
    </div>
  );
}
