import {
  Dispatch,
  SetStateAction,
  useState,
  KeyboardEvent,
  useEffect,
} from 'react';
import { HiXMark } from 'react-icons/hi2';

interface CategoryTag {
  id: number;
  title: string;
}

interface Props {
  setCategoryIds: Dispatch<SetStateAction<number[]>>;
}

export default function CategoryTagsInput({ setCategoryIds }: Props) {
  const [categoryTags, setCategoryTags] = useState<CategoryTag[]>([]);

  useEffect(() => {
    setCategoryIds(categoryTags.map((tag) => tag.id));
  }, [categoryTags, setCategoryIds]);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement) {
      const value: string = e.target.value;

      if (e.key === 'Enter') {
        e.preventDefault();

        setCategoryTags((prev) => [
          ...prev,
          { id: prev.length + 1, title: value },
        ]);

        e.target.value = '';
      } else if (e.key == 'Backspace' && !value) {
        setCategoryTags((prev) =>
          categoryTags.filter((_, i) => i !== prev.length - 1),
        );
      }
    }
  };

  const handleDelete = (id: number) => {
    setCategoryTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  return (
    <div className="flex flex-col gap-3 w-72">
      <label htmlFor="">Categories</label>
      <ul className="flex flex-wrap gap-1 rounded-lg p-3 text-sm bg-white shadow-md">
        {categoryTags.map((tag) => (
          <li key={tag.id}>
            <button
              className="bg-green-800 text-slate-50 rounded-md p-1 flex items-center gap-0.5"
              type="button"
              onClick={() => handleDelete(tag.id)}
            >
              <span>{tag.title}</span>
              <HiXMark />
            </button>
          </li>
        ))}
        <li>
          <input
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
