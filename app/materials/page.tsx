'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { getProducts, Product } from '@/lib/products';
import HoverZoomImage from '@/components/ui/HoverZoomImage';
import CatalogPagination from '@/components/CatalogPagination';
import { PackageCheck, Search, ChevronRight, Home, ShieldCheck } from 'lucide-react';

function MaterialsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const items = data.filter((p) => p.category === 'materials');
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
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Canonical Link */}
      <link rel="canonical" href="https://www.bitiumtechnology.com/materials" />

      {/* CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "DTF Materials & Consumables | Bitium Technology",
            "description": "Inks, hot melt powder, film rolls, emulsions, and wash chemicals for professional printing setups.",
            "url": "https://www.bitiumtechnology.com/materials"
          })
        }}
      />
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
            <span className="text-emerald-400 font-semibold">DTF Consumables</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
                <PackageCheck size={13} />
                <span>Industrial DTF Printing Consumables & Supplies</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">DTF Consumables</h1>
              <p className="text-muted-foreground text-sm mt-2 max-w-xl">
                Trade grade White & CMYK textile inks, premium high-adhesive hot melt TPU powders, and double-matte hot peel DTF film rolls (30cm & 60cm).
              </p>
              <p className="text-emerald-300 text-sm mt-4 font-medium max-w-2xl leading-relaxed border-l-2 border-emerald-500 pl-4">
                Everything your print floor runs on - DTF inks and film, hot-melt powder, screen-printing emulsions, sensitizers, and wash chemicals - in stock and ready to ship.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search consumables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
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
              <div key={n} className="animate-pulse rounded-2xl bg-card border border-border h-[280px]"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-border">
            <PackageCheck size={40} className="mx-auto text-zinc-600 mb-3" />
            <h3 className="text-lg font-bold">No Consumables Found</h3>
            <p className="text-muted-foreground text-xs mt-1">Try resetting your search query.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-foreground hover:bg-emerald-500 transition-all"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative rounded-2xl border border-border bg-card/40 hover:border-emerald-500/40 hover:bg-card/80 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-background overflow-hidden">
                  <HoverZoomImage src={product.image_url} alt={product.name} sizes="(max-w-768px) 50vw, (max-w-1024px) 33vw, 25vw" />
                  {product.original_price && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-rose-600 text-[9px] font-bold tracking-wide uppercase shadow-md">
                      Sale
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-card/80 backdrop-blur-md border border-border text-[9px] font-extrabold text-emerald-300 uppercase tracking-wider">
                    Trade Consumable
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                    DTF Material
                  </span>
                  <h3 className="font-extrabold text-foreground text-xs leading-snug line-clamp-2 mt-1">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-[11px] mt-1 line-clamp-2 flex-grow leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <div>
                      {product.original_price && (
                        <span className="text-[9px] text-muted-foreground line-through block -mb-0.5">
                          Rs. {product.original_price.toLocaleString()}
                        </span>
                      )}
                      <p className="font-black text-emerald-400 text-sm">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-foreground font-bold text-[10px] transition-all shadow-md hover:shadow-emerald-600/20"
                    >
                      Order Supply
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
            <h2 className="text-2xl font-black text-foreground">Stocked for both DTF and screen printing</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Whether you're running a DTF printer or exposing your own screens, running out of a consumable mid-job stalls your whole order queue. We keep the essentials in stock so a low-ink day doesn't turn into a lost week.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">What's available</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> DTF inks and double-matte film rolls</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Hot-melt transfer powder</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Screen-printing photo emulsions and sensitizers</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Emulsion remover and screen reclaiming chemicals</li>
            </ul>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-card/50 border border-border">
            <h3 className="text-lg font-bold text-emerald-300">Buying in bulk</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Running a shop day to day? Ask us about standing orders - we can set up a recurring delivery so consumables show up before you run low, instead of after.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default function MaterialsPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <MaterialsContent />
    </Suspense>
  );
}
