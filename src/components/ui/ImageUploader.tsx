import { productImageSchema } from '@/shared/schemas/product.schema';
import Image from 'next/image';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { HiMiniXCircle, HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface ImagePreview {
  filename: string;
  url: string;
  errors?: string[];
}

interface Props {
  setImages: Dispatch<SetStateAction<File[]>>;
  setImageUploadError: Dispatch<SetStateAction<boolean>>;
}

export default function ImageUploader({
  setImages,
  setImageUploadError,
}: Props) {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImagePreview | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const LIMIT = 5;
      const slots = LIMIT - imagePreviews.length;

      if (slots <= 0) return;

      acceptedFiles.slice(0, slots).forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log('File reading was aborted');
        reader.onerror = () => console.log('File reading has failed');
        reader.onload = () => {
          if (!imagePreviews.some((image) => image.filename === file.name)) {
            const validation = productImageSchema.safeParse(file);

            const imagePreview: ImagePreview = {
              filename: file.name,
              url: URL.createObjectURL(file),
              errors: validation.success
                ? undefined
                : validation.error.errors.map((err) => err.message),
            };

            setImages((prev) => [...prev, file]);
            setImagePreviews((prev) => [...prev, imagePreview]);
          }
        };

        reader.readAsArrayBuffer(file);
      });
    },
    [imagePreviews, setImages],
  );

  useEffect(() => {
    setImageUploadError(imagePreviews.some((img) => Boolean(img.errors)));
  }, [imagePreviews, setImageUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDeleteImage = (name: string) => {
    setImages((prev) => prev.filter((image) => image.name !== name));
    setImagePreviews((prev) => prev.filter((image) => image.filename !== name));
  };

  useEffect(() => {
    if (imagePreviews.length > 0) {
      setSelectedImage(imagePreviews[imagePreviews.length - 1]);
    } else {
      setSelectedImage(null);
    }
  }, [imagePreviews]);

  return (
    <div className="w-full h-96 relative flex flex-col gap-1">
      <button
        {...getRootProps()}
        type="button"
        className="relative h-4/5 bg-neutral-100 shadow-md rounded-md"
      >
        <input {...getInputProps()} />
        {!selectedImage ? (
          <span className="h-full flex justify-center items-center w-60 mx-auto">
            Drag and drop some files here or click to select files
          </span>
        ) : (
          <>
            {!selectedImage.errors ? (
              <Image
                src={selectedImage.url}
                fill={true}
                object-fit="contain"
                alt={`${selectedImage.filename} selected image`}
                className="rounded-md p-1"
              />
            ) : (
              <div className="h-full flex flex-col justify-center items-center gap-4 border border-red-300 rounded-md">
                {selectedImage.errors.map((err, i) => (
                  <p key={i} className="text-red-400 w-60">
                    {err}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </button>
      <p className="text-sm italic opacity-50">Max 5</p>
      <div className="flex-1 flex gap-1">
        {imagePreviews.map((image, i) => (
          <div key={i}>
            <div className="relative h-full">
              <button
                className={`relative w-20 h-full border rounded bg-neutral-100 ${
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
                    object-fit="contain"
                  />
                ) : (
                  <HiOutlineExclamationTriangle className="text-red-400 text-3xl mx-auto" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteImage(image.filename)}
                className="absolute top-0 right-0 text-lg text-red-300 hover:text-red-400 focus:text-red-400 transition"
              >
                <HiMiniXCircle />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
