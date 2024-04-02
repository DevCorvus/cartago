import { CategoryDto } from '@/shared/dtos/category.dto';
import { capitalize } from '@/utils/capitalize';
import ProductScroller from './ProductScroller';

interface Props {
  category: CategoryDto;
}

export default function CategoryWithProducts({ category }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <header className="text-2xl font-semibold text-green-800">
        <h1>{capitalize(category.title)}</h1>
      </header>
      <ProductScroller categoryId={category.id} />
    </div>
  );
}
