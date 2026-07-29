import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: 'apparel' | 'dtf_sheet' | 'accessory';
  sub_category?: string; // 'anime', '12x12', '12x23', '23x60', 'saree-border', 'black', 'white'
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

// Generate the full catalog of 63 items (9 products per 7 subcategories)
const MOCK_PRODUCTS: Product[] = [];

// 1. DTF Sheets - 12x12 (9 products)
const titles1212 = [
  'Labubu DTF Print Sheet 12×12 A013 002',
  'Stitch DTF Print Sheet 12×12 A001 002',
  'Cute Girls DTF Print Sheet 12×12 A002 001',
  'Anime Chibi DTF Print Sheet 12×12 A003 004',
  'Retro Gaming DTF Print Sheet 12×12 A004 009',
  'Vintage Florals DTF Print Sheet 12×12 A005 012',
  'Streetwear Icons DTF Print Sheet 12×12 A006 015',
  'Cyberpunk Neon DTF Print Sheet 12×12 A007 018',
  'Cute Animals DTF Print Sheet 12×12 A008 021'
];
titles1212.forEach((title, idx) => {
  const code = `DTF-1212-00${idx + 1}`;
  MOCK_PRODUCTS.push({
    id: `dtf-1212-${idx + 1}`,
    name: title,
    description: `High-definition pre-designed 12x12 inch transfer sheet. Ideal for t-shirts, canvas bags, and hoodies. Backed with an opaque white ink layer for dark colors.`,
    price: 380.00,
    original_price: 500.00,
    image_url: idx % 2 === 0 ? '/images/products/labubu-dtf.jpg' : '/images/products/stitch-dtf.jpg',
    category: 'dtf_sheet',
    sub_category: '12x12',
    is_active: true,
    variants: [
      { id: `var-1212-${idx + 1}`, product_id: `dtf-1212-${idx + 1}`, name: '12" x 12" Sheet', sku: `${code}-VAR`, price_override: null, stock_quantity: 400 + idx * 10, attributes: { width: 12, height: 12 } }
    ]
  });
});

// 2. DTF Sheets - 12x23 (9 products)
const titles1223 = [
  'Custom Layout DTF Print Sheet 12×23 CL001',
  'Streetwear Brand Pack DTF Print Sheet 12×23 SP002',
  'Band & Music Graphics DTF Print Sheet 12×23 BP003',
  'Motorsports & Racing Badges DTF Print Sheet 12×23 MP004',
  'Meme Culture Pack DTF Print Sheet 12×23 MC005',
  'Abstract Geometry DTF Print Sheet 12×23 AG006',
  'Typographical Quotes DTF Print Sheet 12×23 TQ007',
  'Urban Graffiti Tags DTF Print Sheet 12×23 UG008',
  'Skateboard Decals Set DTF Print Sheet 12×23 SD009'
];
titles1223.forEach((title, idx) => {
  const code = `DTF-1223-00${idx + 1}`;
  MOCK_PRODUCTS.push({
    id: `dtf-1223-${idx + 1}`,
    name: title,
    description: `Premium 12x23 inch DTF transfer roll layout. Add your custom designs or use our curated graphic assets. High elastic-stretch and excellent washability.`,
    price: 1500.00,
    image_url: '/images/products/dtf-sheet.jpg',
    category: 'dtf_sheet',
    sub_category: '12x23',
    is_active: true,
    variants: [
      { id: `var-1223-${idx + 1}`, product_id: `dtf-1223-${idx + 1}`, name: '12" x 23" Sheet', sku: `${code}-VAR`, price_override: null, stock_quantity: 9999, attributes: { width: 12, height: 23 } }
    ]
  });
});

