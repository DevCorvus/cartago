'use client';
import Image from 'next/image';
import WishProduct from '@/components/ui/WishProduct';

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
  return PRODUCTS.map((product, i) => (
    <div key={i} className="flex">
      <div className="relative h-20 w-24">
        <Image
          src={product.url}
          alt={product.name}
          objectFit="contain"
          fill={true}
        />
      </div>
      <section>
        <h1>{product.name}</h1>
        <p>{product.price}</p>
        <p>{product.description}</p>
        <WishProduct />
      </section>
    </div>
  ));
}
