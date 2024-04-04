'use client';

import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import ProductList from '@/components/ui/ProductList';
import { useWishedProducts } from '@/data/product';
import Loading from '@/components/ui/Loading';
import { localStorageWished } from '@/utils/localStorageWished';
import SomethingWentWrong from '@/components/ui/SomethingWentWrong';

export default function Wished() {
  const isAuthenticated = useIsAuthenticated();

  const { isLoading, isError, data } = useWishedProducts(isAuthenticated);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-green-800">Wish List </h1>
      </header>
      <div>
        {isAuthenticated ? (
          <>
            {isLoading && <Loading />}
            {isError && <SomethingWentWrong />}
            {!isLoading && !isError && <ProductList products={data || []} />}
          </>
        ) : (
          <ProductList products={localStorageWished.get()} />
        )}
      </div>
    </div>
  );
}
