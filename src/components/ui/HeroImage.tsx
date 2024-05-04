'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const HERO_IMAGES = [
  { src: '/background-tiny.jpeg', alt: 'Hero Image' },
  { src: '/background-tiny.jpeg', alt: 'Hero Image' },
  { src: '/background-tiny.jpeg', alt: 'Hero Image' },
  { src: '/background-tiny.jpeg', alt: 'Hero Image' },
  { src: '/background-tiny.jpeg', alt: 'Hero Image' },
];

export default function HeroImage() {
  const [current, setCurrent] = useState(0);
  const [isResizing, setResizing] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);

  const autoplayTimeoutIdRef = useRef<NodeJS.Timeout>();

  const stopAutoplay = () => {
    clearTimeout(autoplayTimeoutIdRef.current);
    setAutoplay(false);
    autoplayTimeoutIdRef.current = setTimeout(() => setAutoplay(true), 2000);
  };

  const handleLeft = () => {
    setCurrent((prev) => {
      return prev > 0 ? prev - 1 : HERO_IMAGES.length - 1;
    });
    stopAutoplay();
  };

  const handleRight = () => {
    setCurrent((prev) => {
      return prev < HERO_IMAGES.length - 1 ? prev + 1 : 0;
    });
    stopAutoplay();
  };

  const handleDot = (i: number) => {
    setCurrent(i);
    stopAutoplay();
  };

  const intervalIdRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoplay) {
      intervalIdRef.current = setInterval(() => {
        setCurrent((prev) => {
          return prev < HERO_IMAGES.length - 1 ? prev + 1 : 0;
        });
      }, 5000);
    }

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [autoplay]);

  const resizeTimeoutIdRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const moveSlider = () => {
      clearTimeout(resizeTimeoutIdRef.current);
      setResizing(true);

      const slider = sliderRef.current;

      if (slider) {
        slider.style.transform = `translateX(-${
          slider.clientWidth * current
        }px)`;

        resizeTimeoutIdRef.current = setTimeout(() => {
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
    <section className="relative flex h-full text-xl text-lime-900 md:text-4xl">
      <button
        type="button"
        className="bg-opacity-35 absolute left-0 z-10 flex h-full w-8 items-center justify-center bg-neutral-200 text-white opacity-0 transition duration-300 hover:opacity-100 md:w-16"
        onClick={handleLeft}
      >
        <HiChevronLeft />
      </button>
      <div className="size-full overflow-hidden">
        <div
          className={`size-full flex ${
            isResizing ? '' : 'transition duration-500'
          }`}
          ref={sliderRef}
        >
          {HERO_IMAGES.map((image, i) => (
            <div key={i} className="relative h-full shrink-0 grow-0 basis-full">
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
      <div className="absolute bottom-2 flex w-full items-center justify-center gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button key={i} onClick={() => handleDot(i)} className="flex">
            <span
              className={`size-3 rounded-full border-2 shadow-md transition duration-300 ${
                current === i
                  ? 'border-white bg-white'
                  : 'border-neutral-200 bg-transparent hover:border-white'
              }`}
            />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="bg-opacity-35 absolute right-0 z-10 flex h-full w-8 items-center justify-center bg-neutral-200 text-white opacity-0 transition duration-300 hover:opacity-100 md:w-16"
        onClick={handleRight}
      >
        <HiChevronRight />
      </button>
    </section>
  );
}
