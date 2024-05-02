import { formatMoney } from '@/lib/dinero';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import Image from 'next/image';
import Link from 'next/link';
import Rating from './Rating';
import { useMemo } from 'react';

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

interface Props {
  product: ProductCardDto;
}

export default function ProductItem({ product }: Props) {
  const isNew = useMemo(() => {
    const createdAt = new Date(product.createdAt);
    const createdAtInMs = createdAt.getTime();
    return Date.now() < createdAtInMs + ONE_WEEK;
  }, [product.createdAt]);

  return (
    <Link
      href={'/items/' + product.id}
      key={product.id}
      className="group relative flex flex-col rounded-lg border-b-2 border-r-2 border-gray-100 bg-white shadow-md"
    >
      {isNew && (
        <span className="absolute -left-3 -top-3 z-10 rounded-md bg-lime-100 px-2 py-1 text-xs text-lime-600 shadow-md">
          New
        </span>
      )}
      <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-neutral-100">
        <Image
          src={'/images/' + product.images[0].path}
          alt={product.title}
          fill={true}
          sizes="200px"
          className="object-contain transition duration-300 group-hover:scale-110"
        />
      </div>
      <section className="relative flex flex-1 flex-col gap-1 p-2">
        <header className="flex items-center justify-between gap-0.5 capitalize">
          <h2 className="line-clamp-1 font-medium" title={product.title}>
            {product.title}
          </h2>
          <span className="rounded-xl bg-lime-100 px-1 text-lg font-semibold text-lime-600 shadow-sm">
            {formatMoney(product.price)}
          </span>
        </header>
        <div className="flex items-center justify-between text-neutral-500">
          <p className="text-sm">
            <span className="font-medium">{product.sales}</span> sold
          </p>
          <div className="flex items-center gap-1">
            <Rating score={product.rating.score} />
            <span className="text-xs">({product.rating.count})</span>
          </div>
        </div>
      </section>
    </Link>
  );
}
