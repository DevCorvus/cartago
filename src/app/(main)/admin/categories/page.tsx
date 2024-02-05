import CategoryItem from '@/components/ui/CategoryItem';
import { categoryService } from '@/server/services';

export default async function Categories() {
  const categories = await categoryService.findAll();

  return (
    <ul className="w-full flex flex-col gap-3">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryItem category={category} />
        </li>
      ))}
    </ul>
  );
}
