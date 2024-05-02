import { formatMoney } from '@/lib/dinero';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import Image from 'next/image';
import Link from 'next/link';
import Rating from './Rating';

interface Props {
  product: ProductCardDto;
}

export default function ProductItem({ product }: Props) {
  return (
    <Link
      href={'/items/' + product.id}
      key={product.id}
      className="flex flex-col rounded-lg bg-white shadow-md"
    >
      <div className="relative h-40 w-full rounded-t-lg bg-neutral-100">
        <Image
          src={'/images/' + product.images[0].path}
          alt={product.title}
          fill={true}
          sizes="200px"
          className="object-contain"
        />
      </div>
      <section className="relative flex flex-1 flex-col gap-1 p-2">
        <header className="flex items-center justify-between gap-0.5 capitalize">
          <h2 className="line-clamp-1 font-medium" title={product.title}>
            {product.title}
          </h2>
          <span className="rounded-xl bg-lime-50 px-1 text-lg font-semibold text-lime-600 shadow-sm">
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
