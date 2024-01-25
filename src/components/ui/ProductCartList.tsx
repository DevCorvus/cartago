'use client';

import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from './ProductCartItem';
import { useMemo, useEffect, useState } from 'react';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { localStorageCart } from '@/utils/localStorageCart';
import { useCartStore } from '@/stores/useCartStore';

interface Props {
  products: ProductCartItemDto[] | null;
}

export default function ProductCartList({ products }: Props) {
  const isAuthenticated = useIsAuthenticated();

  const [cartProducts, setCartProducts] = useState<ProductCartItemDto[]>(
    products || [],
  );
  const removeProductId = useCartStore((state) => state.removeProductId);

  useEffect(() => {
    if (!products) {
      setCartProducts(localStorageCart.get());
    }
  }, [products]);

  const total = useMemo(
    () =>
      cartProducts.reduce((total, product) => {
        return product.price * product.amount + total;
      }, 0),
    [cartProducts],
  );

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
