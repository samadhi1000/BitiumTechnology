'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Stamp, Sparkles, Shield, Flame, Palette, Shirt, Frame, Layers } from 'lucide-react';

const BATIK_STAMP_CONFIG: CategoryPageConfig = {
  slug: 'batik-stamp',
  categoryKey: 'batik-stamp',
  breadcrumbName: 'Batik Stamps',
  titlePrimary: 'Batik Stamp',
  titleHighlight: 'Collection',
  badgeText: 'Handcrafted Cap Batik Stamps',
  description: 'Authentic handcrafted copper and solid wood Cap Batik printing stamps for traditional fabric waxing and textile manufacturing.',
  heroImage: '/images/hero-cards/batik.jpg',
  searchPlaceholder: 'Search batik stamps & motifs...',
  itemSingular: 'Batik Stamp',
  itemPlural: 'Stamps',
  subCategories: [
    { id: 'cap-batik', label: 'Cap Batik Stamps' },
  ],
  whyChooseUs: {
    title: 'Why choose our handcrafted batik stamps?',
    features: [
      {
        icon: <Stamp size={16} />,
        title: 'Master Copper Craft',
        desc: 'Hand-soldered pure copper strips for intricate waxing precision.',
      },
      {
        icon: <Flame size={16} />,
        title: 'Optimal Wax Retention',
        desc: 'Engineered for smooth, continuous hot wax transfer without bleeding.',
      },
      {
        icon: <Shield size={16} />,
        title: 'Generational Durability',
        desc: 'Heavy-duty construction built for tens of thousands of prints.',
      },
    ],
  },
  perfectFor: {
    title: 'Perfect for',
    items: [
      { icon: <Shirt size={14} />, label: 'Batik Sarees' },
      { icon: <Palette size={14} />, label: 'Traditional Sarongs' },
      { icon: <Frame size={14} />, label: 'Wall Tapestries' },
      { icon: <Layers size={14} />, label: 'Home Textiles' },
      { icon: <Sparkles size={14} />, label: 'Silk Painting' },
      { icon: <Stamp size={14} />, label: 'Artisan Workshops' },
    ],
  },
  customCta: {
    title: 'Need a custom batik stamp?',
    desc: 'We craft bespoke copper Cap Batik stamps based on your custom artwork and motifs.',
    buttonText: 'Request Custom Stamp',
    buttonHref: '/contact',
  },
  seo: {
    title: 'Batik Stamp Collection | Bitium Technology',
    description: 'Authentic handcrafted copper and solid wood Cap Batik printing stamps for traditional fabric waxing, textile design, and batik manufacturing.',
    canonicalUrl: 'https://www.bitiumtechnology.com/batik-stamp',
  },
};

function BatikStampContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const items = data.filter((p) => p.category === 'batik-stamp');
      setProducts(items);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <CategoryPageTemplate
      config={BATIK_STAMP_CONFIG}
      initialProducts={products}
      loading={loading}
    />
  );
}

export default function BatikStampPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CFF05]"></div>
        </div>
      }
    >
      <BatikStampContent />
    </Suspense>
  );
}
