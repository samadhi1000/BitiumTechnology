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
  customization?: {
    previewUrl?: string; // High-res canvas/mockup snapshot Data URL
    backPreviewUrl?: string; // Optional back view snapshot
    customText?: string;
    designLayersCount?: number;
    printStyle?: string;
    originalFileNames?: string[];
  };
  quantity: number;
  price: number; // resolved unit price
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      addItem: (newItem) => {
        const items = get().items;
        // Generate a random id if not provided (especially for custom sheets to allow duplicates with different canvas layouts)
        const itemId = newItem.id || (newItem.type === 'dtf_sheet' ? crypto.randomUUID() : newItem.variant?.id || crypto.randomUUID());

        // Check if item already exists (only for standard variants, custom sheets are always unique)
        if (newItem.type === 'apparel' && !newItem.customization) {
          const existingItemIndex = items.findIndex(
            (item) => item.type === 'apparel' && item.variant?.id === newItem.variant?.id && !item.customization
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
      name: 'bitium-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
