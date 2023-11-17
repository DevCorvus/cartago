import { create } from 'zustand';

interface State {
  creatingCategory: boolean;
  title: string;
  setCreatingCategory(newState: boolean): void;
  setCategoryTitle(newTitle: string): void;
}

export const useCategoryFormStore = create<State>((set) => ({
  creatingCategory: false,
  title: '',
  setCreatingCategory(creatingCategory) {
    set({ creatingCategory });
  },
  setCategoryTitle(title) {
    set({ title });
  },
}));
