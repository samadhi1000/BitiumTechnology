'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Award, 
  Clock, 
  Layers, 
  Shirt, 
  Briefcase, 
  Globe2,
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function PromoBanner() {
  const container = useRef<HTMLElement>(null);
  const mockupContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });

    // 1. Entrance animations
    tl.from('.promo-header', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.value-card', { 
        y: 40, 
        opacity: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: 'power3.out' 
      }, '-=0.3')
      .from('.service-row', { 
        x: 40, 
        opacity: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: 'power3.out' 
      }, '-=0.4')
      .from('.mockup-image-frame', { 
        scale: 0.95, 
        opacity: 0, 
        duration: 0.7, 
        ease: 'back.out(1.2)' 
      }, '-=0.5');

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full bg-zinc-950 overflow-hidden border-b border-zinc-900 py-16 sm:py-24">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Grid Pattern Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>
      
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modern Header Section */}
        <div className="promo-header text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Sparkles size={11} className="animate-pulse" />
            <span>Why PrintGrid</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Engineered for <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Flawless Custom Prints</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            From high-fidelity digital transfers to precise traditional stencils, we bring industrial-grade printing quality straight to your designs.
          </p>
        </div>

        {/* 2-Column Next-Gen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: 4 Premium Value Prop Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Card 1 */}
            <div className="value-card group relative p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm hover:border-violet-500/30 hover:bg-zinc-900/60 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20 group-hover:text-white transition-all duration-300 mb-5">
                <Award size={24} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">Premium Craftsmanship</h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                Industrial-grade inks, precision laser cuts, and high-density Mylar materials that guarantee vibrant colors and sharp details.
              </p>
            </div>

            {/* Card 2 */}
            <div className="value-card group relative p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm hover:border-violet-500/30 hover:bg-zinc-900/60 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20 group-hover:text-white transition-all duration-300 mb-5">
                <Clock size={24} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">Express Delivery</h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                Fast processing timelines and secure local shipping networks to ensure your custom layouts are delivered right when you need them.
              </p>
            </div>

            {/* Card 3 */}
            <div className="value-card group relative p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm hover:border-violet-500/30 hover:bg-zinc-900/60 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20 group-hover:text-white transition-all duration-300 mb-5">
                <Layers size={24} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">No Order Minimums</h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                Whether you want to order a single personalized gang sheet or thousands of custom brand prints, we service all scale demands.
              </p>
            </div>

            {/* Card 4 */}
            <div className="value-card group relative p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm hover:border-violet-500/30 hover:bg-zinc-900/60 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20 group-hover:text-white transition-all duration-300 mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">Universal Fabric Bonding</h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed">
                Perfect adhesion on all fabric groups including cotton, premium polyester, denim, leather, canvas, and tri-blends.
              </p>
            </div>

          </div>

          {/* Right Column: Visual Showcase Deck & Quick Services (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Overlapping Mockups Box */}
            <div ref={mockupContainerRef} className="mockup-image-frame relative h-[240px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden flex items-center justify-center p-6 shadow-2xl">
              {/* Background gradient shadow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-transparent to-fuchsia-600/5"></div>
              
              {/* Overlapping Mockups with safe containerization */}
              <div className="relative w-full h-full flex items-center justify-center gap-4">
                
                {/* Left Card */}
                <div className="relative w-[30%] h-[85%] rounded-xl overflow-hidden border border-zinc-800 rotate-[-6deg] hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 shadow-lg">
                  <Image 
                    src="/images/products/streetwear-hoodie.jpg" 
                    alt="Custom Hoodie" 
                    fill 
                    className="object-cover"
                  />
                </div>

                {/* Center Card */}
                <div className="relative w-[36%] h-[95%] rounded-xl overflow-hidden border-2 border-violet-500/40 hover:scale-105 hover:z-20 transition-all duration-300 shadow-2xl">
                  <Image 
                    src="/images/products/mountain-vintage-tee.jpg" 
                    alt="Custom Tee" 
                    fill 
                    className="object-cover"
                  />
                </div>

                {/* Right Card */}
                <div className="relative w-[30%] h-[85%] rounded-xl overflow-hidden border border-zinc-800 rotate-[6deg] hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 shadow-lg">
                  <Image 
                    src="/images/products/labubu-new.jpg" 
                    alt="Custom Tee" 
                    fill 
                    className="object-cover"
                  />
                </div>

              </div>
            </div>

            {/* List Services Info */}
            <div className="space-y-3.5">
              
              {/* Service 1 */}
              <div className="service-row group flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 hover:border-violet-500/20 hover:bg-zinc-900/40 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-violet-600/10 text-violet-400">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">Digital DTF Printing</h4>
                    <p className="text-[11px] text-zinc-500">Fine details & brilliant color rendering for premium custom apparel.</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Service 2 */}
              <div className="service-row group flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 hover:border-violet-500/20 hover:bg-zinc-900/40 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-violet-600/10 text-violet-400">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">Workwear & Uniforms</h4>
                    <p className="text-[11px] text-zinc-500">Durable industrial-grade printing for corporate and field uniforms.</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Service 3 */}
              <div className="service-row group flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 hover:border-violet-500/20 hover:bg-zinc-900/40 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-violet-600/10 text-violet-400">
                    <Shirt size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">Custom Merch & Accessories</h4>
                    <p className="text-[11px] text-zinc-500">Bring personalized graphics to life across hoodies, bags, and tri-blends.</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Next-Gen Footer CTA Bar */}
      <div className="absolute bottom-0 inset-x-0 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm font-semibold">
            <Globe2 className="text-violet-500" size={16} />
            <span>Premium Fabric Printing Ecosystem</span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/canvas"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-violet-600/10 hover:shadow-violet-600/35"
            >
              <span>Start Designing</span>
              <ChevronRight size={14} />
            </Link>
            <span className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer hidden md:inline-block">bitiumtechnology.com</span>
          </div>

        </div>
      </div>
    </section>
  );
}
