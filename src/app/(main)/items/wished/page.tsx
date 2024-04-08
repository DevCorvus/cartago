'use client';

import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import ProductList from '@/components/ui/ProductList';
import { useGuestWishedProducts, useWishedProducts } from '@/data/product';
import Loading from '@/components/ui/Loading';
import SomethingWentWrong from '@/components/ui/SomethingWentWrong';
import { localStorageWished } from '@/utils/localStorageWished';
import { useEffect } from 'react';
import { toastError } from '@/lib/toast';
import { useWishedItemStore } from '@/stores/useWishedItemStore';

export default function Wished() {
  const isAuthenticated = useIsAuthenticated();

  const { isLoading, isError, data } = useWishedProducts(isAuthenticated);

  const {
    isLoading: isGuestLoading,
    isError: isGuestError,
    data: guestData,
  } = useGuestWishedProducts(!isAuthenticated);

  const removeWishedItem = useWishedItemStore(
    (store) => store.removeWishedItem,
  );

  useEffect(() => {
    if (guestData) {
      const wished = localStorageWished.get();

      const removedItems = wished.filter(
        (itemId) => !guestData.some((item) => item.id === itemId),
      );

      if (removedItems.length !== 0) {
        toastError(new Error('Some items no longer exist'));
        removedItems.forEach((itemId) => {
          removeWishedItem(itemId);
          localStorageWished.remove(itemId);
        });
      }
    }
  }, [guestData, removeWishedItem]);

  if (isLoading || isGuestLoading) return <Loading />;
  if (isError || isGuestError) return <SomethingWentWrong />;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-green-800">Wish List </h1>
      </header>
      <div>
        {isAuthenticated ? (
          <ProductList products={data || []} />
        ) : (
          <ProductList products={guestData || []} />
        )}
      </div>
    </div>
  );
}
