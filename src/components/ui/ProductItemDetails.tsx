'use client';

import Image from 'next/image';
import { useState } from 'react';
import { HiShoppingCart } from 'react-icons/hi2';
import WishProduct from './WishProduct';
import { ProductDto } from '@/shared/dtos/product.dto';

interface Props {
  product: ProductDto;
}

export default function ProductItemDetails({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full h-96 relative flex flex-col gap-2">
        <div className="relative h-4/5 bg-neutral-100 shadow-md rounded-md">
          {selectedImage ? (
            <Image
              src={selectedImage.path}
              fill={true}
              object-fit="contain"
              alt={`${product.title} selected image`}
              className="rounded-md p-1"
            />
          ) : (
            <span className="h-full flex justify-center items-center bg-neutral-200">
              Image not found
            </span>
          )}
        </div>
        <div className="flex-1 flex gap-1">
          {product.images.map((image, i) => (
            <button
              className={`relative w-20 h-full border rounded bg-neutral-100 ${
                selectedImage === image
                  ? 'border-green-500'
                  : 'border-neutral-300'
              }`}
              key={i}
              onClick={() => {
                setSelectedImage(image);
              }}
            >
              <Image
                src={image.path}
                alt={`${product.title} image #${i + 1}`}
                fill={true}
                object-fit="contain"
              />
            </button>
          ))}
        </div>
        <div className="absolute top-2 right-2 z-10 text-3xl">
          <WishProduct />
        </div>
      </div>
      <div className="text-2xl w-full flex justify-between font-bold">
        <header>
          <h1 className="uppercase">{product.title}</h1>
        </header>
        <p className="justify-start align-top">$ {product.price}</p>
      </div>
      <section className="w-full flex flex-col justify-between gap-6">
        <p>{product.description}</p>
        <div className="w-full flex justify-between text-green-950 opacity-60">
          <p>{product.stock} in stock</p>
          <p>Created at {product.createdAt.toDateString()}</p>
        </div>
        <div className="w-full flex flex-wrap gap-2">
          {product.categories.map((category, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-600 rounded-full text-xs px-2 py-1  "
            >
              {category.title}
            </span>
          ))}
        </div>
      </section>
      <button className="w-full bg-green-800 text-lime-50 px-4 py-4 rounded-full flex gap-2 items-center justify-center">
        <HiShoppingCart />
        Add to shopping cart
      </button>
    </div>
  );
}
