'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Printer, Sparkles, CheckCircle2, Shirt, Frame, Layers, FileText, Palette, Package } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

const SCREEN_PRINTING_CONFIG_EN: CategoryPageConfig = {
  slug: 'screen-printing',
  categoryKey: 'screen-printing',
  breadcrumbName: 'Screen Printing',
  titlePrimary: 'Screen Printing',
  titleHighlight: 'Collection',
  badgeText: 'Trade Screen Printing Supplies',
  description: 'Custom exposed screens, vectorized artwork, and positive tracing films — made to your exact design, ready to print with.',
  heroImage: '/images/hero-cards/screenprint.webp',
  searchPlaceholder: 'Search screens, films & supplies...',
  itemSingular: 'Screen / Supply',
  itemPlural: 'Products',
  subCategories: [
    { id: 'screen-exposed', label: 'Exposed Screens' },
    { id: 'artwork', label: 'Vector Artwork' },
    { id: 'tracing-printouts', label: 'Tracing Printouts' },
    { id: 'positive-printouts', label: 'Positive Film' },
    { id: 'cmyk-halftone', label: 'CMYK Halftone' },
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
  afterListings: {
    sections: [
      {
        title: 'What\'s included in a screen order',
        content: 'We take your artwork, trace or vectorize it if it isn\'t already print-ready, and expose it onto a screen at the mesh count that suits your fabric and detail level. You get a screen that\'s ready to load ink and go.',
      },
      {
        title: 'Good to know before you order',
        content: 'A few things that help us get your screen right the first time.',
        bullets: [
          'Fine detail and small text need a finer mesh — we\'ll tell you if your design needs adjusting to print cleanly.',
          'Multi-color designs need a separate screen per color; we can help you figure out the breakdown if you\'re not sure.',
          'Screens are reusable — with basic care, one screen can print hundreds of shirts.',
        ],
      },
      {
        title: 'Who this is for',
        content: 'Shops running their own print floor, students learning the process, and anyone who wants full control over ink, pressure, and fabric instead of relying on digital transfers.',
      },
    ],
  },
  seo: {
    title: 'Screen Printing Collection | Bitium Technology',
    description: 'Ready-to-print custom exposed mesh screens, vector artwork graphics, tracing sheets, and high-density positive film outputs.',
    canonicalUrl: 'https://www.bitiumtechnology.com/screen-printing',
  },
};

const SCREEN_PRINTING_CONFIG_SI: CategoryPageConfig = {
  slug: 'screen-printing',
  categoryKey: 'screen-printing',
  breadcrumbName: 'සිල්ක් ස්ක්‍රීන් මුද්‍රණය',
  titlePrimary: 'සිල්ක් ස්ක්‍රීන්',
  titleHighlight: 'මුද්‍රණය (Screen Printing)',
  badgeText: 'වෘත්තීය මට්ටමේ ස්ක්‍රීන් මුද්‍රණ උපාංග',
  description: 'ඔබේ නිශ්චිත සැලසුමට අනුව සකසන ලද එක්ස්පෝස් කරන ලද ස්ක්‍රීන් (exposed screens), වෙක්ටර් කරන ලද නිර්මාණ (vectorized artwork) සහ පොසිටිව් ට්‍රේසිං ෆිල්ම්ස් (positive tracing films) - මුද්‍රණය සඳහා සූදානම්ය.',
  heroImage: '/images/hero-cards/screenprint.webp',
  searchPlaceholder: 'ස්ක්‍රීන්, ෆිල්ම් සහ උපාංග සොයන්න...',
  itemSingular: 'ස්ක්‍රීන් / උපාංගය',
  itemPlural: 'නිෂ්පාදන',
  subCategories: [
    { id: 'screen-exposed', label: 'එක්ස්පෝස් කළ ස්ක්‍රීන්' },
    { id: 'artwork', label: 'වෙක්ටර් කරන ලද නිර්මාණ' },
    { id: 'tracing-printouts', label: 'ට්‍රේසිං ප්‍රින්ට්-අවුට්' },
    { id: 'positive-printouts', label: 'පොසිටිව් ප්‍රින්ට්-අවුට්' },
    { id: 'cmyk-halftone', label: 'CMYK හාෆ්ටෝන්' },
  ],
  whyChooseUs: {
    title: 'අපගේ ස්ක්‍රීන් මුද්‍රණ උපාංග තෝරාගත යුත්තේ ඇයි?',
    features: [
      {
        icon: <Printer size={16} />,
        title: 'ඉහළ මෙෂ් ආතතිය (Mesh Tension)',
        desc: 'පැහැදිලි රෙජිස්ට්‍රේෂන් සඳහා නිරවද්‍ය ලෙස ඇද සකසන ලද රාමු.',
      },
      {
        icon: <Sparkles size={16} />,
        title: 'මුද්‍රණයට සූදානම් එක්ස්පෝෂර්',
        desc: 'උසස් තත්ත්වයේ එමල්ෂන් සහ UV කිරණ භාවිතයෙන් එක්ස්පෝස් කර ඇත.',
      },
      {
        icon: <CheckCircle2 size={16} />,
        title: 'වෘත්තීය මට්ටමේ ගුණාත්මකභාවය',
        desc: 'දිගු කාලීන භාවිතය සඳහා ඇලුමිනියම් සහ ලී රාමු.',
      },
    ],
  },
  perfectFor: {
    title: 'පරිපූර්ණ වන්නේ',
    items: [
      { icon: <Shirt size={14} />, label: 'ටී-ෂර්ට් මුද්‍රණය' },
      { icon: <Frame size={14} />, label: 'කලා පෝස්ටර්' },
      { icon: <Package size={14} />, label: 'පෙට්ටි සහ ඇසුරුම්කරණය' },
      { icon: <Palette size={14} />, label: 'රෙදිපිළි මුද්‍රණය' },
      { icon: <FileText size={14} />, label: 'සාරි නිර්මාණකරණය' },
      { icon: <Layers size={14} />, label: 'තොග ඇණවුම්' },
    ],
  },
  customCta: {
    title: 'ඔබට අවශ්‍ය පරිදි සකසාගත් ස්ක්‍රීන් එකක් අවශ්‍යද?',
    desc: 'ඔබේ වෙක්ටර් සැලසුම අප වෙත එවා, මුද්‍රණයට සූදානම් ස්ක්‍රීන් එකක් ඔබේ නිවසටම ගෙන්වා ගන්න.',
    buttonText: 'ස්ක්‍රීන් ඇණවුම් කරන්න',
    buttonHref: '/order-form',
  },
  afterListings: {
    sections: [
      {
        title: 'ස්ක්‍රීන් ඇණවුමකට ඇතුළත් වන්නේ මොනවාද?',
        content: 'අපි ඔබේ කලාකෘතිය ලබාගෙන, එය මුද්‍රණයට සූදානම් නැතිනම් එය ට්‍රේස් හෝ වෙක්ටර් කර, ඔබේ රෙදි සහ විස්තර මට්ටමට ගැලපෙන මෙෂ් ප්‍රමාණයකින් (mesh count) යුතු ස්ක්‍රීන් එකක් මත එක්ස්පෝස් (expose) කර දෙන්නෙමු. ඔබට ලැබෙන්නේ තීන්ත දමා කෙළින්ම මුද්‍රණය කළ හැකි මට්ටමේ ස්ක්‍රීන් එකකි.',
      },
      {
        title: 'ඇණවුම් කිරීමට පෙර දැනගත යුතු වැදගත් කරුණු',
        content: 'පැහැදිලි මුද්‍රණයක් ලබා ගැනීම සඳහා පහත කරුණු දැන ගැනීම වැදගත් වේ.',
        bullets: [
          'සියුම් විස්තර සහ කුඩා අකුරු සඳහා සිහින් මෙෂ් එකක් (finer mesh) අවශ්‍ය වේ - පැහැදිලිව මුද්‍රණය කිරීම සඳහා ඔබේ මෝස්තරය වෙනස් කළ යුතු නම් අපි ඔබට ඒ පිළිබඳව පවසන්නෙමු.',
          'වර්ණ කිහිපයක මෝස්තර සඳහා එක් එක් වර්ණයට වෙන වෙනම ස්ක්‍රීන් එක බැගින් අවශ්‍ය වේ; ඔබට මේ පිළිබඳව නිශ්චිත අවබෝධයක් නැත්නම් වර්ණ වෙන් කරගැනීමට අපි ඔබට උදවු කරන්නෙමු.',
          'ස්ක්‍රීන් නැවත භාවිත කළ හැක - මූලික නඩත්තුව සමඟින්, එක ස්ක්‍රීන් එකකින් ටී-ෂර්ට් සිය ගණනක් මුද්‍රණය කළ හැකිය.',
        ],
      },
      {
        title: 'මෙය කා සඳහාද?',
        content: 'තමන්ගේම මුද්‍රණ අංශයක් පවත්වාගෙන යන ව්‍යාපාරිකයින්, මෙම ක්‍රියාවලිය ඉගෙන ගන්නා සිසුන් සහ ඩිජිටල් මුද්‍රණ ක්‍රමවලට සීමා නොවී තීන්ත, පීඩනය සහ රෙදිපිළි මත සම්පූර්ණ පාලනයක් ලබා ගැනීමට කැමති ඕනෑම අයෙකු සඳහා මෙය සුදුසු වේ.',
      },
    ],
  },
  seo: {
    title: 'ස්ක්‍රීන් මුද්‍රණ එකතුව | Bitium Technology',
    description: 'සිල්ක් ස්ක්‍රීන් මුද්‍රණ උපාංග, එක්ස්පෝස් කරන ලද ස්ක්‍රීන් සහ පොසිටිව් ෆිල්ම්ස්.',
    canonicalUrl: 'https://www.bitiumtechnology.com/screen-printing',
  },
};

function ScreenPrintingContent() {
  const { language } = useLanguage();
  const config = language === 'si' ? SCREEN_PRINTING_CONFIG_SI : SCREEN_PRINTING_CONFIG_EN;
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
      config={config}
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
