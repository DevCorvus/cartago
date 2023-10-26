'use client';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import ProductCartItem from '@/components/ui/ProductCartItem';
import { CartProduct } from '@/components/types';
import { useState } from 'react';

const productMock: CartProduct = {
  id: '',
  image:
    'https://images.pexels.com/photos/6621857/pexels-photo-6621857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  title: 'clock',
  price: 23.1,
  description:
    'A car is a vehicle that has wheels, carries a small number of passengers, and is moved by an engine or a motor',
  stock: 8,
};

const productsMock: CartProduct[] = new Array(8)
  .fill(productMock)
  .map((product: CartProduct, i) => {
    return { ...product, id: String(i + 1) };
  });

export default function Cart() {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>(productsMock);

  const handleCartProductDelete = (id: string) => {
    setCartProducts((prev) => {
      return prev.filter((product) => product.id !== id);
    });
  };
  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <h1>Shopping cart ({cartProducts.length})</h1>
        <p>Total: $ 34</p>
      </div>
      <div className="w-full flex flex-col gap-4">
        {cartProducts.map((product, i) => (
          <ProductCartItem
            key={i}
            i={i}
            product={product}
            handleDelete={handleCartProductDelete}
          />
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
