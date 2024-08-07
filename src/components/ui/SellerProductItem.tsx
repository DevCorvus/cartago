import { formatMoney } from '@/lib/dinero';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import Image from 'next/image';
import Link from 'next/link';
import Rating from './Rating';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import ConfirmModal from './ConfirmModal';
import { useState } from 'react';
import NewTag from './NewTag';

interface Props {
  product: ProductCardDto;
  deleteProduct: () => Promise<void>;
}

export default function SellerProductItem({ product, deleteProduct }: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <div className="relative">
      <Link
        href={'/items/' + product.id}
        key={product.id}
        className="group relative flex flex-col rounded-lg border-b-2 border-neutral-100 bg-white shadow-md"
      >
        <NewTag date={product.createdAt} />
        <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-neutral-100 shadow-inner">
          <Image
            src={'/images/' + product.images[0].path}
            alt={product.title}
            fill={true}
            sizes="300px"
            className="object-cover transition duration-300 group-hover:scale-110 group-focus:scale-110"
          />
          <span className="absolute bottom-2 right-2 rounded-xl border border-green-200 bg-green-50 px-1 font-bold text-green-600 shadow-md">
            {formatMoney(product.price)}
          </span>
        </div>
        <section className="relative flex flex-1 flex-col gap-1 p-2">
          <header>
            <h2
              className="line-clamp-1 text-sm font-medium capitalize text-slate-700 md:text-base"
              title={product.title}
            >
              {product.title}
            </h2>
          </header>
          <div className="flex items-center justify-between text-slate-500">
            <p className="text-xs sm:text-sm">
              <span className="font-medium">{product.sales}</span> sold
            </p>
            <div className="flex items-center gap-1 text-xs sm:text-base">
              <Rating score={product.rating.score} />
              <span className="text-xs">({product.rating.count})</span>
            </div>
          </div>
        </section>
      </Link>
      {product.isOwner && (
        <div className="absolute right-1 top-1 z-10 flex flex-col gap-1.5 text-slate-700">
          <Link
            title="Edit this product"
            href={`/items/${product.id}/edit`}
            className="rounded-full bg-white p-1 text-xl shadow-md transition hover:text-green-500"
          >
            <HiOutlinePencilSquare />
          </Link>
          <button
            title="Delete this product"
            onClick={() => setShowDeleteConfirmation(true)}
            className="rounded-full bg-white p-1 text-xl shadow-md transition hover:text-rose-400"
          >
            <HiOutlineTrash />
          </button>
        </div>
      )}
      {showDeleteConfirmation && (
        <ConfirmModal
          action={deleteProduct}
          close={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
}
