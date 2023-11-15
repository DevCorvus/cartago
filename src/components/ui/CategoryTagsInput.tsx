import {
  CategoryTagDto as CategoryTag,
  CategoryTagDto,
} from '@/shared/dtos/category.dto';
import {
  Dispatch,
  SetStateAction,
  useState,
  KeyboardEvent,
  useEffect,
} from 'react';
import { HiXMark } from 'react-icons/hi2';

interface Props {
  categoryTags: CategoryTagDto[];
  setCategoryIds: Dispatch<SetStateAction<number[]>>;
}

export default function CategoryTagsInput({
  categoryTags,
  setCategoryIds,
}: Props) {
  const [selectedCategoryTags, setSelectedCategoryTags] = useState<
    CategoryTag[]
  >([]);
  const [autocompleteCategoryTags, setAutocompleteCategoryTags] = useState<
    CategoryTag[]
  >([]);

  useEffect(() => {
    setCategoryIds(categoryTags.map((tag) => tag.id));
  }, [categoryTags, setCategoryIds]);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement) {
      const value: string = e.target.value;

      if (e.key === 'Enter') {
        e.preventDefault();

        setSelectedCategoryTags((prev) => [
          ...prev,
          { id: prev.length + 1, title: value },
        ]);

        e.target.value = '';
      } else if (e.key == 'Backspace' && !value) {
        setSelectedCategoryTags((prev) =>
          categoryTags.filter((_, i) => i !== prev.length - 1),
        );
      }

      if (value) {
        const lowerCaseValue = value.toLowerCase();

        setAutocompleteCategoryTags(
          categoryTags.filter((tag) =>
            tag.title.toLowerCase().startsWith(lowerCaseValue),
          ),
        );
      } else {
        setAutocompleteCategoryTags([]);
      }
    }
  };

  const handleDelete = (id: number) => {
    setSelectedCategoryTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  return (
    <div className="flex flex-col gap-3 w-72 relative">
      <label htmlFor="categories">Categories</label>
      <ul>
        {autocompleteCategoryTags.map((tag) => (
          <li key={tag.id}>{tag.title}</li>
        ))}
      </ul>

      <ul className="flex flex-wrap gap-1 rounded-lg p-3 text-sm bg-white shadow-md">
        {selectedCategoryTags.map((selectedTag) => (
          <li key={selectedTag.id}>
            <button
              className="bg-green-800 text-slate-50 rounded-md p-1 flex items-center gap-0.5"
              type="button"
              onClick={() => handleDelete(selectedTag.id)}
            >
              <span>{selectedTag.title}</span>
              <HiXMark />
            </button>
          </li>
        ))}
        <li>
          <input
            id="categories"
            type="text"
            className="outline-none p-1 bg-none w-28"
            placeholder="Add category..."
            onKeyDown={handleKey}
          />
        </li>
      </ul>
    </div>
  );
}
