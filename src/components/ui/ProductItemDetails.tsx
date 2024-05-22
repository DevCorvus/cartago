'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import {
  HiCalendarDays,
  HiOutlineCircleStack,
  HiOutlinePresentationChartLine,
  HiOutlineShoppingBag,
  HiShoppingCart,
} from 'react-icons/hi2';
import WishProduct from './WishProduct';
import { ProductDetailsDto } from '@/shared/dtos/product.dto';
import Link from 'next/link';
import { capitalize } from '@/utils/capitalize';
import { formatMoney } from '@/lib/dinero';
import ProductReviewList from './ProductReviewList';
import { ProductImageVisualizer } from './ProductImageVisualizer';
import { formatTimeFromNow } from '@/lib/dayjs';
import Rating from './Rating';
import ProductRelatedList from './ProductRelatedList';
import { useCartItem } from '@/hooks/useCartItem';

export default function ProductItemDetails({
  isOwner,
  product,
  relatedProducts,
}: ProductDetailsDto) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const { addCartItem, inCart } = useCartItem(product.id);

  const noStock = product.stock === 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addCartItem();
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
            <div className="grid grid-cols-2 gap-3 text-slate-400">
              <p className="flex items-center gap-1">
                <HiOutlineShoppingBag />
                <span className="font-medium">{product.sales}</span> sold
              </p>
              <p className="flex items-center gap-1">
                <HiCalendarDays />
                Created {formatTimeFromNow(product.createdAt)}
              </p>
              <p className="flex items-center gap-1">
                <HiOutlineCircleStack />
                {noStock ? (
                  <span className="font-medium">Out of stock</span>
                ) : (
                  <>
                    <span className="font-semibold">{product.stock}</span> left
                    in stock
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <HiOutlinePresentationChartLine />
                  Rating
                </div>
                <Rating score={product.rating.score} />
              </div>
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
              {inCart ? (
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
          {!isOwner && <WishProduct productId={product.id} />}
        </div>
      </section>
      <ProductRelatedList products={relatedProducts} />
      <ProductReviewList productId={product.id} />
    </div>
  );
}
