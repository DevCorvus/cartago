'use client';

import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from '@/components/ui/ProductCartItem';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { localStorageCart } from '@/utils/localStorageCart';
import { useCartStore } from '@/stores/useCartStore';
import Loading from '@/components/ui/Loading';
import { formatMoney, getTotalMoney } from '@/lib/dinero';
import { useGuestCartItems } from '@/data/cart';
import SomethingWentWrong from '@/components/ui/SomethingWentWrong';
import { toastAmountSynced, toastError } from '@/lib/toast';
import Link from 'next/link';
import EmptyCart from './EmptyCart';

export default function GuestShoppingCart() {
  const [cartItems, setCartItems] = useState<ProductCartItemDto[]>([]);

  const { isLoading, isError, data } = useGuestCartItems();

  const removeProductId = useCartStore((state) => state.removeProductId);

  useEffect(() => {
    if (data) {
      const cart = localStorageCart.get();

      const removedItems = cart.filter(
        (item) => !data.some((p) => p.id === item.id),
      );

      if (removedItems.length !== 0) {
        toastError(new Error('Some items no longer exist'));
        removedItems.forEach((item) => {
          removeProductId(item.id);
          localStorageCart.remove(item.id);
        });
      }

      const cartItems: ProductCartItemDto[] = data.map((cartItem) => {
        const localItem = cart.find((item) => item.id === cartItem.id)!;

        let amount = localItem.amount;

        if (amount > cartItem.stock) {
          amount = cartItem.stock;
          localStorageCart.setItemAmount(cartItem.id, cartItem.stock);
          toastAmountSynced(cartItem.title);
        }

        return { ...cartItem, amount };
      });

      setCartItems(cartItems);
    }
  }, [data, removeProductId]);

  const setCartItemAmountFromUI = (productId: string, amount: number) => {
    setCartItems((prev) => {
      return prev.map((product) => {
        if (product.id === productId) {
          return { ...product, amount };
        }
        return product;
      });
    });
  };

  const setItemAmount = useCallback((productId: string, amount: number) => {
    localStorageCart.setItemAmount(productId, amount);
    setCartItemAmountFromUI(productId, amount);
  }, []);

  const removeCartItemFromUI = (productId: string) => {
    removeProductId(productId);
    setCartItems((prev) => {
      return prev.filter((product) => product.id !== productId);
    });
  };

  const removeItem = (productId: string) => {
    localStorageCart.remove(productId);
    removeCartItemFromUI(productId);
  };

  const total = useMemo(() => getTotalMoney(cartItems), [cartItems]);

  if (isLoading) return <Loading />;
  if (isError) return <SomethingWentWrong />;

  if (cartItems.length === 0) return <EmptyCart />;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-lg bg-white p-8 shadow-md">
      <header>
        <h1 className="text-2xl font-bold text-cyan-700">
          Shopping Cart ({cartItems.length})
        </h1>
      </header>
      <div className="flex w-full flex-col gap-3">
        {cartItems.map((product) => (
          <ProductCartItem
            key={product.id}
            product={product}
            setItemAmount={setItemAmount}
            removeItem={removeItem}
          />
        ))}
      </div>
      <hr />
      <p className="flex items-center justify-between">
        <span className="font-medium text-slate-500">Total</span>
        <span className="rounded-xl bg-green-50 px-2 py-1 text-xl font-bold text-green-600 shadow-sm">
          {formatMoney(total)}
        </span>
      </p>
      <Link
        href="/register?from=/cart"
        className="btn flex w-full items-center justify-center gap-2 p-3"
      >
        <HiOutlineShoppingCart />
        Checkout
      </Link>
    </div>
  );
}
