import { CategoryWithProductsDto } from '@/shared/dtos/category.dto';
import ProductList from './ProductList';
import { capitalize } from '@/utils/capitalize';

interface Props {
  categoryWithProducts: CategoryWithProductsDto;
}

export default function CategoryItemWithProducts({
  categoryWithProducts,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <header className="text-2xl font-semibold text-green-800">
        <h1>
          {capitalize(categoryWithProducts.title)} (
          {categoryWithProducts.products.length})
        </h1>
      </header>
      <ProductList products={categoryWithProducts.products} />
    </div>
  );
}
