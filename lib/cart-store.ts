/**
 * Shopping cart state management using Zustand
 * Handles cart operations: add, remove, update quantity
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Add item to cart or update quantity if already exists
       */
      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.variant?.id === variant?.id
          );

          if (existingItemIndex > -1) {
            // Update quantity if item already exists
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          } else {
            // Add new item
            return {
              items: [...state.items, { product, variant, quantity }],
            };
          }
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId && item.variant?.id === variantId)
          ),
        }));
      },

      /**
       * Update item quantity
       */
      updateQuantity: (productId, quantity, variantId) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  !(item.product.id === productId && item.variant?.id === variantId)
              ),
            };
          }

          const newItems = state.items.map((item) => {
            if (
              item.product.id === productId &&
              item.variant?.id === variantId
            ) {
              return { ...item, quantity };
            }
            return item;
          });

          return { items: newItems };
        });
      },

      /**
       * Clear all items from cart
       */
      clearCart: () => {
        set({ items: [] });
      },

      /**
       * Calculate total cart value
       */
      getTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => {
          const price = item.variant?.price || item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      /**
       * Get total number of items in cart
       */
      getItemCount: () => {
        const items = get().items;
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
