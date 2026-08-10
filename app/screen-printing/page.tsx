'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Printer, Sparkles, CheckCircle2, Shirt, Frame, Layers, FileText, Palette, Package } from 'lucide-react';

const SCREEN_PRINTING_CONFIG: CategoryPageConfig = {
  slug: 'screen-printing',
  categoryKey: 'screen-printing',
  breadcrumbName: 'Screen Printing',
  titlePrimary: 'Screen Printing',
  titleHighlight: 'Collection',
  badgeText: 'Trade Screen Printing Supplies',
  description: 'Ready-to-print custom exposed mesh screens, vector artwork graphics, tracing sheets, and high-density positive film outputs.',
  heroImage: '/images/hero-cards/screenprint.jpg',
  searchPlaceholder: 'Search screens, films & supplies...',
  itemSingular: 'Screen / Supply',
  itemPlural: 'Products',
  subCategories: [
    { id: 'screen-exposed', label: 'Exposed Screens' },
    { id: 'artwork', label: 'Vector Artwork' },
    { id: 'tracing-printouts', label: 'Tracing Printouts' },
    { id: 'positive-printouts', label: 'Positive Film' },
  ],
  whyChooseUs: {
    title: 'Why choose our screen printing supplies?',
    features: [
      {
        icon: <Printer size={16} />,
        title: 'High Mesh Tension',
        desc: 'Precision stretched frames for razor sharp registration.',
      },
      {
        icon: <Sparkles size={16} />,
        title: 'Ready-to-Print Exposure',
        desc: 'Pre-exposed with high-density emulsion and UV cured.',
      },
      {
        icon: <CheckCircle2 size={16} />,
        title: 'Trade Grade Quality',
        desc: 'Durable aluminum & seasoned wood frames built for runs.',
      },
    ],
  },
  perfectFor: {
    title: 'Perfect for',
    items: [
      { icon: <Shirt size={14} />, label: 'T-Shirt Merch' },
      { icon: <Frame size={14} />, label: 'Art Posters' },
      { icon: <Package size={14} />, label: 'Boxes & Packaging' },
      { icon: <Palette size={14} />, label: 'Textile Printing' },
      { icon: <FileText size={14} />, label: 'Saree Work' },
      { icon: <Layers size={14} />, label: 'Bulk Orders' },
    ],
  },
  customCta: {
    title: 'Need a custom screen exposed?',
    desc: 'Send us your vector design and get a ready-to-print screen delivered to your doorstep.',
    buttonText: 'Order Custom Screen',
    buttonHref: '/order-form',
  },
  seo: {
    title: 'Screen Printing Collection | Bitium Technology',
    description: 'Ready-to-print custom exposed mesh screens, vector artwork graphics, tracing sheets, and high-density positive film outputs.',
    canonicalUrl: 'https://www.bitiumtechnology.com/screen-printing',
  },
};

function ScreenPrintingContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const items = data.filter((p) => p.category === 'screen-printing');
      setProducts(items);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <CategoryPageTemplate
      config={SCREEN_PRINTING_CONFIG}
      initialProducts={products}
      loading={loading}
    />
  );
}

export default function ScreenPrintingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CFF05]"></div>
        </div>
      }
    >
      <ScreenPrintingContent />
    </Suspense>
  );
}
