'use client';

import { useProducts } from '@/data/product';
import Loading from './Loading';
import ProductList from './ProductList';
import { useEffect, useMemo, useRef, useState } from 'react';
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

  const prevCategoryIdRef = useRef<number | null>(null);

  useEffect(() => {
    const prevCategoryId = prevCategoryIdRef.current;
    if (prevCategoryId !== null && prevCategoryId !== categoryId) {
      setPageCounter(0);
      setTimeout(() => {
        (async () => {
          await refetch();
        })();
      });
    }

    prevCategoryIdRef.current = categoryId !== undefined ? categoryId : null;
  }, [categoryId, refetch]);

  const { observerTarget, isVisible } = useObserver({ threshold: 1 });

  useEffect(() => {
    if (isVisible) {
      fetchNextPage();
    }
  }, [isVisible, fetchNextPage]);

  const products = useMemo(() => data?.pages.flat() || [], [data]);

  return (
    <div>
      <ProductList products={products} />
      <div className="mt-8 flex justify-center">
        {isLoading ? (
          <div className="relative">
            <Loading />
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <>
                {hasNextPage ? (
                  <>
                    {showLoadMoreBtn ? (
                      <button
                        onClick={() => fetchNextPage()}
                        className="btn px-3 py-2"
                      >
                        Load more
                      </button>
                    ) : (
                      <div ref={observerTarget}></div>
                    )}
                  </>
                ) : (
                  <p className="flex items-center gap-1 text-sm text-slate-500">
                    You reached the end
                    <HiOutlineEmojiSad className="text-base" />
                  </p>
                )}
              </>
            ) : (
              <p className="flex w-full items-center justify-center gap-1 rounded-lg bg-slate-200/50 p-8 text-sm text-slate-500">
                Nothing found here <HiOutlineEmojiSad className="text-base" />
              </p>
            )}
            {isError && <SomethingWentWrong />}
          </>
        )}
      </div>
    </div>
  );
}
