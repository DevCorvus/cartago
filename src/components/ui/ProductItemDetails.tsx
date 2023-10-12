'use client';
import Image from 'next/image';
import { useState } from 'react';
import { HiStar } from 'react-icons/hi2';

interface Props {
  id: string;
  images: string[];
  name: string;
  price: string;
  description: string;
  stock: number;
  createdAt: string;
  tags: string[];
}

export default function ProductItemDetails({
  id,
  images,
  name,
  price,
  description,
  stock,
  createdAt,
  tags,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  return (
    <div>
      <div className="w-full h-96 relative flex flex-col border border-red-600">
        <div className="relative h-4/5">
          <Image
            src={selectedImage}
            fill={true}
            objectFit="contain"
            alt={`${name} selected image`}
          />
        </div>
        <div className="flex-1 flex border border-green-600 relative">
          {images.map((url, i) => (
            <div className="relative w-20 h-full" key={i}>
              <Image
                src={url}
                alt={`${name} image #${i + 1}`}
                fill={true}
                objectFit="contain"
                onClick={() => {
                  setSelectedImage(url);
                }}
              />
            </div>
          ))}
        </div>
        <button className="absolute top-2 right-2 z-10 text-base">
          <HiStar />
        </button>
      </div>
      <div className="text-lg flex justify-between font-bold">
        <header>
          <h1 className="">{name}</h1>
        </header>
        <p>$ {price}</p>
      </div>
      <section className="text-sm flex flex-col p-2 h-32 justify-between">
        <p className="py-1">{description}</p>
        <div className="flex justify-between">
          <p>{stock} in stock</p>
          <p>Created at {createdAt}</p>
        </div>
      </section>
      <div>
        {tags.map((tag, i) => (
          <span key={i} className="border border-red-600 w-9 h-6 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <button>Add to shopping cart</button>
    </div>
  );
}
