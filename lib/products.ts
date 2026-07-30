import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: 'stencil' | 'screen-printing' | 'dtf_sheet' | 'batik-stamp' | 'materials';
  sub_category?: string;
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

// Subcategory definitions (15 subcategories, 9 items each = 135 products total)
const SUBCAT_DATA = [
  // Stencil
  { cat: 'stencil', sub: 'hand-painting', names: ['Artistic Flora Hand-Painting Stencil', 'Mystic Lotus Hand-Painting Stencil', 'Modern Mandala Hand-Painting Stencil', 'Chibi Characters Hand-Painting Stencil', 'Abstract Geometry Hand-Painting Stencil', 'Vintage Logo Hand-Painting Stencil', 'Tropical Leaves Hand-Painting Stencil', 'Cyberpunk Accent Hand-Painting Stencil', 'Cute Animal Hand-Painting Stencil'], image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80', price: 450, orig: 600 },
  { cat: 'stencil', sub: 'saree', names: ['Traditional Gold Zari Saree Stencil', 'Royal Peacock Saree Border Stencil', 'Silver Vines Saree Lace Stencil', 'Copper Paisley Border Saree Stencil', 'Lotus Petals Border Saree Stencil', 'Mandala Lace Border Saree Stencil', 'Chevron Geo Saree Border Stencil', 'Elephant March Saree Stencil', 'Classic Temple Saree Stencil'], image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80', price: 750, orig: 950 },
  { cat: 'stencil', sub: 'tote-bags', names: ['Cute Bear Tote Bag Stencil', 'Save the Earth Eco Tote Stencil', 'Retro Cassette Tote Bag Stencil', 'Aesthetic Line Art Tote Stencil', 'Minimalist Sun & Moon Tote Stencil', 'Coffee Lover Quote Tote Stencil', 'Wildflower Bouquet Tote Stencil', 'Tokyo Street Neon Tote Stencil', 'Kawaii Cat Paw Tote Stencil'], image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80', price: 380, orig: 500 },
  { cat: 'stencil', sub: 'batik', names: ['Traditional Tjanting Batik Stencil', 'Floral Vine Batik Border Stencil', 'Geometric Kawung Batik Stencil', 'Royal Parang Pattern Batik Stencil', 'Mega Mendung Cloud Batik Stencil', 'Modern Abstract Batik Stencil', 'Symmetrical Mandala Batik Stencil', 'Siriwasa Traditional Batik Stencil', 'Ocean Wave Motif Batik Stencil'], image: 'https://images.unsplash.com/photo-1508807526345-15e988543c28?auto=format&fit=crop&w=600&q=80', price: 650, orig: 850 },
  { cat: 'stencil', sub: 'wall-decoration', names: ['Luxury Damask Wall Decor Stencil', 'Giant Monstera Wall Leaf Stencil', 'Geometric Accent Wall Stencil', 'Moroccan Trellis Wall Stencil', 'Scandinavian Forest Wall Stencil', 'Celestial Stars Wall Stencil', 'Art Deco Pattern Wall Stencil', 'Boho Sunrays Wall Decor Stencil', 'Japanese Wave Wall Art Stencil'], image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80', price: 1200, orig: 1600 },
  { cat: 'stencil', sub: 'titanium', names: ['Ultra-Durability Industrial Titanium Stencil', 'Heavy-Duty Logo Titanium Stencil', 'Precision Micro-Circuit Titanium Stencil', 'High-Temp Metal Spray Titanium Stencil', 'Custom Brand Plate Titanium Stencil', 'Stainless Titanium Marking Stencil', 'Automotive Detailing Titanium Stencil', 'Military Grade Numbering Titanium Stencil', 'Premium Mechanical Stencil Titanium'], image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', price: 3500, orig: 4500 },

  // Screen Printing
  { cat: 'screen-printing', sub: 'screen-exposed', names: ['Custom Exposed Screen 12x12 120T', 'Exposed Screen A4 Standard 100T', 'Exposed Screen A3 Large 120T', 'Exposed Screen T-Shirt Front 90T', 'Exposed Screen Pocket Logo 140T', 'Exposed Screen Back Artwork 90T', 'Exposed Screen Textile Print 100T', 'Custom Exposed Screen 23x31 120T', 'Exposed Screen Sleeve Design 140T'], image: 'https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?auto=format&fit=crop&w=600&q=80', price: 2900, orig: 3500 },
  { cat: 'screen-printing', sub: 'artwork', names: ['Viper Streetwear Artwork Design', 'Retro Wave Cyberpunk Artwork', 'Vintage Botanical Artwork Pack', 'Anime Hero Portrait Artwork', 'Classic Typographic Quote Artwork', 'Geometric Mandala Vector Artwork', 'Spooky Skull Custom Artwork', 'Abstract Brushstroke Art Pack', 'Urban Graffiti Vector Artwork'], image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', price: 950, orig: 1500 },
  { cat: 'screen-printing', sub: 'tracing-printouts', names: ['Tracing Film A4 Printout Set', 'Tracing Film A3 Printout Pack', 'Tracing Paper Half-Tone Printout', 'High-Translucent Tracing Roll 12x23', 'Tracing Sheet Vector Pocket Logo', 'Tracing Sheet Large Front Banner', 'Tracing Printout Custom Vector Set', 'Precision Detail Tracing Sheet', 'Fine Text Tracing Film A4'], image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80', price: 150, orig: 250 },
  { cat: 'screen-printing', sub: 'positive-printouts', names: ['Positive Film A4 Screen Laser Set', 'Positive Film A3 Screen Laser Set', 'High-Density Inkjet Positive Sheet', 'Custom Positive Printout 12x23 Roll', 'Positive Printout Multi-Color Layer Set', 'Halftone Screen Positive Sheet A3', 'Micro-Line Detail Positive Film A4', 'Heavyweight Block Positive Sheet', 'Professional Output Positive Film Roll'], image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80', price: 300, orig: 500 },

  // DTF Printing
  { cat: 'dtf_sheet', sub: 'tshirt-design', names: ['Vintage Mountain Adventure Tee Design', 'Demon Slayer Anime T-Shirt Design', 'Cute Labubu Family T-Shirt Design', 'Stitch Cartoon Character Tee Design', 'Streetwear Bear T-Shirt Print Sheet', 'I\'d Hike That Mountain Tee Design', 'I\'d Hike That Mountain Tee (Back) Design', 'Half Mile Hiking Quote Tee Design', 'Premium Heavyweight Blank Tee'], image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', price: 850, orig: 1200 },
  { cat: 'dtf_sheet', sub: 'dtf-sticker', names: ['Stitch & Friends DTF Sticker Pack', 'Labubu Pop Toy DTF Sticker Sheet', 'Retro Arcade Game DTF Stickers', 'Cute Animals DTF Sticker Sheet', 'Streetwear Graffiti DTF Stickers', 'Motorsport Logo DTF Sticker Set', 'Anime Chibi Heroes DTF Stickers', 'Cyberpunk Neon Icons DTF Stickers', 'Floral Botanical DTF Sticker Pack'], image: 'https://images.unsplash.com/photo-1572375995501-4b0894d50d69?auto=format&fit=crop&w=600&q=80', price: 380, orig: 500 },
  { cat: 'dtf_sheet', sub: 'dtf-cloth', names: ['Full Jacket Back DTF Cloth Print', 'Hoodie Large Graphics DTF Cloth Sheet', 'Canvas Tote Bag Print DTF Sheet', 'Denim Jacket Graphic DTF Cloth Sheet', 'Sleeve Stripes Custom DTF Cloth Set', 'Sweatshirt Chest Accent DTF Print', 'Cap Logo Custom DTF Transfer Sheet', 'Fabric Banner Layout DTF Cloth Sheet', 'Heavy Cotton Uniform DTF Cloth Logo'], image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80', price: 1500, orig: 2200 },

  // Batik Stamp
  { cat: 'batik-stamp', sub: 'cap-batik', names: ['Traditional Copper Cap Batik Stamp', 'Wood Carved Lotus Cap Batik Stamp', 'Royal Parang Pattern Cap Batik Stamp', 'Symmetrical Mandala Cap Batik Stamp', 'Peacock Tail Motif Cap Batik Stamp', 'Classic Siriwasa Cap Batik Stamp', 'Kawung Geometry Cap Batik Stamp', 'Geometric Grid Pattern Cap Batik Stamp', 'Modern Wave Abstract Cap Batik Stamp'], image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80', price: 4900, orig: 6500 },

  // Printing Materials & Ink (DTF Printing Consumables)
  { 
    cat: 'materials', 
    sub: 'printing-materials', 
    names: [
      'White Ink for DTF Printer', 
      'Color (C M Y K LC LM) Ink for DTF Printer', 
      'Premium High Adhesive Hot Melt DTF Powder', 
      'Premium DTF Film Roll 30cm – Double Matte', 
      'Premium DTF Film Roll 30cm – Hot Peel', 
      'Premium DTF Film Roll 60cm – Double Matte', 
      'Premium DTF Film Roll 60cm – Hot Peel'
    ], 
    image: '/images/products/dtf-white-ink.jpg',
    prices: [6500, 6500, 4900, 7500, 7500, 14000, 14000],
    origs: [8000, 8000, 6000, 9500, 9500, 18000, 18000]
  }
];

const MOCK_PRODUCTS: Product[] = [];

// Dictionary of unique copyright-free Unsplash images mapped to specific subcategory index items
const UNIQUE_IMAGES: Record<string, string[]> = {
  'hand-painting': [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f', // Floral
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5', // Lotus
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab', // Mandala
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f', // Chibi Characters Stencil
    'https://images.unsplash.com/photo-1502224562085-639556652f33', // Geometry
    'https://images.unsplash.com/photo-1515462277126-270d878326e5', // Vintage Logo
    'https://images.unsplash.com/photo-1448375240586-882707db888b', // Leaves
    'https://images.unsplash.com/photo-1563089145-599997674d42', // Cyberpunk
    'https://images.unsplash.com/photo-1550180133-7286b8b49f9a'  // Animal
  ],
  'saree': [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb',
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e',
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5',
    'https://images.unsplash.com/photo-1618220179428-22790b461013',
    'https://images.unsplash.com/photo-1544816155-12df9643f363',
    'https://images.unsplash.com/photo-1597484211625-2efc21cf81f7'
  ],
  'tote-bags': [
    'https://images.unsplash.com/photo-1544816155-12df9643f363',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6',
    'https://images.unsplash.com/photo-1575032617751-6ddec2089882',
    'https://images.unsplash.com/photo-1544816155-12df9643f363',
    'https://images.unsplash.com/photo-1566150905458-1bf1fc15aae9',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7'
  ],
  'tshirt-design': [
    '/images/products/mountain-vintage-tee.jpg',
    '/images/products/demon-slayer-tee.jpg',
    '/images/products/labubu-new.jpg',
    '/images/products/stitch-dtf.jpg',
    '/images/products/bear-street-dtf.jpg',
    '/images/products/hike-that-tee.jpg',
    '/images/products/hike-that-tee-back.jpg',
    '/images/products/half-mile-tee.jpg',
    '/images/products/heavyweight-tee.jpg'
  ],
  'printing-materials': [
    '/images/products/dtf-white-ink.jpg',
    '/images/products/dtf-color-ink.jpg',
    '/images/products/dtf-powder.jpg',
    '/images/products/dtf-film-roll.jpg',
    '/images/products/dtf-film-roll.jpg',
    '/images/products/dtf-film-roll.jpg',
    '/images/products/dtf-film-roll.jpg'
  ]
};

SUBCAT_DATA.forEach((sc) => {
  sc.names.forEach((name, idx) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    const skuCode = `${sc.cat.substring(0,3).toUpperCase()}-${sc.sub.substring(0,3).toUpperCase()}-00${idx + 1}`;
    
    // Choose custom image if available, else fallback to standard category URL
    let finalImage = sc.image;
    if (UNIQUE_IMAGES[sc.sub] && UNIQUE_IMAGES[sc.sub][idx]) {
      finalImage = UNIQUE_IMAGES[sc.sub][idx];
      if (finalImage.startsWith('http')) {
        finalImage = `${finalImage}?auto=format&fit=crop&w=600&q=80`;
      }
    } else {
      // Append subtle parameter variance so different products have slightly varied views
      finalImage = `${sc.image}&sig=${idx + 1}`;
    }

    const itemPrice = (sc as any).prices && (sc as any).prices[idx] !== undefined 
      ? (sc as any).prices[idx] 
      : (sc as any).price;

    const itemOrig = (sc as any).origs && (sc as any).origs[idx] !== undefined 
      ? (sc as any).origs[idx] 
      : (sc as any).orig;

    MOCK_PRODUCTS.push({
      id: `${sc.cat}-${sc.sub}-${idx + 1}`,
      name: name,
      description: `High quality professional grade ${name}. Designed to meet premium trade and retail printing requirements. Excellent durability and finish.`,
      price: itemPrice,
      original_price: itemOrig,
      image_url: finalImage,
      category: sc.cat as any,
      sub_category: sc.sub,
      is_active: true,
      variants: [
        {
          id: `var-${sc.cat}-${sc.sub}-${idx + 1}`,
          product_id: `${sc.cat}-${sc.sub}-${idx + 1}`,
          name: 'Standard Option',
          sku: skuCode,
          price_override: null,
          stock_quantity: 250 + idx * 10,
          attributes: { size: 'Default', type: sc.sub }
        }
      ]
    });
  });
});

const LOCAL_STORAGE_KEY = 'printgrid_custom_products';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function isSupabaseConfigured(): boolean {
  if (typeof window === 'undefined') return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes('placeholder') || url.includes('your-project')) return false;
  if (!anonKey || anonKey.includes('placeholder') || anonKey.includes('your-key')) return false;
  return true;
}

function getLocalStorageProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading local storage products:', err);
    return [];
  }
}

function setLocalStorageProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error writing local storage products:', err);
  }
}

function getFileCatalogProducts(): Product[] {
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const catalogPath = path.join(process.cwd(), 'lib', 'products-catalog.json');
      if (fs.existsSync(catalogPath)) {
        const data = fs.readFileSync(catalogPath, 'utf8');
        return JSON.parse(data || '[]');
      }
    } catch (err) {
      console.error('Failed to read catalog file on server:', err);
    }
  }
  return [];
}

async function getApiCatalogProducts(): Promise<Product[]> {
  if (typeof window === 'undefined') return [];
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch from API catalog:', err);
  }
  return [];
}

async function syncToApiCatalog(products: Product[]) {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(products)
    });
  } catch (err) {
    console.error('Failed to sync catalog to API:', err);
  }
}

