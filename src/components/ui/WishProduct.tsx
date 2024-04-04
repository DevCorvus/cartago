import { useUnwishProduct, useWishProduct } from '@/data/wished';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { ProductCardWithSalesDto } from '@/shared/dtos/product.dto';
import { useWishedItemStore } from '@/stores/useWishedItemStore';
import { localStorageWished } from '@/utils/localStorageWished';
import { FormEvent, useMemo } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';

interface Props {
  product: ProductCardWithSalesDto;
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
          await wishMutation.mutateAsync(product.id);
          addWishedItem(product.id);
        } catch {
          // TODO: Handl error case
        }
      } else {
        try {
          await unwishMutation.mutateAsync(product.id);
          removeWishedItem(product.id);
        } catch {
          // TODO: Handl error case
        }
      }
    } else {
      if (!isWished) {
        localStorageWished.addItem(product);
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
