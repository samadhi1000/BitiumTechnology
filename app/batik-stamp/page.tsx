'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Stamp, Sparkles, Shield, Flame, Palette, Shirt, Frame, Layers } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

const BATIK_STAMP_CONFIG_EN: CategoryPageConfig = {
  slug: 'batik-stamp',
  categoryKey: 'batik-stamp',
  breadcrumbName: 'Batik Stamps',
  titlePrimary: 'Batik Stamp',
  titleHighlight: 'Collection',
  badgeText: 'Handcrafted Cap Batik Stamps',
  description: 'Traditional copper and hand-carved wood Cap Batik stamps, made the way batik makers have always made them.',
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
  afterListings: {
    sections: [
      {
        title: 'Copper vs. wood stamps',
        content: 'Copper stamps (cap) hold fine, repeating detail well and last through heavy daily use — the standard choice for production batik. Wood stamps carve more freely, so they suit bolder, one-off, or hand-carved motifs where a little natural variation is part of the look.',
      },
      {
        title: 'What we need from you',
        content: 'A photo or drawing of the motif is enough to start. We\'ll confirm sizing and repeat spacing with you before anything is carved or cast, so there are no surprises on the finished stamp.',
      },
      {
        title: 'Who orders these',
        content: 'Batik studios keeping traditional methods alive, textile schools, and makers who want a stamp built to their own pattern instead of a stock design.',
      },
    ],
  },
  seo: {
    title: 'Batik Stamp Collection | Bitium Technology',
    description: 'Authentic handcrafted copper and solid wood Cap Batik printing stamps for traditional fabric waxing, textile design, and batik manufacturing.',
    canonicalUrl: 'https://www.bitiumtechnology.com/batik-stamp',
  },
};

