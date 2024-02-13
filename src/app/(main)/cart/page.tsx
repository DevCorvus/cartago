'use client';

import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from '@/components/ui/ProductCartItem';
import { useMemo, useEffect, useState, FormEvent } from 'react';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { localStorageCart } from '@/utils/localStorageCart';
import { useCartStore } from '@/stores/useCartStore';
import Loading from '@/components/ui/Loading';
import OrderDetailsModal from '@/components/ui/OrderDetailsModal';
import { ImSpinner8 } from 'react-icons/im';
import { OrderDto } from '@/shared/dtos/order.dto';
import { formatMoney, getTotalMoney } from '@/lib/dinero';

// I had to fetch the data in the old-fashioned client-side way
// Server-component methods to always fetch data dynamically didn't work for me
// at least in this current state of Next.js App Router (Probably a skill issue)

export default function Cart() {
  const isAuthenticated = useIsAuthenticated();

  const [isLoading, setLoading] = useState(true);

  const [cartItems, setCartProducts] = useState<ProductCartItemDto[]>([]);
  const removeProductId = useCartStore((state) => state.removeProductId);

  const [isLoadingOrder, setLoadingOrder] = useState(false);
  const [order, setOrder] = useState<OrderDto | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const res = await fetch('/api/cart');

        if (res.ok) {
          const data = await res.json();
          setCartProducts(data);
        }

        setLoading(false);
      })();
    } else {
      setCartProducts(localStorageCart.get());
      setLoading(false);
    }
  }, [isAuthenticated]);

  const total = useMemo(() => getTotalMoney(cartItems), [cartItems]);

  const incrementAmount = async (productId: string) => {
    let userIncrementSuccess = false;

    if (isAuthenticated) {
      const res = await fetch(
        `/api/cart/${productId}/amount?action=increment`,
        {
          method: 'PUT',
        },
      );

      userIncrementSuccess = res.ok;
    } else {
      localStorageCart.incrementItemAmount(productId);
    }

    if (!isAuthenticated || userIncrementSuccess) {
      setCartProducts((prev) => {
        return prev.map((product) => {
          if (product.id === productId && product.amount < product.stock) {
            return { ...product, amount: product.amount + 1 };
          }
          return product;
        });
      });
    }
  };

  const decrementAmount = async (productId: string) => {
    let userDecrementSuccess = false;

    if (isAuthenticated) {
      const res = await fetch(
        `/api/cart/${productId}/amount?action=decrement`,
        {
          method: 'PUT',
        },
      );

      userDecrementSuccess = res.ok;
    } else {
      localStorageCart.decrementItemAmount(productId);
    }

    if (!isAuthenticated || userDecrementSuccess) {
      setCartProducts((prev) => {
        return prev.map((product) => {
          if (product.id === productId && product.amount > 1) {
            return { ...product, amount: product.amount - 1 };
          }
          return product;
        });
      });
    }
  };

  const removeItem = async (productId: string) => {
    let userRemoveSuccess = false;

    if (isAuthenticated) {
      const res = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      });

      userRemoveSuccess = res.ok;
    } else {
      localStorageCart.remove(productId);
    }

    if (!isAuthenticated || userRemoveSuccess) {
      removeProductId(productId);
      setCartProducts((prev) => {
        return prev.filter((product) => product.id !== productId);
      });
    }
  };

  const handleCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoadingOrder(true);

    const res = await fetch('/api/orders', { method: 'POST' });

    if (res.ok) {
      const data: OrderDto = await res.json();
      setOrder(data);
    }

    setLoadingOrder(false);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="max-w-md flex flex-col gap-6 mx-auto">
        <header>
          <h1 className="text-green-800 font-bold text-2xl">
            Shopping cart ({cartItems.length})
          </h1>
        </header>
        <div className="w-full flex flex-col gap-4">
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
            disabled={isLoadingOrder}
            className="p-3 btn w-full flex items-center justify-center gap-2"
          >
            {!isLoadingOrder ? (
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
      {order && (
        <OrderDetailsModal order={order} close={() => setOrder(null)} />
      )}
    </>
  );
}
