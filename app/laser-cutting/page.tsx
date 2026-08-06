'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProducts, Product } from '@/lib/products';
import HoverZoomImage from '@/components/ui/HoverZoomImage';
import CatalogPagination from '@/components/CatalogPagination';
import { Scissors, Search, ChevronRight, Home } from 'lucide-react';

function LaserCuttingContent() {
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
      const items = data.filter((p) => p.category === 'laser-cutting');
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
    { id: 'acrylic', label: 'Acrylic Cut & Engrave' },
    { id: 'wood', label: 'Wood Engraving' },
    { id: 'custom-profile', label: 'Custom Profiles' }
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
            <span className="text-rose-400 font-semibold">Laser Cutting</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
                <Scissors size={13} />
                <span>Precision Custom Cutting & Engraving</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Laser Cutting</h1>
              <p className="text-muted-foreground text-sm mt-2 max-w-xl">
                Custom laser-cut acrylics, engraved wood panels, and multi-layer precision cut profiles for signage, decor, and structural pieces.
              </p>
              <p className="text-rose-300 text-sm mt-4 font-medium max-w-2xl leading-relaxed border-l-2 border-rose-500 pl-4">
                Precision CO2 laser cutting for acrylic, wood, and custom profiles - cut and engraved straight from your file, no tooling required.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search custom cuts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-8">
            <button
              onClick={() => setActiveSub(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSub === null ? 'bg-rose-600 text-foreground shadow-lg shadow-rose-600/20' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              All Items ({products.length})
            </button>
            {subCategories.map((sub) => {
              const count = products.filter((p) => p.sub_category === sub.id).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSub === sub.id
                      ? 'bg-rose-600 text-foreground shadow-lg shadow-rose-600/20'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {sub.label} ({count})
                </button>
              );
            })}
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
            <Scissors size={40} className="mx-auto text-zinc-600 mb-3" />
            <h3 className="text-lg font-bold">No Products Found</h3>
            <p className="text-muted-foreground text-xs mt-1">Try resetting your filters or search keywords.</p>
            <button
              onClick={() => {
                setActiveSub(null);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-foreground hover:bg-rose-500 transition-all"
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
                className="group relative rounded-2xl border border-border bg-card/40 hover:border-rose-500/40 hover:bg-card/80 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-background overflow-hidden">
                  <HoverZoomImage src={product.image_url} alt={product.name} sizes="(max-w-768px) 100vw, 400px" />
                  {product.original_price && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-rose-600 text-[10px] font-bold tracking-wide uppercase shadow-md">
                      Sale
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-card/80 backdrop-blur-md border border-border text-[10px] font-extrabold text-rose-300 uppercase tracking-wider">
                    {product.sub_category?.replace('-', ' ')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                    Laser Cut Profile
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
                      <p className="font-black text-rose-400 text-lg">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-foreground font-bold text-xs transition-all shadow-md hover:shadow-rose-600/20"
                    >
                      View Details
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
            <h2 className="text-2xl font-black text-foreground">How this is different from our stencil cutting</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our Stencil page is about laser-cut Mylar for painting and fabric work. This page is about cutting and engraving the material itself - acrylic signage, wooden nameplates, keychains, panels, and custom-shaped profiles you'd otherwise need a die or mold for.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">What you can order</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Custom-shaped acrylic pieces (signs, stands, awards, decor)</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Wood engraving - nameplates, coasters, gift pieces</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Cut-to-shape profiles from your own outline or logo</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Layered or multi-piece designs that assemble after cutting</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 p-6 rounded-2xl bg-card/50 border border-border">
              <h3 className="text-lg font-bold text-rose-300">Getting your file ready</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A vector file (SVG or AI) gives the cleanest result, since the laser follows the outline exactly. If you only have a photo or a rough sketch, send it anyway - we'll trace it into a cuttable file and confirm the outline with you before cutting.
              </p>
            </div>
            
            <div className="space-y-3 p-6 rounded-2xl bg-card/50 border border-border">
              <h3 className="text-lg font-bold text-rose-300">Material thickness matters</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Send us the thickness you're working with (or ask us to recommend one) - it changes cutting speed, how fine a detail can hold its shape, and whether engraving or a full cut-through is the better call for your design.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-card/50 border border-border">
              <h3 className="text-lg font-bold text-rose-300">Who this is for</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Small businesses needing signage or branded pieces, gift makers, hobbyists prototyping a shape before committing to a bigger batch, and anyone who needs one exact cut rather than a mass-produced stock shape.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
export default function LaserCuttingPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    }>
      <LaserCuttingContent />
    </Suspense>
  );
}
