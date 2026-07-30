'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function PromoBanner() {
  const container = useRef<HTMLDivElement>(null);
  const [showPromo, setShowPromo] = useState(true);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });

    // Entrance animations
    tl.from('.promo-title', { x: -50, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.promo-subtitle', { x: -30, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.promo-btn', { scale: 0.9, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.3')
      .from('.promo-model-img', { scale: 0.95, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .from('.promo-accent-bar', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

  }, { scope: container });

  return (
    <div ref={container} className="relative w-full bg-zinc-950 overflow-hidden border-b border-zinc-900 flex flex-col">
      {/* 1. Announcement Bar at the Top */}
      {showPromo && (
        <div className="w-full bg-zinc-900 border-b border-zinc-800 text-zinc-300 py-3 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 relative z-20 transition-all duration-300">
          <span>10% OFF ON SPIDERMAN T-SHIRTS & GANG SHEETS TODAY!</span>
          <button 
            onClick={() => setShowPromo(false)}
            className="hover:text-white transition-colors flex items-center justify-center p-0.5 rounded-full hover:bg-zinc-800"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. Main content container */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Everyday Premium Text (6 cols) */}
          <div className="lg:col-span-7 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="promo-title space-y-1">
              <h2 className="text-6xl sm:text-[90px] font-black tracking-tighter text-blue-500 uppercase leading-none select-none drop-shadow-[0_4px_12px_rgba(59,130,246,0.35)]">
                FLAWLESS
              </h2>
              <h2 className="text-6xl sm:text-[90px] font-black tracking-tighter text-blue-500 uppercase leading-none select-none drop-shadow-[0_4px_12px_rgba(59,130,246,0.35)]">
                PRINTS
              </h2>
            </div>

            <p className="promo-subtitle text-zinc-450 text-xs sm:text-sm font-semibold max-w-xl leading-relaxed">
              Engineered for Flawless Custom Prints. From high-fidelity digital transfers to precise traditional stencils, we bring industrial-grade printing quality straight to your designs.
            </p>

            <div className="promo-btn">
              <a 
                href="#catalog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/30 hover:shadow-blue-600/60 hover:scale-105 transition-all duration-300"
              >
                <ShoppingCart size={14} />
                <span>Shop Now</span>
              </a>
            </div>
          </div>

          {/* Right Column: Model Graphic Card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="promo-model-img relative w-full max-w-[380px] aspect-[3/4] rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <Image 
                src="/images/promo-model.jpg"
                alt="Premium apparel model"
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Subtle grid lines matching inkwave style overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none opacity-80"></div>
              <div className="absolute inset-0 bg-[radial-gradient(rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Accent Banner: WHY CHOOSE PRINTGRID? */}
      <div className="promo-accent-bar w-full bg-blue-600 py-6 relative z-10 border-t border-blue-500 select-none">
        <div className="max-w-[1500px] mx-auto px-4 text-center">
          <h3 className="text-xl sm:text-3xl font-black text-black tracking-[0.2em] uppercase">
            WHY CHOOSE BITIUM TECHNOLOGY?
          </h3>
        </div>
      </div>

    </div>
  );
}
