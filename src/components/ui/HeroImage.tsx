'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const HERO_IMAGES = [{ src: '/background-tiny.jpeg', alt: 'Hero Image' }];

export default function HeroImage() {
  const [current, setCurrent] = useState(0);
  const [isResizing, setResizing] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const handleLeft = () => {
    setCurrent((prev) => {
      if (prev > 0) {
        return prev - 1;
      } else {
        return prev;
      }
    });
  };

  const handleRight = () => {
    setCurrent((prev) => {
      if (prev < HERO_IMAGES.length - 1) {
        return prev + 1;
      } else {
        return prev;
      }
    });
  };

  const timeoutId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const moveSlider = () => {
      clearTimeout(timeoutId.current);
      setResizing(true);

      const slider = sliderRef.current;

      if (slider) {
        slider.style.transform = `translateX(-${
          slider.clientWidth * current
        }px)`;

        timeoutId.current = setTimeout(() => {
          setResizing(false);
        }, 100);
      }
    };

    window.addEventListener('resize', moveSlider);

    return () => {
      window.removeEventListener('resize', moveSlider);
    };
  }, [current]);

  useEffect(() => {
    const slider = sliderRef.current;

    if (slider) {
      slider.style.transform = `translateX(-${slider.clientWidth * current}px)`;
    }
  }, [current]);

  return (
    <section className="h-full flex relative text-xl md:text-4xl text-lime-900">
      <button
        type="button"
        className="h-full w-16 bg-zinc-50 bg-opacity-0 z-10 absolute left-0  cursor-pointer group/iconLeft hover:bg-zinc-100 hover:opacity-40 flex items-center justify-center"
        onClick={handleLeft}
      >
        <HiChevronLeft className="invisible group-hover/iconLeft:visible" />
      </button>
      <div className="size-full overflow-hidden">
        <div
          className={`size-full flex ${
            isResizing ? '' : 'transition duration-500'
          }`}
          ref={sliderRef}
        >
          {HERO_IMAGES.map((image, i) => (
            <div key={i} className="relative h-full basis-full shrink-0 grow-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill={true}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="h-full w-16 bg-zinc-50 bg-opacity-0 z-10 absolute right-0 cursor-pointer group/iconRight  hover:bg-zinc-100 hover:opacity-40 flex items-center justify-center"
        onClick={handleRight}
      >
        <HiChevronRight className="invisible group-hover/iconRight:visible" />
      </button>
    </section>
  );
}
