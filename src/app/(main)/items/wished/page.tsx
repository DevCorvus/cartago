'use client';

import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import ProductList from '@/components/ui/ProductList';
import { useGuestWishedProducts, useWishedProducts } from '@/data/product';
import SomethingWentWrong from '@/components/ui/SomethingWentWrong';
import { localStorageWished } from '@/utils/localStorageWished';
import { useEffect } from 'react';
import { toastError } from '@/lib/toast';
import { useWishedItemStore } from '@/stores/useWishedItemStore';
import Link from 'next/link';
import { HiOutlineHeart } from 'react-icons/hi2';

export default function Wished() {
  const isAuthenticated = useIsAuthenticated();

  const { isLoading, isError, data } = useWishedProducts(isAuthenticated);

  const {
    isLoading: isGuestLoading,
    isError: isGuestError,
    data: guestData,
  } = useGuestWishedProducts(!isAuthenticated);

  const removeWishedItem = useWishedItemStore(
    (state) => state.removeWishedItem,
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

  if (isError || isGuestError) return <SomethingWentWrong />;

  if (
    ((!isLoading || isGuestLoading) && data && data.length === 0) ||
    (guestData && guestData.length === 0)
  ) {
    return (
      <div className="absolute inset-0 flex h-screen w-screen items-center justify-center">
        <section className="max-w-md space-y-3 rounded-lg text-center text-slate-400">
          <header className="space-y-1">
            <HiOutlineHeart className="mx-auto text-5xl" />
            <h1 className="font-semibold">Nothing wished yet</h1>
          </header>
          <Link
            href="/items"
            className="inline-block w-56 text-xs italic hover:underline"
          >
            Add something to keep the wheels of capitalism rolling!
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-cyan-700">Wish List</h1>
      </header>
      <div>
        {isAuthenticated ? (
          <ProductList isLoading={isLoading} products={data || []} />
        ) : (
          <ProductList isLoading={isGuestLoading} products={guestData || []} />
        )}
      </div>
    </div>
  );
}
