'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Layers, Sparkles, Zap, Shirt, Palette, ShieldCheck, Box, Flame, RefreshCw } from 'lucide-react';

const DTF_PRINTING_CONFIG: CategoryPageConfig = {
  slug: 'dtf-printing',
  categoryKey: 'dtf_sheet',
  breadcrumbName: 'DTF Printing',
  titlePrimary: 'DTF Printing',
  titleHighlight: 'Collection',
  badgeText: 'Direct-to-Film Transfers',
  description: 'Custom gang sheet layouts, anime sticker packs, and cloth transfers — build your sheet online, preview it, and we print and ship it.',
  heroImage: '/images/hero-cards/dtf.jpg',
  searchPlaceholder: 'Search DTF designs, rolls & sheets...',
  itemSingular: 'DTF Transfer',
  itemPlural: 'Transfers',
  subCategories: [
    { id: 'tshirt-design', label: 'T-Shirt Designs' },
    { id: 'dtf-sticker', label: 'DTF Stickers' },
    { id: 'dtf-cloth', label: 'Cloth Transfers' },
  ],
  whyChooseUs: {
    title: 'Why choose our DTF transfers?',
    features: [
      {
        icon: <Sparkles size={16} />,
        title: 'Vibrant CMYK+W Color',
        desc: 'Rich, high-opacity white ink backing for any colored fabric.',
      },
      {
        icon: <ShieldCheck size={16} />,
        title: '50+ Wash Durability',
        desc: 'Ultra stretchable hot-melt powder that never cracks or peels.',
      },
      {
        icon: <Zap size={16} />,
        title: '24-Hour Dispatch',
        desc: 'Fast express production with zero minimum order quantity.',
      },
    ],
  },
  perfectFor: {
    title: 'Perfect for',
    items: [
      { icon: <Shirt size={14} />, label: 'T-Shirts & Hoodies' },
      { icon: <Palette size={14} />, label: 'Cotton & Polyester' },
      { icon: <Box size={14} />, label: 'Caps & Hats' },
      { icon: <Flame size={14} />, label: 'Canvas Tote Bags' },
      { icon: <Layers size={14} />, label: 'Sportswear & Nylon' },
      { icon: <RefreshCw size={14} />, label: 'Custom Brand Tags' },
    ],
  },
  customCta: {
    title: 'Build custom DTF gang sheets?',
    desc: 'Use our 3D interactive canvas gang sheet builder to arrange your designs effortlessly.',
    buttonText: 'Launch DTF Canvas',
    buttonHref: '/canvas',
  },
  afterListings: {
    sections: [
      {
        title: 'How a DTF order works',
        content: 'Your design gets printed onto film, layered with a white base so colors stay bright on any fabric color, then coated with a hot-melt powder. When it arrives, you heat-press it onto the garment — no screens, no setup, no minimum order.',
      },
      {
        title: 'Why people choose DTF over screen printing',
        content: 'DTF transfers offer flexibility that traditional screen printing can\'t match for small runs and full-color work.',
        bullets: [
          'Works on cotton, polyester, and blends without changing your process',
          'No cost jump for full-color or photo-style designs',
          'Makes sense for a single shirt or a full gang sheet of small designs',
          'Transfers store flat until you\'re ready to press them',
        ],
      },
      {
        title: 'Build your own sheet',
        content: 'Use the DTF Sheet Builder to lay out your designs, see exact spacing, and check the finished size before you pay — what you see in the builder is what gets printed.',
      },
      {
        title: 'Turnaround',
        content: 'Standard sheets ship within 24–48 hours of approval.',
      },
    ],
  },
  seo: {
    title: 'DTF Printing Collection | Bitium Technology',
    description: 'High-definition custom direct-to-film transfers, sticker rolls, and ready-to-press garment sheets.',
    canonicalUrl: 'https://www.bitiumtechnology.com/dtf-printing',
  },
};

function DtfPrintingContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const items = data.filter((p) => p.category === 'dtf_sheet');
      setProducts(items);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <CategoryPageTemplate
      config={DTF_PRINTING_CONFIG}
      initialProducts={products}
      loading={loading}
    />
  );
}

export default function DtfPrintingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CFF05]"></div>
        </div>
      }
    >
      <DtfPrintingContent />
    </Suspense>
  );
}
