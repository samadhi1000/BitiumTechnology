'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/lib/products';
import { getPromoBannerForCategory, PromoBanner } from '@/lib/promo-banners';
import HoverZoomImage from '@/components/ui/HoverZoomImage';
import InteractiveZoomViewer from '@/components/ui/InteractiveZoomViewer';
import SecureWatermarkedImage from '@/components/SecureWatermarkedImage';
import ProductCardMediaCarousel from '@/components/ui/ProductCardMediaCarousel';
import { 
  Search, 
  ChevronRight, 
  Home, 
  Eye, 
  ZoomIn, 
  X, 
  ExternalLink, 
  MessageCircle, 
  ArrowRight, 
  SlidersHorizontal, 
  Sparkles, 
  ChevronDown, 
  CheckCircle2, 
  ChevronLeft,
  Phone,
  Copy,
  Check
} from 'lucide-react';

export interface SectionLead {
  name: string;
  badge: string;
  badgeColorClass: string;
  role: string;
  phone: string;
  whatsapp: string;
}

export const SECTION_LEADS: Record<string, SectionLead> = {
  'screen-printing': {
    name: 'Prasadari',
    badge: 'Screen Print',
    badgeColorClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    role: 'Screen Printing & Artwork',
    phone: '0716352558',
    whatsapp: '94716352558',
  },
  'stencil': {
    name: 'Nadeeka',
    badge: 'Stencils',
    badgeColorClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    role: 'Stencils & Hand Painting',
    phone: '0772212369',
    whatsapp: '94772212369',
  },
  'dtf_sheet': {
    name: 'Heshani',
    badge: 'DTF & Art',
    badgeColorClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    role: 'DTF & Artwork',
    phone: '0753026247',
    whatsapp: '94753026247',
  },
  'batik-stamp': {
    name: 'Dinithi',
    badge: 'Batik & Other',
    badgeColorClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    role: 'Cap Batik & Other',
    phone: '0779731097',
    whatsapp: '94779731097',
  },
  'laser-cutting': {
    name: 'Dinithi',
    badge: 'Laser Cutting',
    badgeColorClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    role: 'Laser Cutting & Custom Profiles',
    phone: '0779731097',
    whatsapp: '94779731097',
  },
  'materials': {
    name: 'Dinithi',
    badge: 'Consumables',
    badgeColorClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    role: 'Consumables & Materials',
    phone: '0779731097',
    whatsapp: '94779731097',
  },
  'other': {
    name: 'Dinithi',
    badge: 'Batik & Other',
    badgeColorClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    role: 'Cap Batik & Other',
    phone: '0779731097',
    whatsapp: '94779731097',
  },
};

export const DEFAULT_INQUIRY_LEAD: SectionLead = {
  name: 'Dilrukshi',
  badge: 'Inquiries',
  badgeColorClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  role: 'Customer Inquiries & Complaints',
  phone: '0768370920',
  whatsapp: '94768370920',
};

export interface CategoryPageConfig {
  slug: string;
  categoryKey: Product['category'];
  breadcrumbName: string;
  titlePrimary: string;
  titleHighlight: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  description: string;
  heroImage: string;
  searchPlaceholder: string;
  itemSingular: string;
  itemPlural: string;
  subCategories: { id: string; label: string }[];
  sectionLead?: SectionLead;
  whyChooseUs: {
    title: string;
    features: { icon: React.ReactNode; title: string; desc: string }[];
  };
  perfectFor: {
    title?: string;
    items: { icon: React.ReactNode; label: string }[];
  };
  customCta: {
    title: string;
    desc: string;
    buttonText: string;
    buttonHref: string;
    icon?: React.ReactNode;
    image?: string;
  };
  afterListings?: {
    sections: {
      title: string;
      content: string;
      bullets?: string[];
    }[];
  };
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
  };
}

interface CategoryPageTemplateProps {
  config: CategoryPageConfig;
  initialProducts: Product[];
  loading?: boolean;
}

