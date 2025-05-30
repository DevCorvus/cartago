import { productImageSchema } from '@/shared/schemas/product.schema';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  HiMiniXCircle,
  HiPlusCircle,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { extname } from 'path';
import Loading from './Loading';
import { toastError } from '@/lib/toast';
import { ProductImageDto } from '@/shared/dtos/product.dto';
import { FieldError, Merge } from 'react-hook-form';

interface ImagePreview {
  filename: string;
  url: string;
  errors?: string[];
}

interface Props {
  defaultImages?: ProductImageDto[];
  addImage: (file: File) => void;
  removeImage: (name: string) => void;
  error?: Merge<FieldError, (FieldError | undefined)[] | undefined>;
}

export default function ImageUploader({
  defaultImages,
  addImage,
  removeImage,
  error,
}: Props) {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImagePreview | null>(null);
  const [isLoading, setLoading] = useState(false);

  const addImagePreview = (imagePreview: ImagePreview) => {
    setImagePreviews((prev) => {
      if (!prev.some((preview) => preview.filename === imagePreview.filename)) {
        return [...prev, imagePreview];
      } else {
        return prev;
      }
    });
  };

  const handleNewImage = useCallback(
    (file: File) => {
      const validation = productImageSchema.safeParse(file);

      const imagePreview: ImagePreview = {
        filename: file.name,
        url: URL.createObjectURL(file),
        errors: validation.success
          ? undefined
          : validation.error.errors.map((err) => err.message),
      };

      addImage(file);
      addImagePreview(imagePreview);
    },
    [addImage],
  );

  const handleDeleteImage = (name: string) => {
    removeImage(name);
    setImagePreviews((prev) => prev.filter((image) => image.filename !== name));
  };

  useEffect(() => {
    if (defaultImages) {
      (async () => {
        setLoading(true);

        for (const { path } of defaultImages) {
          try {
            const res = await fetch(`/images/${path}`);

            if (!res.ok) {
              throw new Error(`Could not get image ${path}`);
            }

            const imageBlob = await res.blob();
            const imageType = `image/${extname(path).replace(/\./, '')}`;
            const imageFile = new File([imageBlob], path, {
              type: imageType,
            });

            handleNewImage(imageFile);
          } catch (err) {
            toastError(err);
          }
        }

        setLoading(false);
      })();
    }
  }, [defaultImages, handleNewImage]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const LIMIT = 5;
      const slots = LIMIT - imagePreviews.length;

      if (slots <= 0) return;

      acceptedFiles.slice(0, slots).forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => {
          toastError(new Error('File reading was aborted'));
        };
        reader.onerror = () => {
          toastError(new Error('File reading has failed'));
        };
        reader.onload = () => {
          if (!imagePreviews.some((image) => image.filename === file.name)) {
            handleNewImage(file);
          }
        };

        reader.readAsArrayBuffer(file);
      });
    },
    [imagePreviews, handleNewImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (imagePreviews.length > 0) {
      setSelectedImage(imagePreviews[imagePreviews.length - 1]);
    } else {
      setSelectedImage(null);
    }
  }, [imagePreviews]);

  return (
    <section className="relative w-full space-y-1">
      <button
        title="Upload images"
        {...getRootProps()}
        type="button"
        className="input relative h-60"
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {!selectedImage ? (
              <span className="mx-auto flex h-full w-60 items-center justify-center text-slate-500/75">
                {isDragActive
                  ? 'Drop your files here'
                  : 'Drag and drop some files here or click to select files'}
              </span>
            ) : (
              <>
                {!selectedImage.errors ? (
                  <Image
                    src={selectedImage.url}
                    fill={true}
                    alt={`${selectedImage.filename} selected image`}
                    className="rounded-md object-contain p-1"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 rounded-md border border-red-300">
                    {selectedImage.errors.map((err, i) => (
                      <p key={i} className="w-60 text-red-400">
                        {err}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
            {selectedImage && (
              <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-cyan-100 bg-opacity-25 opacity-0 transition hover:opacity-100">
                <HiPlusCircle className="text-7xl text-cyan-300 text-opacity-50" />
              </div>
            )}
          </>
        )}
      </button>
      <span className="inline-block text-sm italic text-slate-500/75">
        Max 5
      </span>
      {error && <p className="mt-1 text-red-400">{error.message}</p>}
      <div className="grid h-16 flex-1 grid-cols-5 gap-1">
        {imagePreviews.map((image, i) => (
          <div key={i} className="relative">
            <button
              type="button"
              className={`size-full relative rounded border bg-neutral-100 ${
                image.errors
                  ? 'border-red-300 hover:border-red-400 focus:border-red-400'
                  : ''
              } transition`}
              onClick={() => {
                setSelectedImage(image);
              }}
            >
              {!image.errors ? (
                <Image
                  src={image.url}
                  alt={`${image.filename} image #${i + 1}`}
                  fill={true}
                  className="object-contain"
                />
              ) : (
                <HiOutlineExclamationTriangle className="mx-auto text-3xl text-red-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleDeleteImage(image.filename)}
              className="absolute right-0 top-0 text-xl text-red-300 transition hover:text-red-400 focus:text-red-400"
            >
              <HiMiniXCircle />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
