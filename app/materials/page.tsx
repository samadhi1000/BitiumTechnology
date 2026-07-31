'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { getProducts, Product } from '@/lib/products';
import HoverZoomImage from '@/components/ui/HoverZoomImage';
import { PackageCheck, Search, ChevronRight, Home, ShieldCheck } from 'lucide-react';

function MaterialsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const items = data.filter((p) => p.category === 'materials');
      setProducts(items);
      setLoading(false);
    }
    load();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white">
      {/* Header Banner */}
      <div className="border-b border-zinc-900 bg-gradient-to-b from-emerald-950/30 via-zinc-950 to-zinc-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} />
            <span className="text-emerald-400 font-semibold">DTF Consumables</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
                <PackageCheck size={13} />
                <span>Industrial DTF Printing Consumables & Supplies</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">DTF Consumables</h1>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl">
                Trade grade White & CMYK textile inks, premium high-adhesive hot melt TPU powders, and double-matte hot peel DTF film rolls (30cm & 60cm).
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search consumables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="animate-pulse rounded-2xl bg-zinc-900 border border-zinc-800 h-[280px]"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-900">
            <PackageCheck size={40} className="mx-auto text-zinc-600 mb-3" />
            <h3 className="text-lg font-bold">No Consumables Found</h3>
            <p className="text-zinc-500 text-xs mt-1">Try resetting your search query.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition-all"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative rounded-2xl border border-zinc-850 bg-zinc-900/40 hover:border-emerald-500/40 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-zinc-950 overflow-hidden">
                  <HoverZoomImage src={product.image_url} alt={product.name} sizes="(max-w-768px) 50vw, (max-w-1024px) 33vw, 25vw" />
                  {product.original_price && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-rose-600 text-[9px] font-bold tracking-wide uppercase shadow-md">
                      Sale
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-[9px] font-extrabold text-emerald-300 uppercase tracking-wider">
                    Trade Consumable
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                    DTF Material
                  </span>
                  <h3 className="font-extrabold text-zinc-100 text-xs leading-snug line-clamp-2 mt-1">
                    {product.name}
                  </h3>
                  <p className="text-zinc-400 text-[11px] mt-1 line-clamp-2 flex-grow leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-850 pt-3">
                    <div>
                      {product.original_price && (
                        <span className="text-[9px] text-zinc-500 line-through block -mb-0.5">
                          Rs. {product.original_price.toLocaleString()}
                        </span>
                      )}
                      <p className="font-black text-emerald-400 text-sm">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all shadow-md hover:shadow-emerald-600/20"
                    >
                      Order Supply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MaterialsPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <MaterialsContent />
    </Suspense>
  );
}
