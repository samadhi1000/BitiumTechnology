'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { Layers, Sparkles, ArrowRight, Flame, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

interface TrendingHeroShowcaseProps {
  products?: Product[];
}

const DEFAULT_TRENDING = [
  {
    id: 'dtf-custom-canvas',
    name: 'Custom DTF Gang Sheet (12" x 23")',
    category: 'dtf_sheet',
    sub_category: 'dtf-sticker',
    description: 'High-definition full color DTF transfer sheet. Upload multiple designs with instant background removal.',
    price: 3500,
    original_price: 4500,
    image_url: '/images/products/dtf-sheet.jpg',
    badge: '🔥 #1 Trending',
    link: '/canvas',
    btnText: 'Launch Canvas Builder'
  },
  {
    id: 'stencil-saree-1',
    name: 'Floral Saree Border Stencil',
    category: 'stencil',
    sub_category: 'saree',
    description: 'Reusable precision laser-cut Mylar stencil for elegant saree hand-painting & fabric art.',
    price: 1800,
    original_price: 2400,
    image_url: '/images/products/saree-border-dtf.jpg',
    badge: '✨ Popular Choice',
    link: '/products/stencil-saree-1',
    btnText: 'View Stencil'
  },
  {
    id: 'batik-stamp-cap-1',
    name: 'Stitch Artwork Print Transfer',
    category: 'batik-stamp',
    sub_category: 'cap-batik',
    description: 'Handcrafted authentic fabric pattern print transfer for traditional and modern apparel.',
    price: 4900,
    original_price: 6500,
    image_url: '/images/products/stitch-dtf.jpg',
    badge: '🎨 Craft Special',
    link: '/products/batik-stamp-cap-batik-1',
    btnText: 'Explore Print'
  }
];

export default function TrendingHeroShowcase({ products = [] }: TrendingHeroShowcaseProps) {
  const [activeTab, setActiveTab] = useState(0);

  // If real products passed, try mapping them, otherwise use instant high-speed defaults
  const items = DEFAULT_TRENDING.map((defItem) => {
    const found = products.find((p) => p.id === defItem.id || p.category === defItem.category);
    if (found) {
      return {
        ...defItem,
        name: found.name,
        price: found.price,
        original_price: found.original_price,
        image_url: found.image_url || defItem.image_url,
      };
    }
    return defItem;
  });

  const current = items[activeTab] || items[0];

  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col items-center">
      {/* Category Pills Header */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-card/90 border border-border backdrop-blur-md mb-4 shadow-xl">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === idx
                ? 'bg-gradient-to-r from-[#8DFF00] to-[#7acc00] text-foreground shadow-lg shadow-[#8DFF00]/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {idx === 0 && <Flame size={12} className={activeTab === 0 ? 'text-amber-300 animate-pulse' : ''} />}
            {idx === 1 && <Sparkles size={12} className={activeTab === 1 ? 'text-[#9eff1a]' : ''} />}
            {idx === 2 && <Zap size={12} className={activeTab === 2 ? 'text-cyan-300' : ''} />}
            <span>{idx === 0 ? 'DTF Sheet' : idx === 1 ? 'Stencil' : 'Batik'}</span>
          </button>
        ))}
      </div>

      {/* Main Glass Showcase Card */}
      <div className="group relative w-full rounded-3xl border border-[#8DFF00]/20 bg-card/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 hover:border-[#8DFF00]/40 hover:shadow-[#8DFF00]/20">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#8DFF00]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#8DFF00]/30 transition-all duration-500"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#8DFF00]/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Product Image Stage */}
        <div className="relative w-full h-[250px] bg-background overflow-hidden">
          <Image
            src={current.image_url}
            alt={current.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 440px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent"></div>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <span className="px-3 py-1 rounded-full bg-[#8DFF00]/90 text-[#0a0a0a] text-[11px] font-black uppercase tracking-wider backdrop-blur shadow-md flex items-center gap-1">
              <Sparkles size={11} />
              {current.badge}
            </span>
            {current.original_price && (
              <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-foreground text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                SAVE {Math.round(((current.original_price - current.price) / current.original_price) * 100)}%
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-4 z-10">
            <span className="px-2.5 py-1 rounded-lg bg-background/80 border border-border text-[10px] font-bold text-foreground backdrop-blur flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-400" />
              Ready to Order
            </span>
          </div>
        </div>

        {/* Card Info & CTA */}
        <div className="p-6 space-y-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#8DFF00]">
              {current.category.replace('_', ' ')}
            </span>
            <h3 className="text-lg font-black text-foreground mt-0.5 leading-snug line-clamp-1">
              {current.name}
            </h3>
            <p className="text-muted-foreground text-xs mt-1.5 line-clamp-2 leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-between">
            <div>
              {current.original_price && (
                <span className="text-xs text-muted-foreground line-through font-semibold block -mb-0.5">
                  Rs. {current.original_price.toLocaleString()}
                </span>
              )}
              <span className="text-2xl font-black text-foreground tracking-tight">
                Rs. {current.price.toLocaleString()}
              </span>
            </div>

            <Link
              href={current.link}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8DFF00] to-[#7acc00] hover:from-[#9eff1a] hover:to-[#9eff1a] text-foreground font-black text-xs flex items-center gap-2 shadow-lg shadow-[#8DFF00]/25 hover:shadow-[#8DFF00]/40 transition-all hover:scale-105"
            >
              <span>{current.btnText}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
