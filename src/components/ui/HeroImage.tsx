'use client';

import { Roboto } from 'next/font/google';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const roboto = Roboto({ subsets: ['latin'], weight: '900' });

const HERO_IMAGES = [
  { src: '/fashion.webp', alt: 'Hero Image #1' },
  { src: '/kitchen.webp', alt: 'Hero Image #2' },
  { src: '/toys.webp', alt: 'Hero Image #3' },
  { src: '/phone.webp', alt: 'Hero Image #4' },
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
    <header className="h-[75vh] pt-10 md:h-[50vh] md:pt-14 2xl:h-[40vh]">
      <div className="relative flex h-full">
        <button
          type="button"
          className="bg-neutral-200/35 absolute left-0 z-10 flex h-full w-8 items-center justify-center text-white opacity-0 backdrop-blur-sm transition duration-300 hover:opacity-100 md:w-16"
          onClick={handleLeft}
        >
          <HiChevronLeft />
        </button>
        <h1
          style={{
            ...roboto.style,
            filter: 'drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.8))',
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[325px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-cyan-400 to-green-400 bg-clip-text text-center text-4xl text-transparent md:w-[450px] md:text-5xl xl:w-[650px] xl:text-7xl 2xl:w-[850px] 2xl:text-8xl"
        >
          We bring the{' '}
          <span
            style={{
              backgroundImage: 'url("/sand.webp")',
            }}
            className="bg-cover bg-clip-text bg-center brightness-90"
          >
            Punic
          </span>{' '}
          world to your cart.
        </h1>
        <div className="size-full overflow-hidden">
          <div
            className={`size-full flex ${
              isResizing ? '' : 'transition duration-500'
            }`}
            ref={sliderRef}
          >
            {HERO_IMAGES.map((image, i) => (
              <div
                key={i}
                className="relative h-full shrink-0 grow-0 basis-full"
              >
                <Image
                  priority
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
          className="bg-neutral-200/35 absolute right-0 z-10 flex h-full w-8 items-center justify-center text-white opacity-0 backdrop-blur-sm transition duration-300 hover:opacity-100 md:w-16"
          onClick={handleRight}
        >
          <HiChevronRight />
        </button>
      </div>
    </header>
  );
}
