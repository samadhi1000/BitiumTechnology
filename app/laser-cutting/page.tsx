'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Scissors, Sparkles, CheckCircle2, Box, Frame, Layers, Zap, Flame, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

const LASER_CUTTING_CONFIG_EN: CategoryPageConfig = {
  slug: 'laser-cutting',
  categoryKey: 'laser-cutting',
  breadcrumbName: 'Laser Cutting',
  titlePrimary: 'Laser Cutting',
  titleHighlight: 'Collection',
  badgeText: 'Precision Laser Cut & Engraving',
  description: 'Precision CO2 laser cutting for acrylic, wood, and custom profiles — cut and engraved straight from your file, no tooling required.',
  heroImage: '/images/hero-cards/laser.webp',
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

const LASER_CUTTING_CONFIG_SI: CategoryPageConfig = {
  slug: 'laser-cutting',
  categoryKey: 'laser-cutting',
  breadcrumbName: 'ලේසර් කැපුම්',
  titlePrimary: 'ලේසර්',
  titleHighlight: 'කැපුම් (Laser Cutting)',
  badgeText: 'නිරවද්‍ය ලේසර් කැපුම් සහ කැටයම්',
  description: 'ඇක්‍රිලික් (acrylic), ලී (wood) සහ වෙනත් ඕනෑම හැඩතල සඳහා වන ඉතා නිවැරදි CO2 ලේසර් කැපුම් සහ කැටයම් සේවා - කිසිදු අමතර අච්චුවක් අවශ්‍ය නොවන අතර, ඔබේ පරිගණක ගොනුවෙන් කෙළින්ම කපා කැටයම් කරනු ලැබේ.',
  heroImage: '/images/hero-cards/laser.webp',
  searchPlaceholder: 'ලේසර් නිෂ්පාදන සහ අමුද්‍රව්‍ය සොයන්න...',
  itemSingular: 'ලේසර් නිෂ්පාදනය',
  itemPlural: 'නිෂ්පාදන',
  subCategories: [
    { id: 'acrylic', label: 'ඇක්‍රිලික් කැපුම් සහ කැටයම්' },
    { id: 'wood', label: 'ලී කැටයම්' },
    { id: 'custom-profile', label: 'විශේෂ ඇණවුම් කැපුම්' },
  ],
  whyChooseUs: {
    title: 'අපගේ නිරවද්‍ය ලේසර් කැපුම් සේවා තෝරාගත යුත්තේ ඇයි?',
    features: [
      {
        icon: <Scissors size={16} />,
        title: '±0.05mm ක්ෂුද්‍ර නිරවද්‍යතාව',
        desc: 'සියුම් සහ සංකීර්ණ මෝස්තර සඳහා ඉතා සීමිත ඉවසීමකින් යුත් CNC ලේසර් කිරණ.',
      },
      {
        icon: <Sparkles size={16} />,
        title: 'සුමට දාර',
        desc: 'පිළිස්සුම් හෝ රළු ලකුණු රහිත, පැහැදිලි සහ සුමට දාර නිමාව.',
      },
      {
        icon: <Zap size={16} />,
        title: 'ඉක්මන් මූලාකෘතිකරණය (Prototyping)',
        desc: 'තනි ආදර්ශකවල සිට මහා පරිමාණ නිෂ්පාදන දක්වා වේගවත් නිමාවක්.',
      },
    ],
  },
  perfectFor: {
    title: 'පරිපූර්ණ වන්නේ',
    items: [
      { icon: <Box size={14} />, label: 'LED නාමපුවරු සහ සංදර්ශක' },
      { icon: <Frame size={14} />, label: 'ලී බිත්ති සැරසිලි' },
      { icon: <Layers size={14} />, label: 'යතුරු රඳවන' },
      { icon: <Shield size={14} />, label: 'සමරු පලක සහ සම්මාන' },
      { icon: <Flame size={14} />, label: 'ගෑස්කට් සහ සීල් වර්ග' },
      { icon: <Scissors size={14} />, label: 'ස්ටෙන්සිල් ෂීට්ස්' },
    ],
  },
  customCta: {
    title: 'ඔබ සතුව custom DXF / Vector ගොනුවක් තිබේද?',
    desc: 'ක්ෂණික මිල ගණන් සහ උපදෙස් ලබා ගැනීම සඳහා ඔබේ වෙක්ටර් ගොනුව අප වෙත එවන්න.',
    buttonText: 'මිල ගණන් විමසන්න',
    buttonHref: '/contact',
  },
  afterListings: {
    sections: [
      {
        title: 'මෙය අපගේ ස්ටෙන්සිල් කැපීමෙන් වෙනස් වන්නේ කෙසේද?',
        content: 'අපගේ ස්ටෙන්සිල් පිටුව වෙන්වී ඇත්තේ පින්තාරු කිරීම් සහ රෙදිපිළි වැඩ සඳහා ලේසර් මඟින් කපන ලද මයිලර් (Mylar) ප්ලාස්ටික් කොළ සඳහාය. නමුත් මෙම පිටුව වෙන්වී ඇත්තේ අදාළ ද්‍රව්‍යයම කැපීම සහ කැටයම් කිරීම සඳහාය - උදාහරණ ලෙස ඇක්‍රිලික් නාමපුවරු (signage), ලී නාමපුවරු, යතුරු රඳවන (keychains), පැනල (panels) සහ සාමාන්‍යයෙන් කැපීමට අච්චු අවශ්‍ය වන විශේෂිත හැඩතල මේ යටතේ සිදු කරගත හැක.',
      },
      {
        title: 'ඔබට ඇණවුම් කළ හැක්කේ මොනවාද?',
        content: 'විවිධ ද්‍රව්‍ය රැසක් මත ඔබට අවශ්‍ය පරිදි කැපීම් සිදු කරගත හැක.',
        bullets: [
          'විශේෂිත හැඩතල සහිත ඇක්‍රිලික් නිර්මාණ (නාමපුවරු, ස්ටෑන්ඩ්, සම්මාන, සැරසිලි ද්‍රව්‍ය)',
          'ලී කැටයම් — නාමපුවරු, කෝස්ටර් (coasters), තෑගි භාණ්ඩ',
          'ඔබේම ලාංඡනයක් (logo) හෝ දළ සටහනකට අනුව හැඩයට කපාගත් කොටස්',
          'කැපීමෙන් පසු එකට එකතු කර සකස් කළ හැකි ස්ථර කිහිපයකින් යුතු (layered) නිර්මාණ',
        ],
      },
      {
        title: 'ඔබේ ගොනුව (file) සූදානම් කරගන්නා ආකාරය',
        content: 'ලේසර් කටර් එක අදාළ මායිම් නිවැරදිව අනුගමනය කරන බැවින්, වෙක්ටර් ගොනුවක් (SVG හෝ AI) මඟින් වඩාත් පැහැදිලි නිමාවක් ලබාගත හැක. ඔබට ඇත්තේ ඡායාරූපයක් හෝ දළ සටහනක් පමණක් වුවද එය අප වෙත එවන්න — කැපීමට පෙර අපි එය පරිගණක මෝස්තරයක් බවට පත් කර මායිම් ඔබ සමඟ තහවුරු කරන්නෙමු.',
      },
      {
        title: 'ද්‍රව්‍යයේ ඝනකම (thickness) වැදගත් වේ',
        content: 'ඔබ භාවිත කරන ද්‍රව්‍යයේ ඝනකම අප වෙත දන්වන්න (නැතහොත් සුදුසු ඝනකමක් අපෙන් විමසන්න) — ද්‍රව්‍යයේ ඝනකම අනුව ලේසර් කැපීමේ වේගය, සියුම් මෝස්තරවල හැඩය රඳවා ගැනීමේ शक्यता සහ ඔබේ සැලසුමට වඩාත් සුදුසු වන්නේ කැටයම් කිරීම (engraving) ද නැතහොත් සම්පූර්ණ ලෙස කපා වෙන් කිරීම ද යන්න තීරණය වේ.',
      },
      {
        title: 'මෙය කා සඳහාද?',
        content: 'නාමපුවරු හෝ සන්නාමකරණ කොටස් අවශ්‍ය කුඩා ව්‍යාපාරිකයින්, තෑගි භාණ්ඩ සාදන්නන්, විශාල ඇණවුමකට යාමට පෙර ආකෘතියක් (prototype) පරීක්ෂා කිරීමට අවශ්‍ය විනෝදාංශකරුවන් සහ පොදු හැඩතල වෙනුවට නිශ්චිතවම තමන්ට අවශ්‍ය හැඩයට කැපීමක් සිදු කරගැනීමට අවශ්‍ය ඕනෑම අයෙකු සඳහා මෙය සුදුසු වේ.',
      },
    ],
  },
  seo: {
    title: 'ලේසර් කැපුම් සේවා | Bitium Technology',
    description: 'නිරවද්‍ය ලේසර් කැපුම්, කැටයම් සහ ඇක්‍රිලික්, ලී නිර්මාණ සේවා.',
    canonicalUrl: 'https://www.bitiumtechnology.com/laser-cutting',
  },
};

function LaserCuttingContent() {
  const { language } = useLanguage();
  const config = language === 'si' ? LASER_CUTTING_CONFIG_SI : LASER_CUTTING_CONFIG_EN;
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
      config={config}
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
