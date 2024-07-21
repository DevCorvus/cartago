'use client';

import {
  CreateUpdateProductFormSchema,
  ProductDto,
} from '@/shared/dtos/product.dto';
import { FocusEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ui/ImageUploader';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUpdateProductFormSchema } from '@/shared/schemas/product.schema';
import CategoryTagsInput from '@/components/ui/CategoryTagsInput';
import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { getMoneyString } from '@/lib/dinero';
import { useUpdateProduct } from '@/data/product';
import { toastError } from '@/lib/toast';
import SubmitButton from './SubmitButton';

interface Props {
  product: ProductDto;
  categoryTags: CategoryTagDto[];
}

export default function EditProductForm({ product, categoryTags }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    setValue,
    getValues,
    watch,
  } = useForm<CreateUpdateProductFormSchema>({
    resolver: zodResolver(createUpdateProductFormSchema),
    defaultValues: {
      title: product.title,
      description: product.description,
      stock: product.stock,
      images: [],
      categories: [],
    },
  });

  const updateProductMutation = useUpdateProduct();

  const onSubmit: SubmitHandler<CreateUpdateProductFormSchema> = async (
    data,
  ) => {
    const formData = new FormData();

    formData.set('title', data.title);
    formData.set('description', data.description);
    formData.set('price', String(data.price));
    formData.set('stock', String(data.stock));

    data.images.forEach((image) => formData.append('images', image));
    formData.append('categories', JSON.stringify(data.categories));

    try {
      await updateProductMutation.mutateAsync({
        productId: product.id,
        formData,
      });
      return router.push(`/items/${product.id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handlePriceBlur = (e: FocusEvent<HTMLInputElement>) => {
    const price = Number(e.target.value);
    if (price > 1) {
      setValue('price', price.toFixed(2) as unknown as number);
    } else {
      setValue('price', '1.00' as unknown as number, { shouldValidate: true });
    }
  };

  const handleStockBlur = (e: FocusEvent<HTMLInputElement>) => {
    const stock = Number(e.target.value);
    if (stock < 1) {
      setValue('stock', 1, { shouldValidate: true });
    }
  };

  const addImage = useCallback(
    (file: File) => {
      const prev = getValues('images');

      if (!prev.some((prevFile) => prevFile.name === file.name)) {
        setValue('images', [...prev, file], { shouldValidate: isSubmitted });
      }
    },
    [getValues, setValue, isSubmitted],
  );

  const removeImage = useCallback(
    (name: string) => {
      const filteredImages = getValues('images').filter(
        (image) => image.name !== name,
      );
      setValue('images', filteredImages, {
        shouldValidate: isSubmitted,
      });
    },
    [getValues, setValue, isSubmitted],
  );

  const setCategoryIds = useCallback(
    (categoryIds: number[]) => {
      setValue('categories', categoryIds, { shouldValidate: isSubmitted });
    },
    [setValue, isSubmitted],
  );
  const description = watch('description');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6 rounded-lg border-2 border-gray-50 bg-white p-8 shadow-md"
    >
      <header>
        <h1 className="text-2xl font-bold text-cyan-700">Edit Product</h1>
      </header>
      <section className="w-full space-y-6">
        <ImageUploader
          defaultImages={product.images}
          addImage={addImage}
          removeImage={removeImage}
          error={errors.images}
        />
        <div className="space-y-2">
          <label htmlFor="title" className="text-slate-500">
            Title
          </label>
          <input
            {...register('title')}
            id="title"
            type="text"
            placeholder="Enter product title"
            className="input p-3"
          />
          {errors.title && (
            <p className="text-red-400">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-slate-500">
            Description
          </label>
          <div>
            <textarea
              {...register('description')}
              id="description"
              cols={30}
              rows={5}
              placeholder="Enter product description"
              className="input p-3"
            />
            <span className="block text-right text-xs text-slate-500/50">
              ({description.length}/500)
            </span>
          </div>
          {errors.description && (
            <p className="text-red-400">{errors.description.message}</p>
          )}
        </div>
        <div className="flex justify-between">
          <div className="w-[45%] space-y-2">
            <label htmlFor="price" className="text-slate-500">
              Price (USD)
            </label>
            <input
              {...register('price', { onBlur: handlePriceBlur })}
              id="price"
              defaultValue={getMoneyString(product.price)}
              min={1}
              step=".01"
              type="number"
              placeholder="Enter product price"
              className="input p-3"
            />
            {errors.price && (
              <p className="text-red-400">{errors.price.message}</p>
            )}
          </div>
          <div className="w-[45%] space-y-2">
            <label htmlFor="stock" className="text-slate-500">
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
              className="input p-3"
            />
            {errors.stock && (
              <p className="text-red-400">{errors.stock.message}</p>
            )}
          </div>
        </div>
        <CategoryTagsInput
          defaultCategoryTags={product.categories}
          categoryTags={categoryTags}
          setCategoryIds={setCategoryIds}
          error={errors.categories}
        />
      </section>
      <SubmitButton
        className="w-full p-3"
        disabled={isSubmitting}
        placeholder="Applying"
      >
        Apply
      </SubmitButton>
    </form>
  );
}
