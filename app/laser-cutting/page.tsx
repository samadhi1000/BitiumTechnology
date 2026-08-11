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
  description: 'Precision CO2 laser cutting for acrylic, wood, and custom profiles — cut and engraved straight from your file, no tooling required.',
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
  afterListings: {
    sections: [
      {
        title: 'How this is different from our stencil cutting',
        content: 'Our Stencil page is about laser-cut Mylar for painting and fabric work. This page is about cutting and engraving the material itself — acrylic signage, wooden nameplates, keychains, panels, and custom-shaped profiles you\'d otherwise need a die or mold for.',
      },
      {
        title: 'What you can order',
        content: 'We handle a wide range of custom laser work across multiple materials.',
        bullets: [
          'Custom-shaped acrylic pieces (signs, stands, awards, decor)',
          'Wood engraving — nameplates, coasters, gift pieces',
          'Cut-to-shape profiles from your own outline or logo',
          'Layered or multi-piece designs that assemble after cutting',
        ],
      },
      {
        title: 'Getting your file ready',
        content: 'A vector file (SVG or AI) gives the cleanest result, since the laser follows the outline exactly. If you only have a photo or a rough sketch, send it anyway — we\'ll trace it into a cuttable file and confirm the outline with you before cutting.',
      },
      {
        title: 'Material thickness matters',
        content: 'Send us the thickness you\'re working with (or ask us to recommend one) — it changes cutting speed, how fine a detail can hold its shape, and whether engraving or a full cut-through is the better call for your design.',
      },
      {
        title: 'Who this is for',
        content: 'Small businesses needing signage or branded pieces, gift makers, hobbyists prototyping a shape before committing to a bigger batch, and anyone who needs one exact cut rather than a mass-produced stock shape.',
      },
    ],
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
