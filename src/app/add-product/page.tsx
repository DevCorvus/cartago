'use client';

import { ProductDto } from '@/shared/dtos/product.dto';
import Image from 'next/image';
import { FormEvent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

interface FilePreview {
  name: string;
  url: string;
}

export default function AddProduct() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        setFiles((prev) => [...prev, file]);
        setFilePreviews((prev) => [
          ...prev,
          { name: file.name, url: URL.createObjectURL(file) },
        ]);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target);

      const title = formData.get('title');
      const description = formData.get('description');
      const price = Number(formData.get('price'));
      const stock = Number(formData.get('stock'));

      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'aplication/json',
          },
          body: JSON.stringify({
            title,
            description,
            price,
            stock,
            categories: [],
          }),
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
    <div className="p-5 pt-30 bg-lime-50 w-full h-full flex flex-col gap-5 items-center justify-center text-green-800">
      <form
        action=""
        onSubmit={handleSubmit}
        className="flex items-center justify-center flex-col gap-6"
      >
        <header className="w-full ">
          <h1 className=" text-2xl font-bold">Add Product</h1>
        </header>
        <div className="flex flex-col gap-4 w-auto">
          <div
            {...getRootProps()}
            className="border border-green-700 border-opacity-30 p-4 rounded-md"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag and drop some files here or click to select files</p>
            )}
          </div>
          {files.length > 0 && (
            <div className=" flex gap-1 border border-green-700 border-opacity-30 p-1 rounded-md">
              {filePreviews.map((file, i) => (
                <div key={i + 1} className="relative w-16 h-16">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill={true}
                    object-fit="contain"
                  />
                </div>
              ))}
            </div>
          )}
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
