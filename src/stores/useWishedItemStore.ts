import { create } from 'zustand';

interface State {
  productIds: string[];
  setWishedItems(productIds: string[]): void;
  addWishedItem(productId: string): void;
  removeWishedItem(productId: string): void;
}

export const useWishedItemStore = create<State>((set) => ({
  productIds: [],
  setWishedItems(productIds) {
    set({ productIds });
  },
  addWishedItem(productId) {
    set((prev) => ({ productIds: [...prev.productIds, productId] }));
  },
  removeWishedItem(productId) {
    set((prev) => ({
      productIds: prev.productIds.filter((id) => id !== productId),
    }));
  },
}));
