import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: 'apparel' | 'dtf_sheet' | 'accessory';
  sub_category?: string; // 'anime', '12x12', '12x23', '23x60', 'cute-girls', 'black', 'white'
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

const MOCK_PRODUCTS: Product[] = [
  // 1. Core builder
  {
    id: 'b2a8d3e9-4e7a-4e2b-b6c8-2f1a3b4c5d6e',
    name: 'Custom DTF Sheet Builder',
    description: 'Design and arrange your logos, artwork, or custom graphics onto our virtual DTF transfer sheet. Size is customizable up to 12" x 23" or 12" x 48".',
    price: 1500.00,
    image_url: '/images/products/dtf-sheet.jpg',
    category: 'dtf_sheet',
    sub_category: '12x23',
    is_active: true,
    variants: [
      { id: 'var-dtf-1223', product_id: 'b2a8d3e9-4e7a-4e2b-b6c8-2f1a3b4c5d6e', name: '12" x 23" Sheet', sku: 'DTF-1223', price_override: null, stock_quantity: 9999, attributes: { width: 12, height: 23 } },
      { id: 'var-dtf-1248', product_id: 'b2a8d3e9-4e7a-4e2b-b6c8-2f1a3b4c5d6e', name: '12" x 48" Sheet', sku: 'DTF-1248', price_override: 2800.00, stock_quantity: 9999, attributes: { width: 12, height: 48 } }
    ]
  },
  // 2. T-Shirts Collection - Anime
  {
    id: 'anime-douma-tee',
    name: 'TeeDesign Premium Oversize Tee | Demon Slayer | Douma ANM010',
    description: 'Premium heavyweight cotton oversized t-shirt featuring highly detailed Demon Slayer Douma character graphics. 240GSM cotton fabric designed for durability and comfort.',
    price: 2199.00,
    original_price: 3000.00,
    image_url: '/images/products/demon-slayer-tee.jpg',
    category: 'apparel',
    sub_category: 'anime',
    is_active: true,
    variants: [
      { id: 'var-douma-m-blk', product_id: 'anime-douma-tee', name: 'M / Black', sku: 'TS-DM-M', price_override: null, stock_quantity: 50, attributes: { size: 'M', color: 'Black' } },
      { id: 'var-douma-l-blk', product_id: 'anime-douma-tee', name: 'L / Black', sku: 'TS-DM-L', price_override: null, stock_quantity: 60, attributes: { size: 'L', color: 'Black' } },
      { id: 'var-douma-xl-blk', product_id: 'anime-douma-tee', name: 'XL / Black', sku: 'TS-DM-XL', price_override: null, stock_quantity: 30, attributes: { size: 'XL', color: 'Black' } }
    ]
  },
  {
    id: 'anime-shinobu-tee',
    name: 'TeeDesign Premium Oversize Tee | Demon Slayer | Shinobu Kochō ANM009',
    description: 'Premium heavyweight cotton oversized t-shirt featuring Demon Slayer Shinobu Kochō purple butterfly insect hashira graphics.',
    price: 2199.00,
    original_price: 3000.00,
    image_url: '/images/products/demon-slayer-tee.jpg', // sharing layout
    category: 'apparel',
    sub_category: 'anime',
    is_active: true,
    variants: [
      { id: 'var-shin-m-blk', product_id: 'anime-shinobu-tee', name: 'M / Black', sku: 'TS-SN-M', price_override: null, stock_quantity: 40, attributes: { size: 'M', color: 'Black' } },
      { id: 'var-shin-l-blk', product_id: 'anime-shinobu-tee', name: 'L / Black', sku: 'TS-SN-L', price_override: null, stock_quantity: 45, attributes: { size: 'L', color: 'Black' } }
    ]
  },
  // 3. T-Shirts Collection - Blanks
  {
    id: 'c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f',
    name: 'Premium Heavyweight Tee (Blank)',
    description: 'A boxy, modern streetwear fit. Made of ultra-soft 100% combed cotton, 240GSM heavyweight fabric. Built to withstand washes and hold DTF transfer designs perfectly.',
    price: 2200.00,
    image_url: '/images/products/heavyweight-tee.jpg',
    category: 'apparel',
    sub_category: 'black',
    is_active: true,
    variants: [
      { id: 'var-tee-m-blk', product_id: 'c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', name: 'M / Black', sku: 'TS-M-BLK', price_override: null, stock_quantity: 150, attributes: { size: 'M', color: 'Black' } },
      { id: 'var-tee-l-blk', product_id: 'c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', name: 'L / Black', sku: 'TS-L-BLK', price_override: null, stock_quantity: 120, attributes: { size: 'L', color: 'Black' } },
      { id: 'var-tee-xl-blk', product_id: 'c3b9e4f0-5f8b-5f3c-c7d9-3a2b4c5d6e7f', name: 'XL / Black', sku: 'TS-XL-BLK', price_override: 2400.00, stock_quantity: 80, attributes: { size: 'XL', color: 'Black' } }
    ]
  },
  // 4. DTF Print Sheets - 12x12 Sheets
  {
    id: 'dtf-1212-labubu',
    name: 'Labubu DTF Print Sheet 12×12 A013 002',
    description: 'Pre-designed Labubu art style 12x12 inch transfer sheet. Contains multiple ready-to-use stickers of Labubu character configurations, ideal for shirts, bags, or hoodies.',
    price: 380.00,
    original_price: 500.00,
    image_url: '/images/products/labubu-dtf.jpg',
    category: 'dtf_sheet',
    sub_category: '12x12',
    is_active: true,
    variants: [
      { id: 'var-lab-1212', product_id: 'dtf-1212-labubu', name: '12" x 12" Sheet', sku: 'LB-1212', price_override: null, stock_quantity: 500, attributes: { width: 12, height: 12 } }
    ]
  },
  {
    id: 'dtf-1212-stitch',
    name: 'Stitch DTF Print Sheet 12×12 A001 002',
    description: 'Pre-designed Stitch graphic 12x12 inch transfer sheet containing multiple high-definition Stitch sticker assets.',
    price: 380.00,
    original_price: 500.00,
    image_url: '/images/products/stitch-dtf.jpg',
    category: 'dtf_sheet',
    sub_category: '12x12',
    is_active: true,
    variants: [
      { id: 'var-st-1212', product_id: 'dtf-1212-stitch', name: '12" x 12" Sheet', sku: 'ST-1212', price_override: null, stock_quantity: 450, attributes: { width: 12, height: 12 } }
    ]
  },
  {
    id: 'dtf-1212-cute-girls',
    name: 'Cute Girls DTF Print Sheet 12×12 A002 001',
    description: 'AESTHETIC anime style Cute Girls 12x12 inch transfer stickers pack. Easy application instructions included.',
    price: 380.00,
    original_price: 500.00,
    image_url: '/images/products/labubu-dtf.jpg', // sharing layout
    category: 'dtf_sheet',
    sub_category: 'cute-girls',
    is_active: true,
    variants: [
      { id: 'var-cg-1212', product_id: 'dtf-1212-cute-girls', name: '12" x 12" Sheet', sku: 'CG-1212', price_override: null, stock_quantity: 600, attributes: { width: 12, height: 12 } }
    ]
  },
  // 5. DTF Print Sheets - 5 Feet Sheets
  {
    id: 'dtf-5ft-bear-street',
    name: 'Bear Street DTF Print Sheet 23×60 (5 feet) A4 5FT Bear Street 002',
    description: 'Massive 5 feet (23" x 60") DTF transfer roll sheet. Loaded with streetwear theme teddy bear graphics, hip-hop typography, and overlays. Best pricing for bulk apparel decoration.',
    price: 3000.00,
    original_price: 4250.00,
    image_url: '/images/products/bear-street-dtf.jpg',
    category: 'dtf_sheet',
    sub_category: '23x60',
    is_active: true,
    variants: [
      { id: 'var-bs-2360', product_id: 'dtf-5ft-bear-street', name: '23" x 60" Roll (5ft)', sku: 'BS-2360', price_override: null, stock_quantity: 200, attributes: { width: 23, height: 60 } }
    ]
  },
  // 6. Blanks Hoodie
  {
    id: 'd4c0f5a1-6g9c-6g4d-d8e0-4b3c5d6e7f8g',
    name: 'Premium Streetwear Hoodie (Blank)',
    description: 'Unisex luxury hoodie, 400GSM heavy fleece fabric, double-lined hood, no drawstrings for a clean contemporary look.',
    price: 4500.00,
    image_url: '/images/products/streetwear-hoodie.jpg',
    category: 'apparel',
    sub_category: 'black',
    is_active: true,
    variants: [
      { id: 'var-hd-m-gry', product_id: 'd4c0f5a1-6g9c-6g4d-d8e0-4b3c5d6e7f8g', name: 'M / Charcoal', sku: 'HD-M-GRY', price_override: null, stock_quantity: 80, attributes: { size: 'M', color: 'Charcoal' } },
      { id: 'var-hd-l-gry', product_id: 'd4c0f5a1-6g9c-6g4d-d8e0-4b3c5d6e7f8g', name: 'L / Charcoal', sku: 'HD-L-GRY', price_override: null, stock_quantity: 75, attributes: { size: 'L', color: 'Charcoal' } }
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
