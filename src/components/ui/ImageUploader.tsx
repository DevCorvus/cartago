import Image from 'next/image';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ImagePreview } from '../types';
import { useDropzone } from 'react-dropzone';

interface Props {
  setImages: Dispatch<SetStateAction<File[]>>;
}

export default function ImageUploader({ setImages }: Props) {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImagePreview | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log('File reading was aborted');
        reader.onerror = () => console.log('File reading has failed');
        reader.onload = () => {
          if (!imagePreviews.some((image) => image.name === file.name)) {
            const imagePreview: ImagePreview = {
              name: file.name,
              url: URL.createObjectURL(file),
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDeleteImage = (name: string) => {
    setImages((prev) => prev.filter((image) => image.name !== name));
    setImagePreviews((prev) => prev.filter((image) => image.name !== name));
  };

  useEffect(() => {
    if (imagePreviews.length > 0) {
      setSelectedImage(imagePreviews[imagePreviews.length - 1]);
    } else {
      setSelectedImage(null);
    }
  }, [imagePreviews]);

  return (
    <div className="w-full h-96 relative flex flex-col gap-2">
      <div
        {...getRootProps()}
        className="relative h-4/5 bg-neutral-100 shadow-md rounded-md"
      >
        <input {...getInputProps()} />
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            fill={true}
            object-fit="contain"
            alt={`${selectedImage.name} selected image`}
            className="rounded-md p-1"
          />
        ) : (
          <span className="p-5 text-center h-full flex justify-center items-center bg-neutral-200">
            Drag and drop some files here or click to select files
          </span>
        )}
      </div>
      <div className="flex-1 flex gap-1">
        {imagePreviews.map((image, i) => (
          <div key={i} className="relative">
            <button
              className={`relative w-20 h-full border rounded bg-neutral-100 ${
                selectedImage === image
                  ? 'border-green-500'
                  : 'border-neutral-300'
              }`}
              onClick={() => {
                setSelectedImage(image);
              }}
            >
              <Image
                src={image.url}
                alt={`${image.name} image #${i + 1}`}
                fill={true}
                object-fit="contain"
              />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteImage(image.name)}
              className="absolute top-0 right-0"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
