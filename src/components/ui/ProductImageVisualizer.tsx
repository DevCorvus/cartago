'use client';

import { useCursorPosition } from '@/hooks/useCursorPosition';
import { formatMoney } from '@/lib/dinero';
import {
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

  const ref = useRef<HTMLDivElement>(null);
  const position = useCursorPosition(ref);

  const [container, setContainer] = useState({ width: 0, height: 0 });
  const [padding, setPadding] = useState({ x: 0, y: 0 });

  const magnifierSize = 100;

  useEffect(() => {
    const container = ref.current;

    if (container) {
      const containerDimensions = {
        width: container.clientWidth,
        height: container.clientHeight,
      };

      setContainer(containerDimensions);

      (async () => {
        const imageDimensions = await getImageDimensions(path);
        const paddingBasedOnAspectRatios = calculatePaddingBasedOnAspectRatios(
          imageDimensions,
          containerDimensions,
        );
        setPadding(paddingBasedOnAspectRatios);
      })();
    }
  }, [path]);

  return (
    <div
      ref={ref}
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
          backgroundSize: `${(container.width - padding.x * 2) * zoom}px ${(container.height - padding.y * 2) * zoom}px`,
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
