'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProducts, Product } from '@/lib/products';
import HoverZoomImage from '@/components/ui/HoverZoomImage';
import CatalogPagination from '@/components/CatalogPagination';
import { Layers, LayoutGrid, Shirt, Search, ChevronRight, Home, Sparkles } from 'lucide-react';

function DtfPrintingContent() {
  const searchParams = useSearchParams();
  const subParam = searchParams.get('sub');

  const [products, setProducts] = useState<Product[]>([]);
  const [activeSub, setActiveSub] = useState<string | null>(subParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const items = data.filter((p) => p.category === 'dtf_sheet');
      setProducts(items);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    setActiveSub(subParam);
    setCurrentPage(1);
  }, [subParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const subCategories = [
    { id: 'tshirt-design', label: 'T-Shirt Designs' },
    { id: 'dtf-sticker', label: 'DTF Sticker Rolls' },
    { id: 'dtf-cloth', label: 'DTF Cloth Transfers' }
  ];

  const filteredProducts = products.filter((p) => {
    if (activeSub && p.sub_category !== activeSub) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Header Banner */}
      <div className="border-b border-border hero-gradient py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground flex items-center gap-1">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#8DFF00] font-semibold">DTF Printing</span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9eff1a]/10 border border-[#8DFF00]/30 text-[#9eff1a] text-xs font-semibold mb-3">
                <Sparkles size={13} />
                <span>Next-Gen Direct-To-Film Transfers</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">DTF Printing</h1>
              <p className="text-muted-foreground text-sm mt-2 max-w-xl">
                High-definition DTF transfer films, custom t-shirt graphic sheets, sticker packs, and cloth transfer designs for industrial & custom print runs.
              </p>
              <p className="text-[#9eff1a] text-sm mt-4 font-medium max-w-2xl leading-relaxed border-l-2 border-[#8DFF00] pl-4">
                Custom gang sheet layouts, anime sticker packs, and cloth transfers - build your sheet online, preview it, and we print and ship it.
              </p>
            </div>

            {/* Quick Interactive Studio Links & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <Link
                href="/canvas"
                className="px-5 py-2.5 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] font-bold text-xs transition-all shadow-lg shadow-[#8DFF00]/25 flex items-center justify-center gap-2"
              >
                <LayoutGrid size={15} />
                <span>Launch DTF Canvas Builder</span>
              </Link>
              <Link
                href="/3d-customizer"
                className="px-5 py-2.5 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] font-bold text-xs transition-all shadow-lg shadow-[#8DFF00]/25 flex items-center justify-center gap-2"
              >
                <Shirt size={15} />
                <span>3D Mockup Studio</span>
              </Link>
            </div>
          </div>

          {/* Subcategory Pills & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveSub(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSub === null ? 'bg-[#8DFF00] text-[#0a0a0a] shadow-lg shadow-[#8DFF00]/20' : 'bg-card border border-border text-muted-foreground hover:text-[#0a0a0a]'
                }`}
              >
                All DTF Transfers ({products.length})
              </button>
              {subCategories.map((sub) => {
                const count = products.filter((p) => p.sub_category === sub.id).length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSub(sub.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSub === sub.id
                        ? 'bg-[#8DFF00] text-[#0a0a0a] shadow-lg shadow-[#8DFF00]/20'
                        : 'bg-card border border-border text-muted-foreground hover:text-[#0a0a0a]'
                    }`}
                  >
                    {sub.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search DTF sheets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-[#8DFF00] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse rounded-2xl bg-card border border-border h-[320px]"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-border">
            <Layers size={40} className="mx-auto text-zinc-600 mb-3" />
            <h3 className="text-lg font-bold">No DTF Products Found</h3>
            <p className="text-muted-foreground text-xs mt-1">Try resetting your filters or search keywords.</p>
            <button
              onClick={() => {
                setActiveSub(null);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#8DFF00] text-xs font-bold text-[#0a0a0a] hover:bg-[#9eff1a] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative rounded-2xl border border-border bg-card/40 hover:border-[#8DFF00]/40 hover:bg-card/80 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-background overflow-hidden">
                  <HoverZoomImage src={product.image_url} alt={product.name} sizes="(max-w-768px) 100vw, 400px" />
                  {product.original_price && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-rose-600 text-[10px] font-bold tracking-wide uppercase shadow-md">
                      Sale
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-card/80 backdrop-blur-md border border-border text-[10px] font-extrabold text-[#9eff1a] uppercase tracking-wider">
                    {product.sub_category?.replace('-', ' ')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-[#8DFF00] uppercase tracking-widest">
                    DTF Transfer Film
                  </span>
                  <h3 className="font-extrabold text-foreground text-base leading-snug line-clamp-1 mt-1">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-2 line-clamp-2 flex-grow leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <div>
                      {product.original_price && (
                        <span className="text-[10px] text-muted-foreground line-through block -mb-0.5">
                          Rs. {product.original_price.toLocaleString()}
                        </span>
                      )}
                      <p className="font-black text-[#8DFF00] text-lg">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={product.id.startsWith('b2a8') ? '/canvas' : `/products/${product.id}`}
                      className="px-4 py-2.5 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] font-bold text-xs transition-all shadow-md hover:shadow-[#8DFF00]/20"
                    >
                      {product.id.startsWith('b2a8') ? 'Start Custom Canvas' : 'Get Item'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            </div>
            
            <CatalogPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* After Listings Section */}
      <section className="border-t border-border bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">How a DTF order works</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your design gets printed onto film, layered with a white base so colors stay bright on any fabric color, then coated with a hot-melt powder. When it arrives, you heat-press it onto the garment - no screens, no setup, no minimum order.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">Why people choose DTF over screen printing</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9eff1a]" /> Works on cotton, polyester, and blends without changing your process</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9eff1a]" /> No cost jump for full-color or photo-style designs</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9eff1a]" /> Makes sense for a single shirt or a full gang sheet of small designs</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9eff1a]" /> Transfers store flat until you're ready to press them</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-card/50 border border-border">
              <h3 className="text-lg font-bold text-[#9eff1a]">Build your own sheet</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use the DTF Sheet Builder to lay out your designs, see exact spacing, and check the finished size before you pay - what you see in the builder is what gets printed.
              </p>
            </div>
            
            <div className="space-y-3 p-6 rounded-2xl bg-card/50 border border-border">
              <h3 className="text-lg font-bold text-[#9eff1a]">Turnaround</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Standard sheets ship within 24–48 hours of approval. Contact us for bulk orders.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default function DtfPrintingPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8DFF00]"></div>
      </div>
    }>
      <DtfPrintingContent />
    </Suspense>
  );
}
