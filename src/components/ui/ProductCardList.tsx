'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loading from './Loading';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import { HiOutlinePhoto, HiPencilSquare } from 'react-icons/hi2';
import Link from 'next/link';
import SearchInput from './SearchInput';
import Dinero from 'dinero.js';

export default function ProductCardList() {
  const [products, setProducts] = useState<ProductCardDto[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductCardDto[]>(
    [],
  );
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    setSelectedProducts(products);
  }, [products]);

  const searchProducts = (title: string) => {
    const input = title.trim().toLowerCase();
    setSelectedProducts(
      products.filter((product) => product.title.toLowerCase().includes(input)),
    );
  };

  const deleteProduct = async (productId: string) => {
    const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });

    if (res.ok) {
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-6">
      <header>
        <h1 className="text-green-800 font-bold text-2xl">Your products</h1>
      </header>
      <SearchInput term="products" handleSearch={searchProducts} />
      <ul className="flex flex-col gap-3">
        {selectedProducts.map((product) => (
          <li key={product.id}>
            <div className="flex rounded-md shadow-md bg-white">
              <Link
                href={`/items/${product.id}`}
                className="relative w-32 h-32 bg-neutral-100 rounded-md"
              >
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
              </Link>
              <section className="p-4 relative flex flex-col gap-2">
                <header className="flex flex-wrap justify-between uppercase font-bold text-green-800 text-sm md:text-lg gap-2">
                  <h2>{product.title}</h2>
                  <span>{Dinero({ amount: product.price }).toFormat()}</span>
                </header>
                <p className="line-clamp-2 font-sans">{product.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    href="/todo"
                    className="px-1.5 py-1 btn-alternative flex items-center gap-1"
                  >
                    Edit <HiPencilSquare />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-400 hover:text-red-500 focus:text-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </section>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