const BATIK_STAMP_CONFIG_SI: CategoryPageConfig = {
  slug: 'batik-stamp',
  categoryKey: 'batik-stamp',
  breadcrumbName: 'බතික් මුද්‍රා',
  titlePrimary: 'බතික් මුද්‍රා',
  titleHighlight: '(Batik Stamps)',
  badgeText: 'සාම්ප්‍රදායික බතික් මුද්‍රණ අච්චු',
  description: 'සාම්ප්‍රදායික තඹ සහ අතින් කැටයම් කරන ලද ලී කැප් බතික් මුද්‍රා (Cap Batik stamps) - පාරම්පරික බතික් ශිල්පීන් සෑදූ උසස්ම තාක්ෂණයෙන් සහ ගුණාත්මක භාවයෙන් යුතුව නිමවා ඇත.',
  heroImage: '/images/hero-cards/batik.jpg',
  searchPlaceholder: 'බතික් මුද්‍රා සහ මෝස්තර සොයන්න...',
  itemSingular: 'බතික් මුද්‍රාව',
  itemPlural: 'මුද්‍රා',
  subCategories: [
    { id: 'cap-batik', label: 'කැප් බතික් මුද්‍රා' },
  ],
  whyChooseUs: {
    title: 'අපගේ අතින් සාදන ලද බතික් මුද්‍රා තෝරාගත යුත්තේ ඇයි?',
    features: [
      {
        icon: <Stamp size={16} />,
        title: 'විශිෂ්ට තඹ වැඩකටයුතු',
        desc: 'සියුම් මුද්‍රණ රටා සඳහා අතින් පෑස්සූ පිරිසිදු තඹ තීරු.',
      },
      {
        icon: <Flame size={16} />,
        title: 'උපරිම ඉටි රඳවා ගැනීම',
        desc: 'ඉටි කාන්දු වීමකින් තොරව සුමටව රෙදි මත තැවරීමට හැකි වන පරිදි සකසා ඇත.',
      },
      {
        icon: <Shield size={16} />,
        title: 'පරම්පරා ගණනක කල්පැවැත්ම',
        desc: 'දහස් වාරයක් මුද්‍රණය කිරීමට ඔරොත්තු දෙන ශක්තිමත් නිමාව.',
      },
    ],
  },
  perfectFor: {
    title: 'පරිපූර්ණ වන්නේ',
    items: [
      { icon: <Shirt size={14} />, label: 'බතික් සාරි' },
      { icon: <Palette size={14} />, label: 'සාම්ප්‍රදායික සරම්' },
      { icon: <Frame size={14} />, label: 'බිත්ති සැරසිලි රෙදි' },
      { icon: <Layers size={14} />, label: 'ගෘහස්ථ රෙදිපිළි' },
      { icon: <Sparkles size={14} />, label: 'සිල්ක් පින්තාරු කිරීම්' },
      { icon: <Stamp size={14} />, label: 'කලාගාර සහ වැඩමුළු' },
    ],
  },
  customCta: {
    title: 'ඔබට අවශ්‍ය පරිදි සකසාගත් බතික් මුද්‍රාවක් අවශ්‍යද?',
    desc: 'ඔබේම රටා සහ සැලසුම්වලට අනුව සකසන ලද තඹ කැප් බතික් මුද්‍රා අපෙන් ලබාගන්න.',
    buttonText: 'මුද්‍රණයක් ඇණවුම් කරන්න',
    buttonHref: '/contact',
  },
  afterListings: {
    sections: [
      {
        title: 'තඹ සහ ලී මුද්‍රා අතර වෙනස',
        content: 'තඹ මුද්‍රා (cap) මඟින් සියුම්, නැවත නැවත සිදුවන රටා හොඳින් රඳවා ගන්නා අතර දෛනිකව බහුලව භාවිත කිරීමට ඔරොත්තු දෙයි - මෙය වාණිජ බතික් නිෂ්පාදනයේ පොදු තේරීමයි. ලී මුද්‍රා වඩාත් නිදහස්ව කැටයම් කළ හැකි බැවින්, ඒවා වඩාත් කැපී පෙනෙන, එක් වරක් පමණක් භාවිත කරන, හෝ ස්වාභාවික වෙනස්කම් සහිත අතින් කැටයම් කරන ලද මෝස්තර සඳහා වඩාත් සුදුසු වේ.',
      },
      {
        title: 'අපට ඔබෙන් අවශ්‍ය දේ',
        content: 'ආරම්භ කිරීම සඳහා මෝස්තරයේ ඡායාරූපයක් හෝ චිත්‍රයක් ප්‍රමාණවත් වේ. කිසිවක් කැටයම් කිරීමට හෝ වාත්තු කිරීමට පෙර අපි ප්‍රමාණය සහ රටා අතර පරතරය ඔබ සමඟ තහවුරු කරන්නෙමු, එබැවින් අවසානයේ ලැබෙන මුද්‍රාව පිළිබඳව ඔබට කිසිදු සැකයක් ඇති නොවේ.',
      },
      {
        title: 'මේවා ඇණවුම් කරන්නේ කවුද?',
        content: 'සාම්ප්‍රදායික ක්‍රම සුරකිමින් පවත්වාගෙන යන බතික් ආයතන, රෙදිපිළි තාක්ෂණ විද්‍යාල සහ සාමාන්‍ය මෝස්තර වෙනුවට තමන්ගේම රටාවකට අනුව මුද්‍රාවක් සාදා ගැනීමට කැමති නිර්මාණකරුවන්.',
      },
    ],
  },
  seo: {
    title: 'බතික් මුද්‍රා එකතුව | Bitium Technology',
    description: 'සාම්ප්‍රදායික තඹ සහ ලී කැප් බතික් මුද්‍රණ අච්චු.',
    canonicalUrl: 'https://www.bitiumtechnology.com/batik-stamp',
  },
};

function BatikStampContent() {
  const { language } = useLanguage();
  const config = language === 'si' ? BATIK_STAMP_CONFIG_SI : BATIK_STAMP_CONFIG_EN;
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
      config={config}
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
