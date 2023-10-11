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
      <div className="w-full h-96 relative">
        <Image
          src={selectedImage}
          alt={`${name} selected image`}
          className="w-full h-full border border-red-600"
        />
        <div className="">
          {images.map((url, i) => (
            <Image
              src={url}
              alt={`${name} image #${i + 1}`}
              onClick={() => {
                setSelectedImage(url);
              }}
            />
          ))}
        </div>
        <button className="absolute top-2 right-2 z-10">
          <HiStar />
        </button>
      </div>
      <div className="text-lg flex justify-between font-bold">
        <header>
          <h1 className="">{name}</h1>
        </header>
        <p>$ {price}</p>
      </div>
      <section className="text-sm flex flex-col p-2">
        <p className="py-1">{description}</p>
        <div className="flex justify-between">
          <p>{stock} in stock</p>
          <p>Created at {createdAt}</p>
        </div>
      </section>
      <div>
        {tags.map((tag) => (
          <span className="border border-red-600 w-9 h-6 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <button>Add to shopping cart</button>
    </div>
  );
}
