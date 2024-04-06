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
import {
  useCartItems,
  useCheckout,
  useDecrementCartItemAmount,
  useGuestCartItems,
  useIncrementCartItemAmount,
  useRemoveCartItem,
} from '@/data/cart';
import SomethingWentWrong from '@/components/ui/SomethingWentWrong';
import { toastError } from '@/lib/toast';
import toast from 'react-hot-toast';

export default function Cart() {
  const isAuthenticated = useIsAuthenticated();

  const [cartItems, setCartItems] = useState<ProductCartItemDto[]>([]);

  const { isLoading, isError, error, data } = useCartItems(isAuthenticated);
  const {
    isLoading: isGuestLoading,
    isError: isGuestError,
    error: guestError,
    data: guestData,
  } = useGuestCartItems(!isAuthenticated);

  useEffect(() => {
    if (data) setCartItems(data);
  }, [data]);

  useEffect(() => {
    if (guestData) {
      const cart = localStorageCart.get();

      const cartItems: ProductCartItemDto[] = guestData.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);

        if (!cartItem) {
          toastError(new Error(`Could not sync "${product.title}" amount`));
        }

        let amount = cartItem?.amount || 1;

        if (amount > product.stock) {
          localStorageCart.setItemAmount(product.id, product.stock);
          amount = product.stock;
          toast(
            () => (
              <p>
                <strong>{product.title}</strong> amount is higher than current
                stock available. It will now be equal to the remaining stock to
                keep you in sync.
              </p>
            ),
            { duration: 5000 },
          );
        }

        return { ...product, amount };
      });

      setCartItems(cartItems);
    }
  }, [guestData]);

  useEffect(() => {
    if (error) toastError(error);
  }, [error]);

  useEffect(() => {
    if (guestError) toastError(guestError);
  }, [guestError]);

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
    if (isAuthenticated) {
      try {
        incrementCartItemAmountFromUI(productId);
        await incrementMutation.mutateAsync(productId);
      } catch (err) {
        toastError(err);
        decrementCartItemAmountFromUI(productId);
      }
    } else {
      const product = cartItems.find((item) => item.id === productId);

      if (product) {
        localStorageCart.incrementItemAmount(productId, product.stock);
        incrementCartItemAmountFromUI(productId);
      }
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
    if (isAuthenticated) {
      try {
        decrementCartItemAmountFromUI(productId);
        await decrementCartItemAmountMutation.mutateAsync(productId);
      } catch (err) {
        toastError(err);
        incrementCartItemAmountFromUI(productId);
      }
    } else {
      localStorageCart.decrementItemAmount(productId);
      decrementCartItemAmountFromUI(productId);
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
    if (isAuthenticated) {
      try {
        await removeCartItemMutation.mutateAsync(productId);
        removeCartItemFromUI(productId);
      } catch (err) {
        toastError(err);
      }
    } else {
      localStorageCart.remove(productId);
      removeCartItemFromUI(productId);
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

  if (isLoading || isGuestLoading) return <Loading />;
  if (isError || isGuestError) return <SomethingWentWrong />;

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
