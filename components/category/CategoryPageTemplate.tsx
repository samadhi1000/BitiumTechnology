'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/lib/products';
import HoverZoomImage from '@/components/ui/HoverZoomImage';
import { 
  Search, 
  ChevronRight, 
  Home, 
  Heart, 
  ArrowRight, 
  SlidersHorizontal, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';

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
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const itemsPerPage = 12; // 12 items for clean 4x3 desktop grid

  useEffect(() => {
    setActiveSub(subParam);
    setCurrentPage(1);
  }, [subParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      if (activeSub && p.sub_category !== activeSub) return false;
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
  }, [initialProducts, activeSub, searchQuery]);

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
        return list;
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
              src={config.heroImage}
              alt={config.titlePrimary}
              fill
              priority
              quality={90}
              className="object-cover object-center opacity-40 dark:opacity-30"
              style={{
                maskImage: 'linear-gradient(to left, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0) 100%)',
              }}
            />
            {/* Smooth Top & Bottom subtle edge blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#080d1a]/90 via-transparent to-white/50 dark:to-[#080d1a]/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-[#080d1a] via-transparent to-transparent" />
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

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
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
          </div>

          {/* Subcategory Filter Pills Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
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

            {/* Total Items Counter */}
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 shrink-0 ml-auto sm:ml-0">
              {filteredProducts.length} {filteredProducts.length === 1 ? config.itemSingular : config.itemPlural}
            </div>
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
                className="animate-pulse rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border p-3.5 h-[340px] flex flex-col justify-between"
              >
                <div className="w-full aspect-[4/3] rounded-xl bg-slate-100 dark:bg-muted" />
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
                const isFavorite = !!wishlist[product.id];
                
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
                    className="group relative rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card/90 hover:border-emerald-500/40 dark:hover:border-[#2CFF05]/50 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 flex flex-col p-3 sm:p-3.5 shadow-sm"
                  >
                    {/* Image Wrapper */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-white/10 mb-3 group/img">
                      <HoverZoomImage
                        src={product.image_url}
                        alt={product.name}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      />

                      {/* Badges on Top-Left */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        {isSale && (
                          <span className="px-2 py-0.5 rounded bg-[#ff1a3c] text-white font-black text-[9px] uppercase tracking-wide shadow-sm">
                            SALE
                          </span>
                        )}
                        {isPopular && !isSale && (
                          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-[#2CFF05]/40 text-[#2CFF05] font-black text-[9px] uppercase tracking-wide shadow-sm">
                            POPULAR
                          </span>
                        )}
                        {isNew && !isSale && !isPopular && (
                          <span className="px-2 py-0.5 rounded bg-[#2CFF05] text-[#0a0a0a] font-black text-[9px] uppercase tracking-wide shadow-sm">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Wishlist Heart Icon on Top-Right */}
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(product.id, e)}
                        aria-label="Add to Wishlist"
                        className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm z-10 ${
                          isFavorite
                            ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-500 border border-rose-200 dark:border-rose-800'
                            : 'bg-white/85 dark:bg-black/60 text-slate-500 dark:text-zinc-300 border border-slate-200/80 dark:border-white/15 hover:text-rose-500 hover:scale-110'
                        }`}
                      >
                        <Heart size={13} fill={isFavorite ? 'currentColor' : 'none'} />
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
                        className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-[#2CFF05] transition-colors"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-12 pt-8">
                {/* Prev button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-card text-slate-600 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm"
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
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-full text-xs font-bold transition-all shadow-sm ${
                        isCurrent
                          ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-md shadow-[#2CFF05]/20 scale-105'
                          : 'border border-slate-200 dark:border-white/15 bg-white dark:bg-card text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-card text-slate-600 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm"
                  aria-label="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
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
                <div key={i} className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-[#2CFF05] shrink-0 text-sm">
                    {item.icon}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Need a Custom Solution? */}
          <div className="md:col-span-3 bg-white dark:bg-card/70 rounded-2xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mb-2">
                {config.customCta.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-5">
                {config.customCta.desc}
              </p>
            </div>

            <div className="relative z-10">
              <Link
                href={config.customCta.buttonHref}
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full bg-[#2CFF05] text-[#0a0a0a] text-xs font-bold hover:bg-[#3af816] transition-all shadow-md shadow-[#2CFF05]/20 hover:scale-[1.02]"
              >
                <span>{config.customCta.buttonText}</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Subtle background illustration glow */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/10 dark:bg-[#2CFF05]/10 rounded-full blur-xl pointer-events-none" />
          </div>
        </section>
      </main>
    </div>
  );
}
