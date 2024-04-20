import { formatMoney } from '@/lib/dinero';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlinePhoto, HiStar } from 'react-icons/hi2';

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
            src={'/images/' + product.images[0].path}
            alt={product.title}
            fill={true}
            sizes="200px"
            className="rounded-md object-contain"
          />
        ) : (
          <span className="flex h-full flex-col items-center justify-center">
            <HiOutlinePhoto className="text-4xl text-red-400" />
          </span>
        )}
      </div>
      <section className="relative flex flex-col gap-2 p-4 font-sans">
        <header className="flex flex-wrap justify-between gap-2 text-base font-bold capitalize text-green-800 md:text-lg">
          <h2>{product.title}</h2>
        </header>
        <p className="flex justify-between pb-4">
          <span>{formatMoney(product.price)}</span>
          {product.sales > 0 && <span>{product.sales} sold</span>}
        </p>
        <div className="absolute bottom-1 right-2 flex gap-1 py-2 text-base text-yellow-300">
          <HiStar />
          <HiStar />
          <HiStar />
          <HiStar />
          <HiStar />
        </div>
      </section>
    </Link>
  );
}
