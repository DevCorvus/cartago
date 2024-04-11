import { useUnwishProduct, useWishProduct } from '@/data/wished';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { toastError } from '@/lib/toast';
import { ProductCardDto } from '@/shared/dtos/product.dto';
import { useWishedItemStore } from '@/stores/useWishedItemStore';
import { localStorageWished } from '@/utils/localStorageWished';
import { FormEvent, useMemo } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';

interface Props {
  product: ProductCardDto;
}

export default function WishProduct({ product }: Props) {
  const isAuthenticated = useIsAuthenticated();

  const { productIds, removeWishedItem, addWishedItem } = useWishedItemStore(
    (state) => ({
      productIds: state.productIds,
      addWishedItem: state.addWishedItem,
      removeWishedItem: state.removeWishedItem,
    }),
  );

  const isWished = useMemo(
    () => productIds.includes(product.id),
    [productIds, product.id],
  );

  const wishMutation = useWishProduct();
  const unwishMutation = useUnwishProduct();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isAuthenticated) {
      if (!isWished) {
        try {
          addWishedItem(product.id);
          await wishMutation.mutateAsync(product.id);
        } catch (err) {
          toastError(err);
          removeWishedItem(product.id);
        }
      } else {
        try {
          removeWishedItem(product.id);
          await unwishMutation.mutateAsync(product.id);
        } catch (err) {
          toastError(err);
          addWishedItem(product.id);
        }
      }
    } else {
      if (!isWished) {
        localStorageWished.addItem(product.id);
        addWishedItem(product.id);
      } else {
        localStorageWished.remove(product.id);
        removeWishedItem(product.id);
      }
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
