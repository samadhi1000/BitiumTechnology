import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────────
// Print & Customization Types
// ─────────────────────────────────────────────────────────────────────────────

/** Visual finish applied during printing */
export type PrintStyle = 'flat' | 'embossed' | 'vintage' | 'DTF';

/** Standard garment size options */
export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';

/** Which face of the garment carries the design */
export type PrintPosition = 'front' | 'back' | 'both';

/** Which part of the site originated this cart item */
export type CartItemSource =
  | 'mockup_studio'   // 3D Mockup Customizer (/3d-customizer)
  | 'canvas_builder'  // DTF Sheet Canvas Builder (/canvas)
  | 'product_page'    // Standard product detail page (/products/[id])
  | 'search';         // Hero search quick-add

export interface GarmentColor {
  name: string;
  hex: string;
}

/**
 * Rich metadata attached to every custom-print cart item.
 *
 * IMPORTANT: previewUrl fields MUST be Cloudinary CDN URLs (https://res.cloudinary.com/…)
 * NEVER raw base64 Data URLs. Raw base64 blobs can be 1–5 MB per item and will
 * overflow localStorage (5 MB hard cap). Always upload via lib/cloudinary.ts first.
 */
export interface CustomPrintMetadata {
  // ── Preview URLs (Cloudinary CDN — permanent, fast, tiny string) ──────────
  frontPreviewCloudinaryUrl?: string;
  backPreviewCloudinaryUrl?: string;

  // ── Apparel configuration ─────────────────────────────────────────────────
  garmentColor?: GarmentColor;
  garmentSize?: GarmentSize;
  printStyle?: PrintStyle;
  printPosition?: PrintPosition;

  // ── DTF / Canvas sheet configuration ─────────────────────────────────────
  sheetWidth?: number;   // inches
  sheetHeight?: number;  // inches
  /** Fabric.js serialized JSON — allows re-editing from the cart */
  canvasJson?: Record<string, unknown>;

  // ── Design metadata ───────────────────────────────────────────────────────
  designLayersCount?: number;
  originalFileNames?: string[];
  customText?: string;

  // ── Provenance ────────────────────────────────────────────────────────────
  source: CartItemSource;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cart Item Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CartItemProduct {
  id: string;
  name: string;
  description?: string;
  /** Use a Cloudinary URL or Unsplash URL here — never a raw base64 blob */
  image_url?: string;
}

export interface CartItemVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  attributes: Record<string, unknown>;
}

export interface CartItemCustomSheet {
  width: number;   // inches
  height: number;  // inches
  price: number;
}

export interface CartItem {
  /** UUID — uniquely identifies this cart line */
  id: string;
  /**
   * Determines merge behaviour:
   * - 'apparel' standard (no customization) variants merge on re-add
   * - 'apparel' with customization + 'dtf_sheet' are always unique lines
   * - 'standard' always merges by variant.id
   */
  type: 'apparel' | 'dtf_sheet' | 'standard';
  product: CartItemProduct;
  variant?: CartItemVariant;
  customSheet?: CartItemCustomSheet;
  customization?: CustomPrintMetadata;
  quantity: number;
  /** Resolved unit price in LKR */
  price: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Checkout Details
// ─────────────────────────────────────────────────────────────────────────────

/**
 * COD checkout details collected in the cart drawer.
 * Persisted to localStorage so customers don't retype after closing the drawer.
 */
export interface CheckoutDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

const DEFAULT_CHECKOUT_DETAILS: CheckoutDetails = {
  name: '',
  phone: '',
  address: '',
  city: '',
  notes: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// Store Interface
// ─────────────────────────────────────────────────────────────────────────────

interface CartState {
  // ── Data ──────────────────────────────────────────────────────────────────
  items: CartItem[];
  checkoutDetails: CheckoutDetails;

  // ── UI (not persisted) ────────────────────────────────────────────────────
  isCartOpen: boolean;

  // ── Cart Item Actions ─────────────────────────────────────────────────────
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // ── Computed Selectors ────────────────────────────────────────────────────
  getTotalItems: () => number;
  getSubtotal: () => number;

  // ── Drawer Actions ────────────────────────────────────────────────────────
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // ── Checkout Detail Actions ───────────────────────────────────────────────
  /** Partial update — only provided keys are changed */
  setCheckoutDetails: (details: Partial<CheckoutDetails>) => void;
  /** Resets all checkout fields to empty strings (call after successful WhatsApp order) */
  clearCheckoutDetails: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Store Implementation
// ─────────────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      items: [],
      checkoutDetails: DEFAULT_CHECKOUT_DETAILS,
      isCartOpen: false,

      // ── Cart Item Actions ──────────────────────────────────────────────────
      addItem: (newItem) => {
        const items = get().items;

        const itemId =
          newItem.id ??
          (newItem.type === 'dtf_sheet'
            ? crypto.randomUUID()
            : newItem.variant?.id ?? crypto.randomUUID());

        // Standard apparel without customization → increment quantity if duplicate variant
        if (newItem.type === 'apparel' && !newItem.customization) {
          const existingIndex = items.findIndex(
            (item) =>
              item.type === 'apparel' &&
              item.variant?.id === newItem.variant?.id &&
              !item.customization
          );
          if (existingIndex > -1) {
            const updatedItems = [...items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + newItem.quantity,
            };
            set({ items: updatedItems });
            return;
          }
        }

        // Custom print items and DTF sheets always create a unique cart line
        set({ items: [...items, { ...newItem, id: itemId } as CartItem] });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
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

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      // ── Drawer Actions ─────────────────────────────────────────────────────
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      // ── Checkout Detail Actions ────────────────────────────────────────────
      setCheckoutDetails: (details) =>
        set((state) => ({
          checkoutDetails: { ...state.checkoutDetails, ...details },
        })),

      clearCheckoutDetails: () =>
        set({ checkoutDetails: DEFAULT_CHECKOUT_DETAILS }),
    }),
    {
      name: 'bitium-cart-storage',
      /**
       * Persist items and checkout details only.
       * isCartOpen is intentionally excluded — drawer always starts closed
       * to prevent a flash of an open drawer on page load/hydration.
       */
      partialize: (state) => ({
        items: state.items,
        checkoutDetails: state.checkoutDetails,
      }),
    }
  )
);

