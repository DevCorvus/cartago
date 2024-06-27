import { formatMoney } from '@/lib/dinero';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import Image from 'next/image';
import Link from 'next/link';
import Rating from './Rating';
import NewTag from './NewTag';

interface Props {
  product: ProductCardDto;
}

export default function ProductRelatedItem({ product }: Props) {
  return (
    <Link
      href={'/items/' + product.id}
      key={product.id}
      className="group relative flex flex-col rounded-lg border-b-2 border-neutral-100 bg-white shadow-md"
    >
      <NewTag date={product.createdAt} />
      <div className="relative h-28 w-full overflow-hidden rounded-t-lg bg-neutral-100 shadow-inner">
        <Image
          src={'/images/' + product.images[0].path}
          alt={product.title}
          fill={true}
          sizes="200px"
          className="object-cover transition duration-300 group-hover:scale-110 group-focus:scale-110"
        />
        <span className="absolute bottom-1 right-1 rounded-xl border border-green-200 bg-green-50 px-1 font-bold text-green-600 shadow-md">
          {formatMoney(product.price)}
        </span>
      </div>
      <section className="relative flex flex-1 flex-col gap-1 p-2">
        <header>
          <h2
            className="line-clamp-1 text-sm font-medium capitalize text-slate-700"
            title={product.title}
          >
            {product.title}
          </h2>
        </header>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <p>
            <span className="font-medium">{product.sales}</span> sold
          </p>
          <div className="text-xs">
            <Rating score={product.rating.score} />
          </div>
        </div>
      </section>
    </Link>
  );
}
