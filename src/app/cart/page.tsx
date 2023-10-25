'use client';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from '@/components/ui/ProductCartItem';
import { CartProduct } from '@/components/types';

const productMock: CartProduct = {
  id: '',
  image:
    'https://images.pexels.com/photos/6621857/pexels-photo-6621857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  title: 'clock',
  price: 23.1,
  description:
    'A car is a vehicle that has wheels, carries a small number of passengers, and is moved by an engine or a motor',
  stock: 12,
};

const productsMock: CartProduct[] = new Array(10)
  .fill(productMock)
  .map((product: CartProduct, i) => {
    return { ...product, id: String(i + 1) };
  });

export default function Cart() {
  const number = 3;

  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <h1>Shopping cart ({number})</h1>
        <p>Total: $ {number}</p>
      </div>
      <div className="w-full flex flex-col gap-4">
        {productsMock.map((product, i) => (
          <ProductCartItem key={i} i={i} product={product} />
        ))}
      </div>
      <button
        type="submit"
        className="bg-green-800 p-3 w-full rounded-3xl text-slate-50 shadow-lg flex items-center justify-center gap-2"
      >
        <HiOutlineShoppingCart />
        Checkout
      </button>
    </div>
  );
}
