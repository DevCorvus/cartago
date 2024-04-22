'use client';

import { useCursorPosition } from '@/hooks/useCursorPosition';
import {
  calculatePaddingBasedOnAspectRatios,
  getImageDimensions,
} from '@/utils/dimensions';
import NextImage from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Props {
  path: string;
  title: string;
  zoom?: number;
}

// This implementation is a little bit complex because it has to keep the aspect ratio when magnifying the image
// I don't feel like this abstraction is any good either but it works
export function ProductImageVisualizer({ path, title, zoom = 2 }: Props) {
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
      className="relative h-4/5 cursor-none rounded-md bg-neutral-100 shadow-md"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
    >
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
        className="pointer-events-none absolute border border-white bg-white bg-no-repeat"
      />
    </div>
  );
}