export default function CategoryPageTemplate({
  config,
  initialProducts,
  loading = false,
}: CategoryPageTemplateProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subParam = searchParams.get('sub');

  const [activeSub, setActiveSub] = useState<string | null>(subParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name' | 'newest'>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [promoBanner, setPromoBanner] = useState<PromoBanner | null>(null);
  const itemsPerPage = 20; // 20 items per page (4 columns x 5 rows)

  const lead: SectionLead = config.sectionLead || SECTION_LEADS[config.categoryKey] || SECTION_LEADS[config.slug] || DEFAULT_INQUIRY_LEAD;

  const handleCopyPhone = (phoneNum: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phoneNum);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  useEffect(() => {
    const loadBanner = () => {
      const banner = getPromoBannerForCategory(config.categoryKey || config.slug);
      setPromoBanner(banner);
    };
    loadBanner();
    window.addEventListener('bitium_promo_banners_updated', loadBanner);
    return () => window.removeEventListener('bitium_promo_banners_updated', loadBanner);
  }, [config.categoryKey, config.slug]);

  useEffect(() => {
    setActiveSub(subParam);
    setCurrentPage(1);
  }, [subParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

const SUBCATEGORY_ALIASES: Record<string, string[]> = {
  // Screen printing aliases
  'artwork': ['artwork', 'vector-artwork', 'vector-design', 'vector-art', 'vector-designs', 'artwork-design', 'vector-artwork-design', 'vector'],
  'screen-exposed': ['screen-exposed', 'exposed-screens', 'exposed-screen', 'screen-exposure', 'exposed-frame'],
  'tracing-printouts': ['tracing-printouts', 'tracing-printout', 'tracing-film', 'tracing-paper', 'tracing-sheets'],
  'positive-printouts': ['positive-printouts', 'positive-printout', 'positive-film', 'positives', 'positive-sheet', 'positive-films'],
  'cmyk-halftone': ['cmyk-halftone', 'cmyk-halftones', 'cmyk-separation', 'cmyk-film', 'cmyk-process', 'cmyk'],
  'one-color': ['one-color', '1-color', 'single-color', '1-color-screen'],
  'two-color': ['two-color', '2-color', 'dual-color', '2-color-screen'],
  'three-color': ['three-color', '3-color', 'triple-color', '3-color-screen'],
  'four-color': ['four-color', '4-color', 'quad-color', '4-color-screen'],

  // Stencil aliases
  'hand-painting': ['hand-painting', 'hand-painted', 'handpaint', 'handpainting', 'hand-painting-stencil'],
  'saree': ['saree', 'sarees', 'saree-border', 'saree-design', 'sari', 'sari-border', 'saree-stencils', 'saree-dtf'],
  'tote-bags': ['tote-bags', 'tote-bag', 'totebags', 'totebag', 'tote-bag-stencil'],
  'batik': ['batik', 'batik-patterns', 'batik-pattern', 'batik-stencil'],
  'wall-decoration': ['wall-decoration', 'wall-decor', 'walldecor', 'wall-art', 'wall-pattern'],
  'titanium': ['titanium', 'titanium-stencil', 'titanium-sheet'],

  // DTF aliases
  'tshirt-design': ['tshirt-design', 't-shirt-design', 'tshirt', 't-shirt', 't-shirt-designs', 'tshirt-designs', 't-shirt-dtf'],
  'dtf-sticker': ['dtf-sticker', 'dtf-stickers', 'dtf-sticker-sheet', 'dtf-stickers-pack'],
  'dtf-cloth': ['dtf-cloth', 'dtf-cloth-transfers', 'cloth-transfers', 'dtf-fabric', 'dtf-cloth-sheet'],
  'men': ['men', 'mens', 'men-apparel', 'mens-wear', 'mens-apparel'],
  'women': ['women', 'womens', 'women-apparel', 'womens-wear', 'womens-apparel'],
  'kids': ['kids', 'children', 'kids-apparel', 'childrens-apparel'],
  'logo-size': ['logo-size', 'logo-2-5-x-2-5', 'logo-2-5x2-5', 'logo-25x25', 'logo'],
  'a6-size': ['a6-size', 'a6-6-x-4', 'a6-6x4', 'a6'],
  'a5-size': ['a5-size', 'a5-8-x-5', 'a5-8x5', 'a5'],
  'a4-size': ['a4-size', 'a4-8-x-11', 'a4-8x11', 'a4'],
  'a3-size': ['a3-size', 'a3-11-x-16', 'a3-11x16', 'a3'],
  'a2-size': ['a2-size', 'a2-16-x-23', 'a2-16x23', 'a2'],
  '1m-size': ['1m-size', '1m-22-x-40', '1m-22x40', '1m', '1-meter', '1meter'],

  // Batik Stamp / Block Designs aliases
  'cap-batik': ['cap-batik', 'cap-batik-stamps', 'cap-batik-stamp', 'copper-cap-batik', 'cap-batik-stamp-copper'],
  'wooden-blocks': ['wooden-blocks', 'wood-blocks', 'wood-block', 'wooden-block', 'wooden-stamps', 'wood-printing-block', 'wooden-printing-blocks'],

  // Laser cutting aliases
  'acrylic': ['acrylic', 'acrylic-cut', 'acrylic-signs', 'acrylic-engrave', 'acrylic-cut-signs', 'acrylic-cut-and-signs'],
  'wood': ['wood', 'wood-engraving', 'wood-cut', 'wooden-craft', 'wood-laser-cut'],
  'custom-profile': ['custom-profile', 'custom-profiles', 'custom-cutting', 'custom-shape', 'custom-laser-profiles'],

  // Materials aliases
  'screen-printing-consumables': ['screen-printing-consumables', 'screen-printing-consumable', 'screen-consumables', 'screen-ink-chemicals', 'screen-printing-materials'],
  'hand-painting-consumables': ['hand-painting-consumables', 'hand-painting-consumable', 'hand-paint-consumables', 'fabric-paint-consumables', 'hand-painting-materials'],
  'other-consumables': ['other-consumables', 'dtf-consumables', 'dtf-inks-and-films', 'printing-materials', 'other-printing-consumables'],

  // Other aliases
  'custom': ['custom', 'custom-production'],
  'accessories': ['accessories', 'accessories-and-tools', 'tools-and-accessories'],
  'merchandise': ['merchandise', 'custom-merchandise'],
  'other': ['other', 'general', 'misc', 'miscellaneous'],
};

function normalizeSub(s: string): string {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function matchesSingleSub(singleProductSub: string, activeSub: string): boolean {
  const normProduct = normalizeSub(singleProductSub);
  const normActive = normalizeSub(activeSub);

  if (!normProduct || !normActive) return false;

  // 1. Direct exact normalized match
  if (normProduct === normActive) return true;

  // 2. Check if normProduct matches activeSub's defined aliases
  const activeAliases = SUBCATEGORY_ALIASES[normActive] || [];
  if (activeAliases.some(alias => normalizeSub(alias) === normProduct)) {
    return true;
  }

  // 3. Reverse check: if product's sub is defined as a key in SUBCATEGORY_ALIASES, check if normActive is in its aliases
  const productAliases = SUBCATEGORY_ALIASES[normProduct] || [];
  if (productAliases.some(alias => normalizeSub(alias) === normActive)) {
    return true;
  }

  return false;
}

function matchesSubCategory(productSub: string | undefined, activeSub: string, allKnownSubIds: string[]): boolean {
  const normActive = normalizeSub(activeSub);

  if (!productSub || !productSub.trim()) {
    // If product has no subcategory, show it under 'other' / 'other-consumables' tab only
    return normActive === 'other' || normActive === 'other-consumables';
  }

  // Split multiple comma or semicolon separated subcategories
  const subItems = productSub.split(/[,;/]+/).map(s => s.trim()).filter(Boolean);
  if (subItems.length === 0) {
    return normActive === 'other' || normActive === 'other-consumables';
  }

  const isOtherTab = normActive === 'other' || normActive === 'other-consumables';
  if (isOtherTab) {
    // Check if it explicitly matches 'other' / 'other-consumables'
    const explicitlyMatchesOther = subItems.some(subItem => matchesSingleSub(subItem, activeSub));
    if (explicitlyMatchesOther) return true;

    // Fallback: match only if the product's subcategory does NOT match ANY OTHER tab on this category page
    const matchesAnyOtherTab = subItems.some(subItem => {
      return allKnownSubIds.some(subId => {
        const normSubId = normalizeSub(subId);
        if (normSubId === 'other' || normSubId === 'other-consumables') return false;
        return matchesSingleSub(subItem, subId);
      });
    });

    return !matchesAnyOtherTab;
  }

  // If a specific subcategory tab is active:
  return subItems.some(subItem => matchesSingleSub(subItem, activeSub));
}

  // Filter products
  const filteredProducts = useMemo(() => {
    const allKnownSubIds = config.subCategories.map((s) => s.id);
    return initialProducts.filter((p) => {
      if (activeSub && !matchesSubCategory(p.sub_category, activeSub, allKnownSubIds)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.sub_category && p.sub_category.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [initialProducts, activeSub, searchQuery, config.subCategories]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return list.reverse();
      case 'featured':
      default:
        // Prioritize pinned products to the very top
        return list.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const handleSubSelect = (subId: string | null) => {
    setActiveSub(subId);
    if (subId) {
      router.push(`/${config.slug}?sub=${subId}`, { scroll: false });
    } else {
      router.push(`/${config.slug}`, { scroll: false });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Canonical Link & Schema */}
      <link rel="canonical" href={config.seo.canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: config.seo.title,
            description: config.seo.description,
            url: config.seo.canonicalUrl,
          }),
        }}
      />

      {/* ── TOP BANNER HEADER SECTION (Clean e-commerce studio header matching target screenshot) ── */}
      <header className="relative bg-white dark:bg-[#080d1a] border-b border-slate-200/80 dark:border-white/10 overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Right side Contextual Image with Seamless Smooth Gradient Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-1/2 lg:w-5/12 pointer-events-none select-none z-0 hidden sm:block overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              key={config.heroImage}
              src={config.heroImage}
              alt={config.titlePrimary}
              fill
              priority
              unoptimized
              quality={90}
              className="object-cover object-center opacity-90 dark:opacity-85 transition-opacity duration-300"
              style={{
                maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
              }}
            />
            {/* Smooth Top & Bottom subtle edge blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-[#080d1a]/50 via-transparent to-white/20 dark:to-[#080d1a]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 dark:from-[#080d1a]/80 via-transparent to-transparent" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400 mb-4">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold">
              {config.breadcrumbName}
            </span>
          </nav>

          {/* Title & Description */}
          <div className="max-w-2xl mb-8">
            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-3">
              {config.titlePrimary}{' '}
              <span className="text-emerald-600 dark:text-[#2CFF05] drop-shadow-sm">
                {config.titleHighlight}
              </span>
            </h1>
            <p className="text-slate-600 dark:text-zinc-300 text-sm sm:text-[15px] leading-relaxed max-w-xl font-normal">
              {config.description}
            </p>
          </div>

          {/* Section In-Charge Contact Card */}
          {lead && (
            <div className="mb-6 inline-flex flex-col gap-1.5 rounded-2xl bg-white dark:bg-card/70 border border-slate-200/90 dark:border-white/15 p-3 shadow-sm relative overflow-hidden transition-all max-w-fit">
              <div className="relative z-10 flex flex-col gap-1.5">
                {/* Lead Name */}
                <h3 className="font-heading font-black text-sm sm:text-base text-slate-800 dark:text-white tracking-wide">
                  {lead.name}
                </h3>

                {/* Contact Pill (Phone, WhatsApp, Copy) */}
                <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-black/60 border border-slate-200/90 dark:border-white/10 py-1.5 px-3 rounded-xl shadow-xs dark:shadow-inner">
                  {/* Phone Call Link */}
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-2 group/phone text-emerald-700 dark:text-[#2CFF05] font-black text-xs sm:text-sm tracking-wider hover:text-emerald-600 dark:hover:brightness-125 transition-all"
                    title={`Call ${lead.name} (${lead.phone})`}
                  >
                    <Phone size={14} className="text-emerald-600 dark:text-[#2CFF05] group-hover/phone:scale-110 transition-transform" />
                    <span>{lead.phone}</span>
                  </a>

                  {/* Vertical separator */}
                  <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-white/10" />

                  {/* WhatsApp Action Button */}
                  <a
                    href={`https://wa.me/${lead.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:text-white dark:hover:text-white bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/25 dark:border-emerald-500/30 transition-all cursor-pointer"
                    title={`Chat with ${lead.name} on WhatsApp`}
                    aria-label={`WhatsApp ${lead.name}`}
                  >
                    <MessageCircle size={14} />
                  </a>

                  {/* Copy Phone Button */}
                  <button
                    onClick={() => handleCopyPhone(lead.phone)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer relative"
                    title="Copy Phone Number"
                    aria-label="Copy Phone Number"
                  >
                    {copiedPhone ? (
                      <Check size={14} className="text-emerald-600 dark:text-[#2CFF05]" />
                    ) : (
                      <Copy size={14} />
                    )}
                    {copiedPhone && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-600 dark:bg-[#2CFF05] text-white dark:text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar & Sort Dropdown Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400"
              />
              <input
                type="text"
                placeholder={config.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 dark:bg-card/70 border border-slate-200/90 dark:border-white/15 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2CFF05] focus:ring-2 focus:ring-emerald-500/10 dark:focus:ring-[#2CFF05]/10 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown & Total Items Counter */}
            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-slate-50 dark:bg-card/70 border border-slate-200/90 dark:border-white/15 text-xs font-semibold text-slate-900 dark:text-white py-2 pl-3.5 pr-8 rounded-full focus:outline-none focus:border-emerald-500 dark:focus:border-[#2CFF05] cursor-pointer shadow-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Alphabetical (A-Z)</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Total Items Counter */}
              <div className="text-xs font-semibold text-slate-600 dark:text-zinc-300 shrink-0 bg-slate-50 dark:bg-card/70 border border-slate-200/90 dark:border-white/15 py-2 px-3.5 rounded-full shadow-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? config.itemSingular : config.itemPlural}
              </div>
            </div>
          </div>

          {/* Subcategory Filter Pills Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* All Pill */}
            <button
              onClick={() => handleSubSelect(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                activeSub === null
                  ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-md shadow-[#2CFF05]/20 scale-105'
                  : 'bg-slate-50 dark:bg-card/70 border border-slate-200/90 dark:border-white/15 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>

            {/* Subcategories */}
            {config.subCategories.map((sub) => {
              const isSelected = activeSub === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubSelect(sub.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                    isSelected
                      ? 'bg-[#2CFF05] text-[#0a0a0a] font-bold shadow-md shadow-[#2CFF05]/20 scale-105'
                      : 'bg-slate-50 dark:bg-card/70 border border-slate-200/90 dark:border-white/15 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── MAIN PRODUCT CATALOG GRID (Compact 4-Column Grid) ── */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border p-3.5 h-[380px] flex flex-col justify-between"
              >
                <div className="w-full aspect-[3/4] rounded-xl bg-slate-100 dark:bg-muted" />
                <div className="space-y-2 mt-3">
                  <div className="h-3 w-1/3 bg-slate-100 dark:bg-muted rounded" />
                  <div className="h-4 w-4/5 bg-slate-100 dark:bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-slate-100 dark:bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-card/40 rounded-3xl border border-slate-200 dark:border-border shadow-sm">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-muted flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No {config.itemPlural} Found
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
              We couldn't find anything matching your search criteria. Try clearing filters or using different keywords.
            </p>
            <button
              onClick={() => {
                setActiveSub(null);
                setSearchQuery('');
                router.push(`/${config.slug}`, { scroll: false });
              }}
              className="mt-5 px-5 py-2.5 rounded-full bg-[#2CFF05] text-xs font-bold text-[#0a0a0a] hover:bg-[#3af816] transition-all shadow-md shadow-[#2CFF05]/20"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* 4-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {paginatedProducts.map((product, idx) => {
                // Determine Badge type
                const isSale = !!product.original_price && product.original_price > product.price;
                const isPopular = idx % 5 === 1;
                const isNew = idx % 3 === 0 && !isSale;

                // Formatted category tag
                const subLabel = product.sub_category
                  ? product.sub_category.replace(/-/g, ' ').toUpperCase()
                  : config.itemSingular.toUpperCase();

                return (
                  <div
                    key={product.id}
                    className={`group relative rounded-2xl border bg-white dark:bg-card/90 hover:border-emerald-500/40 dark:hover:border-[#2CFF05]/50 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 flex flex-col p-3 sm:p-3.5 shadow-sm ${
                      product.is_pinned
                        ? 'border-emerald-500/60 dark:border-[#2CFF05]/60 ring-1 ring-emerald-500/20 dark:ring-[#2CFF05]/20 shadow-emerald-500/5 dark:shadow-[#2CFF05]/5'
                        : 'border-slate-200/90 dark:border-white/10'
                    }`}
                  >
                    {/* Watermarked Image Wrapper (Portrait 3:4 with Hover Auto-Slideshow) */}
                    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-white/10 mb-3 select-none">
                      <ProductCardMediaCarousel
                        mainImage={product.image_url}
                        mockupUrls={product.mockup_urls}
                        alt={product.name}
                        watermarkText="Bitium Technology"
                        aspectRatio="3/4"
                        className="w-full h-full object-cover"
                      />

                      {/* Badges on Top-Left */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-30 pointer-events-none">
                        {product.is_pinned && (
                          <span className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-emerald-500 text-white font-black text-[9px] uppercase tracking-wide shadow-sm flex items-center gap-1">
                            📌 PINNED
                          </span>
                        )}
                        {isSale && (
                          <span className="px-2 py-0.5 rounded bg-[#ff1a3c] text-white font-black text-[9px] uppercase tracking-wide shadow-sm">
                            SALE
                          </span>
                        )}
                        {isPopular && !isSale && !product.is_pinned && (
                          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-[#2CFF05]/40 text-[#2CFF05] font-black text-[9px] uppercase tracking-wide shadow-sm">
                            POPULAR
                          </span>
                        )}
                        {isNew && !isSale && !isPopular && !product.is_pinned && (
                          <span className="px-2 py-0.5 rounded bg-[#2CFF05] text-[#0a0a0a] font-black text-[9px] uppercase tracking-wide shadow-sm">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Quick Zoom / Preview Eye Icon on Top-Right */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPreviewImageIndex(0);
                          setPreviewProduct(product);
                        }}
                        aria-label={`Quick Zoom Preview for ${product.name}`}
                        title="Quick Zoom & Preview"
                        className="group/btn absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 shadow-md backdrop-blur-md flex items-center justify-center transition-all z-30 hover:bg-[#2CFF05] hover:text-black dark:hover:bg-[#2CFF05] dark:hover:text-black dark:hover:border-[#2CFF05] hover:scale-110 cursor-pointer pointer-events-auto"
                      >
                        <Eye size={13} className="text-slate-800 dark:text-white group-hover/btn:text-black transition-colors" />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-grow">
                      {/* Subcategory Label */}
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-[#2CFF05] uppercase tracking-wider mb-1 truncate">
                        {subLabel}
                      </span>

                      {/* Product Title */}
                      <h3 className="font-heading font-bold text-[13px] sm:text-[14px] text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-[#2CFF05] transition-colors mb-2">
                        {product.name}
                      </h3>

                      {/* Price Row */}
                      <div className="mt-auto pt-1 flex items-baseline gap-2">
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-xs text-slate-400 dark:text-zinc-500 line-through">
                            Rs. {product.original_price.toLocaleString()}
                          </span>
                        )}
                        <span className="font-heading font-black text-[14px] sm:text-[15px] text-emerald-600 dark:text-[#2CFF05]">
                          From Rs. {product.price.toLocaleString()}
                        </span>
                      </div>

                      {/* View Product Link */}
                      <Link
                        href={`/products/${product.id}`}
                        className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#2CFF05] transition-colors"
                      >
                        <span>View {config.itemSingular}</span>
                        <ArrowRight
                          size={13}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls (Matching Target Design: 10 items per page with clean pills) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14 pt-6 border-t border-slate-200/60 dark:border-white/5">
                {/* Prev button */}
                <button
                  onClick={() => {
                    const nextP = Math.max(1, currentPage - 1);
                    setCurrentPage(nextP);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1329]/80 text-slate-600 dark:text-zinc-300 hover:border-emerald-500 dark:hover:border-[#2CFF05]/50 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page Number Pills */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isCurrent = currentPage === page;
                  return (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-full text-xs font-black transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-lg shadow-[#2CFF05]/30 scale-105'
                          : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1329]/80 text-slate-700 dark:text-zinc-300 hover:border-emerald-500/50 dark:hover:border-[#2CFF05]/40 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next button */}
                <button
                  onClick={() => {
                    const nextP = Math.min(totalPages, currentPage + 1);
                    setCurrentPage(nextP);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1329]/80 text-slate-600 dark:text-zinc-300 hover:border-emerald-500 dark:hover:border-[#2CFF05]/50 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
                  aria-label="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── AFTER LISTINGS - Rich SEO Content Section ── */}
        {config.afterListings && config.afterListings.sections.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200/80 dark:border-white/10">
            <div className="max-w-4xl">
              {config.afterListings.sections.map((section, i) => (
                <div key={i} className={i > 0 ? 'mt-10' : ''}>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white mb-3">
                    {section.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {section.content}
                  </p>
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2.5">
                      {section.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-300">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#2CFF05] shrink-0" />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── BOTTOM VALUE PROPS SECTION (3 Clean Info Boxes matching target screenshot) ── */}
        <section className="mt-16 pt-10 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Card 1: Why Choose Us */}
          <div className="md:col-span-5 bg-white dark:bg-card/70 rounded-2xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mb-4">
              {config.whyChooseUs.title}
            </h3>
            <div className="space-y-4">
              {config.whyChooseUs.features.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-[#2CFF05]/15 border border-emerald-500/25 dark:border-[#2CFF05]/30 flex items-center justify-center text-emerald-600 dark:text-[#2CFF05] shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Perfect For */}
          <div className="md:col-span-4 bg-white dark:bg-card/70 rounded-2xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-col">
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mb-4">
              {config.perfectFor.title || 'Perfect for'}
            </h3>
            <div className="grid grid-cols-2 gap-3.5 my-auto">
              {config.perfectFor.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group/item">
                  <span className="text-emerald-600 dark:text-[#2CFF05] shrink-0 text-sm">
                    {item.icon}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-white hover:text-emerald-600 dark:hover:text-[#2CFF05] transition-colors cursor-pointer">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Need a Custom Solution / Offer Advertisement Card */}
          {(() => {
            const hasCustomBanner = promoBanner && promoBanner.isActive;
            const title = hasCustomBanner ? promoBanner.title : config.customCta.title;
            const desc = hasCustomBanner ? promoBanner.desc : config.customCta.desc;
            const buttonText = hasCustomBanner ? promoBanner.buttonText : config.customCta.buttonText;
            const buttonHref = hasCustomBanner ? promoBanner.buttonHref : config.customCta.buttonHref;
            const badgeText = hasCustomBanner ? promoBanner.badgeText : undefined;
            const imageUrl = hasCustomBanner ? promoBanner.imageUrl : undefined;
            const theme = hasCustomBanner ? promoBanner.theme : 'neon-green';

            const themeColor = theme === 'amber-gold' ? '#F59E0B'
              : theme === 'cyber-blue' ? '#06B6D4'
              : theme === 'rose-red' ? '#F43F5E'
              : theme === 'purple-glow' ? '#A855F7'
              : '#2CFF05';

            const buttonTextColor = theme === 'neon-green' ? '#0a0a0a' : '#ffffff';

            return (
              <div className="md:col-span-3 bg-white dark:bg-card/70 rounded-2xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                
                {imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-40 bg-slate-100 dark:bg-black/40 relative z-10">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-32 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="relative z-10">
                  {badgeText && (
                    <div 
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2.5 border"
                      style={{
                        borderColor: `${themeColor}60`,
                        backgroundColor: `${themeColor}20`,
                        color: themeColor
                      }}
                    >
                      <Sparkles size={10} />
                      <span>{badgeText}</span>
                    </div>
                  )}

                  <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-5">
                    {desc}
                  </p>
                </div>

                <div className="relative z-10">
                  <Link
                    href={buttonHref}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
                    style={{
                      backgroundColor: themeColor,
                      color: buttonTextColor,
                      boxShadow: `0 4px 14px ${themeColor}35`
                    }}
                  >
                    <span>{buttonText}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Subtle background illustration glow */}
                <div 
                  className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-xl pointer-events-none opacity-25" 
                  style={{ backgroundColor: themeColor }}
                />
              </div>
            );
          })()}
        </section>

        {/* ── QUICK ZOOM & PREVIEW MODAL ── */}
        {previewProduct && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
            onClick={() => setPreviewProduct(null)}
          >
            <div 
              className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setPreviewProduct(null)}
                aria-label="Close Preview"
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-card border border-slate-200 dark:border-border text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Interactive Pan & Zoom Image Viewer on Left */}
              <div className="w-full md:w-1/2 shrink-0 flex flex-col gap-3">
                {(() => {
                  const previewSlides = [
                    previewProduct.image_url,
                    ...(previewProduct.mockup_urls || []),
                  ].filter(Boolean);
                  const activeSrc = previewSlides[previewImageIndex] || previewProduct.image_url;

                  return (
                    <>
                      <InteractiveZoomViewer
                        src={activeSrc}
                        alt={previewProduct.name}
                      />
                      {previewSlides.length > 1 && (
                        <div className="flex items-center gap-2">
                          {previewSlides.map((imgSrc, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPreviewImageIndex(idx)}
                              className={`relative h-12 w-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer p-0.5 bg-card ${
                                previewImageIndex === idx
                                  ? 'border-[#2CFF05] shadow-md shadow-[#2CFF05]/20 ring-1 ring-[#2CFF05]'
                                  : 'border-border/60 opacity-70 hover:opacity-100 hover:border-white/50'
                              }`}
                            >
                              <div className="relative w-full h-full rounded-[4px] overflow-hidden">
                                <Image
                                  src={imgSrc}
                                  alt={`View ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Product Details & Actions on Right */}
              <div className="flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2CFF05]/10 text-emerald-700 dark:text-[#2CFF05] border border-[#2CFF05]/25 text-[10px] font-black uppercase tracking-wider">
                      {previewProduct.sub_category ? previewProduct.sub_category.replace(/-/g, ' ') : config.itemSingular}
                    </span>
                    {previewProduct.is_active && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Available
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                    {previewProduct.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {previewProduct.description || 'Custom professional quality craftsmanship produced directly by Bitium Technology.'}
                  </p>

                  <div className="pt-2 flex items-baseline gap-2">
                    {previewProduct.original_price && previewProduct.original_price > previewProduct.price && (
                      <span className="text-xs text-slate-400 dark:text-zinc-500 line-through">
                        Rs. {previewProduct.original_price.toLocaleString()}
                      </span>
                    )}
                    <span className="font-heading font-black text-xl text-emerald-600 dark:text-[#2CFF05]">
                      From Rs. {previewProduct.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-border/60">
                  <Link
                    href={`/products/${previewProduct.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#2CFF05] hover:bg-[#3af816] text-[#0a0a0a] text-xs font-black uppercase tracking-wider shadow-lg shadow-[#2CFF05]/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>View Sizes & Customize Order</span>
                    <ExternalLink size={14} />
                  </Link>

                  <a
                    href={`https://wa.me/94770000000?text=${encodeURIComponent(`Hello Bitium Technology, I would like to inquire about ${previewProduct.name} (Rs. ${previewProduct.price})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-card text-xs font-bold text-slate-700 dark:text-white transition-colors cursor-pointer"
                  >
                    <MessageCircle size={14} className="text-emerald-500" />
                    <span>Quick WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