// 3. DTF Sheets - 23x60 / 5 Feet (9 products)
const titles2360 = [
  'Bear Street DTF Print Sheet 23×60 (5 feet) A4 5FT Bear Street 002',
  'Cute Girls DTF Print Sheet 23×60 (5 feet) 5FT Girls 001',
  'Flowers & Butterfly DTF Print Sheet 23×60 (5 feet) 5FT Flowers 001',
  'Streetwear Boys Pack DTF Print Sheet 23×60 (5 feet) 5FT Boys',
  'Sweet Love DTF Print Sheet 23×60 (5 feet) 5FT Love 001',
  'Cherry Red Blossom DTF Print Sheet 23×60 (5 feet) 5FT Cherry 001',
  'Cyberpunk Cityscape DTF Print Sheet 23×60 (5 feet) 5FT Cyber 002',
  'Big Hero Cartoon Set DTF Print Sheet 23×60 (5 feet) 5FT Hero 001',
  'Vintage Japanese Art DTF Print Sheet 23×60 (5 feet) 5FT Japan 001'
];
titles2360.forEach((title, idx) => {
  const code = `DTF-2360-00${idx + 1}`;
  MOCK_PRODUCTS.push({
    id: `dtf-2360-${idx + 1}`,
    name: title,
    description: `Huge 5 feet long (23x60 inches) DTF printing sheet. Filled with high-definition graphic designs ready to transfer. The most economical option for bulk orders.`,
    price: 3000.00,
    original_price: 4250.00,
    image_url: '/images/products/bear-street-dtf.jpg',
    category: 'dtf_sheet',
    sub_category: '23x60',
    is_active: true,
    variants: [
      { id: `var-2360-${idx + 1}`, product_id: `dtf-2360-${idx + 1}`, name: '23" x 60" Roll', sku: `${code}-VAR`, price_override: null, stock_quantity: 200 + idx * 5, attributes: { width: 23, height: 60 } }
    ]
  });
});

// 4. DTF Sheets - Saree Border Designs (9 products)
const titlesSaree = [
  'Royal Gold Paisley Saree Border Design SB001',
  'Traditional Copper Peacock Saree Border Design SB002',
  'Dazzling Silver Vine Saree Border Design SB003',
  'Rose Gold Mandala Lace Saree Border Design SB004',
  'Classic Temple Border Saree Border Design SB005',
  'Elegant Emerald Flower Saree Border Design SB006',
  'Geometric Chevron Border Saree Border Design SB007',
  'Royal Elephant & Floral Saree Border Design SB008',
  'Zari Traditional Lace Saree Border Design SB009'
];
titlesSaree.forEach((title, idx) => {
  const code = `DTF-SAREE-00${idx + 1}`;
  MOCK_PRODUCTS.push({
    id: `dtf-saree-${idx + 1}`,
    name: title,
    description: `Beautiful traditional Sri Lankan and Indian border prints designed for sarees and shawls. Prints feature bright metallic gradients and high fine-line definition.`,
    price: 650.00,
    original_price: 850.00,
    image_url: '/images/products/saree-border-dtf.jpg',
    category: 'dtf_sheet',
    sub_category: 'saree-border',
    is_active: true,
    variants: [
      { id: `var-saree-${idx + 1}`, product_id: `dtf-saree-${idx + 1}`, name: 'Saree Border Sheet', sku: `${code}-VAR`, price_override: null, stock_quantity: 150 + idx * 8, attributes: { width: 12, height: 12 } }
    ]
  });
});

// 5. Apparel - Anime Oversized Tees (9 products)
const titlesAnime = [
  'Demon Slayer | Douma ANM010 Premium Oversize Tee',
  'Demon Slayer | Shinobu Kochō ANM009 Premium Oversize Tee',
  'Demon Slayer | Tanjiro Kamado ANM007 Premium Oversize Tee',
  'Demon Slayer | Inosuke Hashibira ANM008 Premium Oversize Tee',
  'Demon Slayer | Muichiro Tokito ANM006 Premium Oversize Tee',
  'Demon Slayer | Nezuko Kamado ANM011 Premium Oversize Tee',
  'Jujutsu Kaisen | Gojo Satoru JJK001 Premium Oversize Tee',
  'Jujutsu Kaisen | Ryomen Sukuna JJK002 Premium Oversize Tee',
  'Attack on Titan | Eren Yeager AOT001 Premium Oversize Tee'
];
titlesAnime.forEach((title, idx) => {
  const code = `TS-ANM-00${idx + 1}`;
  MOCK_PRODUCTS.push({
    id: `apparel-anime-${idx + 1}`,
    name: `TeeDesign Premium Oversize Tee | ${title}`,
    description: `Oversized streetwear apparel printed with high-quality DTF transfers. Made of 100% combed cotton, 240GSM heavyweight fabric. Built for comfort and daily wear.`,
    price: 2199.00,
    original_price: 3000.00,
    image_url: '/images/products/demon-slayer-tee.jpg',
    category: 'apparel',
    sub_category: 'anime',
    is_active: true,
    variants: [
      { id: `var-anime-${idx + 1}-m`, product_id: `apparel-anime-${idx + 1}`, name: 'M / Black', sku: `${code}-M`, price_override: null, stock_quantity: 80, attributes: { size: 'M', color: 'Black' } },
      { id: `var-anime-${idx + 1}-l`, product_id: `apparel-anime-${idx + 1}`, name: 'L / Black', sku: `${code}-L`, price_override: null, stock_quantity: 75, attributes: { size: 'L', color: 'Black' } },
      { id: `var-anime-${idx + 1}-xl`, product_id: `apparel-anime-${idx + 1}`, name: 'XL / Black', sku: `${code}-XL`, price_override: 2399.00, stock_quantity: 40, attributes: { size: 'XL', color: 'Black' } }
    ]
  });
});

