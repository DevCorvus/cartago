'use client';

import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { useEffect, useRef, useState } from 'react';
import CategoryLink from './CategoryLink';

interface Props {
  categories: CategoryTagDto[];
  skip?: number;
}

// This could've been done "easier" or more optimized just by using CSS animations I guess
export default function CategorySlider({ categories, skip }: Props) {
  const [autoplay, setAutoplay] = useState(true);

  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLUListElement>(null);

  const xRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const sliderContainer = sliderContainerRef.current;
    const slider = sliderRef.current;

    if (autoplay && sliderContainer && slider) {
      const rightBoundary = slider.clientWidth - sliderContainer.clientWidth;

      const slideToX = () => {
        const x = xRef.current;

        if (x < rightBoundary) {
          slider.style.transform = `translateX(-${x}px)`;
          xRef.current += 0.3;
        } else {
          const gapSize = 8; // gap-2
          const xSnapBackPosition =
            x / 2 - sliderContainer.clientWidth / 2 - gapSize / 2;

          slider.style.transform = `translateX(-${xSnapBackPosition}px)`;
          xRef.current = xSnapBackPosition;
        }

        animationFrameRef.current = requestAnimationFrame(slideToX);
      };

      animationFrameRef.current = requestAnimationFrame(slideToX);
    }

    return () => {
      const animationFrameId = animationFrameRef.current;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [autoplay]);

  const handleSlideLeftClick = () => {
    const sliderContainer = sliderContainerRef.current;
    const slider = sliderRef.current;

    if (sliderContainer && slider) {
      const newPosition = Math.max(
        xRef.current - sliderContainer.clientWidth,
        0,
      );

      slider.style.transform = `translateX(-${newPosition}px)`;
      xRef.current = newPosition;
    }
  };

  const handleSlideRightClick = () => {
    const sliderContainer = sliderContainerRef.current;
    const slider = sliderRef.current;

    if (sliderContainer && slider) {
      const rightBoundary = slider.clientWidth - sliderContainer.clientWidth;

      const newPosition = Math.min(
        xRef.current + sliderContainer.clientWidth,
        rightBoundary,
      );

      slider.style.transform = `translateX(-${newPosition}px)`;
      xRef.current = newPosition;
    }
  };

  const timeoutId = useRef<NodeJS.Timeout>();

  const handleEnterSliderContainer = () => {
    clearTimeout(timeoutId.current);
    setAutoplay(false);
  };

  const handleLeaveSliderContainer = () => {
    timeoutId.current = setTimeout(() => setAutoplay(true), 3000);
  };

  useEffect(() => {
    const sliderContainer = sliderContainerRef.current;

    if (sliderContainer) {
      sliderContainer.addEventListener('focusin', handleEnterSliderContainer);
      sliderContainer.addEventListener('focusout', handleLeaveSliderContainer);
    }

    return () => {
      if (sliderContainer) {
        sliderContainer.removeEventListener(
          'focusin',
          handleEnterSliderContainer,
        );
        sliderContainer.removeEventListener(
          'focusout',
          handleLeaveSliderContainer,
        );
      }
    };
  }, []);

  return (
    <section
      className="flex w-full items-center gap-2"
      onMouseEnter={handleEnterSliderContainer}
      onMouseLeave={handleLeaveSliderContainer}
      onTouchStart={handleEnterSliderContainer}
      onTouchEnd={handleLeaveSliderContainer}
    >
      <button
        type="button"
        onClick={handleSlideLeftClick}
        className="rounded-full bg-white p-1.5 text-sm text-slate-700 shadow-md transition hover:text-cyan-700 focus:text-cyan-700 md:p-2 md:text-base"
      >
        <HiChevronLeft />
      </button>
      <div
        className="overflow-hidden rounded-full py-2 md:py-5"
        ref={sliderContainerRef}
      >
        <ul
          ref={sliderRef}
          className={`flex w-max gap-2 ${autoplay ? '' : 'transition-transform duration-1000'}`}
        >
          {categories.map(
            (category) =>
              category.id !== skip && (
                <li key={category.id}>
                  <CategoryLink
                    categoryId={category.id}
                    title={category.title}
                  />
                </li>
              ),
          )}
          {categories.map(
            (category) =>
              category.id !== skip && (
                <li key={`${category.id}-duplicate`} aria-hidden={true}>
                  <CategoryLink
                    categoryId={category.id}
                    title={category.title}
                  />
                </li>
              ),
          )}
        </ul>
      </div>
      <button
        type="button"
        onClick={handleSlideRightClick}
        className="rounded-full bg-white p-1.5 text-sm text-slate-700 shadow-md transition hover:text-cyan-700 focus:text-cyan-700 md:p-2 md:text-base"
      >
        <HiChevronRight />
      </button>
    </section>
  );
}
