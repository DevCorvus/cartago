'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { HiShoppingCart } from 'react-icons/hi2';
import WishProduct from './WishProduct';
import { ProductDetailsDto } from '@/shared/dtos/product.dto';
import Link from 'next/link';
import { capitalize } from '@/utils/capitalize';
import { useCartStore } from '@/stores/useCartStore';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { localStorageCart } from '@/utils/localStorageCart';
import { formatMoney } from '@/lib/dinero';
import ProductReviewList from './ProductReviewList';
import ProductList from './ProductList';
import { useAddCartItem } from '@/data/cart';
import { toastError } from '@/lib/toast';
import { ProductImageVisualizer } from './ProductImageVisualizer';

export default function ProductItemDetails({
  isOwner,
  product,
  relatedProducts,
}: ProductDetailsDto) {
  const isAuthenticated = useIsAuthenticated();
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const { productIds, addProductId, removeProductId } = useCartStore(
    ({ productIds, addProductId, removeProductId }) => ({
      productIds,
      addProductId,
      removeProductId,
    }),
  );

  const noStock = product.stock === 0;

  const addCartItemMutation = useAddCartItem();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isAuthenticated) {
      try {
        addProductId(product.id);
        await addCartItemMutation.mutateAsync(product.id);
      } catch (err) {
        toastError(err);
        removeProductId(product.id);
      }
    } else {
      localStorageCart.addItem({ id: product.id, amount: 1 });
      addProductId(product.id);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6">
      <div className="relative flex h-96 w-full flex-col gap-2">
        {selectedImage ? (
          <ProductImageVisualizer
            path={selectedImage.path}
            title={product.title}
          />
        ) : (
          <div className="h-4/5 rounded-md bg-neutral-100 shadow-md">
            <span className="flex h-full items-center justify-center bg-neutral-200">
              Image not found
            </span>
          </div>
        )}
        <div className="grid flex-1 grid-cols-5 gap-1">
          {product.images.map((image, i) => (
            <button
              className={`relative h-full w-20 rounded bg-neutral-100 ${
                selectedImage === image ? 'border-2 border-neutral-300' : ''
              }`}
              key={i}
              onClick={() => {
                setSelectedImage(image);
              }}
            >
              <Image
                src={'/images/' + image.path}
                alt={`${product.title} image #${i + 1}`}
                priority={true}
                fill={true}
                sizes="100px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      </div>
      <header className="flex w-full justify-between text-2xl font-bold text-green-800">
        <h1 className="uppercase">{product.title}</h1>
        <p className="justify-start align-top">{formatMoney(product.price)}</p>
      </header>
      <section className="flex w-full flex-col justify-between gap-6">
        {product.description ? (
          <p className="text-md whitespace-pre-line font-sans opacity-75">
            {product.description}
          </p>
        ) : (
          <p className="italic text-amber-800 opacity-50">No description</p>
        )}
        <div className="flex w-full items-center justify-between text-green-950 opacity-60">
          {noStock ? (
            <p className="rounded-md border border-red-600 bg-red-100 px-2 py-1 text-red-600">
              Out of stock
            </p>
          ) : (
            <p>{product.stock} in stock</p>
          )}
          <p>Created at {product.createdAt.toDateString()}</p>
        </div>
        <ul className="flex w-full flex-wrap gap-2">
          {product.categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/items?categoryId=${category.id}`}
                className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
              >
                {capitalize(category.title)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <div className="flex w-full items-center justify-center gap-3">
        {isOwner ? (
          <Link
            href={`/items/${product.id}/edit`}
            className="btn flex w-full flex-1 items-center justify-center gap-2 p-4"
          >
            Edit
          </Link>
        ) : (
          <>
            {productIds.includes(product.id) ? (
              <Link
                href="/cart"
                className="btn flex w-full flex-1 items-center justify-center gap-2 p-4"
              >
                <HiShoppingCart />
                View in shopping cart
              </Link>
            ) : (
              <form onSubmit={handleSubmit} className="w-full flex-1">
                <button
                  type="submit"
                  disabled={noStock}
                  className={`flex w-full items-center justify-center gap-2 p-4 ${
                    noStock ? 'btn-disabled' : 'btn'
                  }`}
                >
                  <HiShoppingCart />
                  Add to shopping cart
                </button>
              </form>
            )}
          </>
        )}
        {!isOwner && <WishProduct product={product} />}
      </div>
      <ProductList products={relatedProducts} />
      <ProductReviewList productId={product.id} />
    </div>
  );
}
