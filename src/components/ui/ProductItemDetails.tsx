'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { HiShoppingCart } from 'react-icons/hi2';
import WishProduct from './WishProduct';
import { ProductDto } from '@/shared/dtos/product.dto';
import Link from 'next/link';
import { capitalize } from '@/utils/capitalize';

interface Props {
  product: ProductDto;
}

export default function ProductItemDetails({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(`/api/cart/${product.id}`, { method: 'POST' });
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
        <div className="absolute top-2 right-2 z-10 text-3xl">
          <WishProduct />
        </div>
      </div>
      <header className="text-green-800 text-2xl w-full flex justify-between font-bold">
        <h1 className="uppercase">{product.title}</h1>
        <p className="justify-start align-top">$ {product.price}</p>
      </header>
      <section className="w-full flex flex-col justify-between gap-6">
        {product.description ? (
          <p>{product.description}</p>
        ) : (
          <p className="italic text-amber-800 opacity-50">No description</p>
        )}
        <div className="w-full flex justify-between text-green-950 opacity-60">
          <p>{product.stock} in stock</p>
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
      <form onSubmit={handleSubmit} className="w-full">
        <button
          type="submit"
          className="w-full bg-green-800 text-lime-50 px-4 py-4 rounded-full flex gap-2 items-center justify-center"
        >
          <HiShoppingCart />
          Add to shopping cart
        </button>
      </form>
    </div>
  );
}
