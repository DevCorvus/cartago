import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { useWishedItemStore } from '@/stores/useWishedItemStore';
import { FormEvent, useMemo } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';

interface Props {
  id: string;
}

export default function WishProduct({ id }: Props) {
  const isAuthenticated = useIsAuthenticated();

  const { productIds, removeWishedItem, addWishedItem } = useWishedItemStore(
    (state) => ({
      productIds: state.productIds,
      addWishedItem: state.addWishedItem,
      removeWishedItem: state.removeWishedItem,
    }),
  );

  const isWished = useMemo(() => productIds.includes(id), [productIds, id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isAuthenticated) {
      if (!isWished) {
        const res = await fetch(`/api/wished/${id}`, { method: 'POST' });
        if (res.ok) {
          addWishedItem(id);
        }
      } else {
        const res = await fetch(`/api/wished/${id}`, { method: 'DELETE' });
        if (res.ok) {
          removeWishedItem(id);
        }
      }
    } else {
      // TODO: Local storage support
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">
        {isWished ? (
          <HiHeart className="text-rose-500" />
        ) : (
          <HiOutlineHeart className="text-rose-500" />
        )}
      </button>
    </form>
  );
}