export async function getProducts(): Promise<Product[]> {
  let dbProducts: Product[] = [];
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          variants:product_variants(*)
        `)
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        dbProducts = data as Product[];
      }
    } catch (err) {
      console.error('Error fetching products from DB:', err);
    }
  }

  let customProducts: Product[] = [];
  if (typeof window === 'undefined') {
    customProducts = getFileCatalogProducts();
  } else {
    customProducts = await getApiCatalogProducts();
    if (customProducts.length === 0) {
      customProducts = getLocalStorageProducts();
    }
  }

  if (dbProducts.length === 0) {
    const merged = [...customProducts];
    MOCK_PRODUCTS.forEach((mock) => {
      if (!merged.some((p) => p.id === mock.id)) {
        merged.push(mock);
      }
    });
    return merged.filter((p) => p.is_active);
  } else {
    const merged = [...customProducts];
    dbProducts.forEach((dbP) => {
      if (!merged.some((p) => p.id === dbP.id)) {
        merged.push(dbP);
      }
    });
    return merged.filter((p) => p.is_active);
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      try {
        const { data: product, error } = await supabase
          .from('products')
          .select(`
            *,
            variants:product_variants(*)
          `)
          .eq('id', id)
          .single();

        if (!error && product) {
          return product as Product;
        }
      } catch (err) {
        console.error('Error fetching product from DB:', err);
      }
    }
  }

  let customProducts: Product[] = [];
  if (typeof window === 'undefined') {
    customProducts = getFileCatalogProducts();
  } else {
    customProducts = await getApiCatalogProducts();
    if (customProducts.length === 0) {
      customProducts = getLocalStorageProducts();
    }
  }

  const foundCustom = customProducts.find((p) => p.id === id);
  if (foundCustom) return foundCustom;

  const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id);
  return mockProduct || null;
}

export async function createProduct(productData: Omit<Product, 'id' | 'is_active'>, stock: number): Promise<Product> {
  const id = generateUUID();
  const variantId = generateUUID();
  const newProduct: Product = {
    ...productData,
    id,
    is_active: true,
    variants: [
      {
        id: variantId,
        product_id: id,
        name: 'Standard Option',
        sku: `${productData.category.substring(0,3).toUpperCase()}-CUSTOM-${Date.now().toString().slice(-4)}`,
        price_override: null,
        stock_quantity: stock,
        attributes: { size: 'Default' }
      }
    ]
  };

  if (isSupabaseConfigured()) {
    try {
      const { error: prodError } = await supabase
        .from('products')
        .insert({
          id,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          original_price: productData.original_price,
          image_url: productData.image_url,
          category: productData.category,
          sub_category: productData.sub_category,
          is_active: true
        });

      if (prodError) {
        console.error('Supabase product insert failed:', prodError);
      } else {
        const { error: varError } = await supabase
          .from('product_variants')
          .insert({
            id: variantId,
            product_id: id,
            name: 'Standard Option',
            sku: newProduct.variants![0].sku,
            price_override: null,
            stock_quantity: stock,
            attributes: { size: 'Default' }
          });
        if (varError) {
          console.error('Supabase variant insert failed:', varError);
        }
      }
    } catch (err) {
      console.error('Supabase insert failed:', err);
    }
  }

  const localProducts = getLocalStorageProducts();
  localProducts.unshift(newProduct);
  setLocalStorageProducts(localProducts);

  // Sync to API JSON file
  await syncToApiCatalog(localProducts);

  return newProduct;
}

export async function updateProduct(id: string, productData: Partial<Product>, stock?: number): Promise<Product | null> {
  const existing = await getProductById(id);
  if (!existing) return null;

  const updated: Product = {
    ...existing,
    ...productData,
    variants: existing.variants ? existing.variants.map((v, i) => {
      if (i === 0 && stock !== undefined) {
        return { ...v, stock_quantity: stock };
      }
      return v;
    }) : []
  };

  if (isSupabaseConfigured()) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      try {
        const { error: prodError } = await supabase
          .from('products')
          .update({
            name: updated.name,
            description: updated.description,
            price: updated.price,
            original_price: updated.original_price,
            image_url: updated.image_url,
            category: updated.category,
            sub_category: updated.sub_category,
            is_active: updated.is_active
          })
          .eq('id', id);

        if (!prodError && stock !== undefined) {
          await supabase
            .from('product_variants')
            .update({ stock_quantity: stock })
            .eq('product_id', id);
        }
      } catch (err) {
        console.error('Supabase update failed:', err);
      }
    }
  }

  const localProducts = getLocalStorageProducts();
  const index = localProducts.findIndex((p) => p.id === id);
  if (index !== -1) {
    localProducts[index] = updated;
  } else {
    localProducts.push(updated);
  }
  setLocalStorageProducts(localProducts);

  // Sync to API JSON file
  await syncToApiCatalog(localProducts);

  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      try {
        await supabase
          .from('products')
          .update({ is_active: false })
          .eq('id', id);
      } catch (err) {
        console.error('Supabase delete failed:', err);
      }
    }
  }

  const localProducts = getLocalStorageProducts();
  const index = localProducts.findIndex((p) => p.id === id);
  if (index !== -1) {
    localProducts[index].is_active = false;
  } else {
    const mock = MOCK_PRODUCTS.find((p) => p.id === id);
    if (mock) {
      localProducts.push({ ...mock, is_active: false });
    }
  }
  setLocalStorageProducts(localProducts);

  // Sync to API JSON file
  await syncToApiCatalog(localProducts);

  return true;
}
