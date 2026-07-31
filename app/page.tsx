'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { getProducts, Product } from '@/lib/products';
import TrendingHeroShowcase from '@/components/ui/TrendingHeroShowcase';
import PromoBanner from '@/components/PromoBanner';
import { ArrowRight, Sparkles, Palette, Printer, Layers, Stamp, PackageCheck } from 'lucide-react';

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
        <div className="absolute inset-0 bg-[url('/images/dtf-hero-bg.jpg')] bg-cover bg-center bg-no-repeat pointer-events-none opacity-30"></div>
        <div className="absolute inset-0 bg-radial-[at_center,_var(--tw-gradient-stops)] from-zinc-950/20 via-zinc-950/80 to-zinc-950 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/15 via-transparent to-zinc-950 pointer-events-none"></div>
        
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

          {/* Trending Hero Showcase Column */}
          <div className="flex-1 w-full flex flex-col items-center justify-center hero-cards mt-4 lg:mt-0">
            <TrendingHeroShowcase products={products} />
          </div>
        </div>
      </section>

      {/* 02. Poster Type Section (Promo Banner) */}
      <PromoBanner />

      {/* 03. Category Quick Access Showcase Section */}
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
