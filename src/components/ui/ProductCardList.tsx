'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loading from './Loading';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import { HiOutlinePhoto, HiPencilSquare } from 'react-icons/hi2';
import Link from 'next/link';
import SearchInput from './SearchInput';
import { formatMoney } from '@/lib/dinero';
import { useDeleteProduct, useProductCards } from '@/data/product';
import SomethingWentWrong from './SomethingWentWrong';
import { toastError } from '@/lib/toast';

export default function ProductCardList() {
  const [products, setProducts] = useState<ProductCardDto[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductCardDto[]>(
    [],
  );

  const { isLoading, isError, data } = useProductCards();

  useEffect(() => {
    if (data) {
      setProducts(data);
      setSelectedProducts(data);
    }
  }, [data]);

  const searchProducts = (title: string) => {
    const input = title.trim().toLowerCase();
    setSelectedProducts(
      products.filter((product) => product.title.toLowerCase().includes(input)),
    );
  };

  const removeProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const deleteProductMutation = useDeleteProduct();

  const deleteProduct = async (productId: string) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      removeProduct(productId);
    } catch (err) {
      toastError(err);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <SomethingWentWrong />;

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
                    src={'/images/' + product.images[0].path}
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
