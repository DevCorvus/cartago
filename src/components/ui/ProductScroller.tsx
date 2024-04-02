'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '@/data/product';
import Loading from './Loading';
import { ProductCardWithSalesDto } from '@/shared/dtos/product.dto';
import ProductList from './ProductList';
import { useEffect, useMemo, useState } from 'react';
import { useObserver } from '@/hooks/useObserver';

export default function ProductScroller() {
  const [pageCounter, setPageCounter] = useState(0);

  const showLoadMoreBtn = useMemo(() => {
    return pageCounter > 0 && pageCounter % 5 === 0;
  }, [pageCounter]);

  const { isLoading, isError, fetchNextPage, hasNextPage, data } =
    useInfiniteQuery<ProductCardWithSalesDto[]>({
      initialPageParam: undefined,
      queryFn: async ({ pageParam }) => {
        setPageCounter((prev) => prev + 1);
        return getProducts(pageParam as string | undefined);
      },
      queryKey: ['products'],
      getNextPageParam: (products) => {
        if (products.length) {
          return products[products.length - 1].id;
        }
      },
    });

  const { observerTarget, isVisible } = useObserver({ threshold: 1 });

  useEffect(() => {
    if (isVisible) {
      fetchNextPage();
    }
  }, [isVisible, fetchNextPage]);

  return (
    <div>
      <ProductList products={data?.pages.flat() || []} />
      <div className="mt-8 flex justify-center">
        {isLoading && <Loading />}
        {!isLoading && hasNextPage && (
          <>
            {showLoadMoreBtn ? (
              <button onClick={() => fetchNextPage()} className="btn p-3">
                Load more
              </button>
            ) : (
              <div ref={observerTarget}></div>
            )}
          </>
        )}
        {!isLoading && !hasNextPage && (
          <p className="text-lg text-green-800">No more items for you .(</p>
        )}
        {isError && (
          <p className="text-lg text-green-800">Something went wrong .(</p>
        )}
      </div>
    </div>
  );
}
