'use client';

import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from '@/components/ui/ProductCartItem';
import { useMemo, useEffect, useState, FormEvent } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import Loading from '@/components/ui/Loading';
import { ImSpinner8 } from 'react-icons/im';
import { NewOrderDto } from '@/shared/dtos/order.dto';
import { formatMoney, getTotalMoney } from '@/lib/dinero';
import AddOrderForm from '@/components/ui/AddOrderForm.tsx';
import {
  useCartItems,
  useCheckout,
  useDecrementCartItemAmount,
  useIncrementCartItemAmount,
  useRemoveCartItem,
  useSyncCartItemAmounts,
} from '@/data/cart';
import SomethingWentWrong from '@/components/ui/SomethingWentWrong';
import { toastAmountSynced, toastError } from '@/lib/toast';

export default function UserShoppingCart() {
  const [cartItems, setCartItems] = useState<ProductCartItemDto[]>([]);

  const { isLoading, isError, error, data, refetch } = useCartItems();

  const { mutateAsync: syncCartItemAmounts, isPending } =
    useSyncCartItemAmounts();

  useEffect(() => {
    if (data) {
      const toSync = data
        .filter((item) => item.amount > item.stock)
        .map((item) => item.title);

      if (toSync.length === 0) {
        setCartItems(data);
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
  }, [data, syncCartItemAmounts, refetch]);

  useEffect(() => {
    if (error) toastError(error);
  }, [error]);

  const [order, setOrder] = useState<NewOrderDto | null>(null);

  const incrementMutation = useIncrementCartItemAmount();

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
    try {
      incrementCartItemAmountFromUI(productId);
      await incrementMutation.mutateAsync(productId);
    } catch (err) {
      toastError(err);
      decrementCartItemAmountFromUI(productId);
    }
  };

  const decrementCartItemAmountMutation = useDecrementCartItemAmount();

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
    try {
      decrementCartItemAmountFromUI(productId);
      await decrementCartItemAmountMutation.mutateAsync(productId);
    } catch (err) {
      toastError(err);
      incrementCartItemAmountFromUI(productId);
    }
  };

  const removeCartItemMutation = useRemoveCartItem();

  const removeProductId = useCartStore((state) => state.removeProductId);

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
      const newOrder = await checkoutMutation.mutateAsync();
      setOrder(newOrder);
    } catch (err) {
      toastError(err);
      setOrder(null);
    }
  };

  const total = useMemo(() => getTotalMoney(cartItems), [cartItems]);

  if (isLoading || isPending) return <Loading />;
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
      <form onSubmit={handleCheckout}>
        <button
          type="submit"
          disabled={checkoutMutation.isPending}
          className="btn flex w-full items-center justify-center gap-2 p-3"
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
      {order && <AddOrderForm order={order} close={() => setOrder(null)} />}
    </div>
  );
}
