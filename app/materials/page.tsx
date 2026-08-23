'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { PackageCheck, Sparkles, ShieldCheck, Droplet, Layers, Zap, Shirt, Factory, Flame, Box } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

const MATERIALS_CONFIG_EN: CategoryPageConfig = {
  slug: 'materials',
  categoryKey: 'materials',
  breadcrumbName: 'Materials & Consumables',
  titlePrimary: 'Printing',
  titleHighlight: 'Materials & Inks',
  badgeText: 'Industrial Printing Supplies',
  description: 'Everything your print floor runs on - DTF inks and film, hot-melt powder, screen-printing emulsions, sensitizers, and wash chemicals - in stock and ready to ship.',
  heroImage: '/images/hero-cards/materials.webp',
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
  afterListings: {
    sections: [
      {
        title: 'Stocked for both DTF and screen printing',
        content: 'Whether you\'re running a DTF printer or exposing your own screens, running out of a consumable mid-job stalls your whole order queue. We keep the essentials in stock so a low-ink day doesn\'t turn into a lost week.',
      },
      {
        title: 'What\'s available',
        content: 'We carry the core consumables that professional print shops rely on day to day.',
        bullets: [
          'DTF inks and double-matte film rolls',
          'Hot-melt transfer powder',
          'Screen-printing photo emulsions and sensitizers',
          'Emulsion remover and screen reclaiming chemicals',
        ],
      },
      {
        title: 'Buying in bulk',
        content: 'Running a shop day to day? Ask us about standing orders - we can set up a recurring delivery so consumables show up before you run low, instead of after.',
      },
    ],
  },
  seo: {
    title: 'DTF Materials & Printing Consumables | Bitium Technology',
    description: 'Inks, hot melt powder, film rolls, emulsions, and wash chemicals for professional printing setups.',
    canonicalUrl: 'https://www.bitiumtechnology.com/materials',
  },
};

