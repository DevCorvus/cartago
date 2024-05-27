'use client';

import { useEffect, useState } from 'react';
import Loading from './Loading';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import SearchInput from './SearchInput';
import { useDeleteProduct, useProductCards } from '@/data/product';
import SomethingWentWrong from './SomethingWentWrong';
import { toastError } from '@/lib/toast';
import SellerProductItem from './SellerProductItem';
import Link from 'next/link';
import { HiMiniPlus } from 'react-icons/hi2';

export default function SellerProductList() {
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
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold text-cyan-700">Your products</h1>
        <Link
          href="/items/new"
          className="btn inline-flex items-center gap-1 px-3 py-2"
        >
          <HiMiniPlus className="text-2xl" />
          New
        </Link>
      </header>
      <SearchInput term="products" handleSearch={searchProducts} alternative />
      {products.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {selectedProducts.map((product) => (
            <li key={product.id}>
              <SellerProductItem
                product={product}
                deleteProduct={() => deleteProduct(product.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500">You do not have any products yet.</p>
      )}
    </div>
  );
}
