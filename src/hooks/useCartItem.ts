import { useIsAuthenticated } from './useIsAuthenticated';
import { toastError } from '@/lib/toast';
import { useAddCartItem } from '@/data/cart';
import { useCartStore } from '@/stores/useCartStore';
import { localStorageCart } from '@/utils/localStorageCart';
import { useMemo } from 'react';

export function useCartItem(productId: string) {
  const isAuthenticated = useIsAuthenticated();

  const { productIds, addProductId, removeProductId } = useCartStore(
    ({ productIds, addProductId, removeProductId }) => ({
      productIds,
      addProductId,
      removeProductId,
    }),
  );

  const addCartItemMutation = useAddCartItem();

  const addCartItem = async () => {
    if (isAuthenticated) {
      try {
        addProductId(productId);
        await addCartItemMutation.mutateAsync(productId);
      } catch (err) {
        toastError(err);
        removeProductId(productId);
      }
    } else {
      localStorageCart.addItem({ id: productId, amount: 1 });
      addProductId(productId);
    }
  };

  const inCart = useMemo(
    () => productIds.includes(productId),
    [productIds, productId],
  );

  return {
    addCartItem,
    inCart,
  };
}