const MATERIALS_CONFIG_SI: CategoryPageConfig = {
  slug: 'materials',
  categoryKey: 'materials',
  breadcrumbName: 'ද්‍රව්‍ය සහ පරිභෝජන භාණ්ඩ',
  titlePrimary: 'මුද්‍රණ',
  titleHighlight: 'ද්‍රව්‍ය සහ තීන්ත (Materials & Inks)',
  badgeText: 'කාර්මික මුද්‍රණ අමුද්‍රව්‍ය සැපයුම',
  description: 'ඔබේ මුද්‍රණ අංශයට අවශ්‍ය සියලුම දෑ - DTF තීන්ත සහ ෆිල්ම්, හොට්-මෙල්ට් පවුඩර්, සිල්ක් ස්ක්‍රීන් ෆොටෝ එමල්ෂන් (photo emulsions), සෙන්සිටයිසර් (sensitizers) සහ රෙදි සේදීමේ රසායනික ද්‍රව්‍ය (wash chemicals) - දැන් අප සතුව ඇති අතර, ඉක්මනින්ම ඔබ වෙත එවිය හැක.',
  heroImage: '/images/hero-cards/materials.webp',
  searchPlaceholder: 'තීන්ත, පවුඩර්, ෆිල්ම් සහ අමුද්‍රව්‍ය සොයන්න...',
  itemSingular: 'ද්‍රව්‍යය / අමුද්‍රව්‍යය',
  itemPlural: 'ද්‍රව්‍ය',
  subCategories: [
    { id: 'printing-materials', label: 'DTF අමුද්‍රව්‍ය' },
  ],
  whyChooseUs: {
    title: 'අපගේ මුද්‍රණ පරිභෝජන ද්‍රව්‍ය තෝරාගත යුත්තේ ඇයි?',
    features: [
      {
        icon: <Droplet size={16} />,
        title: 'ඉහළ ඝනත්ව වර්ණක (High-Density Pigment)',
        desc: 'නොසල් අවහිර වීම්වලින් තොරව සකසන ලද දීප්තිමත් සුදු සහ CMYK තීන්ත.',
      },
      {
        icon: <Zap size={16} />,
        title: 'විශිෂ්ට හොට්-මෙල්ට් TPU',
        desc: 'ඉහළ ඇදීමේ හැකියාව, මෘදු නිමාව සහ විශිෂ්ට රෙදි ඇලවුම් හැකියාව.',
      },
      {
        icon: <ShieldCheck size={16} />,
        title: 'තත්ත්ව පරීක්ෂාවට ලක් කළ කාණ්ඩ',
        desc: 'වාණිජ මුද්‍රණ සඳහා 100% ක් කර්මාන්තශාලා මට්ටමෙන්ම පරීක්ෂා කර ඇත.',
      },
    ],
  },
  perfectFor: {
    title: 'පරිපූර්ණ වන්නේ',
    items: [
      { icon: <Shirt size={14} />, label: 'DTF මුද්‍රණාල' },
      { icon: <Factory size={14} />, label: 'ඇඟලුම් කර්මාන්තශාලා' },
      { icon: <Layers size={14} />, label: 'ස්ක්‍රීන් මුද්‍රණ ශිල්පීන්' },
      { icon: <Flame size={14} />, label: 'හීට් ප්‍රෙස් ක්‍රියාකරවන්නන්' },
      { icon: <Box size={14} />, label: 'රෙදිපිළි නිෂ්පාදකයින්' },
      { icon: <Sparkles size={14} />, label: 'වාණිජ කලාගාර' },
    ],
  },
  customCta: {
    title: 'තොග වශයෙන් අමුද්‍රව්‍ය අවශ්‍යද?',
    desc: 'ඔබේ මුද්‍රණාලය සඳහා සෘජු තොග මිල ගණන් සහ මාසික සැපයුම් පහසුකම් ලබාගන්න.',
    buttonText: 'තොග මිල ගණන් විමසන්න',
    buttonHref: '/contact',
  },
  afterListings: {
    sections: [
      {
        title: 'DTF සහ ස්ක්‍රීන් ප්‍රින්ටින් යන දෙකටම අවශ්‍ය ද්‍රව්‍ය ඇත',
        content: 'ඔබ DTF ප්‍රින්ටරයක් ක්‍රියාත්මක කළද, නැතහොත් ඔබේම ස්ක්‍රීන් එක්ස්පෝස් කළද, වැඩක් අතරතුර අමුද්‍රව්‍ය හිඟවීම මුළු ඇණවුම් පෝලිමම නතර කිරීමට හේතු වේ. අපි අත්‍යවශ්‍ය ද්‍රව්‍ය සැමවිටම ගබඩා කර තබා ගන්නා බැවින් තීන්ත හිඟවීමකින් ඔබේ ව්‍යාපාරයේ දිනක්වත් අපතේ නොයනු ඇත.',
      },
      {
        title: 'මිලදී ගැනීමට ඇති ද්‍රව්‍ය',
        content: 'වාණිජ මුද්‍රණාල දිනපතා භාවිත කරන මූලික අමුද්‍රව්‍ය අපි සපයන්නෙමු.',
        bullets: [
          'DTF තීන්ත සහ ඩබල්-මැට් ෆිල්ම් රෝල්ස් (double-matte film rolls)',
          'හොට්-මෙල්ට් ට්‍රාන්ස්ෆර් පවුඩර් (Hot-melt transfer powder)',
          'සිල්ක් ස්ක්‍රීන් ෆොටෝ එමල්ෂන් සහ සෙන්සිටයිසර් (photo emulsions & sensitizers)',
          'එමල්ෂන් රිමූවර් (emulsion remover) සහ ස්ක්‍රීන් පිරිසිදු කරන රසායනික ද්‍රව්‍ය',
        ],
      },
      {
        title: 'තොග වශයෙන් මිලදී ගැනීම්',
        content: 'දිනපතා ව්‍යාපාරයක් පවත්වාගෙන යන්නේද? ස්ටෑන්ඩින් ඕඩර්ස් (standing orders) පිළිබඳව අපෙන් විමසන්න - ද්‍රව්‍ය අවසන් වීමට පෙර, ස්වයංක්‍රීයව නියමිත කාලයට අමුද්‍රව්‍ය ලැබෙන පරිදි ක්‍රමවේදයක් අපට සකස් කර දිය හැකිය.',
      },
    ],
  },
  seo: {
    title: 'DTF මුද්‍රණ ද්‍රව්‍ය සහ අමුද්‍රව්‍ය | Bitium Technology',
    description: 'මුද්‍රණාල සඳහා අවශ්‍ය තීන්ත, පවුඩර්, ෆිල්ම් රෝල්ස් සහ රසායනික ද්‍රව්‍ය.',
    canonicalUrl: 'https://www.bitiumtechnology.com/materials',
  },
};

function MaterialsContent() {
  const { language } = useLanguage();
  const config = language === 'si' ? MATERIALS_CONFIG_SI : MATERIALS_CONFIG_EN;
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
      config={config}
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
