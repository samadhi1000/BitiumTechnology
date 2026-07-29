import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Unique id for cart item (could be variant_id or a generated ID for custom sheet)
  type: 'apparel' | 'dtf_sheet';
  product: {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
  };
  variant?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    attributes: Record<string, any>;
  };
  customSheet?: {
    id?: string;
    width: number;
    height: number;
    canvasJson: any;
    previewUrl?: string;
    price: number;
  };
  quantity: number;
  price: number; // resolved unit price
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items;
        // Generate a random id if not provided (especially for custom sheets to allow duplicates with different canvas layouts)
        const itemId = newItem.id || (newItem.type === 'dtf_sheet' ? crypto.randomUUID() : newItem.variant?.id || crypto.randomUUID());

        // Check if item already exists (only for standard variants, custom sheets are always unique)
        if (newItem.type === 'apparel') {
          const existingItemIndex = items.findIndex(
            (item) => item.type === 'apparel' && item.variant?.id === newItem.variant?.id
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            set({ items: updatedItems });
            return;
          }
        }

        set({
          items: [...items, { ...newItem, id: itemId } as CartItem],
        });
      },
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'printgrid-cart-storage',
    }
  )
);
