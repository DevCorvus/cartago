'use client';

import { useProducts } from '@/data/product';
import Loading from './Loading';
import ProductList from './ProductList';
import { useEffect, useMemo, useState } from 'react';
import { useObserver } from '@/hooks/useObserver';
import SomethingWentWrong from './SomethingWentWrong';
import { HiOutlineEmojiSad } from 'react-icons/hi';

interface Props {
  categoryId?: number;
}

export default function ProductScroller({ categoryId }: Props) {
  const [pageCounter, setPageCounter] = useState(1);

  const showLoadMoreBtn = useMemo(() => {
    return pageCounter > 0 && pageCounter % 5 === 0;
  }, [pageCounter]);

  const {
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
    data,
  } = useProducts(categoryId);

  useEffect(() => {
    if (isFetching) {
      setPageCounter((prev) => prev + 1);
    }
  }, [isFetching]);

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
              <button onClick={() => fetchNextPage()} className="btn px-3 py-2">
                Load more
              </button>
            ) : (
              <div ref={observerTarget}></div>
            )}
          </>
        )}
        {!isLoading && !hasNextPage && (
          <p className="flex items-center gap-1 text-sm text-slate-500">
            You reached the end <HiOutlineEmojiSad className="text-base" />
          </p>
        )}
        {isError && <SomethingWentWrong />}
      </div>
    </div>
  );
}
