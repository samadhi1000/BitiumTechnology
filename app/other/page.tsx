'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Sparkles, ShieldCheck, Zap, Shirt, Factory, Flame, Box, Package } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

const OTHER_CONFIG_EN: CategoryPageConfig = {
  slug: 'other',
  categoryKey: 'other' as any,
  breadcrumbName: 'Other Products',
  titlePrimary: 'Specialty &',
  titleHighlight: 'Other Products',
  badgeText: 'Customized & Specialty Products',
  description: 'Explore our specialized items, novel printing accessories, tailored merchandise, and custom production services.',
  heroImage: '/images/hero-cards/toolkit.webp',
  searchPlaceholder: 'Search other products, accessories & custom items...',
  itemSingular: 'Product',
  itemPlural: 'Products',
  subCategories: [
    { id: 'custom', label: 'Custom Production' },
    { id: 'accessories', label: 'Accessories & Tools' },
    { id: 'merchandise', label: 'Merchandise' },
    { id: 'other', label: 'Other' },
  ],
  whyChooseUs: {
    title: 'Why choose our specialized products?',
    features: [
      {
        icon: <Sparkles size={16} />,
        title: 'Custom Made to Order',
        desc: 'Tailored precisely according to your exact specifications and print requirements.',
      },
      {
        icon: <Zap size={16} />,
        title: 'Fast Production Turnaround',
        desc: 'Produced and dispatched quickly with uncompromised attention to quality.',
      },
      {
        icon: <ShieldCheck size={16} />,
        title: 'Factory Direct Pricing',
        desc: 'Direct manufacturing guarantee with competitive pricing for single and bulk orders.',
      },
    ],
  },
  perfectFor: {
    title: 'Perfect for',
    items: [
      { icon: <Shirt size={14} />, label: 'Custom Apparel Brands' },
      { icon: <Factory size={14} />, label: 'Print Studios' },
      { icon: <Flame size={14} />, label: 'Event Organizers' },
      { icon: <Box size={14} />, label: 'Corporate Gifting' },
      { icon: <Package size={14} />, label: 'Creative Artists' },
      { icon: <Sparkles size={14} />, label: 'Bespoke Projects' },
    ],
  },
  customCta: {
    title: 'Have a special custom order?',
    desc: 'Contact our production team directly to discuss custom specs, bulk pricing, or unique items.',
    buttonText: 'Inquire Custom Order',
    buttonHref: '/contact',
  },
  afterListings: {
    sections: [
      {
        title: 'Bespoke manufacturing and specialty print items',
        content: 'Beyond standard print profiles, we craft unique accessories, custom merchandise, and specialized supplies to power your brand.',
      },
    ],
  },
  seo: {
    title: 'Other Products & Specialty Items | Bitium Technology',
    description: 'Browse specialized printing accessories, merchandise, and custom production services at Bitium Technology.',
    canonicalUrl: 'https://www.bitiumtechnology.com/other',
  },
};

const OTHER_CONFIG_SI: CategoryPageConfig = {
  slug: 'other',
  categoryKey: 'other' as any,
  breadcrumbName: 'වෙනත් නිෂ්පාදන',
  titlePrimary: 'සුවිශේෂී සහ',
  titleHighlight: 'වෙනත් නිෂ්පාදන (Other Products)',
  badgeText: 'සුවිශේෂී නිෂ්පාදන එකතුව',
  description: 'අපගේ විශේෂිත මුද්‍රණ නිෂ්පාදන, අමතර උපාංග සහ ඔබගේ අවශ්‍යතාවයට ගැලපෙන සුවිශේෂී අයිතම මෙතැනින් ලබාගන්න.',
  heroImage: '/images/hero-cards/toolkit.webp',
  searchPlaceholder: 'වෙනත් නිෂ්පාදන සහ උපාංග සොයන්න...',
  itemSingular: 'නිෂ්පාදනය',
  itemPlural: 'නිෂ්පාදන',
  subCategories: [
    { id: 'custom', label: 'විශේෂිත ඇණවුම්' },
    { id: 'accessories', label: 'උපාංග සහ මෙවලම්' },
    { id: 'merchandise', label: 'මර්චන්ඩයිස්' },
    { id: 'other', label: 'වෙනත්' },
  ],
  whyChooseUs: {
    title: 'අපගේ සුවිශේෂී නිෂ්පාදන තෝරාගත යුත්තේ ඇයි?',
    features: [
      {
        icon: <Sparkles size={16} />,
        title: 'ඔබේ අවශ්‍යතාවයටම නිපදවීම',
        desc: 'ඔබේ නිශ්චිත මිමි සහ අවශ්‍යතාවය අනුවම සකස් කර දෙනු ලැබේ.',
      },
      {
        icon: <Zap size={16} />,
        title: 'ඉක්මන් නිමාව සහ බෙදාහැරීම',
        desc: 'උසස් තත්ත්වයෙන් සහ කඩිනමින් නිෂ්පාදනය කර ඔබ වෙත එවනු ලැබේ.',
      },
      {
        icon: <ShieldCheck size={16} />,
        title: 'කර්මාන්තශාලා සෘජු මිල ගණන්',
        desc: 'මැදිහත්කරුවන්ගෙන් තොරව සෘජු නිෂ්පාදන මිල ගණන්.',
      },
    ],
  },
  perfectFor: {
    title: 'පරිපූර්ණ වන්නේ',
    items: [
      { icon: <Shirt size={14} />, label: 'ඇඟලුම් ව්‍යාපාරිකයන්' },
      { icon: <Factory size={14} />, label: 'මුද්‍රණ ශිල්පීන්' },
      { icon: <Flame size={14} />, label: 'උත්සව සංවිධායකයින්' },
      { icon: <Box size={14} />, label: 'ආයතනික ත්‍යාග' },
      { icon: <Package size={14} />, label: 'නිර්මාණකරුවන්' },
      { icon: <Sparkles size={14} />, label: 'විශේෂිත ව්‍යාපෘති' },
    ],
  },
  customCta: {
    title: 'විශේෂිත ඇණවුමක් ලබා දීමට අවශ්‍යද?',
    desc: 'ඔබේ සුවිශේෂී අවශ්‍යතාවය සාකච්ඡා කිරීමට අපගේ නිෂ්පාදන කණ්ඩායම අමතන්න.',
    buttonText: 'ඇණවුම විමසන්න',
    buttonHref: '/contact',
  },
  afterListings: {
    sections: [
      {
        title: 'විශේෂිත නිෂ්පාදන සහ අභිරුචි සේවා',
        content: 'සම්මත මුද්‍රණ නිෂ්පාදන වලට අමතරව ඔබගේ ඕනෑම නිර්මාණාත්මක අවශ්‍යතාවයක් සඳහා උසස් සේවාවක් ලබා දීමට අප සූදානම්.',
      },
    ],
  },
  seo: {
    title: 'වෙනත් නිෂ්පාදන සහ සුවිශේෂී අයිතම | Bitium Technology',
    description: 'විශේෂිත නිෂ්පාදන සහ අමතර මුද්‍රණ උපාංග එකතුව.',
    canonicalUrl: 'https://www.bitiumtechnology.com/other',
  },
};

function OtherContent() {
  const { language } = useLanguage();
  const config = language === 'si' ? OTHER_CONFIG_SI : OTHER_CONFIG_EN;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      const items = data.filter((p) => p.category === 'other');
      setProducts(items);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <CategoryPageTemplate
      config={config}
      initialProducts={products}
      loading={loading}
    />
  );
}

export default function OtherPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CFF05]"></div>
        </div>
      }
    >
      <OtherContent />
    </Suspense>
  );
}
