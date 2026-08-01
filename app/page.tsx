'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { getProducts, Product } from '@/lib/products';
import PromoBanner from '@/components/PromoBanner';
import TrendingHeroShowcase from '@/components/ui/TrendingHeroShowcase';
import { ArrowRight, Sparkles, Palette, Printer, Layers, Stamp, PackageCheck, Flame, CheckCircle2 } from 'lucide-react';
import { HeroSearch } from '@/components/HeroSearch';
import { HeroSlideshow } from '@/components/HeroSlideshow';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

function HomeContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const container = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }
    load();
  }, []);

  // Hero Entrance Animations
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' })
      .from('.hero-title', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-text', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-search', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-cards', { scale: 0.9, opacity: 0, duration: 0.6, ease: 'back.out(1.2)' }, '-=0.4');
  }, { scope: container });

  const categories = [
    {
      title: 'Stencils',
      description: 'Precision laser-cut Mylar stencils for saree, hand painting & wall art.',
      href: '/stencil',
      icon: Palette,
      gradient: 'from-violet-500/20 to-purple-500/10',
      border: 'hover:border-violet-500/50',
      badge: '6 Categories'
    },
    {
      title: 'Screen Printing',
      description: 'Custom exposed screens, artwork vectorizing & positive tracing films.',
      href: '/screen-printing',
      icon: Printer,
      gradient: 'from-blue-500/20 to-cyan-500/10',
      border: 'hover:border-blue-500/50',
      badge: 'Professional Grade'
    },
    {
      title: 'DTF Printing',
      description: 'Custom canvas layout sheets, anime sticker packs & cloth transfers.',
      href: '/dtf-printing',
      icon: Layers,
      gradient: 'from-fuchsia-500/20 to-pink-500/10',
      border: 'hover:border-fuchsia-500/50',
      badge: 'Hot Seller'
    },
    {
      title: 'Batik Stamps',
      description: 'Traditional copper & carved wood Cap Batik stamps for authentic textiles.',
      href: '/batik-stamp',
      icon: Stamp,
      gradient: 'from-amber-500/20 to-orange-500/10',
      border: 'hover:border-amber-500/50',
      badge: 'Traditional Art'
    },
    {
      title: 'DTF Consumables',
      description: 'High quality DTF inks, hot melt powders & double-matte film rolls.',
      href: '/materials',
      icon: PackageCheck,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'hover:border-emerald-500/50',
      badge: 'Trade Inks & Film'
    }
  ];

  return (
    <div ref={container} className="w-full min-h-screen bg-zinc-950 text-white">
      {/* 01. Hero Banner Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-zinc-950">
        <HeroSlideshow />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-12">
          <div className="flex-1 space-y-6">
            <div 
              className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold"
            >
              <Sparkles size={13} />
              <span>Bitium Technology Print Store</span>
            </div>
            
            <h1 
              className="hero-title text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
            >
              High-Definition <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">Print Solutions</span> & Equipment
            </h1>
            
            <p 
              className="hero-text text-sm sm:text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              From custom precision stencils to industrial DTF film rolls, exposed screen printing, and traditional batik stamps — explore our specialized print technology store.
            </p>

            <div className="hero-search pt-2">
              <HeroSearch />
            </div>
            
            <div 
              className="hero-buttons flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
            >
              <Link 
                href="/canvas" 
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 font-bold text-white text-sm transition-all shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 flex items-center justify-center gap-2 group"
              >
                <span>Launch DTF Canvas</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/stencil" 
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 font-bold text-zinc-300 hover:text-white text-sm transition-all flex items-center justify-center"
              >
                Explore Stencils
              </Link>
            </div>
          </div>

          {/* Hero Interactive Cards Showcase Column */}
          <div className="flex-1 w-full flex flex-col items-center justify-center hero-cards mt-4 lg:mt-0 relative">
            <TrendingHeroShowcase products={products} />
          </div>
        </div>
      </section>

      {/* 02. Dynamic 3D Product Visualizer Section (Left Image Frame + Right Content) */}
      <section className="relative w-full bg-zinc-950 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          
          {/* Left Side: Square 3D Product Showcase Image Frame (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden p-[3px] bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_60px_rgba(245,158,11,0.25)] border border-amber-500/40 group">
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-zinc-950">
                <Image
                  src="/images/products/viper-3d-showcase.png"
                  alt="VIPER Streetwear 3D Product Showcase"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-left">
                  <div>
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">VIPER STREETWEAR • EST. 2024</p>
                    <p className="text-xs font-extrabold text-white">Authentic Trade Quality Apparel</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold uppercase">
                    3D Render
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Text & Content Section (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
              <Flame size={14} className="text-amber-400 animate-pulse" />
              <span>3D Product Visualizer • VIPER Streetwear</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-tight">
                STREETWEAR EVOLVED: <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">THE NEXT GENERATION VISUALIZER</span>
              </h2>
              
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Discover the ultimate texture and detail before you order. Featuring our high-octane Graphic Apparel, Screen-Printed Hoodies, Custom Accessories, and DTF Prints, presented in immersive, photorealistic 3D.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-850">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">4K Print Texture Fidelity</h4>
                  <p className="text-[11px] text-zinc-400">Inspect ink depth before print</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-850">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Layers size={16} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">Multi-Layer DTF Transfers</h4>
                  <p className="text-[11px] text-zinc-400">Full color film layout options</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 w-full sm:w-auto">
              <Link
                href="/canvas"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Launch 3D Canvas Builder</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/stencil"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center"
              >
                Explore Apparel Prints
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 03. Poster Type Section (Promo Banner) */}
      <PromoBanner />

      {/* 04. Category Quick Access Showcase Section */}
      <section className="max-w-7xl mx-auto py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Explore Our Print Categories</h2>
          <p className="text-zinc-400 text-sm mt-2">
            Select a specialized category below to view dedicated products, custom options, and detailed listings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className={`group relative rounded-3xl border border-zinc-850 bg-gradient-to-b ${cat.gradient} p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${cat.border} flex flex-col justify-between overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-violet-400 group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white group-hover:text-violet-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-bold text-violet-400 group-hover:text-violet-300">
                  <span>Browse Products</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
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
