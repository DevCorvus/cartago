import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { useState, KeyboardEvent, useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { capitalize } from '@/utils/capitalize';
import { FieldError, Merge } from 'react-hook-form';

interface Props {
  defaultCategoryTags?: CategoryTagDto[];
  categoryTags: CategoryTagDto[];
  setCategoryIds(categoryIds: number[]): void;
  error?: Merge<FieldError, (FieldError | undefined)[] | undefined>;
}

export default function CategoryTagsInput({
  defaultCategoryTags,
  categoryTags,
  setCategoryIds,
  error,
}: Props) {
  const [input, setInput] = useState<string>('');

  const [selectedCategoryTags, setSelectedCategoryTags] = useState<
    CategoryTagDto[]
  >(defaultCategoryTags || []);

  const [autocompleteCategoryTags, setAutocompleteCategoryTags] = useState<
    CategoryTagDto[]
  >([]);

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
  };

  const handleDelete = (id: number) => {
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
        setSelectedCategoryTags((prev) =>
          selectedCategoryTags.filter((_, i) => i !== prev.length - 1),
        );
      }
    }
  };

  return (
    <div className="relative flex flex-col gap-3">
      <label htmlFor="categories" className="text-slate-500">
        Categories
      </label>
      <div className="input p-1">
        <ul className="flex flex-wrap items-center gap-1 p-1">
          {selectedCategoryTags.map((selectedTag) => (
            <li key={selectedTag.id}>
              <button
                title="Remove category"
                className="flex items-center gap-0.5 rounded-md bg-cyan-200/50 p-1 text-cyan-800 shadow-sm transition hover:bg-red-100 hover:text-red-800 focus:bg-red-100 focus:text-red-800"
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
              className="w-32 bg-transparent p-1"
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
                    className="text-slate-500 transition hover:text-cyan-500 focus:text-cyan-500"
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
      {error && <p className="text-red-400">{error.message}</p>}
    </div>
  );
}
