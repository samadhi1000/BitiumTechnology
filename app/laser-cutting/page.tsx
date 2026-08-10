'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Scissors, Sparkles, CheckCircle2, Box, Frame, Layers, Zap, Flame, Shield } from 'lucide-react';

const LASER_CUTTING_CONFIG: CategoryPageConfig = {
  slug: 'laser-cutting',
  categoryKey: 'laser-cutting',
  breadcrumbName: 'Laser Cutting',
  titlePrimary: 'Laser Cutting',
  titleHighlight: 'Collection',
  badgeText: 'Precision Laser Cut & Engraving',
  description: 'High-precision industrial laser cutting, engraving, and custom profiling on acrylic, wood, leather, and metal.',
  heroImage: '/images/hero-cards/laser.jpg',
  searchPlaceholder: 'Search laser cut products & materials...',
  itemSingular: 'Laser Product',
  itemPlural: 'Products',
  subCategories: [
    { id: 'acrylic', label: 'Acrylic Cut & Signs' },
    { id: 'wood', label: 'Wood Engraving' },
    { id: 'custom-profile', label: 'Custom Profiles' },
  ],
  whyChooseUs: {
    title: 'Why choose our precision laser cutting?',
    features: [
      {
        icon: <Scissors size={16} />,
        title: '±0.05mm Micro Accuracy',
        desc: 'Tight tolerance CNC laser beams for delicate and intricate vectors.',
      },
      {
        icon: <Sparkles size={16} />,
        title: 'Flame Polished Edges',
        desc: 'Smooth, crystal clear edge quality without burns or rough marks.',
      },
      {
        icon: <Zap size={16} />,
        title: 'Rapid Prototyping',
        desc: 'Fast turnaround from one-off samples to large bulk productions.',
      },
    ],
  },
  perfectFor: {
    title: 'Perfect for',
    items: [
      { icon: <Box size={14} />, label: 'LED Signage & Displays' },
      { icon: <Frame size={14} />, label: 'Wood Wall Art' },
      { icon: <Layers size={14} />, label: 'Custom Keychains' },
      { icon: <Shield size={14} />, label: 'Plaques & Awards' },
      { icon: <Flame size={14} />, label: 'Gaskets & Seals' },
      { icon: <Scissors size={14} />, label: 'Custom Stencil Sheets' },
    ],
  },
  customCta: {
    title: 'Have a custom DXF / Vector file?',
    desc: 'Upload your vector file or artwork for an instant cutting quotation and advice.',
    buttonText: 'Request Laser Quote',
    buttonHref: '/contact',
  },
  seo: {
    title: 'Laser Cutting Services & Products | Bitium Technology',
    description: 'High-precision industrial laser cutting, engraving, and custom profiling on acrylic, wood, leather, and metal.',
    canonicalUrl: 'https://www.bitiumtechnology.com/laser-cutting',
  },
};

function LaserCuttingContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const items = data.filter((p) => p.category === 'laser-cutting');
      setProducts(items);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <CategoryPageTemplate
      config={LASER_CUTTING_CONFIG}
      initialProducts={products}
      loading={loading}
    />
  );
}

export default function LaserCuttingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CFF05]"></div>
        </div>
      }
    >
      <LaserCuttingContent />
    </Suspense>
  );
}
