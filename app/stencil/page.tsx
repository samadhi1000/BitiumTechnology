'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Scissors, Sparkles, RefreshCw, Shirt, Frame, Paintbrush, Palette, Layers, Box } from 'lucide-react';

const STENCIL_CONFIG: CategoryPageConfig = {
  slug: 'stencil',
  categoryKey: 'stencil',
  breadcrumbName: 'Stencils',
  titlePrimary: 'Stencil',
  titleHighlight: 'Collection',
  badgeText: 'Precision Mylar & Metal Stencils',
  description: 'Precision-cut Mylar stencils for saree work, hand painting, and wall art. Every stencil is laser-cut from your design, so the lines stay sharp no matter how detailed the pattern is.',
  heroImage: '/images/hero-cards/stencil.jpg',
  searchPlaceholder: 'Search stencils...',
  itemSingular: 'Stencil',
  itemPlural: 'Stencils',
  subCategories: [
    { id: 'hand-painting', label: 'Hand Painting' },
    { id: 'saree', label: 'Saree Border' },
    { id: 'tote-bags', label: 'Tote Bags' },
    { id: 'batik', label: 'Batik Patterns' },
    { id: 'wall-decoration', label: 'Wall Decor' },
    { id: 'titanium', label: 'Titanium' },
  ],
  whyChooseUs: {
    title: 'Why choose our laser-cut stencils?',
    features: [
      {
        icon: <Scissors size={16} />,
        title: 'Precision Cut',
        desc: 'Clean edges for perfect results every time.',
      },
      {
        icon: <RefreshCw size={16} />,
        title: 'Reusable',
        desc: 'High quality material built to last.',
      },
      {
        icon: <Sparkles size={16} />,
        title: 'Easy to Use',
        desc: 'Simple to use and easy to clean.',
      },
    ],
  },
  perfectFor: {
    title: 'Perfect for',
    items: [
      { icon: <Shirt size={14} />, label: 'Fabric Printing' },
      { icon: <Frame size={14} />, label: 'Wall Art' },
      { icon: <Box size={14} />, label: 'Furniture & Decor' },
      { icon: <Paintbrush size={14} />, label: 'Painting' },
      { icon: <Scissors size={14} />, label: 'Craft Projects' },
      { icon: <Layers size={14} />, label: 'DIY Projects' },
    ],
  },
  customCta: {
    title: 'Need a custom stencil?',
    desc: 'We can create any precision laser-cut design you need with no minimums.',
    buttonText: 'Contact Us',
    buttonHref: '/contact',
  },
  afterListings: {
    sections: [
      {
        title: 'Why laser-cut stencils?',
        content: 'Hand-cut stencils shift a little every time — a curve here, a corner there. A laser follows your file exactly, so if you\'re repeating a pattern across ten sarees or a whole wall mural, every cut matches the last one.',
      },
      {
        title: 'What you can use them for',
        content: 'Our Mylar stencils are versatile enough for a wide range of creative and commercial applications.',
        bullets: [
          'Saree and fabric block printing',
          'Wall art and mural templates',
          'Henna and hand-painting guides',
          'Repeat-pattern textile work',
        ],
      },
      {
        title: 'Getting your design ready',
        content: 'You can send us a photo of a sketch, a vector file, or just describe what you want — we\'ll clean it up and turn it into a cuttable design before anything goes near the laser. If a detail is too fine to hold its shape once cut, we\'ll flag it and suggest a fix rather than print it as-is.',
      },
      {
        title: 'Turnaround',
        content: 'Most stencil orders are ready within a couple of days, depending on size and how many you need cut.',
      },
    ],
  },
  seo: {
    title: 'Stencil Collection | Bitium Technology',
    description: 'Explore reusable precision laser-cut Mylar and titanium stencils for fabric hand-painting, saree borders, tote bags, and wall decorations.',
    canonicalUrl: 'https://www.bitiumtechnology.com/stencil',
  },
};

function StencilContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const stencils = data.filter((p) => p.category === 'stencil');
      setProducts(stencils);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <CategoryPageTemplate
      config={STENCIL_CONFIG}
      initialProducts={products}
      loading={loading}
    />
  );
}

export default function StencilPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CFF05]"></div>
        </div>
      }
    >
      <StencilContent />
    </Suspense>
  );
}
