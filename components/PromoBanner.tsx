'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { useLanguage } from '@/lib/context/LanguageContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function PromoBanner() {
  const container = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [showPromo, setShowPromo] = useState(true);
  const [activeTab, setActiveTab] = useState('cotton');

  const fabricTypes = [
    { id: 'cotton', label: t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? '100% කපු (Cotton)' : 'Cotton', result: t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? 'දීප්තිමත් වර්ණ සහ මෘදු නිමාව. සේදීමෙන් පසු වර්ණ ඉවත් නොවේ.' : "Rich, saturated color that won't crack or fade after washing." },
    { id: 'polyester', label: t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? 'පෝලියෙස්ටර් & ස්පෝර්ට්ස්' : 'Polyester', result: t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? 'ඉහළ නම්‍යශීලීබව. ක්‍රීඩා ඇඳුම් සඳහා වඩාත් සුදුසුයි.' : "No dye migration or scorching - a common problem with other print methods on poly." },
    { id: 'blends', label: t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? 'මිශ්‍ර රෙදි (Blends)' : 'Blends', result: t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? 'සුමට ඇලීම සහ පැහැදිලි සූක්ෂ්ම විස්තර.' : "Handles mixed fabrics without needing a different process for each one." },
    { id: 'dark', label: t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? 'තද පැහැ රෙදි' : 'Dark Fabrics', result: t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? 'කළු හෝ තද පැහැ රෙදි මත පවා 100% ක්ෂණික කැපී පෙනෙන වර්ණ.' : "Full opacity and true color, even on black - no dulled-down prints." },
    { id: 'light', label: t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? 'ලා පැහැ රෙදි' : 'Light Fabrics', result: t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? 'මෘදු ස්පර්ශය සහ අතිශය පැහැදිලි නිමාව.' : "Crisp, vibrant results with none of the stiffness some transfers leave behind." }
  ];

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
    tl.from('.promo-eyebrow', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' })
      .from('.promo-heading', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.promo-intro', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.promo-tabs', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.promo-result', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.promo-closing', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.promo-model-img', { scale: 0.95, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.6');

  }, { scope: container });

  // Handle tab change with simple GSAP anim
  const handleTabClick = (id: string) => {
    setActiveTab(id);
    gsap.fromTo('.promo-result-text', 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  };

  const currentResult = fabricTypes.find(f => f.id === activeTab)?.result || '';

  return (
    <div ref={container} className="relative w-full bg-background overflow-hidden border-b border-border flex flex-col">
      {/* 1. Announcement Bar at the Top */}
      {showPromo && (
        <div className="w-full bg-card border-b border-border text-foreground py-3 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 relative z-20 transition-all duration-300">
          <span className="tracking-wide">
            {t.homeSections?.whyBadge === 'විශේෂත්වයන්'
              ? '⚡ උසස් තත්ත්වයේ DTF මුද්‍රණ & විශේෂිත ඇඳුම් මුද්‍රණ සේවාව - පැය 24ක් තුළ දිවයින පුරා බෙදාහැරීම'
              : '⚡ PREMIUM DTF TRANSFERS & CUSTOM APPAREL PRINTING - 24H ISLANDWIDE DISPATCH'}
          </span>
          <button 
            onClick={() => setShowPromo(false)}
            className="hover:text-foreground transition-colors flex items-center justify-center p-0.5 rounded-full hover:bg-muted"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Fabric Feature (7 cols) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Eyebrow */}
            <div className="promo-eyebrow inline-flex items-center gap-2 bg-[#2CFF05]/10 border border-[#2CFF05]/25 rounded-full px-3.5 py-1.5">
              <Sparkles size={12} className="text-[#2CFF05]" />
              <span className="font-heading font-semibold text-[11px] text-[#2CFF05] tracking-wider uppercase">
                {t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? 'DTF මුද්‍රණයේ විශිෂ්ටත්වය' : 'Why DTF'}
              </span>
            </div>

            {/* Heading */}
            <h2 className="promo-heading text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1] font-heading">
              {t.homeSections?.whyBadge === 'විශේෂත්වයන්' ? (
                <>
                  ඕනෑම රෙදි වර්ගයකට.<br />
                  <span className="text-[#2CFF05]">එකම මුද්‍රණ ක්‍රමය.</span>
                </>
              ) : (
                <>
                  One Print Method.<br />
                  <span className="text-[#2CFF05]">Every Fabric.</span>
                </>
              )}
            </h2>

            {/* Intro line */}
            <p className="promo-intro text-sm text-muted-foreground leading-relaxed max-w-xl">
              {t.homeSections?.whyBadge === 'විශේෂත්වයන්'
                ? 'DTF මගින් ඕනෑම රෙදි වර්ගයක් මත සාර්ථකව මුද්‍රණය කළ හැක. පහතින් රෙදි වර්ගය තෝරා වෙනස වටහාගන්න.'
                : "DTF doesn't care what you're printing on. Tap a fabric type below and see why it just works."}
            </p>

            {/* Tabs */}
            <div className="promo-tabs flex flex-wrap justify-center lg:justify-start gap-2.5 w-full pt-2">
              {fabricTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTabClick(type.id)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer ${
                    activeTab === type.id
                      ? 'bg-[#2CFF05] border-[#2CFF05] text-[#0a0a0a] shadow-lg shadow-[#2CFF05]/20 scale-105'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-[#2CFF05]/40'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Tab Result Content */}
            <div className="promo-result w-full min-h-[90px] p-6 rounded-2xl border border-border bg-card/35 backdrop-blur flex items-center justify-center lg:justify-start">
              <p className="promo-result-text text-sm text-foreground leading-relaxed font-semibold">
                {currentResult}
              </p>
            </div>

            {/* Closing */}
            <div className="promo-closing space-y-4 w-full pt-2">
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                {t.homeSections?.whyBadge === 'විශේෂත්වයන්'
                  ? 'සෑම විටම එකම උසස් ගුණාත්මකභාවය සහ පැය 24ක වේගවත් නිමාව.'
                  : "Same process, same turnaround, every time - no matter what's on the rack."}
              </p>
            </div>
          </div>

          {/* Right Column: Model Graphic Card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="promo-model-img relative w-full max-w-[380px] aspect-[3/4] rounded-3xl overflow-hidden border border-border shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <Image 
                src="/images/promo-model.webp"
                alt="Premium apparel model"
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Subtle grid lines matching overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none opacity-80"></div>
              <div className="absolute inset-0 bg-[radial-gradient(rgba(141,255,0,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Section Break White Line */}
      <div className="w-full border-t border-white/20 relative z-10" />

    </div>
  );
}
