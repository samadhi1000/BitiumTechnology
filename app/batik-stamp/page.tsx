'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProducts, Product } from '@/lib/products';
import HoverZoomImage from '@/components/ui/HoverZoomImage';
import CatalogPagination from '@/components/CatalogPagination';
import { Stamp, Search, ChevronRight, Home } from 'lucide-react';

function BatikStampContent() {
  const searchParams = useSearchParams();
  const subParam = searchParams.get('sub');

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const items = data.filter((p) => p.category === 'batik-stamp');
      setProducts(items);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredProducts = products.filter((p) => {
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
      <div className="border-b border-zinc-900 bg-gradient-to-b from-amber-950/30 via-zinc-950 to-zinc-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} />
            <span className="text-amber-400 font-semibold">Batik Stamp</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
                <Stamp size={13} />
                <span>Traditional Copper & Wood Cap Batik Stamps</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Cap Batik Stamps</h1>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl">
                Authentic handcrafted copper and solid wood Cap Batik printing stamps for traditional fabric waxing, textile design, and batik manufacturing.
              </p>
              <p className="text-amber-300 text-sm mt-4 font-medium max-w-2xl leading-relaxed border-l-2 border-amber-500 pl-4">
                Traditional copper and hand-carved wood Cap Batik stamps, made the way batik makers have always made them.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search batik stamps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
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
              <div key={n} className="animate-pulse rounded-2xl bg-zinc-900 border border-zinc-800 h-[320px]"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-900">
            <Stamp size={40} className="mx-auto text-zinc-600 mb-3" />
            <h3 className="text-lg font-bold">No Batik Stamps Found</h3>
            <p className="text-zinc-500 text-xs mt-1">Try resetting your search query.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-xs font-bold text-white hover:bg-amber-500 transition-all"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative rounded-2xl border border-zinc-850 bg-zinc-900/40 hover:border-amber-500/40 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-zinc-950 overflow-hidden">
                  <HoverZoomImage src={product.image_url} alt={product.name} sizes="(max-w-768px) 100vw, 400px" />
                  {product.original_price && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-rose-600 text-[10px] font-bold tracking-wide uppercase shadow-md">
                      Sale
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                    Cap Batik
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    Traditional Batik Tool
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
                      <p className="font-black text-amber-400 text-lg">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md hover:shadow-amber-600/20"
                    >
                      View Stamp
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
            <h2 className="text-2xl font-black text-white">Copper vs. wood stamps</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Copper stamps (cap) hold fine, repeating detail well and last through heavy daily use - the standard choice for production batik. Wood stamps carve more freely, so they suit bolder, one-off, or hand-carved motifs where a little natural variation is part of the look.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-850">
              <h3 className="text-lg font-bold text-amber-300">What we need from you</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A photo or drawing of the motif is enough to start. We'll confirm sizing and repeat spacing with you before anything is carved or cast, so there are no surprises on the finished stamp.
              </p>
            </div>
            
            <div className="space-y-3 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-850">
              <h3 className="text-lg font-bold text-amber-300">Who orders these</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Batik studios keeping traditional methods alive, textile schools, and makers who want a stamp built to their own pattern instead of a stock design.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default function BatikStampPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    }>
      <BatikStampContent />
    </Suspense>
  );
}
