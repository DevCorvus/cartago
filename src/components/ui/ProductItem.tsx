import { formatMoney } from '@/lib/dinero';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlinePhoto } from 'react-icons/hi2';

interface Props {
  product: ProductCardDto;
}

export default function ProductItem({ product }: Props) {
  return (
    <Link
      href={'/items/' + product.id}
      key={product.id}
      className="flex flex-col rounded-md bg-white shadow-md"
    >
      <div className="relative h-40 w-full rounded-md bg-neutral-100">
        {product.images.length != 0 ? (
          <Image
            src={'/uploads/' + product.images[0].path}
            alt={product.title}
            fill={true}
            className="rounded-md object-contain"
          />
        ) : (
          <span className="flex h-full flex-col items-center justify-center">
            <HiOutlinePhoto className="text-4xl text-red-400" />
          </span>
        )}
      </div>
      <section className="relative flex flex-col gap-2 p-4">
        <header className="flex flex-wrap justify-between gap-2 text-sm font-bold uppercase text-green-800 md:text-lg">
          <h2>{product.title}</h2>
          <span>{formatMoney(product.price)}</span>
        </header>
        <p className="line-clamp-2 font-sans text-sm opacity-75">
          {product.description}
        </p>
      </section>
    </Link>
  );
}
