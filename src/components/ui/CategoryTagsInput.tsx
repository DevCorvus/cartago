import { CategoryTagDto } from '@/shared/dtos/category.dto';
import {
  Dispatch,
  SetStateAction,
  useState,
  KeyboardEvent,
  useEffect,
} from 'react';
import { HiXMark } from 'react-icons/hi2';
import AddCategoryFormModal from './AddCategoryFormModal';
import { useCategoryFormStore } from '@/stores/useCategoryFormStore';

interface Props {
  defaultCategoryTags: CategoryTagDto[];
  setCategoryIds: Dispatch<SetStateAction<number[]>>;
}

export default function CategoryTagsInput({
  defaultCategoryTags,
  setCategoryIds,
}: Props) {
  const [input, setInput] = useState<string>('');

  const [categoryTags, setCategoryTags] =
    useState<CategoryTagDto[]>(defaultCategoryTags);

  const [selectedCategoryTags, setSelectedCategoryTags] = useState<
    CategoryTagDto[]
  >([]);

  const [autocompleteCategoryTags, setAutocompleteCategoryTags] = useState<
    CategoryTagDto[]
  >([]);

  const { creatingCategory, setCreatingCategory, setCategoryTitle } =
    useCategoryFormStore(
      ({ creatingCategory, setCreatingCategory, setCategoryTitle }) => ({
        creatingCategory,
        setCreatingCategory,
        setCategoryTitle,
      }),
    );

  useEffect(() => {
    setCategoryIds(categoryTags.map((tag) => tag.id));
  }, [categoryTags, setCategoryIds]);

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
          } else {
            setCreatingCategory(true);
            setCategoryTitle(input);
          }
        }
      } else if (e.key == 'Backspace' && !value) {
        setSelectedCategoryTags((prev) =>
          selectedCategoryTags.filter((_, i) => i !== prev.length - 1),
        );
      }
    }
  };

  const handleNewCategory = (data: CategoryTagDto) => {
    setCategoryTags((prev) => [...prev, data]);
    addSelectedCategoryTag(data);
  };

  return (
    <div className="flex flex-col gap-3 w-72 relative">
      <label htmlFor="categories">Categories</label>
      {autocompleteCategoryTags.length > 0 && (
        <ul>
          {autocompleteCategoryTags.map((tag) => (
            <li key={tag.id}>
              <button onClick={() => addSelectedCategoryTag(tag)}>
                {tag.title}
              </button>
            </li>
          ))}
        </ul>
      )}
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
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </li>
      </ul>
      {creatingCategory && (
        <AddCategoryFormModal handleNewCategory={handleNewCategory} />
      )}
    </div>
  );
}
