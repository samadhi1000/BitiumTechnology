"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PenTool, Layers, Printer, Stamp, Scissors } from "lucide-react";

interface HeroCardItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  href: string;
  icon: React.ElementType;
}

const HERO_ITEMS: HeroCardItem[] = [
  {
    id: "stencil",
    title: "Custom Stencils",
    desc: "Precision laser-cut stencils for every creative need.",
    image: "/images/hero-cards/stencil.jpg",
    href: "/stencil",
    icon: PenTool,
  },
  {
    id: "dtf",
    title: "DTF Film Rolls",
    desc: "High-quality film rolls for vibrant and durable prints.",
    image: "/images/hero-cards/dtf.jpg",
    href: "/dtf-printing",
    icon: Layers,
  },
  {
    id: "screen-printing",
    title: "Screen Printing",
    desc: "Professional screen printing materials and accessories.",
    image: "/images/hero-cards/screenprint.jpg",
    href: "/screen-printing",
    icon: Printer,
  },
  {
    id: "batik-stamp",
    title: "Batik Stamps",
    desc: "Traditional batik stamps crafted to perfection.",
    image: "/images/hero-cards/batik.jpg",
    href: "/batik-stamp",
    icon: Stamp,
  },
  {
    id: "laser-cutting",
    title: "Laser Engraving",
    desc: "Precision CNC laser cutting and engraving solutions.",
    image: "/images/hero-cards/laser.jpg",
    href: "/laser-cutting",
    icon: Scissors,
  },
];

export const HeroShowcaseCarousel: React.FC = () => {
  // Duplicated arrays to ensure seamless infinite looping from right to left
  const displayItems = [...HERO_ITEMS, ...HERO_ITEMS, ...HERO_ITEMS];

  return (
    <div className="w-full max-w-[540px] group relative select-none rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/20 bg-white/95 dark:bg-black/50 backdrop-blur-xl p-4 sm:p-5 shadow-xl dark:shadow-2xl overflow-hidden transition-colors duration-300">
      {/* Subtle Ambient Light Effect inside frame */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 dark:bg-[#2CFF05]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-slate-300/20 dark:bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header inside frame */}
      <div className="mb-3.5 flex items-center justify-between relative z-10">
        <h3 className="font-heading font-extrabold text-sm sm:text-[15px] tracking-tight text-slate-900 dark:text-white drop-shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#2CFF05] animate-pulse shrink-0" />
          <span>Everything You Need to <span className="text-emerald-600 dark:text-[#2CFF05] dark:drop-shadow-[0_0_10px_rgba(44,255,5,0.4)]">Create, Print &amp; Deliver</span></span>
        </h3>
      </div>

      {/* Marquee Viewport: shows cards with infinite right-to-left scroll */}
      <div className="relative overflow-hidden w-full select-none py-1 z-10">
        {/* Soft edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/95 dark:from-black/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/95 dark:from-black/50 to-transparent z-10 pointer-events-none" />

        <div className="animate-hero-marquee flex items-stretch gap-3">
          {displayItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={`${item.id}-${index}`}
                href={item.href}
                className="w-[145px] sm:w-[155px] shrink-0 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 dark:bg-white/[0.08] dark:hover:bg-white/[0.15] border border-slate-200/80 dark:border-white/15 hover:border-emerald-500/50 dark:hover:border-[#2CFF05]/70 transition-all duration-200 flex flex-col group/card cursor-pointer shadow-sm dark:shadow-lg backdrop-blur-sm"
              >
                {/* Image */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-zinc-900 border border-slate-200 dark:border-white/20 mb-2">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="160px"
                    className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Category Icon & Title */}
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 dark:bg-[#2CFF05]/20 border border-emerald-500/30 dark:border-[#2CFF05]/40 flex items-center justify-center text-emerald-600 dark:text-[#2CFF05] shrink-0">
                    <Icon size={11} strokeWidth={2.2} />
                  </div>
                  <h4 className="font-heading font-bold text-[12px] text-slate-900 dark:text-white group-hover/card:text-emerald-600 dark:group-hover/card:text-[#2CFF05] transition-colors truncate">
                    {item.title}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-[10px] text-slate-600 dark:text-zinc-300 leading-tight line-clamp-2">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroShowcaseCarousel;
