import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { create } from 'zustand';

interface State {
  input: string;
  categoryTags: CategoryTagDto[];
  setInput(value: string): void;
  setCategoryTags(newCategoryTags: CategoryTagDto[]): void;
}

export const useSearchFormStore = create<State>((set) => ({
  input: '',
  categoryTags: [],
  setInput(value) {
    set({ input: value });
  },
  setCategoryTags(newCategoryTags) {
    set({ categoryTags: newCategoryTags });
  },
}));
