'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '@/data/product';
import Loading from './Loading';
import { ProductCardWithSalesDto } from '@/shared/dtos/product.dto';
import ProductList from './ProductList';
import { useEffect, useMemo, useState } from 'react';
import { useObserver } from '@/hooks/useObserver';
import { PRODUCT_PAGE_SIZE } from '@/shared/constants';

interface Props {
  categoryId?: number;
}

export default function ProductScroller({ categoryId }: Props) {
  const [pageCounter, setPageCounter] = useState(0);

  const showLoadMoreBtn = useMemo(() => {
    return pageCounter > 0 && pageCounter % 5 === 0;
  }, [pageCounter]);

  const { isLoading, isError, fetchNextPage, hasNextPage, refetch, data } =
    useInfiniteQuery<ProductCardWithSalesDto[]>({
      initialPageParam: undefined,
      queryFn: async ({ pageParam }) => {
        setPageCounter((prev) => prev + 1);
        return getProducts({
          lastId: pageParam as string | undefined,
          categoryId,
        });
      },
      queryKey: ['products'],
      getNextPageParam: (products) => {
        if (products.length !== PRODUCT_PAGE_SIZE) return;
        else return products[products.length - 1].id;
      },
    });

  useEffect(() => {
    setPageCounter(0);
    setTimeout(() => {
      refetch();
    });
  }, [categoryId, refetch]);

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
