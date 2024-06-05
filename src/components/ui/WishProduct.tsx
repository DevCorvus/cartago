import { useWished } from '@/hooks/useWished';
import { FormEvent } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';

interface Props {
  productId: string;
}

export default function WishProduct({ productId }: Props) {
  const { toggleWishness, isWished } = useWished(productId);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await toggleWishness();
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        title={isWished ? 'Unwish product' : 'Wish product'}
        className={`group flex items-center rounded-full p-2 text-3xl text-rose-400 shadow-sm transition ${isWished ? 'bg-rose-50' : 'hover:bg-rose-50'}`}
      >
        <span className="inline-block transition group-hover:scale-110">
          {isWished ? <HiHeart /> : <HiOutlineHeart />}
        </span>
      </button>
    </form>
  );
}
