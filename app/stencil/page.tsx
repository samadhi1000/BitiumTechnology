'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProducts, Product } from '@/lib/products';
import HoverZoomImage from '@/components/ui/HoverZoomImage';
import CatalogPagination from '@/components/CatalogPagination';
import { Palette, Filter, Search, Sparkles, ChevronRight, Home } from 'lucide-react';

function StencilContent() {
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
      const stencils = data.filter((p) => p.category === 'stencil');
      setProducts(stencils);
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
    { id: 'hand-painting', label: 'Hand Painting Stencils' },
    { id: 'saree', label: 'Saree Border Stencils' },
    { id: 'tote-bags', label: 'Tote Bag Stencils' },
    { id: 'batik', label: 'Batik Pattern Stencils' },
    { id: 'wall-decoration', label: 'Wall Decor Stencils' },
    { id: 'titanium', label: 'Industrial Titanium Stencils' }
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
    <div className="w-full min-h-screen bg-zinc-950 text-white">
      {/* Header Banner */}
      <div className="border-b border-zinc-900 bg-gradient-to-b from-violet-950/30 via-zinc-950 to-zinc-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} />
            <span className="text-violet-400 font-semibold">Stencils</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
                <Palette size={13} />
                <span>Precision Mylar & Metal Stencils</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Stencil Collection</h1>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl">
                Explore reusable precision laser-cut Mylar and titanium stencils for fabric hand-painting, saree borders, tote bags, and wall decorations.
              </p>
              <p className="text-violet-300 text-sm mt-4 font-medium max-w-2xl leading-relaxed border-l-2 border-violet-500 pl-4">
                Precision-cut Mylar stencils for saree work, hand painting, and wall art. Every stencil is laser-cut from your design, so the lines stay sharp no matter how detailed the pattern is.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search stencils..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-8">
            <button
              onClick={() => setActiveSub(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSub === null ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              All Stencils ({products.length})
            </button>
            {subCategories.map((sub) => {
              const count = products.filter((p) => p.sub_category === sub.id).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSub === sub.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
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
              <div key={n} className="animate-pulse rounded-2xl bg-zinc-900 border border-zinc-800 h-[320px]"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-900">
            <Palette size={40} className="mx-auto text-zinc-600 mb-3" />
            <h3 className="text-lg font-bold">No Stencils Found</h3>
            <p className="text-zinc-500 text-xs mt-1">Try resetting your filters or search keywords.</p>
            <button
              onClick={() => {
                setActiveSub(null);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-xs font-bold text-white hover:bg-violet-500 transition-all"
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
                className="group relative rounded-2xl border border-zinc-850 bg-zinc-900/40 hover:border-violet-500/40 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-zinc-950 overflow-hidden">
                  <HoverZoomImage src={product.image_url} alt={product.name} sizes="(max-w-768px) 100vw, 400px" />
                  {product.original_price && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-rose-600 text-[10px] font-bold tracking-wide uppercase shadow-md">
                      Sale
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-[10px] font-extrabold text-violet-300 uppercase tracking-wider">
                    {product.sub_category?.replace('-', ' ')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                    Stencil Pattern
                  </span>
                  <h3 className="font-extrabold text-zinc-100 text-base leading-snug line-clamp-1 mt-1">
                    {product.name}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-2 line-clamp-2 flex-grow leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-zinc-850 pt-4">
                    <div>
                      {product.original_price && (
                        <span className="text-[10px] text-zinc-500 line-through block -mb-0.5">
                          Rs. {product.original_price.toLocaleString()}
                        </span>
                      )}
                      <p className="font-black text-violet-400 text-lg">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all shadow-md hover:shadow-violet-600/20"
                    >
                      View Stencil
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
      <section className="border-t border-zinc-900 bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white">Why laser-cut stencils?</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Hand-cut stencils shift a little every time - a curve here, a corner there. A laser follows your file exactly, so if you're repeating a pattern across ten sarees or a whole wall mural, every cut matches the last one.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white">What you can use them for</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Saree and fabric block printing</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Wall art and mural templates</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Henna and hand-painting guides</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Repeat-pattern textile work</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-850">
              <h3 className="text-lg font-bold text-violet-300">Getting your design ready</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                You can send us a photo of a sketch, a vector file, or just describe what you want - we'll clean it up and turn it into a cuttable design before anything goes near the laser. If a detail is too fine to hold its shape once cut, we'll flag it and suggest a fix rather than print it as-is.
              </p>
            </div>
            
            <div className="space-y-3 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-850">
              <h3 className="text-lg font-bold text-violet-300">Turnaround</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Most stencil orders are ready within a couple of days, depending on size and how many you need cut. Contact us for bulk or urgent inquiries.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default function StencilPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    }>
      <StencilContent />
    </Suspense>
  );
}
