'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { capitalize } from '@/utils/capitalize';
import Loading from './Loading';
import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { getCategoryTags } from '@/data/category';
import { toastError } from '@/lib/toast';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';

export default function SearchForm() {
  const pathname = usePathname();

  const [input, setInput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [categoryTags, setCategoryTags] = useState<CategoryTagDto[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (input) {
      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        (async () => {
          try {
            const data = await getCategoryTags(input);
            setCategoryTags(data);
          } catch (err) {
            toastError(err);
          } finally {
            setLoading(false);
          }
        })();
      }, 500);
    } else {
      setCategoryTags([]);
    }
  }, [input]);

  useEffect(() => {
    setInput('');
    setCategoryTags([]);
  }, [pathname]);

  return (
    <div className="font-sans font-normal">
      <form className="relative flex items-center">
        <input
          type="text"
          className="resize-none rounded-full bg-zinc-50 py-2 px-4 text-lime-900 shadow-inner shadow-slate-300 outline-none w-40 sm:w-80 md:w-96"
          placeholder="Search"
          onChange={(e) => setInput(e.target.value.trim())}
          value={input}
        />
        <HiMiniMagnifyingGlass className="absolute right-2 text-lime-500 text-xl" />
      </form>
      {input && (
        <div className="absolute w-40 sm:w-80 md:w-96 rounded-b-lg bg-white px-2 py-4 text-lime-500">
          {categoryTags.length === 0 ? (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <p className="text-center">Nothing here .(</p>
              )}
            </>
          ) : (
            <ul className="">
              {categoryTags.map((category) => (
                <li
                  key={category.id}
                  className="px-2 py-1 hover:bg-lime-500 hover:text-white hover:rounded-md"
                >
                  <Link href={`/items?categoryId=${category.id}`}>
                    {capitalize(category.title)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
