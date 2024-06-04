import { formatMoney } from '@/lib/dinero';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import Image from 'next/image';
import Link from 'next/link';
import Rating from './Rating';
import { useMemo } from 'react';
import WishProductItem from './WishProductItem';
import AddCartItem from './AddCartItem';

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
    <div className="relative">
      <Link
        href={'/items/' + product.id}
        key={product.id}
        className="group relative flex flex-col rounded-lg border-b-2 border-neutral-100 bg-white shadow-md"
      >
        {isNew && (
          <span className="absolute -left-3 -top-3 z-10 rounded-md bg-cyan-600 p-1 text-xs font-semibold text-white shadow-md">
            New
          </span>
        )}
        <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-neutral-100 shadow-inner">
          <Image
            src={'/images/' + product.images[0].path}
            alt={product.title}
            fill={true}
            sizes="300px"
            className="object-cover transition duration-300 group-hover:scale-110"
          />
        </div>
        <section className="relative flex flex-1 flex-col gap-1 p-2">
          <header className="flex items-center justify-between gap-0.5 capitalize">
            <h2
              className="line-clamp-1 text-sm font-medium text-slate-700 md:text-base"
              title={product.title}
            >
              {product.title}
            </h2>
            <span className="rounded-xl bg-green-50 px-1 text-sm font-semibold text-green-600 shadow-sm md:text-base md:font-bold">
              {formatMoney(product.price)}
            </span>
          </header>
          <div className="flex items-center justify-between text-slate-500">
            <p className="text-xs sm:text-sm">
              <span className="font-medium">{product.sales}</span> sold
            </p>
            <div className="flex items-center gap-1 text-xs sm:text-base">
              <Rating score={product.rating.score} />
              <span className="text-xs">({product.rating.count})</span>
            </div>
          </div>
        </section>
      </Link>
      {!product.isOwner && (
        <div className="absolute bottom-16 left-1.5 z-10 flex items-center gap-1.5 text-slate-700 md:bottom-[4.6rem]">
          {product.stock > 0 && <AddCartItem productId={product.id} />}
          <WishProductItem productId={product.id} />
        </div>
      )}
    </div>
  );
}
