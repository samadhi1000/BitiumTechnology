'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProducts, Product } from '@/lib/products';
import CategoryPageTemplate, { CategoryPageConfig } from '@/components/category/CategoryPageTemplate';
import { Scissors, Sparkles, RefreshCw, Shirt, Frame, Paintbrush, Palette, Layers, Box } from 'lucide-react';

import { useLanguage } from '@/lib/context/LanguageContext';

const STENCIL_CONFIG_EN: CategoryPageConfig = {
  slug: 'stencil',
  categoryKey: 'stencil',
  breadcrumbName: 'Stencils',
  titlePrimary: 'Stencil',
  titleHighlight: 'Collection',
  badgeText: 'Precision Mylar & Metal Stencils',
  description: 'Precision-cut Mylar stencils for saree work, hand painting, and wall art. Every stencil is laser-cut from your design, so the lines stay sharp no matter how detailed the pattern is.',
  heroImage: '/images/hero-cards/stencil.webp',
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
        content: 'Hand-cut stencils shift a little every time - a curve here, a corner there. A laser follows your file exactly, so if you\'re repeating a pattern across ten sarees or a whole wall mural, every cut matches the last one.',
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
        content: 'You can send us a photo of a sketch, a vector file, or just describe what you want - we\'ll clean it up and turn it into a cuttable design before anything goes near the laser. If a detail is too fine to hold its shape once cut, we\'ll flag it and suggest a fix rather than print it as-is.',
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

const STENCIL_CONFIG_SI: CategoryPageConfig = {
  slug: 'stencil',
  categoryKey: 'stencil',
  breadcrumbName: 'ස්ටෙන්සිල්',
  titlePrimary: 'ස්ටෙන්සිල් සේවා',
  titleHighlight: '(Stencils)',
  badgeText: 'නිරවද්‍ය මයිලර් සහ ලෝහ ස්ටෙන්සිල්',
  description: 'සාරි නිර්මාණකරණය, අත් තීන්ත ආලේපනය (hand painting) සහ බිත්ති කලාව (wall art) සඳහා වන ඉතා නිවැරදිව කපන ලද මයිලර් ස්ටෙන්සිල් (Mylar stencils). සෑම ස්ටෙන්සිල් එකක්ම ඔබගේ සැලසුමට අනුව ලේසර් මඟින් කපා ඇති බැවින්, මෝස්තරය කොතරම් සවිස්තරාත්මක වුවත් එහි ඉරි සහ රේඛා ඉතා පැහැදිලිව සහ තියුණුව පවතී.',
  heroImage: '/images/hero-cards/stencil.webp',
  searchPlaceholder: 'ස්ටෙන්සිල් සොයන්න...',
  itemSingular: 'ස්ටෙන්සිල්',
  itemPlural: 'ස්ටෙන්සිල්',
  subCategories: [
    { id: 'hand-painting', label: 'හෑන්ඩ්' },
    { id: 'saree', label: 'සාරි බෝඩර්' },
    { id: 'tote-bags', label: 'ටෝට් බෑග්' },
    { id: 'batik', label: 'බතික් රටා' },
    { id: 'wall-decoration', label: 'බිත්ති අලංකරණ' },
    { id: 'titanium', label: 'ටයිටේනියම්' },
  ],
  whyChooseUs: {
    title: 'අපගේ ලේසර් කැපූ ස්ටෙන්සිල් තෝරාගත යුත්තේ ඇයි?',
    features: [
      {
        icon: <Scissors size={16} />,
        title: 'නිරවද්‍ය කැපීම',
        desc: 'සෑම විටම පරිපූර්ණ ප්‍රතිඵල සඳහා පිරිසිදු දාර.',
      },
      {
        icon: <RefreshCw size={16} />,
        title: 'නැවත භාවිත කළ හැකි',
        desc: 'දිගු කල් පවතින ඉහළ ගුණාත්මක ද්‍රව්‍ය.',
      },
      {
        icon: <Sparkles size={16} />,
        title: 'භාවිතය පහසු වීම',
        desc: 'භාවිතා කිරීමට සහ පිරිසිදු කිරීමට ඉතා පහසුයි.',
      },
    ],
  },
  perfectFor: {
    title: 'පරිපූර්ණ වන්නේ',
    items: [
      { icon: <Shirt size={14} />, label: 'රෙදිපිළි මුද්‍රණය' },
      { icon: <Frame size={14} />, label: 'බිත්ති සැරසිලි' },
      { icon: <Box size={14} />, label: 'ගෘහ භාණ්ඩ හා අලංකරණය' },
      { icon: <Paintbrush size={14} />, label: 'පින්තාරු කිරීම' },
      { icon: <Scissors size={14} />, label: 'අත්කම් නිර්මාණ' },
      { icon: <Layers size={14} />, label: 'ස්වයං නිර්මාණ' },
    ],
  },
  customCta: {
    title: 'ඔබට අවශ්‍ය පරිදි සකසාගත් ස්ටෙන්සිල් එකක් අවශ්‍යද?',
    desc: 'අවම ඇණවුම් සීමාවකින් තොරව ඔබට අවශ්‍ය ඕනෑම මෝස්තරයක් ලේසර් තාක්‍ෂණයෙන් නිර්මාණය කර දිය හැක.',
    buttonText: 'අප හා සම්බන්ධ වන්න',
    buttonHref: '/contact',
  },
  afterListings: {
    sections: [
      {
        title: 'ලේසර් මඟින් කපන ලද ස්ටෙන්සිල් භාවිත කරන්නේ ඇයි?',
        content: 'අතින් කපන ලද ස්ටෙන්සිල් භාවිත කරන සෑම අවස්ථාවකදීම සුළු වශයෙන් වෙනස් විය හැක - මෙතැනින් වක්‍රයක්, එතැනින් කොනක් ආදී වශයෙන්. නමුත් ලේසර් කටර් එකක් ඔබ ලබාදෙන පරිගණක ගොනුව (file) ඒ අයුරින්ම අනුගමනය කරයි. එබැවින් ඔබ සාරි දහයක් පුරා හෝ සම්පූර්ණ බිත්ති සිතුවමක් පුරා එකම රටාවක් නැවත නැවතත් සිදු කළද, සෑම කැපීමක්ම එකිනෙකට පරිපූර්ණ ලෙස ගැලපේ.',
      },
      {
        title: 'මේවා ඔබට කුමන දේ සඳහා භාවිත කළ හැකිද?',
        content: 'අපගේ මයිලර් ස්ටෙන්සිල් විවිධ නිර්මාණාත්මක සහ වාණිජමය කටයුතු සඳහා භාවිත කළ හැක.',
        bullets: [
          'සාරි සහ රෙදිපිළි බ්ලොක් මුද්‍රණය (fabric block printing)',
          'බිත්ති කලාව සහ බිත්ති සිතුවම් අච්චු (mural templates)',
          'හැනා (maruthani) සහ අත් තීන්ත ආලේපන මාර්ගෝපදේශ (hand-painting guides)',
          'නැවත නැවත සිදුවන රටා සහිත රෙදිපිළි නිර්මාණ (repeat-pattern textile work)',
        ],
      },
      {
        title: 'ඔබේ සැලසුම සූදානම් කරගන්නා ආකාරය',
        content: 'ඔබට ඇඳි චිත්‍රයක ඡායාරූපයක්, වෙක්ටර් ගොනුවක් (vector file) අප වෙත එවිය හැක, නැතහොත් ඔබට අවශ්‍ය දේ විස්තර කළ හැක - ලේසර් කැපීමට ප්‍රථම අපි එය පිරිසිදු කර කැපීමට සුදුසු මෝස්තරයක් බවට පත් කරන්නෙමු. කැපීමෙන් පසු හැඩය රඳවා ගැනීමට නොහැකි තරම් සියුම් විස්තරයක් ඇත්නම්, අපි එය එලෙසම මුද්‍රණය නොකර, එය පෙන්වා දී නිවැරදි කිරීමක් යෝජනා කරන්නෙමු.',
      },
      {
        title: 'නිම කිරීමට ගතවන කාලය',
        content: 'ස්ටෙන්සිල් එකෙහි ප්‍රමාණය සහ ඔබට කැපීමට අවශ්‍ය ප්‍රමාණය අනුව බොහෝ ඇණවුම් දින කිහිපයක් ඇතුළත සූදානම් කළ හැක.',
      },
    ],
  },
  seo: {
    title: 'ස්ටෙන්සිල් එකතුව | Bitium Technology',
    description: 'සාරි නිර්මාණකරණය, අත් තීන්ත ආලේපනය සහ බිත්ති කලාව සඳහා වන මයිලර් ස්ටෙන්සිල්.',
    canonicalUrl: 'https://www.bitiumtechnology.com/stencil',
  },
};

function StencilContent() {
  const { language } = useLanguage();
  const config = language === 'si' ? STENCIL_CONFIG_SI : STENCIL_CONFIG_EN;
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
      config={config}
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
