'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import {
  HiCalendarDays,
  HiOutlineCircleStack,
  HiShoppingCart,
} from 'react-icons/hi2';
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
import { formatTimeFromNow } from '@/lib/dayjs';

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
    <div className="mx-auto max-w-md space-y-12">
      <section className="space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="space-y-4">
          <div className="flex flex-col-reverse gap-6">
            <header className="flex w-full items-center justify-between">
              <h1 className="line-clamp-1 text-2xl font-semibold text-slate-700">
                {product.title}
              </h1>
              <span className="rounded-xl bg-green-50 px-2 py-1 text-xl font-bold text-green-600 shadow-sm">
                {formatMoney(product.price)}
              </span>
            </header>
            <div className="size-full relative flex flex-col gap-4">
              <ProductImageVisualizer
                path={selectedImage.path}
                title={product.title}
              />
              <div className="grid h-14 grid-cols-5 gap-1 sm:h-16 sm:gap-2">
                {product.images.map((image, i) => (
                  <button
                    key={i}
                    className={`size-full relative rounded-lg ${
                      selectedImage === image
                        ? 'border-2 border-cyan-500/50'
                        : 'shadow-md'
                    }`}
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
                      className={`object-cover ${selectedImage === image ? 'rounded-md' : 'rounded-lg'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full space-y-6">
            {product.description ? (
              <p className="hyphens-auto whitespace-pre-line break-words font-sans text-slate-600">
                {product.description}
              </p>
            ) : (
              <p className="italic text-slate-400">No description</p>
            )}
            <div className="flex w-full items-center justify-between text-slate-400">
              {noStock ? (
                <p className="rounded-md border border-red-600 bg-red-100 px-2 py-1 text-red-600">
                  Out of stock
                </p>
              ) : (
                <p className="flex items-center gap-1">
                  <HiOutlineCircleStack />
                  {product.stock} left in stock
                </p>
              )}
              <p className="flex items-center gap-1">
                <HiCalendarDays />
                Created {formatTimeFromNow(product.createdAt)}
              </p>
            </div>
            <ul className="flex w-full flex-wrap gap-1">
              {product.categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/items?categoryId=${category.id}`}
                    className="rounded-full bg-cyan-50 px-2 py-1 text-sm text-cyan-600 shadow-sm transition hover:text-cyan-500 hover:shadow-md focus:text-cyan-500 focus:shadow-md"
                  >
                    {capitalize(category.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex w-full items-center justify-center gap-3">
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
      </section>
      <ProductList products={relatedProducts} />
      <ProductReviewList productId={product.id} />
    </div>
  );
}
