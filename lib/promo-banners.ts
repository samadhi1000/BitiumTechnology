/**
 * Promo & Seasonal Offer Banners Configuration for Bitium Technology.
 * Allows 100% dynamic customization of CTA & Advertisement sections per category.
 */

export interface PromoBanner {
  id: string;
  category: string; // 'all' | 'stencil' | 'screen-printing' | 'dtf_sheet' | 'batik-stamp' | 'laser-cutting' | 'materials' | 'other'
  categoryName: string;
  badgeText?: string;
  title: string;
  desc: string;
  buttonText: string;
  buttonHref: string;
  imageUrl?: string;
  theme: 'neon-green' | 'amber-gold' | 'cyber-blue' | 'rose-red' | 'purple-glow';
  isActive: boolean;
  updatedAt: string;
}

export const DEFAULT_PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'promo-screen-printing',
    category: 'screen-printing',
    categoryName: 'Screen Printing',
    badgeText: 'Custom Service',
    title: 'Need a custom screen exposed?',
    desc: 'Send us your vector design and get a ready-to-print screen delivered to your doorstep.',
    buttonText: 'Order Custom Screen',
    buttonHref: '/contact',
    imageUrl: '',
    theme: 'neon-green',
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-stencil',
    category: 'stencil',
    categoryName: 'Stencils',
    badgeText: 'Custom Design',
    title: 'Custom Laser-Cut Stencils',
    desc: 'Need a custom size, typography or company logo stencil? We cut from premium durable Mylar & PVC sheets.',
    buttonText: 'Get Custom Stencil',
    buttonHref: '/contact',
    imageUrl: '',
    theme: 'neon-green',
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-dtf_sheet',
    category: 'dtf_sheet',
    categoryName: 'DTF Printing',
    badgeText: 'Special Service',
    title: 'Custom Gang Sheets & Bulk Prints',
    desc: 'Upload your designs or build a gang sheet with our online tool for ultra-vibrant textile heat transfers.',
    buttonText: 'Create Custom Sheet',
    buttonHref: '/contact',
    imageUrl: '',
    theme: 'cyber-blue',
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-batik-stamp',
    category: 'batik-stamp',
    categoryName: 'Batik Stamps',
    badgeText: 'Traditional Craft',
    title: 'Custom Cap Batik Stamps & Wooden Blocks',
    desc: 'Handcrafted traditional copper and wood stamps made to your precise geometric or floral motifs.',
    buttonText: 'Inquire Custom Stamp',
    buttonHref: '/contact',
    imageUrl: '',
    theme: 'amber-gold',
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-laser-cutting',
    category: 'laser-cutting',
    categoryName: 'Laser Cutting',
    badgeText: 'Precision Cutting',
    title: 'Industrial Laser Engraving & Profile Cutting',
    desc: 'Custom acrylic, wood, leather and stencil profile cutting with sub-millimeter precision.',
    buttonText: 'Request Quotation',
    buttonHref: '/contact',
    imageUrl: '',
    theme: 'rose-red',
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-materials',
    category: 'materials',
    categoryName: 'Materials & Inks',
    badgeText: 'Bulk Supplies',
    title: 'Wholesale Consumables & Bulk Orders',
    desc: 'Need bulk screen inks, photo emulsion, squeeze squeegees, or hand painting fabrics? Contact our sales team.',
    buttonText: 'Bulk Inquiries',
    buttonHref: '/contact',
    imageUrl: '',
    theme: 'purple-glow',
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-other',
    category: 'other',
    categoryName: 'Other Services',
    badgeText: 'Custom Work',
    title: 'Have a Unique Printing Project?',
    desc: 'Talk directly with our technical team to bring your creative apparel and graphic printing ideas to life.',
    buttonText: 'Contact Our Team',
    buttonHref: '/contact',
    imageUrl: '',
    theme: 'neon-green',
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
];

export function getPromoBanners(): PromoBanner[] {
  if (typeof window === 'undefined') return DEFAULT_PROMO_BANNERS;
  try {
    const saved = localStorage.getItem('bitium_promo_banners');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all categories have a banner entry
        const existingCats = new Set(parsed.map((b: PromoBanner) => b.category));
        const merged = [...parsed];
        DEFAULT_PROMO_BANNERS.forEach(def => {
          if (!existingCats.has(def.category)) {
            merged.push(def);
          }
        });
        return merged;
      }
    }
  } catch (e) {
    console.error('Error loading bitium_promo_banners:', e);
  }
  return DEFAULT_PROMO_BANNERS;
}

export function savePromoBanners(banners: PromoBanner[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('bitium_promo_banners', JSON.stringify(banners));
    window.dispatchEvent(new Event('bitium_promo_banners_updated'));
  } catch (e) {
    console.error('Error saving bitium_promo_banners:', e);
  }
}

export function getPromoBannerForCategory(categorySlug: string): PromoBanner | null {
  const allBanners = getPromoBanners();
  const normalized = categorySlug === 'dtf-printing' || categorySlug === 'dtf' ? 'dtf_sheet' : categorySlug;
  const found = allBanners.find(b => b.category === normalized || b.category === categorySlug);
  if (found && found.isActive) return found;
  
  // Fallback to 'all' or default
  const globalBanner = allBanners.find(b => b.category === 'all');
  if (globalBanner && globalBanner.isActive) return globalBanner;

  return found || null;
}
