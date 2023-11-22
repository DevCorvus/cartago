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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {PRODUCTS.map((product, i) => (
        <Link
          href={'/items/abc'}
          key={i}
          className="flex flex-col rounded-md shadow-md bg-white"
        >
          <div className="relative h-40 w-full bg-neutral-100 rounded-md ">
            <Image
              src={product.url}
              alt={product.name}
              fill
              className="rounded-md object-contain"
            />
          </div>
          <section className="p-4 relative flex flex-col gap-2">
            <header className="flex justify-between uppercase font-bold text-green-800 text-lg">
              <h1>{product.name}</h1>
              <p>$ {product.price}</p>
            </header>
            <p className="line-clamp-2 font-sans">{product.description}</p>
          </section>
        </Link>
      ))}
    </div>
  );
}
