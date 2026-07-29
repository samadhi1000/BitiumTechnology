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
  { cat: 'stencil', sub: 'hand-painting', names: ['Artistic Flora Hand-Painting Stencil', 'Mystic Lotus Hand-Painting Stencil', 'Modern Mandala Hand-Painting Stencil', 'Chibi Characters Hand-Painting Stencil', 'Abstract Geometry Hand-Painting Stencil', 'Vintage Logo Hand-Painting Stencil', 'Tropical Leaves Hand-Painting Stencil', 'Cyberpunk Accent Hand-Painting Stencil', 'Cute Animal Hand-Painting Stencil'], image: '/images/products/dtf-sheet.jpg', price: 450, orig: 600 },
  { cat: 'stencil', sub: 'saree', names: ['Traditional Gold Zari Saree Stencil', 'Royal Peacock Saree Border Stencil', 'Silver Vines Saree Lace Stencil', 'Copper Paisley Border Saree Stencil', 'Lotus Petals Border Saree Stencil', 'Mandala Lace Border Saree Stencil', 'Chevron Geo Saree Border Stencil', 'Elephant March Saree Stencil', 'Classic Temple Saree Stencil'], image: '/images/products/saree-border-dtf.jpg', price: 750, orig: 950 },
  { cat: 'stencil', sub: 'tote-bags', names: ['Cute Bear Tote Bag Stencil', 'Save the Earth Eco Tote Stencil', 'Retro Cassette Tote Bag Stencil', 'Aesthetic Line Art Tote Stencil', 'Minimalist Sun & Moon Tote Stencil', 'Coffee Lover Quote Tote Stencil', 'Wildflower Bouquet Tote Stencil', 'Tokyo Street Neon Tote Stencil', 'Kawaii Cat Paw Tote Stencil'], image: '/images/products/stitch-dtf.jpg', price: 380, orig: 500 },
  { cat: 'stencil', sub: 'batik', names: ['Traditional Tjanting Batik Stencil', 'Floral Vine Batik Border Stencil', 'Geometric Kawung Batik Stencil', 'Royal Parang Pattern Batik Stencil', 'Mega Mendung Cloud Batik Stencil', 'Modern Abstract Batik Stencil', 'Symmetrical Mandala Batik Stencil', 'Siriwasa Traditional Batik Stencil', 'Ocean Wave Motif Batik Stencil'], image: '/images/products/bear-street-dtf.jpg', price: 650, orig: 850 },
  { cat: 'stencil', sub: 'wall-decoration', names: ['Luxury Damask Wall Decor Stencil', 'Giant Monstera Wall Leaf Stencil', 'Geometric Accent Wall Stencil', 'Moroccan Trellis Wall Stencil', 'Scandinavian Forest Wall Stencil', 'Celestial Stars Wall Stencil', 'Art Deco Pattern Wall Stencil', 'Boho Sunrays Wall Decor Stencil', 'Japanese Wave Wall Art Stencil'], image: '/images/products/labubu-dtf.jpg', price: 1200, orig: 1600 },
  { cat: 'stencil', sub: 'titanium', names: ['Ultra-Durability Industrial Titanium Stencil', 'Heavy-Duty Logo Titanium Stencil', 'Precision Micro-Circuit Titanium Stencil', 'High-Temp Metal Spray Titanium Stencil', 'Custom Brand Plate Titanium Stencil', 'Stainless Titanium Marking Stencil', 'Automotive Detailing Titanium Stencil', 'Military Grade Numbering Titanium Stencil', 'Premium Mechanical Stencil Titanium'], image: '/images/products/dtf-sheet.jpg', price: 3500, orig: 4500 },

  // Screen Printing
  { cat: 'screen-printing', sub: 'screen-exposed', names: ['Custom Exposed Screen 12x12 120T', 'Exposed Screen A4 Standard 100T', 'Exposed Screen A3 Large 120T', 'Exposed Screen T-Shirt Front 90T', 'Exposed Screen Pocket Logo 140T', 'Exposed Screen Back Artwork 90T', 'Exposed Screen Textile Print 100T', 'Custom Exposed Screen 23x31 120T', 'Exposed Screen Sleeve Design 140T'], image: '/images/products/dtf-sheet.jpg', price: 2900, orig: 3500 },
  { cat: 'screen-printing', sub: 'artwork', names: ['Viper Streetwear Artwork Design', 'Retro Wave Cyberpunk Artwork', 'Vintage Botanical Artwork Pack', 'Anime Hero Portrait Artwork', 'Classic Typographic Quote Artwork', 'Geometric Mandala Vector Artwork', 'Spooky Skull Custom Artwork', 'Abstract Brushstroke Art Pack', 'Urban Graffiti Vector Artwork'], image: '/images/products/demon-slayer-tee.jpg', price: 950, orig: 1500 },
  { cat: 'screen-printing', sub: 'tracing-printouts', names: ['Tracing Film A4 Printout Set', 'Tracing Film A3 Printout Pack', 'Tracing Paper Half-Tone Printout', 'High-Translucent Tracing Roll 12x23', 'Tracing Sheet Vector Pocket Logo', 'Tracing Sheet Large Front Banner', 'Tracing Printout Custom Vector Set', 'Precision Detail Tracing Sheet', 'Fine Text Tracing Film A4'], image: '/images/products/dtf-sheet.jpg', price: 150, orig: 250 },
  { cat: 'screen-printing', sub: 'positive-printouts', names: ['Positive Film A4 Screen Laser Set', 'Positive Film A3 Screen Laser Set', 'High-Density Inkjet Positive Sheet', 'Custom Positive Printout 12x23 Roll', 'Positive Printout Multi-Color Layer Set', 'Halftone Screen Positive Sheet A3', 'Micro-Line Detail Positive Film A4', 'Heavyweight Block Positive Sheet', 'Professional Output Positive Film Roll'], image: '/images/products/dtf-sheet.jpg', price: 300, orig: 500 },

  // DTF Printing
  { cat: 'dtf_sheet', sub: 'tshirt-design', names: ['TeeDesign Custom T-Shirt Print Sheet', 'Demon Slayer Anime T-Shirt Design', 'Cute Labubu Family T-Shirt Design', 'Stitch Cartoon Character Tee Design', 'Streetwear Bear T-Shirt Print Sheet', 'Classic Rock Band Logo Tee Design', 'Cyberpunk City T-Shirt Print Design', 'Retro Gaming Console Tee Design', 'Typography Coffee Quote Tee Design'], image: '/images/products/demon-slayer-tee.jpg', price: 850, orig: 1200 },
  { cat: 'dtf_sheet', sub: 'dtf-sticker', names: ['Stitch & Friends DTF Sticker Pack', 'Labubu Pop Toy DTF Sticker Sheet', 'Retro Arcade Game DTF Stickers', 'Cute Animals DTF Sticker Sheet', 'Streetwear Graffiti DTF Stickers', 'Motorsport Logo DTF Sticker Set', 'Anime Chibi Heroes DTF Stickers', 'Cyberpunk Neon Icons DTF Stickers', 'Floral Botanical DTF Sticker Pack'], image: '/images/products/stitch-dtf.jpg', price: 380, orig: 500 },
  { cat: 'dtf_sheet', sub: 'dtf-cloth', names: ['Full Jacket Back DTF Cloth Print', 'Hoodie Large Graphics DTF Cloth Sheet', 'Canvas Tote Bag Print DTF Sheet', 'Denim Jacket Graphic DTF Cloth Sheet', 'Sleeve Stripes Custom DTF Cloth Set', 'Sweatshirt Chest Accent DTF Print', 'Cap Logo Custom DTF Transfer Sheet', 'Fabric Banner Layout DTF Cloth Sheet', 'Heavy Cotton Uniform DTF Cloth Logo'], image: '/images/products/bear-street-dtf.jpg', price: 1500, orig: 2200 },

  // Batik Stamp
  { cat: 'batik-stamp', sub: 'cap-batik', names: ['Traditional Copper Cap Batik Stamp', 'Wood Carved Lotus Cap Batik Stamp', 'Royal Parang Pattern Cap Batik Stamp', 'Symmetrical Mandala Cap Batik Stamp', 'Peacock Tail Motif Cap Batik Stamp', 'Classic Siriwasa Cap Batik Stamp', 'Kawung Geometry Cap Batik Stamp', 'Geometric Grid Pattern Cap Batik Stamp', 'Modern Wave Abstract Cap Batik Stamp'], image: '/images/products/bear-street-dtf.jpg', price: 4900, orig: 6500 },

  // Printing Materials & Ink
  { cat: 'materials', sub: 'printing-materials', names: ['Premium Matte DTF Printing Ink 1L', 'Vibrant Glossy DTF Printing Ink 1L', 'DTF Hot Melt Adhesive Powder 1kg', 'Plastisol Screen Printing Ink White 1L', 'Water-Based Premium Textile Ink 1L', 'Aluminum Screen Frame 20x24 120T', 'Wooden Squeegee 12 Inch 70 Durometer', 'Photo Emulsion & Sensitizer Kit 1L', 'Screen Printing Clean-up Solvent 1L'], image: '/images/products/streetwear-hoodie.jpg', price: 2400, orig: 3200 }
];

