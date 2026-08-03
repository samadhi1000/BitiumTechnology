'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import PromoBanner from '@/components/PromoBanner';
import { ArrowRight, Sparkles, Palette, Printer, Layers, Stamp, PackageCheck, Flame, CheckCircle2, Scissors, FlaskConical, PlayCircle, MessageSquareHeart } from 'lucide-react';
import { HeroSearch } from '@/components/HeroSearch';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import TrustSection from '@/components/TrustSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

function HomeContent() {
  const container = React.useRef<HTMLDivElement>(null);

  // Hero Entrance Animations
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' })
      .from('.hero-title', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-text', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-search', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }, { scope: container });

  const categories = [
    {
      title: 'Stencils',
      description: 'Laser-cut Mylar stencils for saree work, hand painting, and wall art — cut clean, every time.',
      href: '/stencil',
      icon: Palette,
      gradient: 'from-[#EC4899]/20 to-[#EC4899]/5',
      border: 'hover:border-[#EC4899]/50',
      badge: '6 Categories'
    },
    {
      title: 'Screen Printing',
      description: 'Exposed screens, vectorized artwork, and positive tracing films, made to your exact specs.',
      href: '/screen-printing',
      icon: Printer,
      gradient: 'from-[#4F46E5]/20 to-[#4F46E5]/5',
      border: 'hover:border-[#4F46E5]/50',
      badge: 'Professional Grade'
    },
    {
      title: 'DTF Printing',
      description: 'Custom sheet layouts, anime sticker packs, and cloth transfers — our most popular category.',
      href: '/dtf-printing',
      icon: Layers,
      gradient: 'from-[#06B6D4]/20 to-[#06B6D4]/5',
      border: 'hover:border-[#06B6D4]/50',
      badge: 'Hot Seller'
    },
    {
      title: 'Batik Stamps',
      description: 'Traditional copper and hand-carved wood Cap Batik stamps, made the way they\'ve always been made.',
      href: '/batik-stamp',
      icon: Stamp,
      gradient: 'from-[#8B5CF6]/20 to-[#8B5CF6]/5',
      border: 'hover:border-[#8B5CF6]/50',
      badge: 'Traditional Art'
    },
    {
      title: 'Laser Cutting',
      description: 'Precision CO2 laser cutting for acrylic, wood, and custom profiles — built to your file, not a template.',
      href: '/laser-cutting',
      icon: Scissors,
      gradient: 'from-[#10B981]/20 to-[#10B981]/5',
      border: 'hover:border-[#10B981]/50',
      badge: 'CNC Precision'
    },
    {
      title: 'Consumables',
      description: 'Inks, hot melt powder, film rolls, emulsions, and wash chemicals — the supplies that keep your shop running.',
      href: '/materials',
      icon: FlaskConical,
      gradient: 'from-[#F97316]/20 to-[#F97316]/5',
      border: 'hover:border-[#F97316]/50',
      badge: 'Industrial Grade'
    },
    {
      title: 'Video Tutorials',
      description: 'Learn how to master Screen & DTF printing with our step-by-step video guides.',
      href: '#',
      icon: PlayCircle,
      gradient: 'from-[#4F46E5]/20 to-[#4F46E5]/5',
      border: 'hover:border-[#4F46E5]/50',
      badge: 'Learn & Master'
    },
    {
      title: 'Customer Feedbacks',
      description: 'See what our existing customers have to say about Bitium Technology Products.',
      href: '#',
      icon: MessageSquareHeart,
      gradient: 'from-[#EC4899]/20 to-[#EC4899]/5',
      border: 'hover:border-[#EC4899]/50',
      badge: 'Real Stories'
    }
  ];

  return (
    <div ref={container} className="w-full min-h-screen bg-background text-foreground">
      {/* 01. Hero Banner Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-border hero-gradient">
        <HeroSlideshow />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center justify-center bg-card/65 border border-border/60 backdrop-blur-md p-6 sm:p-10 rounded-[32px] shadow-2xl">
          <div className="w-full space-y-6 flex flex-col items-center justify-center">
            <div 
              className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold"
            >
              <Sparkles size={13} />
              <span>Bitium Technology · Print Store</span>
            </div>
            
            <h1 
              className="hero-title text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
            >
              See Your Design Before <span className="outline-text">It's Ever Printed</span>
            </h1>
            
            <p 
              className="hero-text text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              Build your DTF sheet, preview it in 3D, and order it in minutes. From custom transfers to precision stencils, we print it the way you imagined it — not close, exact.
            </p>

            <div 
              className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
            >
              <Link 
                href="/canvas" 
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl cta-gradient font-bold text-sm transition-all duration-150 border border-transparent shadow-[3px_3px_0px_0px_#020617] dark:shadow-[3px_3px_0px_0px_#F8FAFC] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] flex items-center justify-center gap-2 group"
              >
                <span>Start Your Design</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/stencil" 
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-primary font-bold text-sm transition-all duration-150 hover:underline flex items-center justify-center gap-2"
              >
                Browse all categories
              </Link>
            </div>

            <div className="hero-search pt-2 w-full flex justify-center z-30">
              <HeroSearch />
            </div>
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
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden p-[3px] bg-gradient-to-tr from-amber-500/50 to-orange-500/30 border border-amber-500/20 group">
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
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#D9B08C] text-xs font-extrabold uppercase tracking-widest">
              <Flame size={14} className="text-[#D9B08C] animate-pulse" />
              <span>3D Product Visualizer • VIPER Streetwear</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-tight">
                STREETWEAR EVOLVED: <span className="bg-gradient-to-r from-[#FFCB9A] to-[#116466] bg-clip-text text-transparent">THE NEXT GENERATION VISUALIZER</span>
              </h2>
              
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Discover the ultimate texture and detail before you order. Featuring our high-octane Graphic Apparel, Screen-Printed Hoodies, Custom Accessories, and DTF Prints, presented in immersive, photorealistic 3D.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-850">
                <div className="p-2 rounded-xl bg-amber-500/10 text-[#D9B08C] shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-foreground">4K Print Texture Fidelity</h4>
                  <p className="text-[11px] text-zinc-400">Inspect ink depth before print</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-850">
                <div className="p-2 rounded-xl bg-amber-500/10 text-[#D9B08C] shrink-0">
                  <Layers size={16} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-foreground">Multi-Layer DTF Transfers</h4>
                  <p className="text-[11px] text-zinc-400">Full color film layout options</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 w-full sm:w-auto">
              <Link
                href="/canvas"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#116466] hover:bg-[#157a7c] text-[#D1E8E2] font-black text-xs uppercase tracking-wider transition-all duration-150 border border-[#0d4e50] shadow-[3px_3px_0px_0px_#2C3531] dark:shadow-[3px_3px_0px_0px_#D1E8E2] hover:shadow-[1px_1px_0px_0px_#2C3531] dark:hover:shadow-[1px_1px_0px_0px_#D1E8E2] active:shadow-[0px_0px_0px_0px_#2C3531] dark:active:shadow-[0px_0px_0px_0px_#D1E8E2] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] flex items-center justify-center gap-2"
              >
                <span>Launch 3D Canvas Builder</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/stencil"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#D1E8E2] dark:bg-[#2C3531] hover:bg-[#c1d9d3] dark:hover:bg-[#38433e] text-[#2C3531] dark:text-[#D1E8E2] border-[#b7d1c9] dark:border-[#45544e] shadow-[3px_3px_0px_0px_#2C3531] dark:shadow-[3px_3px_0px_0px_#D1E8E2] hover:shadow-[1px_1px_0px_0px_#2C3531] dark:hover:shadow-[1px_1px_0px_0px_#D1E8E2] active:shadow-[0px_0px_0px_0px_#2C3531] dark:active:shadow-[0px_0px_0px_0px_#D1E8E2] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] flex items-center justify-center"
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
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">What We Print</h2>
          <p className="text-zinc-400 text-sm mt-2">
            Pick a category to see products, pricing, and options.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className={`group relative rounded-3xl border border-zinc-850 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${cat.border} flex flex-col justify-between overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-[#116466] dark:text-[#FFCB9A] group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-zinc-950/50 border border-zinc-800 text-zinc-300">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-foreground group-hover:text-[#116466] dark:group-hover:text-[#FFCB9A] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-bold text-[#116466] dark:text-[#FFCB9A]">
                  <span>Browse Products</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 05. Trust & Reviews Section */}
      <TrustSection />
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
