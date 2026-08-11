'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Layers, Sparkles, Zap, Shirt, Palette, ShieldCheck, Box, Flame, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

const DTF_PRINTING_CONFIG_EN: CategoryPageConfig = {
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

const DTF_PRINTING_CONFIG_SI: CategoryPageConfig = {
  slug: 'dtf-printing',
  categoryKey: 'dtf_sheet',
  breadcrumbName: 'DTF මුද්‍රණය',
  titlePrimary: 'DTF',
  titleHighlight: 'මුද්‍රණය (DTF Printing)',
  badgeText: 'Direct-to-Film ට්‍රාන්ස්ෆර් මුද්‍රණ',
  description: 'ඔබට අවශ්‍ය පරිදි සකසන ලද ගෑං ෂීට් (gang sheet) සැකසුම්, ඇනිමෙ ස්ටිකර් පැකේජ (anime sticker packs) සහ ඇඳුම් මාරු කිරීමේ මුද්‍රණ (cloth transfers) - ඔබේ ෂීට් එක අන්තර්ජාලය හරහා සකසා, පෙරදසුන (preview) බලා ඇණවුම් කරන්න, අපි එය මුද්‍රණය කර ඔබ වෙත එවන්නෙමු.',
  heroImage: '/images/hero-cards/dtf.jpg',
  searchPlaceholder: 'DTF මෝස්තර සහ ෂීට්ස් සොයන්න...',
  itemSingular: 'DTF ට්‍රාන්ස්ෆර්',
  itemPlural: 'ට්‍රාන්ස්ෆර්ස්',
  subCategories: [
    { id: 'tshirt-design', label: 'ටී-ෂර්ට් මෝස්තර' },
    { id: 'dtf-sticker', label: 'DTF ස්ටිකර්ස්' },
    { id: 'dtf-cloth', label: 'ඇඳුම් ට්‍රාන්ස්ෆර්ස්' },
  ],
  whyChooseUs: {
    title: 'අපගේ DTF ට්‍රාන්ස්ෆර්ස් තෝරාගත යුත්තේ ඇයි?',
    features: [
      {
        icon: <Sparkles size={16} />,
        title: 'දීප්තිමත් CMYK+W වර්ණ',
        desc: 'ඕනෑම වර්ණවත් රෙද්දක පැහැදිලි බව සඳහා ඝන සුදු පසුබිම් තට්ටුවක් (white base).',
      },
      {
        icon: <ShieldCheck size={16} />,
        title: '50+ වාරයක සේදීමේ කල්පැවැත්ම',
        desc: 'කිසි විටෙකත් ඉරිතලා නොයන හෝ ගැලවී නොයන ඇදෙන සුළු හොට්-මෙල්ට් පවුඩර්.',
      },
      {
        icon: <Zap size={16} />,
        title: 'පැය 24ක් තුළ නැව්ගත කිරීම',
        desc: 'අවම ඇණවුම් සීමාවකින් තොරව වේගවත්ම නිෂ්පාදනය.',
      },
    ],
  },
  perfectFor: {
    title: 'පරිපූර්ණ වන්නේ',
    items: [
      { icon: <Shirt size={14} />, label: 'ටී-ෂර්ට් සහ හුඩීස්' },
      { icon: <Palette size={14} />, label: 'කපු සහ පොලියෙස්ටර්' },
      { icon: <Box size={14} />, label: 'තොප්පි (Caps & Hats)' },
      { icon: <Flame size={14} />, label: 'ටෝට් බෑග්' },
      { icon: <Layers size={14} />, label: 'ක්‍රීඩා ඇඳුම් සහ නයිලෝන්' },
      { icon: <RefreshCw size={14} />, label: 'සන්නාම ටැග්ස් (Brand Tags)' },
    ],
  },
  customCta: {
    title: 'ඔබේම custom DTF gang sheets සකසනවාද?',
    desc: 'අපගේ 3D ඉන්ටරැක්ටිව් කැන්වස් බිල්ඩරය භාවිත කර ඔබේ මෝස්තර පහසුවෙන් සකසා ගන්න.',
    buttonText: 'ඔබේ නිර්මාණය අරඹන්න',
    buttonHref: '/canvas',
  },
  afterListings: {
    sections: [
      {
        title: 'DTF ඇණවුමක් ක්‍රියාත්මක වන ආකාරය',
        content: 'ඔබගේ මෝස්තරය විශේෂිත ෆිල්ම් එකක් මත මුද්‍රණය කර, ඕනෑම රෙදි වර්ණයකදී වර්ණ දීප්තිමත්ව තබා ගැනීම සඳහා සුදු පැහැති පසුබිම් තට්ටුවක් (white base) යොදනු ලැබේ. ඉන්පසු එය උණුසුම්ව දියවන කුඩු වර්ගයකින් (hot-melt powder) ආලේප කරයි. එය ඔබට ලැබුණු පසු, හීට් ප්‍රෙස් (heat-press) යන්ත්‍රයකින් ඇඳුම මත ඇලවිය හැක - මෙහිදී ස්ක්‍රීන් සකස් කිරීම් හෝ අවම ඇණවුම් සීමාවන් නොමැත.',
      },
      {
        title: 'මිනිසුන් සිල්ක් ස්ක්‍රීන් මුද්‍රණය වෙනුවට DTF තෝරා ගන්නේ ඇයි?',
        content: 'DTF මුද්‍රණය මඟින් ඔබේ ඇණවුම් සඳහා උපරිම නම්‍යශීලී බවක් සහ ලාභදායී බවක් හිමි වේ.',
        bullets: [
          'ඔබගේ ක්‍රියාවලිය වෙනස් නොකර කපු (cotton), පොලියෙස්ටර් (polyester) සහ මිශ්‍ර රෙදිපිළි මත ඉතා පහසුවෙන් භාවිත කළ හැකිය.',
          'වර්ණ කිහිපයක් හෝ ඡායාරූප වැනි මෝස්තර සඳහා අමතර පිරිවැයක් එකතු නොවේ.',
          'තනි ටී-ෂර්ට් එකක් සඳහා හෝ කුඩා මෝස්තර රැසක් සහිත සම්පූර්ණ ගෑං ෂීට් (gang sheet) එකක් සඳහා වුවද ඉතා ලාභදායී වේ.',
          'ඇඳුම් මත මුද්‍රණය කරන තෙක් මෙම ට්‍රාන්ස්ෆර් ෂීට්ස් පැතලිව පහසුවෙන් ගබඩා කර තැබිය හැක.',
        ],
      },
      {
        title: 'ඔබේම ෂීට් එකක් සාදා ගන්න',
        content: 'අපගේ DTF Sheet Builder භාවිත කර ඔබේ මෝස්තර අවශ්‍ය පරිදි සකසන්න, නිශ්චිත පරතරයන් බලාගන්න සහ මුදල් ගෙවීමට පෙර නිමි ප්‍රමාණය පරීක්ෂා කරන්න - ඔබට බිල්ඩර් එකෙහි පෙනෙන ආකාරයටම එය මුද්‍රණය වේ.',
      },
      {
        title: 'නිම කිරීමට ගතවන කාලය',
        content: 'සාමාන්‍ය ෂීට්ස් ඔබ අනුමත කර පැය 24-48ක් ඇතුළත නැව්ගත කරනු ලැබේ (ship කරනු ලැබේ).',
      },
    ],
  },
  seo: {
    title: 'DTF මුද්‍රණ එකතුව | Bitium Technology',
    description: 'උසස් තත්ත්වයේ custom DTF gang sheets, ස්ටිකර් සහ මුද්‍රණ.',
    canonicalUrl: 'https://www.bitiumtechnology.com/dtf-printing',
  },
};

function DtfPrintingContent() {
  const { language } = useLanguage();
  const config = language === 'si' ? DTF_PRINTING_CONFIG_SI : DTF_PRINTING_CONFIG_EN;
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
      config={config}
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
