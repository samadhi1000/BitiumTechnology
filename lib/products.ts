import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'apparel' | 'dtf_sheet' | 'accessory';
  is_active: boolean;
  variants?: Variant[];
}

export interface Variant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price_override: number | null;
  stock_quantity: number;
  attributes: Record<string, any>;
}

// Fallback high-quality local mock data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'b2a8d3e9-4e7a-4e2b-b6c8-2f1a3b4c5d6e',
    name: 'Custom DTF Sheet Builder',
    description: 'Design and arrange your logos, artwork, or custom graphics onto our virtual DTF transfer sheet. We print using high-density inks, premium powder adhesive, and hot-peel films. Size is customizable up to 12" x 23" or 12" x 48".',
    price: 1500.00,
    image_url: '/images/products/dtf-sheet.jpg',
    category: 'dtf_sheet',
    is_active: true,
    variants: [
      {
        id: 'var-dtf-1223',
        product_id: 'b2a8d3e9-4e7a-4e2b-b6c8-2f1a3b4c5d6e',
        name: '12" x 23" Sheet',
        sku: 'DTF-1223',
        price_override: null,
        stock_quantity: 9999,
        attributes: { width: 12, height: 23 }
      },
      {
        id: 'var-dtf-1248',
        product_id: 'b2a8d3e9-4e7a-4e2b-b6c8-2f1a3b4c5d6e',
        name: '12" x 48" Sheet',
        sku: 'DTF-1248',
        price_override: 2800.00,
        stock_quantity: 9999,
        attributes: { width: 12, height: 48 }
      }
    ]
  },
  {
    id: 'c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f',
    name: 'Premium Heavyweight Tee',
    description: 'A boxy, modern streetwear fit. Made of ultra-soft 100% combed cotton, 240GSM heavyweight fabric. Built to withstand washes and hold DTF transfer designs perfectly.',
    price: 2200.00,
    image_url: '/images/products/heavyweight-tee.jpg',
    category: 'apparel',
    is_active: true,
    variants: [
      { id: 'var-tee-m-blk', product_id: 'c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', name: 'M / Black', sku: 'TS-M-BLK', price_override: null, stock_quantity: 150, attributes: { size: 'M', color: 'Black' } },
      { id: 'var-tee-l-blk', product_id: 'c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', name: 'L / Black', sku: 'TS-L-BLK', price_override: null, stock_quantity: 120, attributes: { size: 'L', color: 'Black' } },
      { id: 'var-tee-xl-blk', product_id: 'c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', name: 'XL / Black', sku: 'TS-XL-BLK', price_override: 2400.00, stock_quantity: 80, attributes: { size: 'XL', color: 'Black' } },
      { id: 'var-tee-m-wht', product_id: 'c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', name: 'M / White', sku: 'TS-M-WHT', price_override: null, stock_quantity: 100, attributes: { size: 'M', color: 'White' } },
      { id: 'var-tee-l-wht', product_id: 'c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', name: 'L / White', sku: 'TS-L-WHT', price_override: null, stock_quantity: 90, attributes: { size: 'L', color: 'White' } }
    ]
  },
  {
    id: 'd4c0f5a1-6g9c-6g4d-d8e0-4b3c5d6e7f8g',
    name: 'Premium Streetwear Hoodie',
    description: 'Unisex luxury hoodie, 400GSM heavy fleece fabric, double-lined hood, no drawstrings for a clean contemporary look. Excellent canvas for premium DTF center chests or sleeves.',
    price: 4500.00,
    image_url: '/images/products/streetwear-hoodie.jpg',
    category: 'apparel',
    is_active: true,
    variants: [
      { id: 'var-hd-m-gry', product_id: 'd4c0f5a1-6g9c-6g4d-d8e0-4b3c5d6e7f8g', name: 'M / Charcoal', sku: 'HD-M-GRY', price_override: null, stock_quantity: 80, attributes: { size: 'M', color: 'Charcoal' } },
      { id: 'var-hd-l-gry', product_id: 'd4c0f5a1-6g9c-6g4d-d8e0-4b3c5d6e7f8g', name: 'L / Charcoal', sku: 'HD-L-GRY', price_override: null, stock_quantity: 75, attributes: { size: 'L', color: 'Charcoal' } },
      { id: 'var-hd-xl-gry', product_id: 'd4c0f5a1-6g9c-6g4d-d8e0-4b3c5d6e7f8g', name: 'XL / Charcoal', sku: 'HD-XL-GRY', price_override: 4800.00, stock_quantity: 50, attributes: { size: 'XL', color: 'Charcoal' } }
    ]
  }
];

export async function getProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*)
      `)
      .eq('is_active', true);

    if (error || !products || products.length === 0) {
      console.warn('Supabase fetch failed or empty; using local product catalog.');
      return MOCK_PRODUCTS;
    }

    return products as Product[];
  } catch (err) {
    console.error('Error fetching products from DB, returning mocks:', err);
    return MOCK_PRODUCTS;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*)
      `)
      .eq('id', id)
      .single();

    if (error || !product) {
      const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id);
      return mockProduct || null;
    }

    return product as Product;
  } catch (err) {
    console.error('Error fetching product from DB, returning mock:', err);
    const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id);
    return mockProduct || null;
  }
}
