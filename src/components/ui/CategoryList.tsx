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
        <ul className="h-10 mb-6 flex w-full gap-1.5 text-left overflow-hidden overscroll-contain">
          {categories.map(
            (category) =>
              category.id !== skip && (
                <li key={category.id} className='w-auto flex'>
                  <Link
                    href={`/items?categoryId=${category.id}`}
                    className="h-fit max rounded-full bg-green-100 px-2 py-1 text-green-700 shadow-sm flex"
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
