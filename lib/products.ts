import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  mockup_urls?: string[];
  category: 'stencil' | 'screen-printing' | 'dtf_sheet' | 'batik-stamp' | 'materials' | 'laser-cutting' | 'other';
  sub_category?: string;
  is_active: boolean;
  is_pinned?: boolean;
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

/** One row from the admin "Size & Price Tiers" table */
export interface SizeVariantInput {
  size: string;   // e.g. "A4", "A3", "Meters"
  price: number;  // selling price for this size
  stock: number;  // stock qty for this size
}

// Subcategory definitions (15 subcategories, 9 items each = 135 products total)
const SUBCAT_DATA = [
  // Stencil
  { cat: 'stencil', sub: 'hand-painting', names: ['Tropical Palm & Monstera Stencil', 'Feathered Leaf Pattern Stencil', 'Wild Vine Leaves Hand-Painting Stencil', 'Botanical Branch & Leaves Stencil', 'Floral Bouquet Hand-Painting Stencil', 'Vintage Logo Hand-Painting Stencil', 'Tropical Leaves Hand-Painting Stencil', 'Cyberpunk Accent Hand-Painting Stencil', 'Cute Animal Hand-Painting Stencil'], image: '/images/products/stencil-hand-painting-1.webp', price: 450, orig: 600 },
  { cat: 'stencil', sub: 'saree', names: ['Traditional Gold Zari Saree Stencil', 'Royal Peacock Saree Border Stencil', 'Silver Vines Saree Lace Stencil', 'Copper Paisley Border Saree Stencil', 'Lotus Petals Border Saree Stencil', 'Mandala Lace Border Saree Stencil', 'Chevron Geo Saree Border Stencil', 'Elephant March Saree Stencil', 'Classic Temple Saree Stencil'], image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80', price: 750, orig: 950 },
  { cat: 'stencil', sub: 'tote-bags', names: ['Cute Bear Tote Bag Stencil', 'Save the Earth Eco Tote Stencil', 'Retro Cassette Tote Bag Stencil', 'Aesthetic Line Art Tote Stencil', 'Minimalist Sun & Moon Tote Stencil', 'Coffee Lover Quote Tote Stencil', 'Wildflower Bouquet Tote Stencil', 'Tokyo Street Neon Tote Stencil', 'Kawaii Cat Paw Tote Stencil'], image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80', price: 380, orig: 500 },
  { cat: 'stencil', sub: 'batik', names: ['Traditional Tjanting Batik Stencil', 'Floral Vine Batik Border Stencil', 'Geometric Kawung Batik Stencil', 'Royal Parang Pattern Batik Stencil', 'Mega Mendung Cloud Batik Stencil', 'Modern Abstract Batik Stencil', 'Symmetrical Mandala Batik Stencil', 'Siriwasa Traditional Batik Stencil', 'Ocean Wave Motif Batik Stencil'], image: 'https://images.unsplash.com/photo-1508807526345-15e988543c28?auto=format&fit=crop&w=600&q=80', price: 650, orig: 850 },
  { cat: 'stencil', sub: 'wall-decoration', names: ['Luxury Damask Wall Decor Stencil', 'Giant Monstera Wall Leaf Stencil', 'Geometric Accent Wall Stencil', 'Moroccan Trellis Wall Stencil', 'Scandinavian Forest Wall Stencil', 'Celestial Stars Wall Stencil', 'Art Deco Pattern Wall Stencil', 'Boho Sunrays Wall Decor Stencil', 'Japanese Wave Wall Art Stencil'], image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80', price: 1200, orig: 1600 },
  { cat: 'stencil', sub: 'titanium', names: ['Ultra-Durability Industrial Titanium Stencil', 'Heavy-Duty Logo Titanium Stencil', 'Precision Micro-Circuit Titanium Stencil', 'High-Temp Metal Spray Titanium Stencil', 'Custom Brand Plate Titanium Stencil', 'Stainless Titanium Marking Stencil', 'Automotive Detailing Titanium Stencil', 'Military Grade Numbering Titanium Stencil', 'Premium Mechanical Stencil Titanium'], image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', price: 3500, orig: 4500 },
  { cat: 'stencil', sub: 'two-color', names: ['2-Color Layer Alignment Stencil A4', 'Two Color Saree Border Stencil Pair', 'Dual Layer Floral Mylar Stencil Set', 'Two Tone Geometric Art Stencil Pack', '2-Color Custom Registration Stencil Duo', 'Two Color Wall Decor Stencil Pair', 'Dual Layer Botanical Stencil Set', 'Two Tone Typography Stencil Kit', 'Precision 2-Color Multi-Layer Stencil'], image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80', price: 950, orig: 1300 },
  { cat: 'stencil', sub: 'other', names: ['Custom Specialized Mylar Stencil', 'Geometric Pattern Craft Stencil', 'Custom Architectural Stencil Sheet', 'Bespoke Font & Lettering Stencil', 'Decorative Floor Tile Stencil', 'Mixed Media Art Stencil Pack', 'Industrial Machinery Stencil Sheet', 'Custom Airbrushing Template Stencil', 'Textile Texture Background Stencil'], image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80', price: 600, orig: 800 },

  // Screen Printing
  { cat: 'screen-printing', sub: 'screen-exposed', names: ['Custom Exposed Screen 12x12 120T', 'Exposed Screen A4 Standard 100T', 'Exposed Screen A3 Large 120T', 'Exposed Screen T-Shirt Front 90T', 'Exposed Screen Pocket Logo 140T', 'Exposed Screen Back Artwork 90T', 'Exposed Screen Textile Print 100T', 'Custom Exposed Screen 23x31 120T', 'Exposed Screen Sleeve Design 140T'], image: 'https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?auto=format&fit=crop&w=600&q=80', price: 2900, orig: 3500 },
  { cat: 'screen-printing', sub: 'artwork', names: ['Viper Streetwear Artwork Design', 'Retro Wave Cyberpunk Artwork', 'Vintage Botanical Artwork Pack', 'Anime Hero Portrait Artwork', 'Classic Typographic Quote Artwork', 'Geometric Mandala Vector Artwork', 'Spooky Skull Custom Artwork', 'Abstract Brushstroke Art Pack', 'Urban Graffiti Vector Artwork'], image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', price: 950, orig: 1500 },
  { cat: 'screen-printing', sub: 'tracing-printouts', names: ['Tracing Film A4 Printout Set', 'Tracing Film A3 Printout Pack', 'Tracing Paper Half-Tone Printout', 'High-Translucent Tracing Roll 12x23', 'Tracing Sheet Vector Pocket Logo', 'Tracing Sheet Large Front Banner', 'Tracing Printout Custom Vector Set', 'Precision Detail Tracing Sheet', 'Fine Text Tracing Film A4'], image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80', price: 150, orig: 250 },
  { cat: 'screen-printing', sub: 'positive-printouts', names: ['Positive Film A4 Screen Laser Set', 'Positive Film A3 Screen Laser Set', 'High-Density Inkjet Positive Sheet', 'Custom Positive Printout 12x23 Roll', 'Positive Printout Multi-Color Layer Set', 'Halftone Screen Positive Sheet A3', 'Micro-Line Detail Positive Film A4', 'Heavyweight Block Positive Sheet', 'Professional Output Positive Film Roll'], image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80', price: 300, orig: 500 },
  { cat: 'screen-printing', sub: 'cmyk-halftone', names: ['CMYK Color Separation Film Set (4-Page A4)', 'CMYK Color Separation Film Set (4-Page A3)', 'CMYK Cyan Layer High-Density Film A3', 'CMYK Magenta Layer High-Density Film A3', 'CMYK Yellow Layer High-Density Film A3', 'CMYK Black Layer High-Density Film A3', 'Custom CMYK Halftone Screen 12x12 A3 size', 'Exposed Screen Set for CMYK Printing (4 Frames)', 'Process CMYK Ink Trial Pack (C, M, Y, K - 250ml each)'], image: 'https://images.unsplash.com/photo-1525909002-1b057f39ff82?auto=format&fit=crop&w=600&q=80', price: 1200, orig: 1600 },
  { cat: 'screen-printing', sub: 'one-color', names: ['Single Color Exposed Screen A4', 'One Color Spot Print Screen A3', 'Monochrome Logo Exposed Screen', 'One Color Bold Graphic Screen', 'Single Pass White Screen Frame', 'One Color Textile Squeegee & Screen', 'High Density Monochrome Mesh 120T', 'One Color Quick Dry Ink & Screen Kit', 'Single Color Precision Screen 20x24'], image: 'https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?auto=format&fit=crop&w=600&q=80', price: 2200, orig: 2800 },
  { cat: 'screen-printing', sub: 'two-color', names: ['2-Color Separation Screen Set A4', 'Two Color Alignment Screen Pair A3', 'Dual Layer Print Screen Kit', 'Two Color Spot Screen Set 110T', 'Two Color Registered Frame Duo', 'Underbase + Top Color Screen Set', 'Two Color Gradient Mesh Frames', 'Dual Tone Textile Screen Pack', 'Two Color Merch Printing Screen Set'], image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', price: 4200, orig: 5200 },
  { cat: 'screen-printing', sub: 'three-color', names: ['3-Color Separation Screen Trio A4', 'Three Color Spot Exposure Set A3', 'Triple Screen Registration Pack', 'Three Layer Vector Screen Bundle', 'Tri-Color High Tension Mesh Frames', '3-Color Graphic Print Screen Pack', 'Three Color Underbase & Highlights Set', 'Three Color Vintage Poster Screen Set', 'Triple Pass Screen Kit 120T'], image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', price: 5900, orig: 7200 },
  { cat: 'screen-printing', sub: 'four-color', names: ['4-Color Process Screen Set A4', 'Four Color Spot Separation Pack A3', 'Quad Layer Precision Screen Set', 'Four Color Registration Frame Bundle', '4-Color CMYK Simulated Process Screens', 'Four Screen Production Print Kit', 'Quad Frame High Definition Mesh Set', 'Four Color Textile Master Screen Set', '4-Color Custom Merch Screen Array'], image: 'https://images.unsplash.com/photo-1525909002-1b057f39ff82?auto=format&fit=crop&w=600&q=80', price: 7500, orig: 9200 },
  { cat: 'screen-printing', sub: 'other', names: ['Screen Printing Emulsion Remover 1L', 'Mesh Adhesive Glue for Screen Frames', 'Screen Clean Washout Booth Accessory', 'Blockout Red Pen for Mesh Pinholes', 'Screen Tensiometer Calibration Tool', 'Heavy Duty Hinge Clamps Pair', 'Screen Printing Scoop Coater 14 Inch', 'Screen Drying Cabinet Rack Accessories', 'Textile Screen Registration Guide Kit'], image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', price: 1500, orig: 2000 },

  // DTF Printing
  { cat: 'dtf_sheet', sub: 'tshirt-design', names: ['Vintage Mountain Adventure Tee Design', 'Demon Slayer Anime T-Shirt Design', 'Cute Labubu Family T-Shirt Design', 'Stitch Cartoon Character Tee Design', 'Streetwear Bear T-Shirt Print Sheet', 'I\'d Hike That Mountain Tee Design', 'I\'d Hike That Mountain Tee (Back) Design', 'Half Mile Hiking Quote Tee Design', 'Premium Heavyweight Blank Tee'], image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', price: 850, orig: 1200 },
  { cat: 'dtf_sheet', sub: 'dtf-sticker', names: ['Stitch & Friends DTF Sticker Pack', 'Labubu Pop Toy DTF Sticker Sheet', 'Retro Arcade Game DTF Stickers', 'Cute Animals DTF Sticker Sheet', 'Streetwear Graffiti DTF Stickers', 'Motorsport Logo DTF Sticker Set', 'Anime Chibi Heroes DTF Stickers', 'Cyberpunk Neon Icons DTF Stickers', 'Floral Botanical DTF Sticker Pack'], image: 'https://images.unsplash.com/photo-1572375995501-4b0894d50d69?auto=format&fit=crop&w=600&q=80', price: 380, orig: 500 },
  { cat: 'dtf_sheet', sub: 'dtf-cloth', names: ['Full Jacket Back DTF Cloth Print', 'Hoodie Large Graphics DTF Cloth Sheet', 'Canvas Tote Bag Print DTF Sheet', 'Denim Jacket Graphic DTF Cloth Sheet', 'Sleeve Stripes Custom DTF Cloth Set', 'Sweatshirt Chest Accent DTF Print', 'Cap Logo Custom DTF Transfer Sheet', 'Fabric Banner Layout DTF Cloth Sheet', 'Heavy Cotton Uniform DTF Cloth Logo'], image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80', price: 1500, orig: 2200 },
  { cat: 'dtf_sheet', sub: 'men', names: ['Men\'s Oversized Vintage Graphic DTF Sheet', 'Men\'s Urban Streetwear DTF Print Pack', 'Men\'s Gym & Fitness Quote DTF Transfer', 'Men\'s Anime Warrior DTF Front Chest Print', 'Men\'s Biker Club DTF Back Graphic', 'Men\'s Minimalist Pocket DTF Print Set', 'Men\'s Heavyweight Hoodie DTF Graphic', 'Men\'s Cyberpunk Neon Street DTF Sheet', 'Men\'s Classic Muscle Car DTF Transfer'], image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80', price: 950, orig: 1400 },
  { cat: 'dtf_sheet', sub: 'women', names: ['Women\'s Aesthetic Floral Botanical DTF Sheet', 'Women\'s Butterfly & Moon DTF Transfer Pack', 'Women\'s Motivational Quote DTF Chest Print', 'Women\'s Crop Top Graphic DTF Transfer', 'Women\'s Bohemian Celestial DTF Sheet', 'Women\'s Watercolor Art DTF Transfer', 'Women\'s Minimalist Line Art DTF Pack', 'Women\'s Cute Cottagecore DTF Sheet', 'Women\'s Chic Typography DTF Transfer'], image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80', price: 950, orig: 1400 },
  { cat: 'dtf_sheet', sub: 'kids', names: ['Cute Dino World Kids DTF Print Sheet', 'Cartoon Animals Kids DTF Transfer Pack', 'Space Astronaut Galaxy Kids DTF Print Set', 'Rainbow & Unicorns Kids DTF Sheet', 'Super Hero Comic Kids DTF Transfer', 'Cute Monster Friends Kids DTF Pack', 'Kids Birthday Number & Graphic DTF Set', 'Teddy Bear & Toys Kids DTF Transfer', 'Fun Vehicles & Race Cars Kids DTF Sheet'], image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', price: 750, orig: 1100 },
  { cat: 'dtf_sheet', sub: 'logo-size', names: ['Custom Brand Logo DTF Transfer (2.5x2.5)', 'Pocket Crest Logo DTF Print (2.5x2.5)', 'Company Badge Logo DTF Sheet (2.5x2.5)', 'Sports Emblem Logo DTF Pack (2.5x2.5)', 'Mini Icon Logo DTF Transfer (2.5x2.5)'], image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', price: 150, orig: 250 },
  { cat: 'dtf_sheet', sub: 'a6-size', names: ['A6 Compact DTF Print Sheet (6x4)', 'A6 Graphic Card DTF Transfer (6x4)', 'A6 Pocket Art DTF Sheet (6x4)', 'A6 Custom Logo DTF Pack (6x4)'], image: 'https://images.unsplash.com/photo-1572375995501-4b0894d50d69?auto=format&fit=crop&w=600&q=80', price: 250, orig: 350 },
  { cat: 'dtf_sheet', sub: 'a5-size', names: ['A5 Medium DTF Print Sheet (8x5)', 'A5 Chest Graphic DTF Transfer (8x5)', 'A5 Streetwear Art DTF Sheet (8x5)', 'A5 Custom Apparel DTF Pack (8x5)'], image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80', price: 450, orig: 600 },
  { cat: 'dtf_sheet', sub: 'a4-size', names: ['A4 Standard DTF Transfer Sheet (8x11)', 'A4 Front Chest Graphic DTF (8x11)', 'A4 Poster Style DTF Sheet (8x11)', 'A4 Full Color DTF Print Pack (8x11)'], image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', price: 850, orig: 1100 },
  { cat: 'dtf_sheet', sub: 'a3-size', names: ['A3 Large DTF Transfer Sheet (11x16)', 'A3 Full Front Art DTF Print (11x16)', 'A3 Oversized Graphic DTF Sheet (11x16)', 'A3 Hoodie Graphic DTF Sheet (11x16)'], image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80', price: 1450, orig: 1800 },
  { cat: 'dtf_sheet', sub: 'a2-size', names: ['A2 Extra Large DTF Sheet (16x23)', 'A2 Full Back Jacket DTF Sheet (16x23)', 'A2 Master Gang Sheet DTF (16x23)', 'A2 Heavyweight Apparel DTF Sheet (16x23)'], image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80', price: 2800, orig: 3500 },
  { cat: 'dtf_sheet', sub: '1m-size', names: ['1 Meter Industrial DTF Roll Sheet (22x40)', '1 Meter Custom Gang Sheet DTF (22x40)', '1 Meter Bulk Production DTF Roll (22x40)', '1 Meter High-Capacity DTF Sheet (22x40)'], image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80', price: 4200, orig: 5200 },
  { cat: 'dtf_sheet', sub: 'other', names: ['Custom Mixed Gang Sheet 60cmx100cm', 'Specialty Metallic Finish DTF Transfer', 'Glow in the Dark DTF Sheet', 'Reflective DTF Transfer Pack', 'High-Stretch Performance DTF Sheet', 'Mini Logo Neck Tag DTF Sheet', 'Full Color Sample Swatch DTF Sheet', 'Vintage Distressed Effect DTF Transfer', 'Custom Hat & Pocket DTF Transfer Pack'], image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80', price: 1200, orig: 1800 },

  // Batik Stamp / Block Designs
  { cat: 'batik-stamp', sub: 'cap-batik', names: ['Traditional Copper Cap Batik Stamp', 'Wood Carved Lotus Cap Batik Stamp', 'Royal Parang Pattern Cap Batik Stamp', 'Symmetrical Mandala Cap Batik Stamp', 'Peacock Tail Motif Cap Batik Stamp', 'Classic Siriwasa Cap Batik Stamp', 'Kawung Geometry Cap Batik Stamp', 'Geometric Grid Pattern Cap Batik Stamp', 'Modern Wave Abstract Cap Batik Stamp'], image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80', price: 4900, orig: 6500 },
  { cat: 'batik-stamp', sub: 'wooden-blocks', names: ['Hand-Carved Floral Wooden Block Stamp', 'Traditional Teak Wood Pattern Block', 'Geometric Paisley Wooden Printing Block', 'Artisan Border Carved Wood Stamp', 'Custom Motif Handcrafted Wood Block'], image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80', price: 2400, orig: 3200 },
  { cat: 'batik-stamp', sub: 'other', names: ['Custom Brass Batik Canting Tool', 'Hand-Carved Wooden Wax Stamp', 'Traditional Wax Melting Pot & Stand', 'Batik Tjanting Pen Fine Nozzle Set', 'Wax Resist Scraper & Clean Tool', 'Specialty Batik Stamp Handle Grip', 'Traditional Fabric Waxing Guide Block', 'Custom Motif Double-Sided Wood Stamp', 'Copper Strip Artisan Repair Kit'], image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80', price: 3200, orig: 4500 },

  // Laser Cutting
  { cat: 'laser-cutting', sub: 'acrylic', names: ['Custom Acrylic LED Sign Panel', 'Clear Acrylic Display Stand', 'Frosted Acrylic Name Plate', 'Layered Acrylic Award Plaque', 'Acrylic Keychain Bulk Pack', 'Colored Acrylic Lettering Set', 'Acrylic Box Enclosure Panels', 'Neon Edge-Lit Acrylic Sign Base', 'Custom Acrylic Stencil Template'], image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80', price: 2500, orig: 3200 },
  { cat: 'laser-cutting', sub: 'wood', names: ['Engraved Wood Coaster Set', 'Custom Plywood Wall Art', 'Bamboo Wood Menu Board', 'Laser Cut Wooden Nameplate', 'Wood Veneer Business Cards', 'Intricate Wood Mandala Panel', 'Custom Hardwood Cutting Board', 'Wooden Key Organizer Rack', 'Layered Wood Topography Map'], image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', price: 1800, orig: 2400 },
  { cat: 'laser-cutting', sub: 'custom-profile', names: ['Custom Profile MDF Cutout', 'Bespoke Foam Insert Profile', 'Leather Engraved Patch Profile', 'Felt Acoustic Panel Cutout', 'Cardboard Prototyping Shape', 'Rubber Stamp Matrix Profile', 'Gasket and Seal Laser Cut', 'Fabric Template Profile Cut', 'Precision Shims Profile Cut'], image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', price: 1500, orig: 2000 },
  { cat: 'laser-cutting', sub: 'other', names: ['Custom Cut Rubber Gasket Sheet', 'Laser Cut Leather Patch Set', 'Precision Foam Packaging Insert', 'Laser Cut Cardstock Display Box', 'Engraved Anodized Aluminum Plate', 'Laser Cut Silicone Insulator Mat', 'Custom Cut Cork Coaster Pack', 'Bespoke Fabric Applique Cutout', 'Multi-Material Prototyping Sample Kit'], image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', price: 1800, orig: 2500 },

  // Materials & Consumables
  { 
    cat: 'materials', 
    sub: 'screen-printing-consumables', 
    names: [
      'Screen Printing Diazo Photo Emulsion 1KG',
      'Screen Sensitizer Powder 100g',
      'Screen Reclaimer & Wash Chemical 1L',
      'Plastisol Screen Printing Ink 1KG - White & CMYK',
      'Water-Based Textile Screen Printing Ink 1KG',
      'Screen Degreaser & Mesh Prep 1L',
      'Aluminum Frame Screen Squeegee Rubber 1M'
    ], 
    image: 'https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?auto=format&fit=crop&w=600&q=80',
    prices: [3200, 850, 1950, 4200, 3800, 1650, 1200],
    origs: [3800, 1100, 2400, 4900, 4500, 2000, 1500]
  },
  {
    cat: 'materials',
    sub: 'hand-painting-consumables',
    names: [
      'Fabric Hand-Painting Ink Set (12 Colors)',
      'Acrylic Fabric Painting Medium 500ml',
      'Fabric Color Fixer & Binder 1L',
      'Fine Detail Hand-Painting Brush Set (6 Pcs)',
      'Metallic Fabric Outliner & Gutta 100ml',
      'Fabric Softener Medium 500ml'
    ],
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    prices: [2800, 1450, 1850, 950, 650, 1250],
    origs: [3500, 1800, 2200, 1200, 800, 1500]
  },
  {
    cat: 'materials',
    sub: 'other-consumables',
    names: [
      'White Ink for DTF Printer', 
      'Color (C M Y K LC LM) Ink for DTF Printer', 
      'Premium High Adhesive Hot Melt DTF Powder', 
      'Premium DTF Film Roll 30cm – Double Matte', 
      'Premium DTF Film Roll 30cm – Hot Peel', 
      'Premium DTF Film Roll 60cm – Double Matte', 
      'Premium DTF Film Roll 60cm – Hot Peel'
    ], 
    image: '/images/products/dtf-white-ink.webp',
    prices: [6500, 6500, 4900, 7500, 7500, 14000, 14000],
    origs: [8000, 8000, 6000, 9500, 9500, 18000, 18000]
  }
];

const MOCK_PRODUCTS: Product[] = [];

// Dictionary of unique copyright-free Unsplash images mapped to specific subcategory index items
const UNIQUE_IMAGES: Record<string, string[]> = {
  'hand-painting': [
    '/images/products/stencil-hand-painting-1.webp',
    '/images/products/stencil-hand-painting-2.webp',
    '/images/products/stencil-hand-painting-3.webp',
    '/images/products/stencil-hand-painting-4.webp',
    '/images/products/stencil-hand-painting-5.webp',
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
    '/images/products/mountain-vintage-tee.webp',
    '/images/products/demon-slayer-tee.webp',
    '/images/products/labubu-new.webp',
    '/images/products/stitch-dtf.webp',
    '/images/products/bear-street-dtf.webp',
    '/images/products/hike-that-tee.webp',
    '/images/products/hike-that-tee-back.webp',
    '/images/products/half-mile-tee.webp',
    '/images/products/heavyweight-tee.webp'
  ],
  'other-consumables': [
    '/images/products/dtf-white-ink.webp',
    '/images/products/dtf-color-ink.webp',
    '/images/products/dtf-powder.webp',
    '/images/products/dtf-film-roll.webp',
    '/images/products/dtf-film-roll.webp',
    '/images/products/dtf-film-roll.webp',
    '/images/products/dtf-film-roll.webp'
  ]
};

const CATEGORY_MOCKUPS: Record<string, [string, string]> = {
  'tshirt-design': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
  ],
  'dtf-sticker': [
    'https://images.unsplash.com/photo-1572375995501-4b0894d50d69?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
  ],
  'dtf-cloth': [
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
  ],
  'men': [
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
  ],
  'women': [
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
  ],
  'saree': [
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1508807526345-15e988543c28?auto=format&fit=crop&w=600&q=80',
  ],
  'tote-bags': [
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  ],
  'batik': [
    'https://images.unsplash.com/photo-1508807526345-15e988543c28?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80',
  ],
  'wall-decoration': [
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  ],
  'cap-batik': [
    'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1508807526345-15e988543c28?auto=format&fit=crop&w=600&q=80',
  ],
  'acrylic': [
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
  ],
  'wood': [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
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

    // Generate mockup URLs for physical products (e.g., T-shirt, saree, tote bag mockups)
    const mockups = CATEGORY_MOCKUPS[sc.sub] || [
      `${sc.image}&mockup=1&sig=${idx + 10}`,
      `${sc.image}&mockup=2&sig=${idx + 20}`
    ];

    // Generate size variants based on category to test the size selector feature
    let mockVariants: Variant[] = [];
    if (sc.cat === 'stencil' || sc.cat === 'screen-printing') {
      const sizes = ['A4', 'A3', 'A2', 'A1'];
      const mults = [1.0, 1.7, 2.8, 4.2];
      mockVariants = sizes.map((size, sIdx) => ({
        id: `var-${sc.cat}-${sc.sub}-${idx + 1}-${size}`,
        product_id: `${sc.cat}-${sc.sub}-${idx + 1}`,
        name: size,
        sku: `${skuCode}-${size}`,
        price_override: Math.round(itemPrice * mults[sIdx]),
        stock_quantity: 100 + idx * 5,
        attributes: { size }
      }));
    } else if (sc.cat === 'dtf_sheet') {
      const sizes = ['A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'Meters'];
      const mults = [0.5, 0.7, 1.0, 1.7, 2.8, 4.2, 1.2];
      mockVariants = sizes.map((size, sIdx) => ({
        id: `var-${sc.cat}-${sc.sub}-${idx + 1}-${size}`,
        product_id: `${sc.cat}-${sc.sub}-${idx + 1}`,
        name: size,
        sku: `${skuCode}-${size}`,
        price_override: Math.round(itemPrice * mults[sIdx]),
        stock_quantity: 100 + idx * 5,
        attributes: { size }
      }));
    } else {
      mockVariants = [
        {
          id: `var-${sc.cat}-${sc.sub}-${idx + 1}`,
          product_id: `${sc.cat}-${sc.sub}-${idx + 1}`,
          name: 'Standard Option',
          sku: skuCode,
          price_override: null,
          stock_quantity: 250 + idx * 10,
          attributes: { size: 'Default', type: sc.sub }
        }
      ];
    }

    MOCK_PRODUCTS.push({
      id: `${sc.cat}-${sc.sub}-${idx + 1}`,
      name: name,
      description: `High quality professional grade ${name}. Designed to meet premium trade and retail printing requirements. Excellent durability and finish.`,
      price: itemPrice,
      original_price: itemOrig,
      image_url: finalImage,
      mockup_urls: mockups,
      category: sc.cat as any,
      sub_category: sc.sub,
      is_active: true,
      variants: mockVariants
    });
  });
});

const LOCAL_STORAGE_KEY = 'bitium_custom_products';

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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes('placeholder') || url.includes('your-project')) return false;
  if (!anonKey || anonKey.includes('placeholder') || anonKey.includes('your-key')) return false;
  return true;
}

const PINNED_PRODUCTS_KEY = 'bitium_pinned_product_ids';

export function getPinnedProductIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PINNED_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setPinnedProductIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PINNED_PRODUCTS_KEY, JSON.stringify(ids));
  } catch {}
}

export function togglePinnedProductId(id: string, pinState?: boolean): boolean {
  const ids = getPinnedProductIds();
  const currentlyPinned = ids.includes(id);
  const shouldPin = pinState !== undefined ? pinState : !currentlyPinned;
  
  let newIds: string[];
  if (shouldPin) {
    newIds = [id, ...ids.filter(i => i !== id)];
  } else {
    newIds = ids.filter(i => i !== id);
  }
  setPinnedProductIds(newIds);
  return shouldPin;
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
  const pinnedIds = getPinnedProductIds();

  // If running on client, fetch directly from /api/products which serves live Supabase data
  if (typeof window !== 'undefined') {
    const apiProducts = await getApiCatalogProducts();
    if (apiProducts.length > 0) {
      // Merge with any optimistic un-synced local storage items if needed
      const localProducts = getLocalStorageProducts();
      const merged = [...apiProducts];
      localProducts.forEach((localP) => {
        if (!merged.some((p) => p.id === localP.id)) {
          merged.unshift(localP);
        }
      });
      return merged
        .map(p => ({
          ...p,
          is_pinned: pinnedIds.includes(p.id) || p.is_pinned === true
        }))
        .filter((p) => p.is_active);
    }
  }

  // Server-side or fallback path
  let dbProducts: Product[] = [];
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        dbProducts = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          description: row.description || '',
          price: Number(row.price) || 0,
          original_price: row.original_price ? Number(row.original_price) : undefined,
          image_url: row.image_url || '',
          mockup_urls: row.mockup_urls || (row.mockup_1 ? [row.mockup_1, row.mockup_2].filter(Boolean) : []),
          category: row.category,
          sub_category: row.sub_category || undefined,
          is_active: row.is_active !== false,
          variants: (row.variants || []).map((v: any) => ({
            id: v.id,
            product_id: v.product_id,
            name: v.name,
            sku: v.sku,
            price_override: v.price_override != null ? Number(v.price_override) : null,
            stock_quantity: Number(v.stock_quantity) || 0,
            attributes: v.attributes || { size: v.name },
          })),
        }));
      }
    } catch (err) {
      console.error('Error fetching products from DB:', err);
    }
  }

  let customProducts: Product[] = [];
  if (typeof window === 'undefined') {
    customProducts = getFileCatalogProducts();
  } else {
    customProducts = getLocalStorageProducts();
  }

  // Merge datasets: DB items take precedence and override custom catalog items with the same ID
  const merged = [...dbProducts];
  customProducts.forEach((customP) => {
    if (!merged.some((p) => p.id === customP.id)) {
      merged.push(customP);
    }
  });

  // Include MOCK_PRODUCTS as default products unless overridden by custom items with the same ID
  MOCK_PRODUCTS.forEach((mock) => {
    if (!merged.some((p) => p.id === mock.id)) {
      merged.push(mock);
    }
  });

  return merged
    .map(p => ({
      ...p,
      is_pinned: pinnedIds.includes(p.id) || p.is_pinned === true
    }))
    .filter((p) => p.is_active);
}

export async function getProductById(id: string): Promise<Product | null> {
  const pinnedIds = getPinnedProductIds();

  if (typeof window !== 'undefined') {
    const products = await getProducts();
    const found = products.find((p) => p.id === id);
    if (found) return { ...found, is_pinned: pinnedIds.includes(found.id) || found.is_pinned === true };
  }

  if (isSupabaseConfigured()) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      try {
        const { data: row, error } = await supabase
          .from('products')
          .select(`
            *,
            variants:product_variants(*)
          `)
          .eq('id', id)
          .single();

        if (!error && row) {
          return {
            id: row.id,
            name: row.name,
            description: row.description || '',
            price: Number(row.price) || 0,
            original_price: row.original_price ? Number(row.original_price) : undefined,
            image_url: row.image_url || '',
            mockup_urls: row.mockup_urls || (row.mockup_1 ? [row.mockup_1, row.mockup_2].filter(Boolean) : []),
            category: row.category,
            sub_category: row.sub_category || undefined,
            is_active: row.is_active !== false,
            is_pinned: pinnedIds.includes(row.id) || row.is_pinned === true,
            variants: (row.variants || []).map((v: any) => ({
              id: v.id,
              product_id: v.product_id,
              name: v.name,
              sku: v.sku,
              price_override: v.price_override != null ? Number(v.price_override) : null,
              stock_quantity: Number(v.stock_quantity) || 0,
              attributes: v.attributes || { size: v.name },
            })),
          };
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
    customProducts = getLocalStorageProducts();
  }

  const foundCustom = customProducts.find((p) => p.id === id);
  if (foundCustom) return { ...foundCustom, is_pinned: pinnedIds.includes(foundCustom.id) || foundCustom.is_pinned === true };

  const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id);
  return mockProduct ? { ...mockProduct, is_pinned: pinnedIds.includes(mockProduct.id) || mockProduct.is_pinned === true } : null;
}

export async function createProduct(
  productData: Omit<Product, 'id' | 'is_active'>,
  sizeVariants: SizeVariantInput[]
): Promise<Product> {
  const id = generateUUID();
  const catPrefix = productData.category.substring(0, 3).toUpperCase();
  const stamp = Date.now().toString().slice(-4);

  if (productData.is_pinned) {
    togglePinnedProductId(id, true);
  }

  // Build one Variant per size entry (fallback: single Default variant)
  const inputs = sizeVariants.length > 0
    ? sizeVariants
    : [{ size: 'Default', price: productData.price, stock: 100 }];

  const newVariants: Variant[] = inputs.map((sv, idx) => {
    const skuTag = sv.size.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || `V${idx + 1}`;
    return {
      id: generateUUID(),
      product_id: id,
      name: sv.size,
      sku: `${catPrefix}-CUSTOM-${stamp}-${skuTag}`,
      price_override: sv.price !== productData.price ? sv.price : null,
      stock_quantity: sv.stock,
      attributes: { size: sv.size },
    };
  });

  const newProduct: Product = { ...productData, id, is_active: true, variants: newVariants };

  // 1. Sync to API route (which handles Supabase server-side persistence)
  try {
    if (typeof window !== 'undefined') {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          product: newProduct,
          variants: newVariants,
        }),
      });
    }
  } catch (apiErr) {
    console.error('Failed to call /api/products create:', apiErr);
  }

  // 2. Direct Supabase Client fallback
  if (isSupabaseConfigured()) {
    try {
      const { error: prodError } = await supabase.from('products').upsert({
        id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.original_price || null,
        image_url: productData.image_url,
        category: productData.category,
        sub_category: productData.sub_category || null,
        is_active: true,
      });

      if (!prodError) {
        for (const v of newVariants) {
          const { error: varError } = await supabase.from('product_variants').upsert({
            id: v.id,
            product_id: id,
            name: v.name,
            sku: v.sku,
            price_override: v.price_override,
            stock_quantity: v.stock_quantity,
            attributes: v.attributes,
          });
          if (varError) console.error('Supabase variant upsert failed:', varError);
        }
      } else {
        console.error('Supabase product upsert failed:', prodError);
      }
    } catch (err) {
      console.error('Supabase insert failed:', err);
    }
  }

  // 3. Optimistic local cache
  const localProducts = getLocalStorageProducts();
  localProducts.unshift(newProduct);
  setLocalStorageProducts(localProducts);
  return newProduct;
}

export async function updateProduct(
  id: string,
  productData: Partial<Product>,
  sizeVariants?: SizeVariantInput[]
): Promise<Product | null> {
  const existing = await getProductById(id);
  if (!existing) return null;

  if (productData.is_pinned !== undefined) {
    togglePinnedProductId(id, productData.is_pinned);
  }

  const basePrice = productData.price ?? existing.price;
  const catPrefix = (productData.category ?? existing.category).substring(0, 3).toUpperCase();
  const stamp = Date.now().toString().slice(-4);

  // Rebuild variants array when size tiers are provided
  let updatedVariants: Variant[];
  if (sizeVariants && sizeVariants.length > 0) {
    updatedVariants = sizeVariants.map((sv, idx) => {
      // Reuse existing variant id if same size already existed (preserves SKU stability)
      const prior = existing.variants?.find(v => v.attributes.size === sv.size);
      const skuTag = sv.size.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || `V${idx + 1}`;
      return {
        id: prior?.id ?? generateUUID(),
        product_id: id,
        name: sv.size,
        sku: prior?.sku ?? `${catPrefix}-CUSTOM-${stamp}-${skuTag}`,
        price_override: sv.price !== basePrice ? sv.price : null,
        stock_quantity: sv.stock,
        attributes: { size: sv.size },
      };
    });
  } else {
    // No size change - keep existing variants as-is
    updatedVariants = existing.variants ?? [];
  }

  const updated: Product = { ...existing, ...productData, variants: updatedVariants };

  // 1. Sync to API route
  try {
    if (typeof window !== 'undefined') {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id,
          productData,
          variants: updatedVariants,
        }),
      });
    }
  } catch (apiErr) {
    console.error('Failed to call /api/products update:', apiErr);
  }

  // 2. Direct Supabase Client fallback
  if (isSupabaseConfigured()) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      try {
        await supabase.from('products').update({
          name: updated.name,
          description: updated.description,
          price: updated.price,
          original_price: updated.original_price || null,
          image_url: updated.image_url,
          category: updated.category,
          sub_category: updated.sub_category || null,
          is_active: updated.is_active,
        }).eq('id', id);

        if (sizeVariants && sizeVariants.length > 0) {
          await supabase.from('product_variants').delete().eq('product_id', id);
          for (const v of updatedVariants) {
            await supabase.from('product_variants').upsert({
              id: v.id, product_id: id, name: v.name, sku: v.sku,
              price_override: v.price_override, stock_quantity: v.stock_quantity,
              attributes: v.attributes,
            });
          }
        }
      } catch (err) {
        console.error('Supabase update failed:', err);
      }
    }
  }

  // 3. Optimistic local cache
  const localProducts = getLocalStorageProducts();
  const index = localProducts.findIndex((p) => p.id === id);
  if (index !== -1) {
    localProducts[index] = updated;
  } else {
    localProducts.push(updated);
  }
  setLocalStorageProducts(localProducts);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  // 1. Sync to API route
  try {
    if (typeof window !== 'undefined') {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id,
        }),
      });
    }
  } catch (apiErr) {
    console.error('Failed to call /api/products delete:', apiErr);
  }

  // 2. Direct Supabase Client fallback
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

  // 3. Optimistic local cache
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

  return true;
}
