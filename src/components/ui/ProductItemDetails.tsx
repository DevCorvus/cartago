'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { HiShoppingCart } from 'react-icons/hi2';
import WishProduct from './WishProduct';
import { ProductDto } from '@/shared/dtos/product.dto';
import Link from 'next/link';
import { capitalize } from '@/utils/capitalize';
import { useCartStore } from '@/stores/useCartStore';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { localStorageCart } from '@/utils/localStorageCart';
import { formatMoney } from '@/lib/dinero';
import ProductReviewList from './ProductReviewList';

interface Props {
  product: ProductDto;
}

export default function ProductItemDetails({ product }: Props) {
  const isAuthenticated = useIsAuthenticated();
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const { productIds, addProductId } = useCartStore(
    ({ productIds, addProductId }) => ({ productIds, addProductId }),
  );

  const noStock = product.stock === 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let success = false;

    if (isAuthenticated) {
      const res = await fetch(`/api/cart/${product.id}`, { method: 'POST' });
      success = res.ok;
    } else {
      localStorageCart.addItem({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        amount: 1,
        images: [product.images[0]],
      });
    }

    if (!isAuthenticated || success) {
      addProductId(product.id);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6">
      <div className="relative flex h-96 w-full flex-col gap-2">
        <div className="relative h-4/5 rounded-md bg-neutral-100 shadow-md">
          {selectedImage ? (
            <Image
              src={'/uploads/' + selectedImage.path}
              fill={true}
              alt={`${product.title} selected image`}
              className="rounded-md object-contain p-1"
            />
          ) : (
            <span className="flex h-full items-center justify-center bg-neutral-200">
              Image not found
            </span>
          )}
        </div>
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
                src={'/uploads/' + image.path}
                alt={`${product.title} image #${i + 1}`}
                fill={true}
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
      <div className="flex w-full flex-row-reverse items-center justify-center gap-3">
        <div className=" text-4xl">
          <WishProduct product={product} />
        </div>
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
      </div>
      <ProductReviewList productId={product.id} />
    </div>
  );
}
