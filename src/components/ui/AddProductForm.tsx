'use client';

import { CreatePartialProductDto, ProductDto } from '@/shared/dtos/product.dto';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ui/ImageUploader';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPartialProductSchema } from '@/shared/schemas/product.schema';
import CategoryTagsInput from '@/components/ui/CategoryTagsInput';
import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { useCategoryFormStore } from '@/stores/useCategoryFormStore';

interface Props {
  defaultCategoryTags: CategoryTagDto[];
}

export default function AddProductForm({ defaultCategoryTags }: Props) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [imageUploadError, setImageUploadError] = useState<boolean>(false);

  const creatingCategory = useCategoryFormStore(
    (state) => state.creatingCategory,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePartialProductDto>({
    resolver: zodResolver(createPartialProductSchema),
  });

  const onSubmit: SubmitHandler<CreatePartialProductDto> = async (data) => {
    if (imageUploadError) return;

    const formData = new FormData();

    formData.set('title', data.title);
    formData.set('description', data.description);
    formData.set('price', String(data.price));
    formData.set('stock', String(data.stock));

    images.forEach((image) => formData.append('images', image));
    formData.append('categories', JSON.stringify(categoryIds));

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
  };

  return (
    <div className="p-5 bg-lime-50 w-full h-full flex flex-col gap-5 items-center justify-center text-green-800">
      <form
        onSubmit={() => !creatingCategory && handleSubmit(onSubmit)}
        className="flex items-center justify-center flex-col gap-6"
      >
        <header className="w-full ">
          <h1 className=" text-2xl font-bold">Add Product</h1>
        </header>
        <div className="flex flex-col gap-4 w-auto">
          <ImageUploader
            setImages={setImages}
            setImageUploadError={setImageUploadError}
          />

          <div className="flex flex-col gap-3">
            <label htmlFor="title">Title</label>
            <input
              {...register('title')}
              id="title"
              type="text"
              placeholder="Enter product title"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
            {errors.title && (
              <p className="text-red-400">{errors.title.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="description">Description</label>
            <textarea
              {...register('description')}
              id="description"
              cols={30}
              rows={5}
              placeholder="Enter product description"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
            {errors.description && (
              <p className="text-red-400">{errors.description.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="price">Price</label>
            <input
              {...register('price', { valueAsNumber: true })}
              id="price"
              defaultValue={0}
              min={0}
              type="number"
              placeholder="Enter product price"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
            {errors.price && (
              <p className="text-red-400">{errors.price.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="stock">Stock</label>
            <input
              {...register('stock', { valueAsNumber: true })}
              id="stock"
              defaultValue={0}
              min={0}
              type="number"
              placeholder="Enter product stock"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
            {errors.stock && (
              <p className="text-red-400">{errors.stock.message}</p>
            )}
          </div>
          <CategoryTagsInput
            defaultCategoryTags={defaultCategoryTags}
            setCategoryIds={setCategoryIds}
          />
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
