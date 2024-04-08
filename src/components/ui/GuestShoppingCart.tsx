'use client';

import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from '@/components/ui/ProductCartItem';
import { useMemo, useEffect, useState } from 'react';
import { localStorageCart } from '@/utils/localStorageCart';
import { useCartStore } from '@/stores/useCartStore';
import Loading from '@/components/ui/Loading';
import { formatMoney, getTotalMoney } from '@/lib/dinero';
import { useGuestCartItems } from '@/data/cart';
import SomethingWentWrong from '@/components/ui/SomethingWentWrong';
import { toastAmountSynced, toastError } from '@/lib/toast';
import Link from 'next/link';

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

  const incrementCartItemAmountFromUI = (productId: string) => {
    setCartItems((prev) => {
      return prev.map((product) => {
        if (product.id === productId && product.amount < product.stock) {
          return { ...product, amount: product.amount + 1 };
        }
        return product;
      });
    });
  };

  const incrementAmount = async (productId: string) => {
    const product = cartItems.find((item) => item.id === productId);

    if (product) {
      localStorageCart.incrementItemAmount(productId, product.stock);
      incrementCartItemAmountFromUI(productId);
    }
  };

  const decrementCartItemAmountFromUI = (productId: string) => {
    setCartItems((prev) => {
      return prev.map((product) => {
        if (product.id === productId && product.amount > 1) {
          return { ...product, amount: product.amount - 1 };
        }
        return product;
      });
    });
  };

  const decrementAmount = async (productId: string) => {
    localStorageCart.decrementItemAmount(productId);
    decrementCartItemAmountFromUI(productId);
  };

  const removeCartItemFromUI = (productId: string) => {
    removeProductId(productId);
    setCartItems((prev) => {
      return prev.filter((product) => product.id !== productId);
    });
  };

  const removeItem = async (productId: string) => {
    localStorageCart.remove(productId);
    removeCartItemFromUI(productId);
  };

  const total = useMemo(() => getTotalMoney(cartItems), [cartItems]);

  if (isLoading) return <Loading />;
  if (isError) return <SomethingWentWrong />;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-green-800">
          Shopping cart ({cartItems.length})
        </h1>
      </header>
      <div className="flex w-full flex-col gap-4">
        {cartItems.map((product) => (
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
        Total: <span className="text-xl">{formatMoney(total)}</span>
      </p>
      <Link
        href="/register"
        className="btn flex w-full items-center justify-center gap-2 p-3"
      >
        <HiOutlineShoppingCart />
        Checkout
      </Link>
    </div>
  );
}
