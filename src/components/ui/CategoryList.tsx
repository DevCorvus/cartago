'use client';

import Link from 'next/link';
import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { capitalize } from '@/utils/capitalize';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { useEffect, useRef, useState } from 'react';

interface Props {
  categories: CategoryTagDto[];
  skip?: number;
}

export default function CategoryList({ categories, skip }: Props) {
  const [autoplay, setAutoplay] = useState(true);

  const sliderRef = useRef<HTMLUListElement>(null);
  const intervalId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const slider = sliderRef.current;

    if (autoplay && slider) {
      let backwards = false;

      intervalId.current = setInterval(() => {
        slider.scrollBy(backwards ? -3 : 3, 0);

        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

        if (slider.scrollLeft === maxScrollLeft) {
          backwards = true;
        } else if (slider.scrollLeft === 0) {
          backwards = false;
        }
      }, 50);
    }

    return () => {
      clearInterval(intervalId.current);
    };
  }, [autoplay]);

  const handleSlideLeftClick = () => {
    const slider = sliderRef.current;
    if (slider) slider.scrollBy(-70, 0);
  };

  const handleSlideRightClick = () => {
    const slider = sliderRef.current;
    if (slider) slider.scrollBy(70, 0);
  };

  const timeoutId = useRef<NodeJS.Timeout>();

  const handleEnterSliderContainer = () => {
    clearTimeout(timeoutId.current);
    setAutoplay(false);
  };

  const handleLeaveSliderContainer = () => {
    timeoutId.current = setTimeout(() => setAutoplay(true), 2500);
  };

  return (
    <div
      className="mb-6 flex h-10 w-full items-center justify-center gap-1"
      onMouseEnter={handleEnterSliderContainer}
      onMouseLeave={handleLeaveSliderContainer}
    >
      <button type="button" onClick={handleSlideLeftClick}>
        <HiChevronLeft />
      </button>
      <ul
        ref={sliderRef}
        className="flex w-full gap-1.5 overflow-hidden scroll-smooth"
      >
        {categories.map(
          (category) =>
            category.id !== skip && (
              <li
                key={category.id}
                className="text-nowrap rounded-full bg-green-100 px-2 py-1 text-green-700 shadow-sm"
              >
                <Link href={`/items?categoryId=${category.id}`}>
                  {capitalize(category.title)}
                </Link>
              </li>
            ),
        )}
      </ul>
      <button type="button" onClick={handleSlideRightClick}>
        <HiChevronRight />
      </button>
    </div>
  );
}
