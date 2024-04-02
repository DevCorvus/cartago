'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loading from './Loading';
import { ProductCardWithSalesDto } from '@/shared/dtos/product.dto';
import { HiOutlinePhoto, HiPencilSquare } from 'react-icons/hi2';
import Link from 'next/link';
import SearchInput from './SearchInput';
import { formatMoney } from '@/lib/dinero';

export default function ProductCardList() {
  const [products, setProducts] = useState<ProductCardWithSalesDto[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    ProductCardWithSalesDto[]
  >([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/seller/products');
      if (res.ok) {
        const data: ProductCardWithSalesDto[] = await res.json();
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
    <div className="flex w-full flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-green-800">Your products</h1>
      </header>
      <SearchInput term="products" handleSearch={searchProducts} />
      <ul className="flex flex-col gap-3">
        {selectedProducts.map((product) => (
          <li key={product.id}>
            <div className="flex rounded-md bg-white shadow-md">
              <Link
                href={`/items/${product.id}`}
                className="relative h-32 w-32 rounded-md bg-neutral-100"
              >
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
              </Link>
              <section className="relative flex flex-col gap-2 p-4">
                <header className="flex flex-wrap justify-between gap-2 text-sm font-bold uppercase text-green-800 md:text-lg">
                  <h2>{product.title}</h2>
                  <span>{formatMoney(product.price)}</span>
                </header>
                <p className="line-clamp-2 font-sans">{product.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    href={`/items/${product.id}/edit`}
                    className="btn-alternative flex items-center gap-1 px-1.5 py-1"
                  >
                    Edit <HiPencilSquare />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-400 transition hover:text-red-500 focus:text-red-500"
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
