'use client';

import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from '@/components/ui/ProductCartItem';
import { useMemo, useEffect, useState, FormEvent, useCallback } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import Loading from '@/components/ui/Loading';
import { ImSpinner8 } from 'react-icons/im';
import { formatMoney, getTotalMoney } from '@/lib/dinero';
import {
  useCartItems,
  useCheckout,
  useRemoveCartItem,
  useSetCartItemAmount,
  useSyncCartItemAmounts,
} from '@/data/cart';
import SomethingWentWrong from '@/components/ui/SomethingWentWrong';
import { toastAmountSynced, toastError } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import EmptyCart from './EmptyCart';

export default function UserShoppingCart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<ProductCartItemDto[]>([]);

  const { isLoading, isError, data, refetch } = useCartItems();

  const { mutateAsync: syncCartItemAmounts, isPending } =
    useSyncCartItemAmounts();

  const { setProductIds, removeProductId } = useCartStore(
    ({ setProductIds, removeProductId }) => ({
      setProductIds,
      removeProductId,
    }),
  );

  useEffect(() => {
    if (data) {
      const toSync = data
        .filter((item) => item.amount > item.stock)
        .map((item) => item.title);

      if (toSync.length === 0) {
        setCartItems(data);
        setProductIds(data.map((item) => item.id));
      } else {
        (async () => {
          try {
            await syncCartItemAmounts();
            await refetch();
            toSync.forEach((title) => {
              toastAmountSynced(title);
            });
          } catch (err) {
            toastError(err);
          }
        })();
      }
    }
  }, [data, syncCartItemAmounts, refetch, setProductIds]);

  const setCartItemAmountMutation = useSetCartItemAmount();

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

  const setItemAmount = useCallback(
    async (productId: string, amount: number) => {
      const prevAmount = cartItems.find(
        (item) => item.id === productId,
      )!.amount;

      try {
        setCartItemAmountFromUI(productId, amount);
        await setCartItemAmountMutation.mutateAsync({ productId, amount });
      } catch (err) {
        toastError(err);
        setCartItemAmountFromUI(productId, prevAmount);
      }
    },
    [cartItems, setCartItemAmountMutation],
  );

  const removeCartItemMutation = useRemoveCartItem();

  const removeCartItemFromUI = (productId: string) => {
    removeProductId(productId);
    setCartItems((prev) => {
      return prev.filter((product) => product.id !== productId);
    });
  };

  const removeItem = async (productId: string) => {
    try {
      await removeCartItemMutation.mutateAsync(productId);
      removeCartItemFromUI(productId);
    } catch (err) {
      toastError(err);
    }
  };

  const checkoutMutation = useCheckout();

  const handleCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const checkoutOrder = await checkoutMutation.mutateAsync();
      router.push('/checkout/' + checkoutOrder.id);
    } catch (err) {
      toastError(err);
      refetch();
    }
  };

  const total = useMemo(() => getTotalMoney(cartItems), [cartItems]);

  const insufficientStock = useMemo(() => {
    return cartItems.some((item) => item.stock === 0);
  }, [cartItems]);

  if (isLoading || isPending) return <Loading />;
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
      <form onSubmit={handleCheckout}>
        <button
          type="submit"
          disabled={checkoutMutation.isPending || insufficientStock}
          className={`${insufficientStock ? 'btn-disabled' : 'btn'} flex w-full items-center justify-center gap-2 p-3`}
        >
          {!checkoutMutation.isPending ? (
            <>
              <HiOutlineShoppingCart />
              Checkout
            </>
          ) : (
            <>
              <ImSpinner8 className="animate-spin" />
              Generating order...
            </>
          )}
        </button>
      </form>
    </div>
  );
}
