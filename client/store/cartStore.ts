'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items;
        const existing = items.find((i) => i.product === newItem.product);
        if (existing) {
          set({
            items: items.map((i) =>
              i.product === newItem.product ? { ...i, qty: i.qty + newItem.qty } : i
            ),
          });
        } else {
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product !== productId) }),

      updateQty: (productId, qty) => {
        if (qty < 1) return;
        set({
          items: get().items.map((i) =>
            i.product === productId ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'bm-cart' }
  )
);
