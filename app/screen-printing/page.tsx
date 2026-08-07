'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProducts, Product } from '@/lib/products';
import HoverZoomImage from '@/components/ui/HoverZoomImage';
import CatalogPagination from '@/components/CatalogPagination';
import { Printer, Search, ChevronRight, Home } from 'lucide-react';

function ScreenPrintingContent() {
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
      const items = data.filter((p) => p.category === 'screen-printing');
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
    { id: 'screen-exposed', label: 'Screen Exposed Frames' },
    { id: 'tracing-printouts', label: 'Tracing Printouts' },
    { id: 'positive-printouts', label: 'Positive Film Printouts' }
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
      {/* Canonical Link */}
      <link rel="canonical" href="https://www.bitiumtechnology.com/screen-printing" />

      {/* CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Screen Printing Collection | Bitium Technology",
            "description": "Ready-to-print custom exposed mesh screens, vector artwork graphics, tracing sheets, and high-density positive film outputs.",
            "url": "https://www.bitiumtechnology.com/screen-printing"
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
            <span className="text-[#8DFF00] font-semibold">Screen Printing</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9eff1a]/10 border border-[#8DFF00]/30 text-[#9eff1a] text-xs font-semibold mb-3">
                <Printer size={13} />
                <span>Trade Screen Printing Supplies</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Screen Printing</h1>
              <p className="text-muted-foreground text-sm mt-2 max-w-xl">
                Ready-to-print custom exposed mesh screens, vector artwork graphics, tracing sheets, and high-density positive film outputs.
              </p>
              <p className="text-[#9eff1a] text-sm mt-4 font-medium max-w-2xl leading-relaxed border-l-2 border-[#8DFF00] pl-4">
                Custom exposed screens, vectorized artwork, and positive tracing films - made to your exact design, ready to print with.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search screen printing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-[#8DFF00] transition-colors"
              />
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-8">
            <button
              onClick={() => setActiveSub(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSub === null ? 'bg-[#8DFF00] text-[#0a0a0a] shadow-lg shadow-[#8DFF00]/20' : 'bg-card border border-border text-muted-foreground hover:text-[#0a0a0a]'
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
                      ? 'bg-[#8DFF00] text-[#0a0a0a] shadow-lg shadow-[#8DFF00]/20'
                      : 'bg-card border border-border text-muted-foreground hover:text-[#0a0a0a]'
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
            <Printer size={40} className="mx-auto text-zinc-600 mb-3" />
            <h3 className="text-lg font-bold">No Products Found</h3>
            <p className="text-muted-foreground text-xs mt-1">Try resetting your filters or search terms.</p>
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
                    Screen Printing
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
                      href={`/products/${product.id}`}
                      className="px-4 py-2.5 rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-[#0a0a0a] font-bold text-xs transition-all shadow-md hover:shadow-[#8DFF00]/20"
                    >
                      Get Item
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-foreground">What's included in a screen order</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We take your artwork, trace or vectorize it if it isn't already print-ready, and expose it onto a screen at the mesh count that suits your fabric and detail level. You get a screen that's ready to load ink and go.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-foreground">Who this is for</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Shops running their own print floor, students learning the process, and anyone who wants full control over ink, pressure, and fabric instead of relying on digital transfers.
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-card/50 border border-border p-6 sm:p-8">
            <h2 className="text-xl font-black text-[#9eff1a]">Good to know before you order</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#9eff1a] mt-1.5 shrink-0" />
                <p>Fine detail and small text need a finer mesh - we'll tell you if your design needs adjusting to print cleanly.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#9eff1a] mt-1.5 shrink-0" />
                <p>Multi-color designs need a separate screen per color; we can help you figure out the breakdown if you're not sure.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#9eff1a] mt-1.5 shrink-0" />
                <p>Screens are reusable - with basic care, one screen can print hundreds of shirts.</p>
              </li>
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
}

export default function ScreenPrintingPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8DFF00]"></div>
      </div>
    }>
      <ScreenPrintingContent />
    </Suspense>
  );
}
