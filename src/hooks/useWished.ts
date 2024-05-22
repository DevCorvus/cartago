'use client';

import { useWishedItemStore } from '@/stores/useWishedItemStore';
import { useIsAuthenticated } from './useIsAuthenticated';
import { useMemo } from 'react';
import { useUnwishProduct, useWishProduct } from '@/data/wished';
import { toastError } from '@/lib/toast';
import { localStorageWished } from '@/utils/localStorageWished';

export function useWished(productId: string) {
  const isAuthenticated = useIsAuthenticated();

  const { productIds, removeWishedItem, addWishedItem } = useWishedItemStore(
    (state) => ({
      productIds: state.productIds,
      addWishedItem: state.addWishedItem,
      removeWishedItem: state.removeWishedItem,
    }),
  );

  const isWished = useMemo(
    () => productIds.includes(productId),
    [productIds, productId],
  );

  const wishMutation = useWishProduct();
  const unwishMutation = useUnwishProduct();

  const toggleWishness = async () => {
    if (isAuthenticated) {
      if (!isWished) {
        try {
          addWishedItem(productId);
          await wishMutation.mutateAsync(productId);
        } catch (err) {
          toastError(err);
          removeWishedItem(productId);
        }
      } else {
        try {
          removeWishedItem(productId);
          await unwishMutation.mutateAsync(productId);
        } catch (err) {
          toastError(err);
          addWishedItem(productId);
        }
      }
    } else {
      if (!isWished) {
        localStorageWished.addItem(productId);
        addWishedItem(productId);
      } else {
        localStorageWished.remove(productId);
        removeWishedItem(productId);
      }
    }
  };

  return {
    toggleWishness,
    isWished,
  };
}
