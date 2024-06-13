'use client';

import { useCursorPosition } from '@/hooks/useCursorPosition';
import { formatMoney } from '@/lib/dinero';
import {
  Dimensions,
  calculatePaddingBasedOnAspectRatios,
  getImageDimensions,
} from '@/utils/dimensions';
import NextImage from 'next/image';
import { useEffect, useRef, useState } from 'react';
import NewTag from './NewTag';

interface Props {
  path: string;
  title: string;
  price: number;
  createdAt: Date;
  zoom?: number;
}

// This implementation is a little bit complex because it has to keep the aspect ratio when magnifying the image
// I don't feel like this abstraction is any good either but it works
export function ProductImageVisualizer({
  path,
  title,
  price,
  createdAt,
  zoom = 2,
}: Props) {
  const [showMagnifier, setShowMagnifier] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const position = useCursorPosition(containerRef);

  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [padding, setPadding] = useState({ x: 0, y: 0 });

  const magnifierSize = 100;

  const imageDimensionsRef = useRef<Dimensions | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const dimensions = {
        width: container.clientWidth,
        height: container.clientHeight,
      };

      setContainerDimensions(dimensions);

      (async () => {
        imageDimensionsRef.current = await getImageDimensions(path);

        const paddingBasedOnAspectRatios = calculatePaddingBasedOnAspectRatios(
          imageDimensionsRef.current,
          dimensions,
        );

        setPadding(paddingBasedOnAspectRatios);
      })();
    }
  }, [path]);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;

      if (container && imageDimensionsRef.current) {
        const dimensions = {
          width: container.clientWidth,
          height: container.clientHeight,
        };

        setContainerDimensions(dimensions);

        const paddingBasedOnAspectRatios = calculatePaddingBasedOnAspectRatios(
          imageDimensionsRef.current,
          dimensions,
        );

        setPadding(paddingBasedOnAspectRatios);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-72 cursor-none rounded-md bg-neutral-100 shadow-md"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
    >
      <NewTag date={createdAt} />
      <NextImage
        src={'/images/' + path}
        priority={true}
        fill={true}
        sizes="500px"
        alt={`${title} selected image`}
        className="rounded-md object-contain"
      />
      <div
        hidden={!showMagnifier}
        style={{
          width: `${magnifierSize}px`,
          height: `${magnifierSize}px`,
          left: position.x - magnifierSize / 2,
          top: position.y - magnifierSize / 2,
          backgroundImage: `url('/images/${path}')`,
          backgroundSize: `${(containerDimensions.width - padding.x * 2) * zoom}px ${(containerDimensions.height - padding.y * 2) * zoom}px`,
          backgroundPositionX: `${-(position.x - padding.x) * zoom + magnifierSize / 2}px`,
          backgroundPositionY: `${-(position.y - padding.y) * zoom + magnifierSize / 2}px`,
        }}
        className="pointer-events-none absolute z-10 rounded-lg border border-white bg-neutral-100 bg-no-repeat"
      />
      <span className="absolute bottom-2 right-2 rounded-xl border border-green-200 bg-green-50 px-1.5 py-0.5 text-xl font-bold text-green-600 shadow-md">
        {formatMoney(price)}
      </span>
    </div>
  );
}
