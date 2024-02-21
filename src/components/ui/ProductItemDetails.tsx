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
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      <div className="w-full h-96 relative flex flex-col gap-2">
        <div className="relative h-4/5 bg-neutral-100 shadow-md rounded-md">
          {selectedImage ? (
            <Image
              src={'/uploads/' + selectedImage.path}
              fill={true}
              alt={`${product.title} selected image`}
              className="rounded-md p-1 object-contain"
            />
          ) : (
            <span className="h-full flex justify-center items-center bg-neutral-200">
              Image not found
            </span>
          )}
        </div>
        <div className="flex-1 grid grid-cols-5 gap-1">
          {product.images.map((image, i) => (
            <button
              className={`relative w-20 h-full rounded bg-neutral-100 ${
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
      <header className="text-green-800 text-2xl w-full flex justify-between font-bold">
        <h1 className="uppercase">{product.title}</h1>
        <p className="justify-start align-top">{formatMoney(product.price)}</p>
      </header>
      <section className="w-full flex flex-col justify-between gap-6">
        {product.description ? (
          <p className="font-sans text-md opacity-75 whitespace-pre-line">
            {product.description}
          </p>
        ) : (
          <p className="italic text-amber-800 opacity-50">No description</p>
        )}
        <div className="w-full flex justify-between items-center text-green-950 opacity-60">
          {noStock ? (
            <p className="text-red-600 bg-red-100 border border-red-600 rounded-md px-2 py-1">
              Out of stock
            </p>
          ) : (
            <p>{product.stock} in stock</p>
          )}
          <p>Created at {product.createdAt.toDateString()}</p>
        </div>
        <ul className="w-full flex flex-wrap gap-2">
          {product.categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/items?categoryId=${category.id}`}
                className="bg-green-100 text-green-700 rounded-full text-xs px-2 py-1"
              >
                {capitalize(category.title)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <div className="w-full flex gap-3 justify-center items-center flex-row-reverse">
        <div className=" text-4xl">
          <WishProduct product={product} />
        </div>
        {productIds.includes(product.id) ? (
          <Link
            href="/cart"
            className="w-full p-4 flex items-center justify-center gap-2 btn flex-1"
          >
            <HiShoppingCart />
            View in shopping cart
          </Link>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex-1">
            <button
              type="submit"
              disabled={noStock}
              className={`w-full p-4 flex items-center justify-center gap-2 ${
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
