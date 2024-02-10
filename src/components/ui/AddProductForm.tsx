'use client';

import { CreatePartialProductDto, ProductDto } from '@/shared/dtos/product.dto';
import { FocusEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ui/ImageUploader';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPartialProductSchema } from '@/shared/schemas/product.schema';
import CategoryTagsInput from '@/components/ui/CategoryTagsInput';
import { CategoryTagDto } from '@/shared/dtos/category.dto';

interface Props {
  categoryTags: CategoryTagDto[];
}

// TODO: Validation refactor
export default function AddProductForm({ categoryTags }: Props) {
  const router = useRouter();

  const [images, setImages] = useState<File[]>([]);
  const [notEnoughImagesError, setNotEnoughImagesError] =
    useState<boolean>(false);
  const [imageUploadError, setImageUploadError] = useState<boolean>(false);

  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [notEnoughCategoriesError, setNotEnoughCategoriesError] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreatePartialProductDto>({
    resolver: zodResolver(createPartialProductSchema),
  });

  const onSubmit: SubmitHandler<CreatePartialProductDto> = async (data) => {
    const noImages = images.length === 0;
    const noCategories = categoryIds.length === 0;

    setNotEnoughImagesError(noImages);
    setNotEnoughCategoriesError(noCategories);

    if (noImages || noCategories || imageUploadError) return;

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
        const data: ProductDto = await res.json();
        return router.push(`/items/${data.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePriceBlur = (e: FocusEvent<HTMLInputElement>) => {
    const price = Number(e.target.value);
    if (price <= 1) {
      // TODO: Fix price type
      // Price has to be validated as a string and then transformed to a number
      // but types are messed up and I have a skill issue going on right now
      setValue('price', '1.00' as unknown as number, { shouldValidate: true });
    }
  };

  const handleStockBlur = (e: FocusEvent<HTMLInputElement>) => {
    const stock = Number(e.target.value);
    if (stock < 1) {
      setValue('stock', 1, { shouldValidate: true });
    }
  };

  const addImage = (file: File) => {
    setImages((prev) => [...prev, file]);
    setNotEnoughImagesError(false);
  };

  const removeImage = (name: string) => {
    if (images.length === 1) {
      setNotEnoughImagesError(true);
    }
    setImages((prev) => prev.filter((image) => image.name !== name));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center flex-col gap-10 max-w-sm bg-white p-8 shadow-md rounded-lg border-2 border-gray-50"
    >
      <header className="w-full">
        <h1 className="text-2xl font-bold text-green-800">Add Product</h1>
      </header>
      <div className="flex flex-col gap-6 w-full">
        <ImageUploader
          addImage={addImage}
          removeImage={removeImage}
          setImageUploadError={setImageUploadError}
          notEnoughImagesError={notEnoughImagesError}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-green-800 opacity-75">
            Title
          </label>
          <input
            {...register('title')}
            id="title"
            type="text"
            placeholder="Enter product title"
            className="p-4 input"
          />
          {errors.title && (
            <p className="text-red-400">{errors.title.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-green-800 opacity-75">
            Description
          </label>
          <textarea
            {...register('description')}
            id="description"
            cols={30}
            rows={5}
            placeholder="Enter product description"
            className="p-4 input"
          />
          {errors.description && (
            <p className="text-red-400">{errors.description.message}</p>
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-2 w-[45%]">
            <label htmlFor="price" className="text-green-800 opacity-75">
              Price (USD)
            </label>
            <input
              {...register('price', { onBlur: handlePriceBlur })}
              id="price"
              defaultValue="1.00"
              min={1}
              step=".01"
              type="number"
              placeholder="Enter product price"
              className="p-4 input"
            />
            {errors.price && (
              <p className="text-red-400">{errors.price.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-[45%]">
            <label htmlFor="stock" className="text-green-800 opacity-75">
              Stock
            </label>
            <input
              {...register('stock', {
                valueAsNumber: true,
                onBlur: handleStockBlur,
              })}
              id="stock"
              defaultValue={1}
              min={1}
              type="number"
              placeholder="Enter product stock"
              className="p-4 input"
            />
            {errors.stock && (
              <p className="text-red-400">{errors.stock.message}</p>
            )}
          </div>
        </div>
        <CategoryTagsInput
          categoryTags={categoryTags}
          setCategoryIds={setCategoryIds}
          notEnoughCategoriesError={notEnoughCategoriesError}
          setNotEnoughCategoriesError={setNotEnoughCategoriesError}
        />
      </div>
      <button type="submit" className="p-3 btn w-full">
        Add Product
      </button>
    </form>
  );
}
