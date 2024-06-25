'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { capitalize } from '@/utils/capitalize';
import { getCategoryTags } from '@/data/category';
import { toastError } from '@/lib/toast';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import { useSearchFormStore } from '@/stores/useSearchFormStore';
import { ImSpinner8 } from 'react-icons/im';

interface Props {
  visible: boolean;
  hide(): void;
}

const menuStyles = {
  boxShadow: '0 0 6px 1px rgb(0 0 0 / 0.1)',
};

export default function MobileSearchForm({ visible, hide }: Props) {
  const { input, setInput, categoryTags, setCategoryTags } =
    useSearchFormStore();

  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setLoading] = useState(false);

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
            setShowMenu(true);
          } catch (err) {
            toastError(err);
          } finally {
            setLoading(false);
          }
        })();
      }, 500);
    } else {
      setCategoryTags([]);
      setLoading(false);
      setShowMenu(false);
    }
  }, [input, setCategoryTags]);

  const handleSearchClick = async () => {
    if (input) {
      setLoading(true);
      try {
        const data = await getCategoryTags(input);
        setCategoryTags(data);
        setShowMenu(true);
      } catch (err) {
        toastError(err);
      } finally {
        setLoading(false);
      }
    } else {
      setCategoryTags([]);
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleFocus = () => {
    if (input && !isLoading) {
      setShowMenu(true);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const inputElement = inputRef.current;

    if (visible && inputElement) {
      inputElement.focus();
    }
  }, [visible]);

  const handleAnimationEnd = () => {
    if (!visible) {
      hide();
    }
  };

  return (
    <div
      className={`${visible ? 'show-mobile-search' : 'hide-mobile-search'} relative flex flex-col-reverse overflow-hidden font-sans text-slate-600`}
      onAnimationEnd={handleAnimationEnd}
    >
      <section className="group flex items-center rounded-full border border-slate-200 bg-white py-2 pl-4 text-black shadow-md focus-within:border-cyan-500">
        <input
          ref={inputRef}
          type="text"
          className="w-full resize-none bg-transparent"
          placeholder="Search"
          onChange={(e) => setInput(e.target.value.trim())}
          onFocus={handleFocus}
          value={input}
        />
        <button
          onClick={handleSearchClick}
          type="button"
          className="pl-2 pr-3 text-cyan-700 transition group-focus-within:text-cyan-500"
        >
          {isLoading ? (
            <ImSpinner8 className="animate-spin" />
          ) : (
            <HiMiniMagnifyingGlass className="text-xl" />
          )}
        </button>
      </section>
      {showMenu && (
        <div
          style={menuStyles}
          className="mx-auto w-[88%] rounded-t-lg border border-slate-200 bg-slate-50 px-3 py-2 shadow-md"
        >
          {categoryTags.length === 0 ? (
            <p className="flex items-center justify-center gap-1 text-sm">
              Nothing found <HiOutlineEmojiSad className="text-base" />
            </p>
          ) : (
            <ul>
              {categoryTags.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/items?categoryId=${category.id}`}
                    className="transition hover:text-cyan-500 focus:text-cyan-500"
                  >
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
