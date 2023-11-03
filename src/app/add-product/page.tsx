'use client';

import { ProductDto } from '@/shared/dtos/product.dto';
import { FormEvent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ui/ImageUploader';

export default function AddProduct() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<number[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target);

      images.forEach((image) => formData.append('images', image));
      formData.append('categories', JSON.stringify(categories));

      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const { data }: { data: ProductDto } = await res.json();
          return router.push(`/items/${data.id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="p-5 bg-lime-50 w-full h-full flex flex-col gap-5 items-center justify-center text-green-800">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center flex-col gap-6"
      >
        <header className="w-full ">
          <h1 className=" text-2xl font-bold">Add Product</h1>
        </header>
        <div className="flex flex-col gap-4 w-auto">
          <ImageUploader setImages={setImages} />
          <div className="flex flex-col gap-3">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="write product title"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              cols={30}
              rows={5}
              placeholder="write description"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            ></textarea>
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="write price product"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              placeholder="write stock of product"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="">Categories</label>
            <input
              type="text"
              placeholder="write categories product"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
          </div>
        </div>
        <div className="w-full">
          <button
            type="submit"
            className="bg-green-800 p-3 w-full rounded-3xl text-slate-50 shadow-lg"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
