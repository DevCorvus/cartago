'use client';

import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from '@/components/ui/ProductCartItem';
import { useMemo, useEffect, useState, FormEvent } from 'react';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { localStorageCart } from '@/utils/localStorageCart';
import { useCartStore } from '@/stores/useCartStore';
import Loading from '@/components/ui/Loading';
import { ImSpinner8 } from 'react-icons/im';
import { NewOrderDto } from '@/shared/dtos/order.dto';
import { formatMoney, getTotalMoney } from '@/lib/dinero';
import AddOrderForm from '@/components/ui/AddOrderForm.tsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  checkout,
  decrementCartItemAmount,
  getCartItems,
  incrementCartItemAmount,
  removeCartItem,
} from '@/data/cart';
import SomethingWentWrong from '@/components/ui/SomethingWentWrong';

export default function Cart() {
  const isAuthenticated = useIsAuthenticated();

  const [cartItems, setCartItems] = useState<ProductCartItemDto[]>(
    isAuthenticated ? [] : localStorageCart.get(),
  );

  const { isLoading, isError, data } = useQuery({
    queryFn: getCartItems,
    queryKey: ['cartItems'],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data) setCartItems(data);
  }, [data]);

  const [order, setOrder] = useState<NewOrderDto | null>(null);

  const incrementMutation = useMutation({
    mutationFn: incrementCartItemAmount,
    mutationKey: ['incrementCartItemAmount'],
  });

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
    if (isAuthenticated) {
      try {
        await incrementMutation.mutateAsync(productId);
        incrementCartItemAmountFromUI(productId);
      } catch {
        // TODO: Handle error case
      }
    } else {
      localStorageCart.incrementItemAmount(productId);
      incrementCartItemAmountFromUI(productId);
    }
  };

  const decrementCartItemAmountMutation = useMutation({
    mutationFn: decrementCartItemAmount,
    mutationKey: ['decrementCartItemAmount'],
  });

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
    if (isAuthenticated) {
      try {
        await decrementCartItemAmountMutation.mutateAsync(productId);
        decrementCartItemAmountFromUI(productId);
      } catch {
        // TODO: Handle error case
      }
    } else {
      localStorageCart.decrementItemAmount(productId);
      decrementCartItemAmountFromUI(productId);
    }
  };

  const removeCartItemMutation = useMutation({
    mutationFn: removeCartItem,
    mutationKey: ['removeCartItem'],
  });

  const removeProductId = useCartStore((state) => state.removeProductId);

  const removeCartItemFromUI = (productId: string) => {
    removeProductId(productId);
    setCartItems((prev) => {
      return prev.filter((product) => product.id !== productId);
    });
  };

  const removeItem = async (productId: string) => {
    if (isAuthenticated) {
      try {
        await removeCartItemMutation.mutateAsync(productId);
        removeCartItemFromUI(productId);
      } catch {
        // TODO: Handle error case
      }
    } else {
      localStorageCart.remove(productId);
      removeCartItemFromUI(productId);
    }
  };

  const checkoutMutation = useMutation({
    mutationFn: checkout,
    mutationKey: ['checkout'],
  });

  const handleCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newOrder = await checkoutMutation.mutateAsync();
      setOrder(newOrder);
    } catch {
      setOrder(null);
    }
  };

  const total = useMemo(() => getTotalMoney(cartItems), [cartItems]);

  if (isLoading) return <Loading />;
  if (isError) return <SomethingWentWrong />;

  return (
    <>
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
      </div>
      {order && <AddOrderForm order={order} close={() => setOrder(null)} />}
    </>
  );
}
