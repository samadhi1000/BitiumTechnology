'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getProducts, Product } from '@/lib/products';
import CardStack from '@/components/ui/CardStack';
import HoverZoomImage from '@/components/ui/HoverZoomImage';
import PromoBanner from '@/components/PromoBanner';
import { Layers, Shirt, ArrowRight, ShieldCheck, Zap, Sparkles, Filter } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

function HomeContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');
  const subParam = searchParams.get('sub');

  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'stencil' | 'screen-printing' | 'dtf_sheet' | 'batik-stamp' | 'materials'>('all');
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load and apply URL search filters
  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (catParam) {
      setFilter(catParam as any);
    } else {
      setFilter('all');
    }
    if (subParam) {
      setActiveSubFilter(subParam);
    } else {
      setActiveSubFilter(null);
    }
  }, [catParam, subParam]);

  // Smooth scroll to catalog grid when category or subcategory changes
  useEffect(() => {
    if (catParam || subParam) {
      const timer = setTimeout(() => {
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [catParam, subParam]);

  const filteredProducts = products.filter((product) => {
    // Category check
    if (filter !== 'all' && product.category !== filter) return false;
    // Subcategory check
    if (activeSubFilter && product.sub_category !== activeSubFilter) return false;
    return true;
  });

  // Extract featured products for the Card Stack deck
  const featuredProducts = products.filter(
    (p) => p.id === 'stencil-saree-1' || p.id === 'dtf_sheet-dtf-sticker-1' || p.id === 'batik-stamp-cap-batik-1'
  );

  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Animations
    const tl = gsap.timeline();
    
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' })
      .from('.hero-title', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-text', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-cards', { scale: 0.9, opacity: 0, duration: 0.6, ease: 'back.out(1.2)' }, '-=0.4');

    // 2. Catalog Grid ScrollTrigger Animations
    if (filteredProducts.length > 0 && !loading) {
      ScrollTrigger.batch('.product-card', {
        interval: 0.1,
        batchMax: 3,
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true, duration: 0.6, ease: 'power2.out' }),
        onLeave: batch => gsap.set(batch, { opacity: 0, y: 30, overwrite: true }),
        onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true, duration: 0.6, ease: 'power2.out' }),
        onLeaveBack: batch => gsap.set(batch, { opacity: 0, y: 30, overwrite: true }),
        start: 'top 85%'
      });
    }

  }, { scope: container, dependencies: [filteredProducts, loading] });

  return (
    <div ref={container} className="w-full min-h-screen bg-zinc-950 text-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-radial-[at_top_right,_var(--tw-gradient-stops)] from-violet-950/10 via-zinc-950 to-zinc-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex-1 space-y-6">
            <div 
              className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold"
            >
              <Sparkles size={12} />
              <span>Next-Gen DTF Printing</span>
            </div>
            
            <h1 
              className="hero-title text-4xl sm:text-6xl font-black tracking-tight"
            >
              High-Definition <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">DTF Transfers</span> & Apparel
            </h1>
            
            <p 
              className="hero-text text-base text-zinc-400 max-w-xl leading-relaxed"
            >
              Create custom layouts on our virtual 12x23 sheet builder, or browse our hot-selling pre-designed collections of anime tees and sticker rolls.
            </p>
            
            <div 
              className="hero-buttons flex flex-col sm:flex-row items-center gap-4 pt-2"
            >
              <Link 
                href="/canvas" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 font-bold text-white transition-all shadow-lg hover:shadow-violet-600/20 flex items-center justify-center gap-2 group"
              >
                <span>Launch DTF Canvas</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#catalog" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-center"
              >
                Browse Shop
              </a>
            </div>
          </div>

          {/* Interactive Card Stack Column */}
          <div className="flex-1 w-full flex flex-col items-center justify-center">
            {featuredProducts.length > 0 ? (
              <div className="hero-cards space-y-4">
                <CardStack products={featuredProducts} />
                <p className="text-center text-xs text-zinc-500 font-semibold select-none">
                  Drag cards left/right or hover to view details
                </p>
              </div>
            ) : (
              <div className="animate-pulse rounded-2xl bg-zinc-900 border border-zinc-850 w-[340px] h-[400px]"></div>
            )}
          </div>
        </div>
      </section>

      {/* Full Width Promo Banner */}
      <PromoBanner />

      {/* Catalog Grid Section */}
      <section id="catalog" className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 scroll-mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black">Shop Collection</h2>
            <p className="text-zinc-500 text-sm mt-1">Select customizable templates or top-quality blank base apparel.</p>
          </div>
          
           <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap p-1 rounded-xl bg-zinc-900 border border-zinc-800 gap-1">
              <button
                onClick={() => {
                  setFilter('all');
                  setActiveSubFilter(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setFilter('stencil');
                  setActiveSubFilter(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'stencil' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Stencils
              </button>
              <button
                onClick={() => {
                  setFilter('screen-printing');
                  setActiveSubFilter(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'screen-printing' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Screen Printing
              </button>
              <button
                onClick={() => {
                  setFilter('dtf_sheet');
                  setActiveSubFilter(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'dtf_sheet' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                DTF Printing
              </button>
              <button
                onClick={() => {
                  setFilter('batik-stamp');
                  setActiveSubFilter(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'batik-stamp' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Batik Stamps
              </button>
              <button
                onClick={() => {
                  setFilter('materials');
                  setActiveSubFilter(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'materials' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Materials & Ink
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Filters / Tags if Active */}
        {(filter !== 'all' || activeSubFilter) && (
          <div className="flex flex-wrap gap-2 items-center mb-8 bg-zinc-900/30 p-3 rounded-xl border border-zinc-900">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mr-2">
              <Filter size={10} /> Active Filters:
            </span>
            <button
              onClick={() => {
                setFilter('all');
                setActiveSubFilter(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-[10px] font-bold text-zinc-300 hover:text-white"
            >
              Clear Filters
            </button>
            {filter === 'stencil' && (
              <>
                {[
                  { sub: 'hand-painting', label: 'Hand Painting' },
                  { sub: 'saree', label: 'Saree' },
                  { sub: 'tote-bags', label: 'Tote Bags' },
                  { sub: 'batik', label: 'Batik' },
                  { sub: 'wall-decoration', label: 'Wall Decoration' },
                  { sub: 'titanium', label: 'Titanium' }
                ].map((item) => (
                  <button
                    key={item.sub}
                    onClick={() => setActiveSubFilter(item.sub)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${activeSubFilter === item.sub ? 'bg-violet-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}
            {filter === 'screen-printing' && (
              <>
                {[
                  { sub: 'screen-exposed', label: 'Screen Exposed' },
                  { sub: 'artwork', label: 'Artwork' },
                  { sub: 'tracing-printouts', label: 'Tracing Printouts' },
                  { sub: 'positive-printouts', label: 'Positive Printouts' }
                ].map((item) => (
                  <button
                    key={item.sub}
                    onClick={() => setActiveSubFilter(item.sub)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${activeSubFilter === item.sub ? 'bg-violet-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}
            {filter === 'dtf_sheet' && (
              <>
                {[
                  { sub: 'tshirt-design', label: 'T Shirt Design' },
                  { sub: 'dtf-sticker', label: 'DTF Sticker' },
                  { sub: 'dtf-cloth', label: 'DTF Cloth' }
                ].map((item) => (
                  <button
                    key={item.sub}
                    onClick={() => setActiveSubFilter(item.sub)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${activeSubFilter === item.sub ? 'bg-violet-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}
            {filter === 'batik-stamp' && (
              <>
                {[
                  { sub: 'cap-batik', label: 'Cap Batik' }
                ].map((item) => (
                  <button
                    key={item.sub}
                    onClick={() => setActiveSubFilter(item.sub)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${activeSubFilter === item.sub ? 'bg-violet-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse rounded-2xl bg-zinc-900 border border-zinc-800 h-[380px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card opacity-0 translate-y-8 group relative rounded-2xl border border-zinc-905 bg-zinc-900/20 hover:border-zinc-800/80 hover:bg-zinc-900/40 transition-all flex flex-col h-full overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-zinc-950 overflow-hidden">
                  <HoverZoomImage
                    src={product.image_url}
                    alt={product.name}
                    sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                  />
                  {product.original_price && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-rose-600 text-[10px] font-bold tracking-wide uppercase">
                      Sale
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {product.category.replace('-', ' ')}
                  </span>
                  <h3 className="font-extrabold text-sm text-zinc-100 mt-1.5 leading-snug line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-2 line-clamp-2 flex-grow leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-850 pt-4">
                    <div>
                      {product.original_price && (
                        <span className="text-[10px] text-zinc-500 line-through">
                          Rs. {product.original_price.toLocaleString()}
                        </span>
                      )}
                      <p className="font-black text-base text-violet-400">Rs. {product.price.toLocaleString()}</p>
                    </div>

                    <Link
                      href={product.category === 'dtf_sheet' && product.id.startsWith('b2a8') ? '/canvas' : `/products/${product.id}`}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        product.category === 'dtf_sheet' && product.id.startsWith('b2a8')
                          ? 'bg-violet-600 hover:bg-violet-500 text-white glow-primary'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                      }`}
                    >
                      {product.category === 'dtf_sheet' && product.id.startsWith('b2a8') ? 'Start Custom Canvas' : 'Get Item'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
