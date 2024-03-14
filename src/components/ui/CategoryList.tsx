import Link from 'next/link';
import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { capitalize } from '@/utils/capitalize';

interface Props {
  categories: CategoryTagDto[];
  skip?: number;
}

export default function CategoryList({ categories, skip }: Props) {
  const isEmpty = categories.length === 0 || (categories.length === 1 && skip);
  return (
    <>
      {!isEmpty && (
        <ul className="mb-6 flex w-full flex-wrap gap-1.5 ">
          {categories.map(
            (category) =>
              category.id !== skip && (
                <li key={category.id}>
                  <Link
                    href={`/items?categoryId=${category.id}`}
                    className="rounded-full bg-green-100 px-2 py-1 text-green-700 shadow-sm"
                  >
                    {capitalize(category.title)}
                  </Link>
                </li>
              ),
          )}
        </ul>
      )}
    </>
  );
}
