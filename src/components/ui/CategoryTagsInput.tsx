import { CategoryTagDto } from '@/shared/dtos/category.dto';
import {
  Dispatch,
  SetStateAction,
  useState,
  KeyboardEvent,
  useEffect,
} from 'react';
import { HiXMark } from 'react-icons/hi2';
import { capitalize } from '@/utils/capitalize';

interface Props {
  defaultCategoryTags?: CategoryTagDto[];
  categoryTags: CategoryTagDto[];
  setCategoryIds: Dispatch<SetStateAction<number[]>>;
  notEnoughCategoriesError: boolean;
  setNotEnoughCategoriesError: Dispatch<SetStateAction<boolean>>;
}

export default function CategoryTagsInput({
  defaultCategoryTags,
  categoryTags,
  setCategoryIds,
  notEnoughCategoriesError,
  setNotEnoughCategoriesError,
}: Props) {
  const [input, setInput] = useState<string>('');

  const [selectedCategoryTags, setSelectedCategoryTags] = useState<
    CategoryTagDto[]
  >([]);

  const [autocompleteCategoryTags, setAutocompleteCategoryTags] = useState<
    CategoryTagDto[]
  >(defaultCategoryTags || []);

  useEffect(() => {
    setCategoryIds(selectedCategoryTags.map((tag) => tag.id));
  }, [selectedCategoryTags, setCategoryIds]);

  useEffect(() => {
    if (input) {
      const lowerInput = input.toLowerCase();

      setAutocompleteCategoryTags(
        categoryTags.filter((tag) => {
          const tagAlreadyExist = selectedCategoryTags.some(
            (selectedTag) => selectedTag.id === tag.id,
          );
          const tagStartsWith = tag.title.toLowerCase().startsWith(lowerInput);

          return !tagAlreadyExist && tagStartsWith;
        }),
      );
    } else {
      setAutocompleteCategoryTags([]);
    }
  }, [input, categoryTags, selectedCategoryTags]);

  const addSelectedCategoryTag = (tag: CategoryTagDto) => {
    setSelectedCategoryTags((prev) => [...prev, { ...tag }]);
    setAutocompleteCategoryTags([]);
    setInput('');
    setNotEnoughCategoriesError(false);
  };

  const handleDelete = (id: number) => {
    if (selectedCategoryTags.length === 1) {
      setNotEnoughCategoriesError(true);
    }
    setSelectedCategoryTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement) {
      const value: string = e.target.value;

      if (e.key === 'Enter') {
        e.preventDefault();

        if (value) {
          const lowerInput = input.toLowerCase();

          const selectedTagAlreadyExist = selectedCategoryTags.some(
            (tag) => tag.title.toLowerCase() === lowerInput,
          );

          if (selectedTagAlreadyExist) return;

          const categoryMatch = categoryTags.find(
            (tag) => tag.title.toLowerCase() === lowerInput,
          );

          if (categoryMatch) {
            addSelectedCategoryTag(categoryMatch);
          }
        }
      } else if (e.key == 'Backspace' && !value) {
        if (selectedCategoryTags.length === 1) {
          setNotEnoughCategoriesError(true);
        }
        setSelectedCategoryTags((prev) =>
          selectedCategoryTags.filter((_, i) => i !== prev.length - 1),
        );
      }
    }
  };

  return (
    <div className="relative flex flex-col gap-3">
      <label htmlFor="categories" className="text-green-800 opacity-75">
        Categories
      </label>
      <div className="input p-1">
        <ul className="flex flex-wrap gap-1 p-2">
          {selectedCategoryTags.map((selectedTag) => (
            <li key={selectedTag.id}>
              <button
                title="Remove category"
                className="flex items-center gap-0.5 rounded-md bg-green-200 p-1 text-green-800 shadow-sm transition hover:bg-red-200 hover:text-red-800 focus:bg-red-200 focus:text-red-800"
                type="button"
                onClick={() => handleDelete(selectedTag.id)}
              >
                <span>{capitalize(selectedTag.title)}</span>
                <HiXMark />
              </button>
            </li>
          ))}
          <li>
            <input
              id="categories"
              type="text"
              className="w-28 bg-transparent p-1"
              placeholder="Add category..."
              autoComplete="off"
              onKeyDown={handleKey}
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </li>
        </ul>
        {autocompleteCategoryTags.length > 0 && (
          <>
            <hr />
            <ul className="flex flex-wrap gap-2 p-2">
              {autocompleteCategoryTags.map((tag) => (
                <li key={tag.id}>
                  <button
                    className="text-slate-500 transition hover:text-green-700 focus:text-green-700"
                    onClick={() => addSelectedCategoryTag(tag)}
                  >
                    {capitalize(tag.title)}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {notEnoughCategoriesError && (
        <p className="text-red-400">At least one category is required</p>
      )}
    </div>
  );
}
