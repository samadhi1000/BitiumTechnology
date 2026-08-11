'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Grid, 
  Eye, 
  Shield, 
  Tag, 
  Download, 
  ShoppingBag, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Sparkles,
  Zap,
  Lock,
  Layers,
  Scissors,
  Printer,
  Shirt,
  Flame,
  Box
} from 'lucide-react';
import { loadPayHereScript } from '@/lib/payhere-loader';
import SecureWatermarkedImage from '@/components/SecureWatermarkedImage';

interface DigitalArtwork {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  preview_url: string;
  category: 'batik' | 'vector' | 'dtf' | 'wall-art';
  tags: string[];
  file_format: string;
  file_size?: string;
  resolution?: string;
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Designs' },
  { value: 'batik', label: 'Traditional Batik' },
  { value: 'vector', label: 'Vector & SVG' },
  { value: 'dtf', label: 'DTF Sheets' },
  { value: 'wall-art', label: 'Wall Decor' }
];

export default function DownloadsPage() {
  const [mounted, setMounted] = useState(false);
  const [artworks, setArtworks] = useState<DigitalArtwork[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedArt, setSelectedArt] = useState<DigitalArtwork | null>(null);
  
  // Checkout Modal State
  const [checkoutArt, setCheckoutArt] = useState<DigitalArtwork | null>(null);
  const [email, setEmail] = useState<string>('');
  const [checkingOut, setCheckingOut] = useState<boolean>(false);

  // Secure Fulfillment State (revealing Google Drive links)
  const [fulfillmentOrderId, setFulfillmentOrderId] = useState<string | null>(null);
  const [fulfillmentEmail, setFulfillmentEmail] = useState<string>('');
  const [fulfillmentLinks, setFulfillmentLinks] = useState<{ title: string; link: string }[]>([]);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<'idle' | 'verifying' | 'input_email' | 'ready' | 'error'>('idle');
  const [fulfillmentError, setFulfillmentError] = useState<string>('');

  const itemsPerPage = 12;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [category, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, search, sortBy]);

  // Handle PayHere Success/Cancel redirect detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const orderId = params.get('order_id');

    if (orderId) {
      if (status === 'success') {
        setFulfillmentOrderId(orderId);
        const storedEmail = localStorage.getItem(`bitium_order_email_${orderId}`);
        if (storedEmail) {
          setFulfillmentEmail(storedEmail);
          verifyFulfillment(orderId, storedEmail);
        } else {
          setFulfillmentStatus('input_email');
        }
      } else if (status === 'cancelled') {
        alert('Payment was cancelled. You can try checking out again.');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`/api/downloads?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setArtworks(data);
      }
    } catch (err) {
      console.error('Error loading digital downloads catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  // Securely query post-payment assets
  const verifyFulfillment = async (orderId: string, emailAddress: string, attempts = 0) => {
    setFulfillmentStatus('verifying');
    setFulfillmentError('');

    try {
      const res = await fetch('/api/downloads/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          email: emailAddress.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.downloads) {
        setFulfillmentLinks(data.downloads);
        setFulfillmentStatus('ready');
      } else {
        if (data.status === 'processing' && attempts < 4) {
          setTimeout(() => {
            verifyFulfillment(orderId, emailAddress, attempts + 1);
          }, 3000);
          return;
        }

        setFulfillmentStatus('error');
        setFulfillmentError(data.error || 'Unable to retrieve authorized download credentials. Please verify your email.');
      }
    } catch (err) {
      setFulfillmentStatus('error');
      setFulfillmentError('Network connection issue when checking asset fulfillment.');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutArt || !email) return;

    setCheckingOut(true);

    try {
      const isLoaded = await loadPayHereScript();
      if (!isLoaded || !(window as any).payhere) {
        alert('Payment gateway failed to initialize. Please try again.');
        setCheckingOut(false);
        return;
      }

      const res = await fetch('/api/checkout/digital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artwork_id: checkoutArt.id,
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.order_id) {
        localStorage.setItem(`bitium_order_email_${data.order_id}`, email.trim());

        (window as any).payhere.onCompleted = function onCompleted(orderId: string) {
          console.log('Payment completed. OrderID:' + orderId);
          window.location.href = data.return_url;
        };

        (window as any).payhere.onDismissed = function onDismissed() {
          console.log('Payment window closed by customer');
        };

        (window as any).payhere.onError = function onError(error: string) {
          console.log('Payment Error:' + error);
          alert('Payment failed: ' + error);
        };

        (window as any).payhere.startPayment(data);
      } else {
        alert(data.error || 'Failed to initialize checkout payment');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Network request failed. Unable to initiate gateway.');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleFulfillmentEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fulfillmentOrderId && fulfillmentEmail) {
      verifyFulfillment(fulfillmentOrderId, fulfillmentEmail);
    }
  };

  // Sort Artworks
  const sortedArtworks = useMemo(() => {
    const list = [...artworks];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'name':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'featured':
      default:
        return list;
    }
  }, [artworks, sortBy]);

  // Paginated list
  const totalPages = Math.ceil(sortedArtworks.length / itemsPerPage);
  const paginatedArtworks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedArtworks.slice(start, start + itemsPerPage);
  }, [sortedArtworks, currentPage, itemsPerPage]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Canonical Link & Schema */}
      <link rel="canonical" href="https://www.bitiumtechnology.com/downloads" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Digital Artwork Downloads | Bitium Technology',
            description: 'Download secure watermarked digital artwork vector files, stencils, and printing sheets.',
            url: 'https://www.bitiumtechnology.com/downloads',
          }),
        }}
      />

      {/* ── TOP BANNER HEADER SECTION ── */}
      <header className="relative bg-white dark:bg-[#080d1a] border-b border-slate-200/80 dark:border-white/10 overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Right side Contextual Image with Smooth Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-1/2 lg:w-5/12 pointer-events-none select-none z-0 hidden sm:block overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              key="/images/hero-cards/downloads.jpg"
              src="/images/hero-cards/downloads.jpg"
              alt="Digital Vector Assets"
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
              Digital Downloads
            </span>
          </nav>

          {/* Title & Description */}
          <div className="max-w-2xl mb-8">
            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-3">
              Digital Designs &{' '}
              <span className="text-emerald-600 dark:text-[#2CFF05] drop-shadow-sm">
                Downloads
              </span>
            </h1>
            <p className="text-slate-600 dark:text-zinc-300 text-sm sm:text-[15px] leading-relaxed max-w-xl font-normal">
              High-resolution vector files, batik layouts, laser cut paths, and DTF gang sheets with instant Google Drive delivery upon payment.
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
                placeholder="Search vector designs, SVG, stencils, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 dark:bg-card/70 border border-slate-200/90 dark:border-white/15 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2CFF05] focus:ring-2 focus:ring-emerald-500/10 dark:focus:ring-[#2CFF05]/10 shadow-sm transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
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
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_OPTIONS.map((opt) => {
                const isSelected = category === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setCategory(opt.value)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                      isSelected
                        ? 'bg-[#2CFF05] text-[#0a0a0a] font-bold shadow-md shadow-[#2CFF05]/20 scale-105'
                        : 'bg-slate-50 dark:bg-card/70 border border-slate-200/90 dark:border-white/15 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Total Items Counter */}
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 shrink-0 ml-auto sm:ml-0">
              {artworks.length} {artworks.length === 1 ? 'Design' : 'Designs'}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN PRODUCT CATALOG GRID ── */}
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
        ) : artworks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-card/40 rounded-3xl border border-slate-200 dark:border-border shadow-sm">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-muted flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Digital Designs Found
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
              We couldn't find anything matching your search criteria. Try clearing filters or using different keywords.
            </p>
            <button
              onClick={() => {
                setCategory('all');
                setSearch('');
              }}
              className="mt-5 px-5 py-2.5 rounded-full bg-[#2CFF05] text-xs font-bold text-[#0a0a0a] hover:bg-[#3af816] transition-all shadow-md shadow-[#2CFF05]/20"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* 4-Column Compact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {paginatedArtworks.map((art, idx) => {
                return (
                  <div
                    key={art.id}
                    className="group relative rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card/90 hover:border-emerald-500/40 dark:hover:border-[#2CFF05]/50 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 flex flex-col p-3 sm:p-3.5 shadow-sm"
                  >
                    {/* Watermarked Image Wrapper */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-white/10 mb-3 select-none">
                      <SecureWatermarkedImage
                        src={art.preview_url}
                        alt={art.title}
                        watermarkText="Bitium Technology"
                        aspectRatio="4/3"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Top-Left Category & Format Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-[#2CFF05]/40 text-[#2CFF05] font-black text-[9px] uppercase tracking-wide shadow-sm">
                          {art.file_format}
                        </span>
                      </div>

                      {/* Top-Right Quick Preview Spec Eye Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedArt(art)}
                        aria-label="Inspect Specs"
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/85 dark:bg-black/60 backdrop-blur-md border border-slate-200/80 dark:border-white/15 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-[#2CFF05] hover:scale-110 transition-all shadow-sm z-10"
                        title="View Artwork Details"
                      >
                        <Eye size={13} />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-grow">
                      {/* Category Label */}
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-[#2CFF05] uppercase tracking-wider mb-1 truncate">
                        {art.category.toUpperCase()} VECTOR
                      </span>

                      {/* Product Title */}
                      <h3 className="font-heading font-bold text-[13px] sm:text-[14px] text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-[#2CFF05] transition-colors mb-1">
                        {art.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                        {art.description}
                      </p>

                      {/* Price Row */}
                      <div className="mt-auto pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-bold tracking-wider block">
                            Instant Access
                          </span>
                          <span className="font-heading font-black text-[14px] sm:text-[15px] text-emerald-600 dark:text-[#2CFF05]">
                            Rs. {art.price.toLocaleString()}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCheckoutArt(art)}
                          className="px-3.5 py-1.5 rounded-full bg-[#2CFF05] hover:bg-[#3af816] text-[#0a0a0a] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#2CFF05]/15 transition-all hover:scale-105 cursor-pointer"
                        >
                          <ShoppingBag size={12} />
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-12 pt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-card text-slate-600 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

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

        {/* ── BOTTOM VALUE PROPS SECTION ── */}
        <section className="mt-16 pt-10 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Card 1: Why Choose Us */}
          <div className="md:col-span-5 bg-white dark:bg-card/70 rounded-2xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mb-4">
              Why choose our digital assets?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-[#2CFF05]/15 border border-emerald-500/25 dark:border-[#2CFF05]/30 flex items-center justify-center text-emerald-600 dark:text-[#2CFF05] shrink-0 mt-0.5">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white">
                    Clean Vector Geometry
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                    Optimized paths without broken nodes for seamless CNC & laser cuts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-[#2CFF05]/15 border border-emerald-500/25 dark:border-[#2CFF05]/30 flex items-center justify-center text-emerald-600 dark:text-[#2CFF05] shrink-0 mt-0.5">
                  <Zap size={16} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white">
                    Instant Google Drive Access
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                    Automated secure fulfillment delivers download links immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-[#2CFF05]/15 border border-emerald-500/25 dark:border-[#2CFF05]/30 flex items-center justify-center text-emerald-600 dark:text-[#2CFF05] shrink-0 mt-0.5">
                  <Lock size={16} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white">
                    Commercial License Included
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                    Full commercial usage rights for end-products and apparel prints.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Perfect For */}
          <div className="md:col-span-4 bg-white dark:bg-card/70 rounded-2xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-col">
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mb-4">
              Perfect for
            </h3>
            <div className="grid grid-cols-2 gap-3.5 my-auto">
              <div className="flex items-center gap-2">
                <Scissors size={14} className="text-emerald-600 dark:text-[#2CFF05]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-white hover:text-emerald-600 dark:hover:text-[#2CFF05] transition-colors cursor-pointer">
                  Laser Cutters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Printer size={14} className="text-emerald-600 dark:text-[#2CFF05]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-white hover:text-emerald-600 dark:hover:text-[#2CFF05] transition-colors cursor-pointer">
                  DTF Printers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shirt size={14} className="text-emerald-600 dark:text-[#2CFF05]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-white hover:text-emerald-600 dark:hover:text-[#2CFF05] transition-colors cursor-pointer">
                  Screen Printing
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Box size={14} className="text-emerald-600 dark:text-[#2CFF05]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-white hover:text-emerald-600 dark:hover:text-[#2CFF05] transition-colors cursor-pointer">
                  CNC Routing
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-emerald-600 dark:text-[#2CFF05]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-white hover:text-emerald-600 dark:hover:text-[#2CFF05] transition-colors cursor-pointer">
                  Vinyl Plotters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-emerald-600 dark:text-[#2CFF05]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-white hover:text-emerald-600 dark:hover:text-[#2CFF05] transition-colors cursor-pointer">
                  Print-on-Demand
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Need a Custom Vector? */}
          <div className="md:col-span-3 bg-white dark:bg-card/70 rounded-2xl border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mb-2">
                Need a custom vector?
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-5">
                We can digitize and vector convert any physical motif, photo, or sketch into clean cut paths.
              </p>
            </div>

            <div className="relative z-10">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full bg-[#2CFF05] text-[#0a0a0a] text-xs font-bold hover:bg-[#3af816] transition-all shadow-md shadow-[#2CFF05]/20 hover:scale-[1.02]"
              >
                <span>Request Custom Artwork</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/10 dark:bg-[#2CFF05]/10 rounded-full blur-xl pointer-events-none" />
          </div>
        </section>
      </main>

      {/* ── PORTAL MODALS MOUNTED DIRECTLY ON DOCUMENT.BODY ── */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <>
          {/* 1. Artwork Details Modal */}
          {selectedArt && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 dark:border-border bg-white dark:bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <button 
                  onClick={() => setSelectedArt(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer p-1.5 rounded-full bg-slate-100 dark:bg-background border border-slate-200 dark:border-border"
                >
                  <X size={16} />
                </button>
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-full sm:w-1/2 relative bg-slate-50 dark:bg-background rounded-2xl overflow-hidden select-none border border-slate-200 dark:border-border">
                    <SecureWatermarkedImage
                      src={selectedArt.preview_url}
                      alt={selectedArt.title}
                      watermarkText="Bitium Technology"
                      aspectRatio="1/1"
                    />
                  </div>
                  <div className="w-full sm:w-1/2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-emerald-600 dark:text-[#2CFF05] uppercase tracking-widest block">{selectedArt.category}</span>
                      <h2 className="text-xl font-black mt-1 text-slate-900 dark:text-white">{selectedArt.title}</h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">{selectedArt.description}</p>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-border mt-4">
                      <div className="flex justify-between text-xs"><span className="text-slate-500 dark:text-zinc-400">File Size:</span><span className="font-bold text-slate-900 dark:text-white">{selectedArt.file_size || 'N/A'}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-slate-500 dark:text-zinc-400">Format:</span><span className="font-bold text-emerald-600 dark:text-[#2CFF05]">{selectedArt.file_format}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-slate-500 dark:text-zinc-400">Resolution:</span><span className="font-bold text-slate-900 dark:text-white">{selectedArt.resolution || 'Vector'}</span></div>
                      <div className="flex justify-between text-xs pt-1 border-t border-slate-100 dark:border-border/60"><span className="text-slate-500 dark:text-zinc-400 font-bold">Secure Price:</span><span className="font-extrabold text-emerald-600 dark:text-[#2CFF05]">Rs. {selectedArt.price.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCheckoutArt(selectedArt);
                    setSelectedArt(null);
                  }}
                  className="w-full py-3.5 rounded-full bg-[#2CFF05] hover:bg-[#3af816] text-[#0a0a0a] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#2CFF05]/15"
                >
                  <ShoppingBag size={14} />
                  Confirm Checkout & Buy Now
                </button>
              </div>
            </div>
          )}

          {/* 2. Direct Checkout Email Input Modal */}
          {checkoutArt && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-border bg-white dark:bg-card p-6 sm:p-8 shadow-2xl space-y-5">
                <button 
                  onClick={() => setCheckoutArt(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer p-1.5 rounded-full bg-slate-100 dark:bg-background border border-slate-200 dark:border-border"
                  disabled={checkingOut}
                >
                  <X size={16} />
                </button>
                <div className="text-center space-y-2">
                  <span className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 dark:bg-[#2CFF05]/10 border border-emerald-500/30 dark:border-[#2CFF05]/30 text-emerald-600 dark:text-[#2CFF05] mb-1">
                    <Shield size={24} />
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Secure Checkout</h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                    You are purchasing <strong className="text-slate-900 dark:text-white">{checkoutArt.title}</strong> for <strong className="text-emerald-600 dark:text-[#2CFF05]">Rs. {checkoutArt.price.toLocaleString()}</strong>. Enter your email to confirm transaction and receive Google Drive access.
                  </p>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Customer Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={checkingOut}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-background text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#2CFF05] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={checkingOut}
                    className="w-full py-3.5 rounded-full bg-[#2CFF05] hover:bg-[#3af816] disabled:opacity-50 text-[#0a0a0a] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2CFF05]/15 cursor-pointer"
                  >
                    {checkingOut ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Validating Gateway...
                      </>
                    ) : (
                      <>
                        Proceed to Payment
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 3. Secure Asset Delivery Fulfillment Modal */}
          {fulfillmentOrderId && fulfillmentStatus !== 'idle' && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
              <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-border bg-white dark:bg-card p-6 sm:p-8 shadow-2xl space-y-6 text-center max-h-[90vh] overflow-y-auto">
                
                {fulfillmentStatus === 'verifying' && (
                  <div className="space-y-4 py-8">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600 dark:text-[#2CFF05] mx-auto" />
                    <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">Verifying Payment Status</h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                      We are securely checking your payment status with PayHere. Please do not close this window.
                    </p>
                    <div className="inline-block px-3 py-1.5 rounded-full bg-slate-100 dark:bg-background border border-slate-200 dark:border-border text-[10px] font-mono text-slate-600 dark:text-zinc-400">
                      Order ID: {fulfillmentOrderId}
                    </div>
                  </div>
                )}

                {fulfillmentStatus === 'input_email' && (
                  <div className="space-y-4 py-4">
                    <Shield className="w-12 h-12 text-emerald-600 dark:text-[#2CFF05] mx-auto animate-pulse" />
                    <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">Access Verification Required</h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      To securely download your digital products, please verify the customer email address used during checkout.
                    </p>
                    <form onSubmit={handleFulfillmentEmailSubmit} className="space-y-4 max-w-xs mx-auto">
                      <input
                        type="email"
                        required
                        placeholder="Enter your checkout email"
                        value={fulfillmentEmail}
                        onChange={(e) => setFulfillmentEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-background text-xs text-center text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#2CFF05] transition-colors"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 rounded-full bg-[#2CFF05] hover:bg-[#3af816] text-[#0a0a0a] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        Unlock My Downloads
                        <ArrowRight size={13} />
                      </button>
                    </form>
                  </div>
                )}

                {fulfillmentStatus === 'ready' && (
                  <div className="space-y-4 py-4 text-left">
                    <div className="text-center space-y-2 mb-4">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                      <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">Assets Unlocked!</h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Payment verified. High-resolution files have been successfully shared and are ready for download.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-widest block border-b border-slate-200 dark:border-border pb-1.5">Your Download Links</span>
                      <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                        {fulfillmentLinks.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-background border border-slate-200 dark:border-border rounded-2xl">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-[260px]">{item.title}</span>
                              <span className="text-[9px] text-slate-400 dark:text-zinc-400 uppercase block font-medium">Shared via Google Drive</span>
                            </div>
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#2CFF05] hover:bg-[#3af816] text-[#0a0a0a] font-bold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-md shadow-[#2CFF05]/10 cursor-pointer"
                            >
                              <Download size={13} />
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-border flex justify-between items-center text-[10px] text-slate-500 dark:text-zinc-400">
                      <span>Authorized to: {fulfillmentEmail}</span>
                      <button 
                        onClick={() => {
                          setFulfillmentOrderId(null);
                          setFulfillmentStatus('idle');
                          window.history.replaceState({}, document.title, window.location.pathname);
                        }}
                        className="underline text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {fulfillmentStatus === 'error' && (
                  <div className="space-y-4 py-6">
                    <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
                    <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">Fulfillment Error</h2>
                    <p className="text-xs text-rose-500 dark:text-rose-400 max-w-sm mx-auto leading-relaxed bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl">
                      {fulfillmentError}
                    </p>
                    <div className="flex gap-2 justify-center max-w-xs mx-auto pt-2">
                      <button
                        onClick={() => setFulfillmentStatus('input_email')}
                        className="w-1/2 py-2.5 rounded-full border border-slate-200 dark:border-border bg-white dark:bg-background text-xs font-bold text-slate-900 dark:text-white transition-colors cursor-pointer"
                      >
                        Try Another Email
                      </button>
                      <button
                        onClick={() => {
                          if (fulfillmentOrderId && fulfillmentEmail) {
                            verifyFulfillment(fulfillmentOrderId, fulfillmentEmail);
                          }
                        }}
                        className="w-1/2 py-2.5 rounded-full bg-[#2CFF05] hover:bg-[#3af816] text-[#0a0a0a] text-xs font-black transition-colors cursor-pointer"
                      >
                        Retry Verification
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setFulfillmentOrderId(null);
                        setFulfillmentStatus('idle');
                        window.history.replaceState({}, document.title, window.location.pathname);
                      }}
                      className="text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white underline cursor-pointer mt-4 block"
                    >
                      Close & Browse Products
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </div>
  );
}
