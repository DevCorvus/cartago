'use client';

import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from './ProductCartItem';
import { useMemo, useEffect, useState } from 'react';
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

  const total = useMemo(
    () =>
      cartProducts.reduce((total, product) => {
        return product.price * product.amount + total;
      }, 0),
    [cartProducts],
  );

  const incrementAmount = (productId: string) => {
    setCartProducts((prev) => {
      return prev.map((product) => {
        if (product.id === productId && product.amount < product.stock) {
          return { ...product, amount: product.amount + 1 };
        }
        return product;
      });
    });
  };

  const decrementAmount = (productId: string) => {
    setCartProducts((prev) => {
      return prev.map((product) => {
        if (product.id === productId && product.amount > 1) {
          return { ...product, amount: product.amount - 1 };
        }
        return product;
      });
    });
  };

  const removeItem = (productId: string) => {
    setCartProducts((prev) => {
      return prev.filter((product) => product.id !== productId);
    });
  };

  return (
    <div className="max-w-md flex flex-col gap-6 mx-auto">
      <div>
        <h1 className="text-green-800 font-bold text-2xl">
          Shopping cart ({cartProducts.length})
        </h1>
      </div>
      <div className="w-full flex flex-col gap-4">
        {cartProducts.map((product) => (
          <ProductCartItem
            key={product.id}
            product={product}
            incrementAmount={incrementAmount}
            decrementAmount={decrementAmount}
            removeItem={removeItem}
          />
        ))}
      </div>
      <p className="text-right">
        Total: $ <span className="text-xl">{total}</span>
      </p>
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
