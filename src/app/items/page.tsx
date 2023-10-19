'use client';
import Image from 'next/image';
import WishProduct from '@/components/ui/WishProduct';
import Link from 'next/link';

interface Props {
  url: string;
  name: string;
  price: string;
  description: string;
}
const PRODUCTS = [
  {
    url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'car',
    price: '23.10',
    description:
      'A car is a vehicle that has wheels, carries a small number of passengers, and is moved by an engine or a motor',
  },
  {
    url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'car',
    price: '23.10',
    description:
      'A car is a vehicle that has wheels, carries a small number of passengers, and is moved by an engine or a motor',
  },
  {
    url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'car',
    price: '23.10',
    description:
      'A car is a vehicle that has wheels, carries a small number of passengers, and is moved by an engine or a motor',
  },
];
export default function ProductList() {
  return (
    <div className="flex flex-col gap-6">
      {PRODUCTS.map((product, i) => (
        <Link
          href={'/items/abc'}
          key={i}
          className="flex rounded-md shadow-md max-h-32"
        >
          <div className="relative h-auto w-32 bg-neutral-100 rounded-md">
            <Image
              src={product.url}
              alt={product.name}
              object-fit="contain"
              fill={true}
              className="rounded-md"
            />
          </div>
          <section className="flex-1 p-4 relative flex flex-col gap-2">
            <header className="flex justify-between uppercase font-bold">
              <h1>{product.name}</h1>
              <p>$ {product.price}</p>
            </header>
            <p className="opacity-60 line-clamp-2">{product.description}</p>
            <div className="absolute bottom-2 right-2 flex text-xl">
              <WishProduct />
            </div>
          </section>
        </Link>
      ))}
    </div>
  );
}
