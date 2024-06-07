import { formatMoney } from '@/lib/dinero';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import Image from 'next/image';
import Link from 'next/link';
import Rating from './Rating';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import ConfirmModal from './ConfirmModal';
import { useMemo, useState } from 'react';
import { ONE_WEEK } from '@/shared/constants';

interface Props {
  product: ProductCardDto;
  deleteProduct: () => Promise<void>;
}

export default function SellerProductItem({ product, deleteProduct }: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const isNew = useMemo(() => {
    const createdAt = new Date(product.createdAt);
    const createdAtInMs = createdAt.getTime();
    return Date.now() < createdAtInMs + ONE_WEEK;
  }, [product.createdAt]);

  return (
    <div className="relative">
      <Link
        href={'/items/' + product.id}
        key={product.id}
        className="group relative flex flex-col rounded-lg border-b-2 border-neutral-100 bg-white shadow-md"
      >
        {isNew && (
          <span className="absolute -left-3 -top-3 z-10 rounded-md border border-cyan-600 bg-cyan-50 p-1 text-xs font-semibold text-cyan-600 shadow-md">
            New
          </span>
        )}
        <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-neutral-100 shadow-inner">
          <Image
            src={'/images/' + product.images[0].path}
            alt={product.title}
            fill={true}
            sizes="300px"
            className="object-cover transition duration-300 group-hover:scale-110"
          />
        </div>
        <section className="relative flex flex-1 flex-col gap-1 p-2">
          <header className="flex items-center justify-between gap-0.5 capitalize">
            <h2
              className="line-clamp-1 text-sm font-medium text-slate-700 md:text-base"
              title={product.title}
            >
              {product.title}
            </h2>
            <span className="rounded-xl bg-green-50 px-1 text-sm font-semibold text-green-600 shadow-sm md:text-base md:font-bold">
              {formatMoney(product.price)}
            </span>
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
            className="rounded-full bg-white p-0.5 text-xl shadow-md transition hover:text-green-500"
          >
            <HiOutlinePencilSquare />
          </Link>
          <button
            title="Delete this product"
            onClick={() => setShowDeleteConfirmation(true)}
            className="rounded-full bg-white p-0.5 text-xl shadow-md transition hover:text-rose-400"
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
