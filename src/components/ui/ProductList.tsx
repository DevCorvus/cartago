import { ProductCardDto } from '@/shared/dtos/product.dto';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlinePhoto } from 'react-icons/hi2';

interface Props {
  products: ProductCardDto[];
}

export default function ProductList({ products }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, i) => (
        <Link
          href={'/items/abc'}
          key={i}
          className="flex flex-col rounded-md shadow-md bg-white"
        >
          <div className="relative h-40 w-full bg-neutral-100 rounded-md">
            {product.images.length != 0 ? (
              <Image
                src={'/uploads/' + product.images[0].path}
                alt={product.title}
                fill={true}
                className="rounded-md object-contain"
              />
            ) : (
              <span className="h-full flex flex-col justify-center items-center">
                <HiOutlinePhoto className="text-red-400 text-4xl" />
              </span>
            )}
          </div>
          <section className="p-4 relative flex flex-col gap-2">
            <header className="flex justify-between uppercase font-bold text-green-800 text-lg">
              <h1>{product.title}</h1>
              <p>$ {product.price}</p>
            </header>
            <p className="line-clamp-2 font-sans">{product.description}</p>
          </section>
        </Link>
      ))}
    </div>
  );
}
