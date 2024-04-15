'use client';
import Link from 'next/link';
import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { capitalize } from '@/utils/capitalize';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { useRef } from 'react';

interface Props {
  categories: CategoryTagDto[];
  skip?: number;
}

export default function CategoryList({ categories, skip }: Props) {
  const isEmpty = categories.length === 0 || (categories.length === 1 && skip);

  const scrollContainer = useRef<HTMLUListElement>(null);

  return (
    <div className="w-full h-10 mb-6 flex justify-center items-center gap-1">
      <button
        type="button"
        onClick={() => {
          if (!scrollContainer.current) return;
          scrollContainer.current.scrollLeft -= 60;
        }}
      >
        <HiChevronLeft />
      </button>
      {!isEmpty && (
        <ul
          className={`flex w-full gap-1.5 overflow-hidden touch-auto scroll-smooth snap-start`}
          ref={scrollContainer}
          onScroll={(e) => e.preventDefault()}
        >
          {categories.map(
            (category) =>
              category.id !== skip && (
                <li
                  key={category.id}
                  className="rounded-full bg-green-100 px-2 py-1 text-green-700 shadow-sm text-nowrap"
                >
                  <Link href={`/items?categoryId=${category.id}`}>
                    {capitalize(category.title)}
                  </Link>
                </li>
              ),
          )}
        </ul>
      )}
      <button
        type="button"
        onClick={() => {
          if (!scrollContainer.current) return;
          scrollContainer.current.scrollLeft += 60;
        }}
      >
        <HiChevronRight />
      </button>
    </div>
  );
}
