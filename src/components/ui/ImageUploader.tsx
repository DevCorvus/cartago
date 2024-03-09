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
import {
  HiMiniXCircle,
  HiPlusCircle,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { extname } from 'path';
import Loading from './Loading';
import { ProductImageDto } from '@/shared/dtos/product.dto';

interface ImagePreview {
  filename: string;
  url: string;
  errors?: string[];
}

interface Props {
  defaultImages?: ProductImageDto[];
  addImage: (file: File) => void;
  removeImage: (name: string) => void;
  setImageUploadError: Dispatch<SetStateAction<boolean>>;
  notEnoughImagesError: boolean;
}

export default function ImageUploader({
  defaultImages,
  addImage,
  removeImage,
  setImageUploadError,
  notEnoughImagesError,
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
          const res = await fetch(`/uploads/${path}`);

          if (res.ok) {
            const imageBlob = await res.blob();
            const imageType = `image/${extname(path).replace(/\./, '')}`;
            const imageFile = new File([imageBlob], path, { type: imageType });

            handleNewImage(imageFile);
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

        reader.onabort = () => console.log('File reading was aborted');
        reader.onerror = () => console.log('File reading has failed');
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

  useEffect(() => {
    setImageUploadError(imagePreviews.some((img) => Boolean(img.errors)));
  }, [imagePreviews, setImageUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
        title="Upload images"
        {...getRootProps()}
        type="button"
        className="relative h-4/5 input"
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {!selectedImage ? (
              <span className="h-full flex justify-center items-center w-60 mx-auto opacity-50">
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
                    className="rounded-md p-1 object-contain"
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
            {selectedImage && (
              <div className="opacity-0 hover:opacity-100 transition absolute inset-0 w-full h-full bg-green-100 bg-opacity-25 flex flex-col items-center justify-center">
                <HiPlusCircle className="text-7xl text-green-300 text-opacity-50" />
              </div>
            )}
          </>
        )}
      </button>
      <span className="text-sm italic opacity-50">Max 5</span>
      {notEnoughImagesError && (
        <p className="text-red-400 mt-1">At least one image is required</p>
      )}
      <div className="flex-1 grid grid-cols-5 gap-1">
        {imagePreviews.map((image, i) => (
          <div key={i} className="relative">
            <button
              type="button"
              className={`relative w-full h-full border rounded bg-neutral-100 ${
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
                <HiOutlineExclamationTriangle className="text-red-400 text-3xl mx-auto" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleDeleteImage(image.filename)}
              className="absolute top-0 right-0 text-xl text-red-300 hover:text-red-400 focus:text-red-400 transition"
            >
              <HiMiniXCircle />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