const MOCK_PRODUCTS: Product[] = [];

const AVAILABLE_IMAGES = [
  '/images/products/bear-street-dtf.jpg',
  '/images/products/demon-slayer-tee.jpg',
  '/images/products/dtf-sheet.jpg',
  '/images/products/heavyweight-tee.jpg',
  '/images/products/labubu-dtf.jpg',
  '/images/products/saree-border-dtf.jpg',
  '/images/products/stitch-dtf.jpg',
  '/images/products/streetwear-hoodie.jpg'
];

SUBCAT_DATA.forEach((sc, catIdx) => {
  sc.names.forEach((name, idx) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    const skuCode = `${sc.cat.substring(0,3).toUpperCase()}-${sc.sub.substring(0,3).toUpperCase()}-00${idx + 1}`;
    
    // Create variety for dummy products
    const dynamicImage = AVAILABLE_IMAGES[(catIdx * 9 + idx) % AVAILABLE_IMAGES.length];
    const dynamicPrice = sc.price + (idx * 50);
    const dynamicOrig = sc.orig ? sc.orig + (idx * 70) : undefined;

    MOCK_PRODUCTS.push({
      id: `${sc.cat}-${sc.sub}-${idx + 1}`,
      name: name,
      description: `High quality professional grade ${name}. Designed to meet premium trade and retail printing requirements. Excellent durability and finish.`,
      price: dynamicPrice,
      original_price: dynamicOrig,
      image_url: dynamicImage,
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
