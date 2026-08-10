'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { PackageCheck, Sparkles, ShieldCheck, Droplet, Layers, Zap, Shirt, Factory, Flame, Box } from 'lucide-react';

const MATERIALS_CONFIG: CategoryPageConfig = {
  slug: 'materials',
  categoryKey: 'materials',
  breadcrumbName: 'Materials & Consumables',
  titlePrimary: 'Printing',
  titleHighlight: 'Materials & Inks',
  badgeText: 'Industrial Printing Supplies',
  description: 'Trade grade DTF textile inks, premium high-adhesive hot melt TPU powders, and double-matte hot peel DTF film rolls.',
  heroImage: '/images/hero-cards/dtf.jpg',
  searchPlaceholder: 'Search inks, powders, films & consumables...',
  itemSingular: 'Material / Supply',
  itemPlural: 'Supplies',
  subCategories: [
    { id: 'printing-materials', label: 'DTF Consumables' },
  ],
  whyChooseUs: {
    title: 'Why choose our printing consumables?',
    features: [
      {
        icon: <Droplet size={16} />,
        title: 'High-Density Pigment',
        desc: 'Rich, vivid white & CMYK inks engineered with zero nozzle clogging.',
      },
      {
        icon: <Zap size={16} />,
        title: 'Premium Hot-Melt TPU',
        desc: 'Superior stretch, soft hand-feel, and exceptional fabric adhesion.',
      },
      {
        icon: <ShieldCheck size={16} />,
        title: 'Batch Quality Tested',
        desc: '100% factory fresh supplies certified for commercial print floors.',
      },
    ],
  },
  perfectFor: {
    title: 'Perfect for',
    items: [
      { icon: <Shirt size={14} />, label: 'DTF Print Shops' },
      { icon: <Factory size={14} />, label: 'Garment Factories' },
      { icon: <Layers size={14} />, label: 'Screen Printers' },
      { icon: <Flame size={14} />, label: 'Heat Press Operators' },
      { icon: <Box size={14} />, label: 'Textile Manufacturers' },
      { icon: <Sparkles size={14} />, label: 'Commercial Studios' },
    ],
  },
  customCta: {
    title: 'Need bulk consumable supply?',
    desc: 'Get direct wholesale rates and scheduled monthly dispatch for your print shop.',
    buttonText: 'Request Wholesale Pricing',
    buttonHref: '/contact',
  },
  seo: {
    title: 'DTF Materials & Printing Consumables | Bitium Technology',
    description: 'Inks, hot melt powder, film rolls, emulsions, and wash chemicals for professional printing setups.',
    canonicalUrl: 'https://www.bitiumtechnology.com/materials',
  },
};

function MaterialsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const items = data.filter((p) => p.category === 'materials');
      setProducts(items);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <CategoryPageTemplate
      config={MATERIALS_CONFIG}
      initialProducts={products}
      loading={loading}
    />
  );
}

export default function MaterialsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CFF05]"></div>
        </div>
      }
    >
      <MaterialsContent />
    </Suspense>
  );
}
