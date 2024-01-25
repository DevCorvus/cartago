import { create } from 'zustand';

interface State {
  productIds: string[];
  setProductIds(productIds: string[]): void;
  addProductId(productId: string): void;
  removeProductId(productId: string): void;
}

export const useCartStore = create<State>((set) => ({
  productIds: [],
  setProductIds(productIds) {
    set({ productIds });
  },
  addProductId(productId) {
    set((prev) => ({ productIds: [...prev.productIds, productId] }));
  },
  removeProductId(productId) {
    set((prev) => ({
      productIds: prev.productIds.filter((id) => id !== productId),
    }));
  },
}));