// 6. Apparel - Black Blanks (9 products)
const titlesBlack = [
  'Premium Crewneck Heavyweight Black Tee',
  'Streetwear V-Neck Heavyweight Black Tee',
  'Loose-Fit Oversized Combed Black Tee',
  'Classic Combed Cotton Black Tee',
  'Luxury Drop-Shoulder Streetwear Black Tee',
  'Acid-Wash Premium Heavyweight Black Tee',
  'Ribbed Collar Streetwear Black Tee',
  'Organic Sustainable Heavy Cotton Black Tee',
  'Streetwear Heavyweight Black Long-Sleeve'
];
titlesBlack.forEach((title, idx) => {
  const code = `TS-BLK-00${idx + 1}`;
  MOCK_PRODUCTS.push({
    id: `apparel-black-${idx + 1}`,
    name: title,
    description: `Blank base apparel perfect for custom DTF printing. Heavyweight 240GSM cotton fabric designed for durability and structural streetwear fit.`,
    price: 2200.00,
    original_price: 2800.00,
    image_url: idx % 2 === 0 ? '/images/products/heavyweight-tee.jpg' : '/images/products/streetwear-hoodie.jpg',
    category: 'apparel',
    sub_category: 'black',
    is_active: true,
    variants: [
      { id: `var-black-${idx + 1}-m`, product_id: `apparel-black-${idx + 1}`, name: 'M / Black', sku: `${code}-M`, price_override: null, stock_quantity: 120, attributes: { size: 'M', color: 'Black' } },
      { id: `var-black-${idx + 1}-l`, product_id: `apparel-black-${idx + 1}`, name: 'L / Black', sku: `${code}-L`, price_override: null, stock_quantity: 100, attributes: { size: 'L', color: 'Black' } }
    ]
  });
});

// 7. Apparel - White Blanks (9 products)
const titlesWhite = [
  'Premium Crewneck Heavyweight White Tee',
  'Streetwear V-Neck Heavyweight White Tee',
  'Loose-Fit Oversized Combed White Tee',
  'Classic Combed Cotton White Tee',
  'Luxury Drop-Shoulder Streetwear White Tee',
  'Soft-Touch Vintage Cream White Tee',
  'Ribbed Collar Streetwear White Tee',
  'Organic Sustainable Heavy Cotton White Tee',
  'Streetwear Heavyweight White Long-Sleeve'
];
titlesWhite.forEach((title, idx) => {
  const code = `TS-WHT-00${idx + 1}`;
  MOCK_PRODUCTS.push({
    id: `apparel-white-${idx + 1}`,
    name: title,
    description: `Ultra-clean white blank apparel. Tailored specifically for Direct-To-Film (DTF) visual transfers. High density weave guarantees solid prints.`,
    price: 2200.00,
    original_price: 2800.00,
    image_url: '/images/products/heavyweight-tee.jpg', // sharing layout
    category: 'apparel',
    sub_category: 'white',
    is_active: true,
    variants: [
      { id: `var-white-${idx + 1}-m`, product_id: `apparel-white-${idx + 1}`, name: 'M / White', sku: `${code}-M`, price_override: null, stock_quantity: 100, attributes: { size: 'M', color: 'White' } },
      { id: `var-white-${idx + 1}-l`, product_id: `apparel-white-${idx + 1}`, name: 'L / White', sku: `${code}-L`, price_override: null, stock_quantity: 90, attributes: { size: 'L', color: 'White' } }
    ]
  });
});


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
