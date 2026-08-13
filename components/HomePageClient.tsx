'use client';

import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import PromoBanner from '@/components/PromoBanner';
import { ArrowRight, Sparkles, Palette, Printer, Layers, Stamp, Flame, CheckCircle2, Scissors, FlaskConical, PlayCircle, MessageSquareHeart, Upload, Grid, Cuboid, Package, Shield, Zap, Phone, ThumbsUp, Activity, Shirt, Feather, Clock, Droplet, PenTool, Crown, Target, Star } from 'lucide-react';
import { HeroSearch } from '@/components/HeroSearch';
import { HeroShowcaseCarousel } from '@/components/HeroShowcaseCarousel';
import { useLanguage } from '@/lib/context/LanguageContext';

// Icons for How It Works & Why Choose Us
const UploadIcon = () => <Upload size={28} className="text-primary" strokeWidth={1.8} />;
const GridIcon = () => <Grid size={28} className="text-primary" strokeWidth={1.8} />;
const CubeIcon = () => <Cuboid size={28} className="text-primary" strokeWidth={1.8} />;
const PackageIcon = () => <Package size={28} className="text-primary" strokeWidth={1.8} />;

const ShieldIcon = () => <Shield size={22} className="text-primary" strokeWidth={1.8} />;
const ZapIcon = () => <Zap size={22} className="text-primary" strokeWidth={1.8} />;
const DropletIcon = () => <Droplet size={22} className="text-primary" strokeWidth={1.8} />;
const LayersIcon = () => <Layers size={22} className="text-primary" strokeWidth={1.8} />;
const HeadphonesIcon = () => <Phone size={22} className="text-primary" strokeWidth={1.8} />;
const ThumbsUpIcon = () => <ThumbsUp size={22} className="text-primary" strokeWidth={1.8} />;
const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg width="14" height="14" fill={filled ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5" viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const ChevronUp = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

function HomeContent() {
  const container = React.useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const traditionalDesigns = [
    { id: 1, bg: '#ff6b35', cardImage: '/images/products/design_1_card.png', motifImage: '/images/products/design_1_motif.png', title: 'Sri Lankan Peacock Motif' },
    { id: 2, bg: '#7c3aed', cardImage: '/images/products/design_2_card.png', motifImage: '/images/products/design_2_motif.png', title: 'Traditional Sun Motif' },
    { id: 3, bg: '#059669', cardImage: '/images/products/design_3_card.png', motifImage: '/images/products/design_3_motif.png', title: 'Sri Lankan Traditional Dancers' },
    { id: 4, bg: '#dc2626', cardImage: '/images/products/design_4_card.png', motifImage: '/images/products/design_4_motif.png', title: 'Traditional Bird Line Art' },
    { id: 5, bg: '#d97706', cardImage: '/images/products/design_5_card.png', motifImage: '/images/products/design_5_motif.png', title: 'Majestic Lion Motif' },
    { id: 6, bg: '#0284c7', cardImage: '/images/products/design_6_card.png', motifImage: '/images/products/design_6_motif.png', title: 'Batik Symmetrical Border Pattern' }
  ];
  const [selectedDesign, setSelectedDesign] = useState<typeof traditionalDesigns[0] | null>(traditionalDesigns[0]);

  // Hero Entrance Animations
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' })
      .from('.hero-title', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-text', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }, { scope: container });

  const categories = [
    {
      title: 'Stencils',
      description: 'Laser-cut Mylar stencils for saree work, hand painting, and wall art — cut clean, every time.',
      href: '/stencil',
      image: '/images/catalog/stencils.jpg',
      icon: Palette,
      badge: '6 Categories'
    },
    {
      title: 'Screen Printing',
      description: 'Exposed screens, vectorized artwork, and positive tracing films, made to your exact specs.',
      href: '/screen-printing',
      image: '/images/catalog/screen-printing.jpg',
      icon: Printer,
      badge: 'Professional Grade'
    },
    {
      title: 'DTF Printing',
      description: 'Custom sheet layouts, anime sticker packs, and cloth transfers — our most popular category.',
      href: '/dtf-printing',
      image: '/images/catalog/dtf-printing.jpg',
      icon: Layers,
      badge: 'Hot Seller'
    },
    {
      title: 'Batik Stamps',
      description: 'Traditional copper and hand-carved wood Cap Batik stamps, made the way they\'ve always been made.',
      href: '/batik-stamp',
      image: '/images/catalog/batik-stamp.jpg',
      icon: Stamp,
      badge: 'Traditional Art'
    },
    {
      title: 'Laser Cutting',
      description: 'Precision CO2 laser cutting for acrylic, wood, and custom profiles — built to your file, not a template.',
      href: '/laser-cutting',
      image: '/images/catalog/laser-cutting.jpg',
      icon: Scissors,
      badge: 'CNC Precision'
    },
    {
      title: 'Consumables',
      description: 'Inks, hot melt powder, film rolls, emulsions, and wash chemicals — the supplies that keep your shop running.',
      href: '/materials',
      image: '/images/catalog/consumables.jpg',
      icon: FlaskConical,
      badge: 'Industrial Grade'
    },
    {
      title: 'Video Tutorials',
      description: 'Learn how to master Screen & DTF printing with our step-by-step video guides.',
      href: '/blog',
      image: '/images/catalog/video-tutorials.jpg',
      icon: PlayCircle,
      badge: 'Learn & Master'
    },
    {
      title: 'Customer Feedbacks',
      description: 'See what our existing customers have to say about Bitium Technology Products.',
      href: '/about',
      image: '/images/catalog/customer-feedbacks.jpg',
      icon: MessageSquareHeart,
      badge: 'Real Stories'
    }
  ];

  const steps = [
    { num: 1, icon: <UploadIcon />, title: 'Upload Your Design', desc: 'Upload artwork in PNG, JPG, or PDF format. We support all major file types.' },
    { num: 2, icon: <GridIcon />, title: 'Arrange Your Sheet', desc: 'Resize and organize your designs on the gang sheet for maximum efficiency.' },
    { num: 3, icon: <CubeIcon />, title: 'Preview in 3D', desc: 'See your design on realistic apparel before you commit to printing.' },
    { num: 4, icon: <PackageIcon />, title: 'We Print & Ship', desc: 'Premium quality printing delivered to your door within 24–48 hours.' },
  ];
  
  const benefits = [
    { icon: <ShieldIcon />, title: 'Premium Quality', desc: 'Top-grade materials and advanced printing technology for lasting results.' },
    { icon: <DropletIcon />, title: 'Vibrant Colors', desc: 'High-opacity, ultra-vibrant inks that stand out on any fabric color.' },
    { icon: <LayersIcon />, title: 'No Minimum Order', desc: 'Order one sheet or thousands — no minimums, ever.' },
    { icon: <HeadphonesIcon />, title: 'Expert Support', desc: 'Our team is here to help at every step of your order.' },
    { icon: <ThumbsUpIcon />, title: 'Satisfaction Guarantee', desc: "If you're not happy, we make it right. No questions asked." },
  ];
  
  const galleryItems = [
    // DTF Printing
    { src: 'https://images.unsplash.com/photo-1601754664414-aa3e4f42e6d4?w=500&h=400&fit=crop&auto=format', alt: 'Custom black and white shirt', cat: 'DTF Printing' },
    { src: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&h=400&fit=crop&auto=format', alt: 'Custom gray hoodie', cat: 'DTF Printing' },
    { src: 'https://images.unsplash.com/photo-1680292783974-a9a336c10366?w=500&h=400&fit=crop&auto=format', alt: 'Black hoodie custom', cat: 'DTF Printing' },
    { src: 'https://images.unsplash.com/photo-1615397587950-3cbb55f95b77?w=500&h=400&fit=crop&auto=format', alt: 'White hoodie apparel mockup', cat: 'DTF Printing' },

    // Screen Printing
    { src: 'https://images.unsplash.com/photo-1663433567177-9f94be0bff4c?w=500&h=400&fit=crop&auto=format', alt: 'Screen printing process', cat: 'Screen Printing' },
    { src: 'https://images.unsplash.com/photo-1663433541063-ddab084d1126?w=500&h=400&fit=crop&auto=format', alt: 'Industrial screen printing', cat: 'Screen Printing' },
    { src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=400&fit=crop&auto=format', alt: 'T-Shirt screen printing', cat: 'Screen Printing' },
    { src: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&h=400&fit=crop&auto=format', alt: 'Mesh screen exposure', cat: 'Screen Printing' },

    // Laser Cutting
    { src: 'https://images.unsplash.com/photo-1738162837451-2041c1418f54?w=500&h=400&fit=crop&auto=format', alt: 'Laser cutting machine', cat: 'Laser Cutting' },
    { src: 'https://images.unsplash.com/photo-1738162837438-92ff852619a1?w=500&h=400&fit=crop&auto=format', alt: 'Precision laser cut metal', cat: 'Laser Cutting' },
    { src: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&h=400&fit=crop&auto=format', alt: 'CNC acrylic cut', cat: 'Laser Cutting' },
    { src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&h=400&fit=crop&auto=format', alt: 'Laser cut wooden craft', cat: 'Laser Cutting' },

    // Stencils
    { src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=400&fit=crop&auto=format', alt: 'Saree fabric stencil painting', cat: 'Stencils' },
    { src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&h=400&fit=crop&auto=format', alt: 'Laser-cut Mylar wall stencil', cat: 'Stencils' },
    { src: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&h=400&fit=crop&auto=format', alt: 'Hand painting with stencils', cat: 'Stencils' },
    { src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=400&fit=crop&auto=format', alt: 'Tote bag stencil printing', cat: 'Stencils' },

    // Batik Stamp
    { src: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=500&h=400&fit=crop&auto=format', alt: 'Hand-carved wooden cap batik stamp', cat: 'Batik Stamp' },
    { src: 'https://images.unsplash.com/photo-1508807526345-15e988543c28?w=500&h=400&fit=crop&auto=format', alt: 'Traditional copper batik stamp making', cat: 'Batik Stamp' },
    { src: 'https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?w=500&h=400&fit=crop&auto=format', alt: 'Wax resist textile stamping', cat: 'Batik Stamp' },
    { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=400&fit=crop&auto=format', alt: 'Traditional Sri Lankan Batik pattern', cat: 'Batik Stamp' },
  ];

  const filters = ['DTF Printing', 'Screen Printing', 'Laser Cutting', 'Stencils', 'Batik Stamp'];
  const [activeGallery, setActiveGallery] = useState('DTF Printing');
  const visibleGallery = galleryItems.filter(g => g.cat === activeGallery);

  const categoryUrlMap: Record<string, string> = {
    'DTF Printing': '/dtf-printing',
    'Screen Printing': '/screen-printing',
    'Laser Cutting': '/laser-cutting',
    'Stencils': '/stencil',
    'Batik Stamp': '/batik-stamp',
  };

  const testimonials = [
    { name: 'Kavinda P.', role: 'Apparel Brand Owner', rating: 5, text: '"Bitium Technology provided the cleanest DTF prints I\'ve ever seen. The colors popped instantly."', avatar: 'KP' },
    { name: 'Design Studio X', role: 'Interior Designers', rating: 5, text: '"The custom laser cut stencils for our mural project were flawless. Exceeded expectations!"', avatar: 'DS' },
    { name: 'Sahan M.', role: 'Local Screen Printer', rating: 5, text: '"Fastest screen exposing service in the city. Really appreciate the quick turnarounds."', avatar: 'SM' },
  ];
  const avatarColors = ['#2CFF05', '#7c3aed', '#0284c7'];
  
  const faqs = [
    { q: 'What is DTF printing?', a: 'DTF (Direct-to-Film) printing is a modern transfer method where designs are printed onto a special film and then heat-pressed onto garments. It produces vibrant, full-color prints on virtually any fabric.' },
    { q: 'What file formats do you accept?', a: 'We accept PNG (preferred for transparency), JPG, PDF, AI, and PSD files. For best results, submit artwork at 300 DPI or higher with a transparent background.' },
    { q: 'How long does shipping take?', a: 'Standard production takes 24 hours from order confirmation. Domestic shipping typically adds 2–5 business days. Express overnight options are available at checkout.' },
    { q: 'Do you offer bulk discounts?', a: 'Yes! Orders over 50 sheets receive 10% off, over 100 sheets get 20% off, and custom pricing is available for enterprise and wholesale customers. Contact us for a quote.' },
  ];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  const brands = ['Sneaker Lab', 'Urban Threads', 'Print Raven', 'Overtime Co.', 'InkFlow', 'Dezign Studio', 'Custom Kings'];

  return (
    <div ref={container} className="w-full min-h-screen bg-background text-foreground">
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Bitium Technology",
            "image": "https://www.bitiumtechnology.com/images/bitium-logo.jpg",
            "@id": "https://www.bitiumtechnology.com/#organization",
            "url": "https://www.bitiumtechnology.com/",
            "telephone": "+94779731097",
            "email": "info@bitium.lk",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "102 Galle Road",
              "addressLocality": "Colombo 03",
              "addressCountry": "LK"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 6.9189,
              "longitude": 79.8484
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ],
              "opens": "08:30",
              "closes": "18:00"
            },
            "sameAs": [
              "https://www.facebook.com/bitiumtechnology",
              "https://www.instagram.com/bitiumtechnology",
              "https://www.youtube.com/@bitiumtechnology",
              "https://www.linkedin.com/company/bitiumtechnology"
            ]
          })
        }}
      />

      {/* 01. Hero Banner Section with Static Industrial Printer Background & Right Showcase */}
      <section className="relative py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-border bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white min-h-[600px] lg:min-h-[660px] flex items-center transition-colors duration-300 z-20">
        {/* Static Background Image with Crystal Clear Visibility & Gradient Falloff to the Right */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <Image
            src="/images/hero-printer-bg.jpg"
            alt="Bitium Technology Industrial Printing Machinery"
            fill
            priority
            quality={95}
            className="object-cover object-center lg:object-right opacity-100 dark:opacity-95 transition-opacity duration-300"
          />
          {/* 1. Subtle Base Tint (Dark mode only) */}
          <div className="absolute inset-0 bg-transparent dark:bg-black/25 transition-colors duration-300" />

          {/* 2. Text Reading Scrim: Full opaque white backdrop behind left text column (0-52%), smoothly transitioning into machinery background (62-80%) */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-40% to-transparent to-58% dark:from-[#020617] dark:via-[#020617]/90 dark:via-38% dark:to-transparent dark:to-58% transition-all duration-300" />

          {/* 3. Subtle Bottom Edge Fade into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Search, Actions */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 flex flex-col items-start text-left relative z-30">
            <div 
              className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 dark:bg-[#2CFF05]/15 border border-emerald-600/30 dark:border-[#2CFF05]/40 text-emerald-900 dark:text-[#2CFF05] text-xs font-bold backdrop-blur-md shadow-sm"
            >
              <Sparkles size={14} className="text-emerald-600 dark:text-[#2CFF05]" />
              <span>{t.hero.badge}</span>
            </div>
            
            {/* SSR H1 is injected by the Server Component wrapper in app/page.tsx.
                This client-rendered heading matches it visually but uses aria-hidden
                to avoid duplicate headings for assistive tech. */}
            <p 
              aria-hidden="true"
              className="hero-title font-heading font-black text-[clamp(28px,4.2vw,52px)] tracking-tight leading-[1.12] text-slate-950 dark:text-white"
            >
              {t.hero.titlePrefix}
              <span className="text-[#059669] dark:text-[#2CFF05] dark:drop-shadow-[0_0_24px_rgba(44,255,5,0.6)]">
                {t.hero.titleHighlight}
              </span>
              {t.hero.titleSuffix}
            </p>
            
            <p 
              className="hero-text text-base sm:text-lg text-slate-800 dark:text-white max-w-xl leading-relaxed font-medium dark:drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]"
            >
              {t.hero.description}
            </p>

            <div className="hero-search pt-1 w-full max-w-[500px] relative z-40">
              <HeroSearch />
            </div>
            
            <div 
              className="hero-buttons flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto"
            >
              <Link 
                href="/canvas" 
                className="lime-btn flex items-center justify-center gap-[10px] px-8 py-3.5 rounded-full text-[15px] font-bold border-none cursor-pointer w-full sm:w-auto shadow-lg shadow-[#2CFF05]/30 hover:scale-105 transition-all"
              >
                <span>{t.hero.btnCreate}</span>
                <ArrowRight size={16} />
              </Link>
              <Link 
                href="/stencil" 
                className="ghost-btn flex items-center justify-center gap-[10px] px-8 py-3.5 rounded-full text-[15px] font-semibold cursor-pointer w-full sm:w-auto border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-900 dark:text-white hover:border-emerald-500/50 dark:hover:border-[#2CFF05]/50 transition-all shadow-sm"
              >
                {t.hero.btnBrowse}
              </Link>
            </div>

            {/* Refactored Clean Hero Stats Row (Single 4-Column Row, Complete Text Rendering) */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-3.5 w-full text-slate-900 dark:text-white">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="text-base sm:text-[18px] shrink-0">🎯</span>
                <div className="min-w-0">
                  <div className="font-heading font-extrabold text-[11px] sm:text-xs leading-tight text-slate-950 dark:text-white">
                    {t.hero.stats.accuracyTitle}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight">
                    {t.hero.stats.accuracySub}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="text-base sm:text-[18px] shrink-0">⚡</span>
                <div className="min-w-0">
                  <div className="font-heading font-extrabold text-[11px] sm:text-xs leading-tight text-slate-950 dark:text-white">
                    {t.hero.stats.turnaroundTitle}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight">
                    {t.hero.stats.turnaroundSub}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="text-base sm:text-[18px] shrink-0">📦</span>
                <div className="min-w-0">
                  <div className="font-heading font-extrabold text-[11px] sm:text-xs leading-tight text-slate-950 dark:text-white">
                    {t.hero.stats.ordersTitle}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight">
                    {t.hero.stats.ordersSub}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="text-base sm:text-[18px] shrink-0">⭐</span>
                <div className="min-w-0">
                  <div className="font-heading font-extrabold text-[11px] sm:text-xs leading-tight text-slate-950 dark:text-white">
                    {t.hero.stats.ratingTitle}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight">
                    {t.hero.stats.ratingSub}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Infinite Carousel Box */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center w-full">
            <HeroShowcaseCarousel />
          </div>
        </div>
      </section>

      {/* 02. Trust & Partner Brands Strip - Modern Static Bento Grid */}
      <section className="bg-slate-100/70 dark:bg-[#060b18] border-b border-border/80 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-emerald-500/5 dark:bg-[#2CFF05]/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10 text-center">
          
          {/* Header Row: Title - Center Aligned */}
          <div className="flex items-center justify-center gap-3 border-b border-slate-200/80 dark:border-white/5 pb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-[#2CFF05] animate-ping" />
            <p className="font-heading font-extrabold text-xs sm:text-[13px] tracking-wider uppercase text-slate-800 dark:text-slate-200 text-center">
              Trusted by 1,000+ Apparel Brands, Studios &amp; Manufacturers
            </p>
          </div>

          {/* Clean Interactive Logo Matrix - Center Aligned */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 justify-center items-center">
            {[
              { name: 'Sneaker Lab', tag: 'Footwear', icon: Activity },
              { name: 'Urban Threads', tag: 'Streetwear', icon: Shirt },
              { name: 'Print Raven', tag: 'Boutique', icon: Feather },
              { name: 'Overtime Co.', tag: 'Workwear', icon: Clock },
              { name: 'InkFlow Studio', tag: 'Textile', icon: Droplet },
              { name: 'Dezign Lab', tag: 'Agency', icon: PenTool },
              { name: 'Custom Kings', tag: 'Merch', icon: Crown },
            ].map((brand) => {
              const Icon = brand.icon;
              return (
                <div
                  key={brand.name}
                  className="group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0b1329]/60 border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/50 dark:hover:border-[#2CFF05]/50 shadow-sm hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(44,255,5,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 group-hover:bg-emerald-500/10 dark:group-hover:bg-[#2CFF05]/10 flex items-center justify-center text-slate-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-[#2CFF05] transition-colors mb-2">
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <span className="font-heading font-bold text-[13px] text-slate-800 dark:text-white group-hover:text-slate-950 dark:group-hover:text-[#2CFF05] transition-colors truncate w-full text-center">
                    {brand.name}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-[#2CFF05] font-medium tracking-tight transition-colors">
                    {brand.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="font-heading font-bold text-[13px] text-[#2CFF05] uppercase tracking-widest">Process</span>
            <h2 className="font-heading font-black text-[clamp(28px,4vw,42px)] text-foreground mt-2">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 relative hiw-grid">
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center text-center relative px-4 mb-8 lg:mb-0">
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-9 -right-3 z-10 text-border items-center">
                    <ArrowRight size={20} />
                  </div>
                )}
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center font-heading font-extrabold text-[12px] text-primary-foreground mb-4">
                  {step.num}
                </div>
                <div className="w-[68px] h-[68px] rounded-[18px] bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  {step.icon}
                </div>
                <h3 className="font-heading font-extrabold text-[17px] text-foreground mb-2.5">{step.title}</h3>
                <p className="text-[14px] text-muted-foreground dark:text-muted-foreground leading-[1.6]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PromoBanner />

      {/* Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-card/40 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="font-heading font-bold text-[13px] text-[#2CFF05] uppercase tracking-widest">Catalog</span>
            <h2 className="font-heading font-black text-[clamp(28px,4vw,42px)] text-foreground mt-2">Shop Our Printing Solutions</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-2.5">
              Explore our full range of custom stencils, industrial DTF transfers, traditional Cap Batik stamps, precision cutting, and print consumables.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 products-grid">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.title}
                  href={c.href}
                  className="product-card group flex flex-col bg-white dark:bg-card/70 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-[#2CFF05]/60 hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Card Image Banner */}
                  <div className="relative w-full h-[180px] sm:h-[190px] overflow-hidden bg-slate-100 dark:bg-zinc-900 select-none">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                    {/* Subtle Scrim Gradient Overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Badge */}
                    {c.badge && (
                      <div className="absolute top-3 left-3 bg-[#2CFF05] text-slate-950 font-heading font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
                        {c.badge}
                      </div>
                    )}

                    {/* Floating Icon Pill */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#2CFF05] flex items-center justify-center shadow-md z-10 group-hover:scale-110 transition-transform">
                      <Icon size={16} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex flex-col flex-grow justify-between bg-white dark:bg-card/90">
                    <div>
                      <h3 className="font-heading font-black text-[16px] text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#2CFF05] transition-colors mb-2">
                        {c.title}
                      </h3>
                      <p className="text-[13px] text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3 mb-4 font-normal">
                        {c.description}
                      </p>
                    </div>
                    
                    <div className="pt-2.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#2CFF05] transition-colors">
                      <span>Browse Products</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-heading font-bold text-[13px] text-[#2CFF05] uppercase tracking-widest">Benefits</span>
            <h2 className="font-heading font-black text-[clamp(28px,4vw,42px)] text-foreground mt-2">The Bitium Advantage</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 benefits-grid">
            {benefits.map(b => (
              <div key={b.title} className="text-center py-8 px-5 rounded-[16px] border-[1.5px] border-border bg-card transition-all duration-200 hover:border-[#2CFF05] hover:shadow-[0_8px_32px_rgba(141,255,0,0.12)]">
                <div className="w-[52px] h-[52px] bg-primary/10 border border-primary/20 rounded-[14px] flex items-center justify-center mx-auto mb-4">
                  {b.icon}
                </div>
                <h3 className="font-heading font-extrabold text-[15px] text-foreground mb-2">{b.title}</h3>
                <p className="text-[13px] text-muted-foreground dark:text-muted-foreground leading-[1.6]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 px-6 bg-zinc-50 dark:bg-card/40 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-9">
            <span className="font-heading font-bold text-[13px] text-[#2CFF05] uppercase tracking-widest">Gallery</span>
            <h2 className="font-heading font-black text-[clamp(28px,4vw,42px)] text-foreground mt-2">See Our Work</h2>
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-8">
            {filters.map(f => (
              <button key={f} className={`filter-btn ${activeGallery === f ? 'active' : ''}`} onClick={() => setActiveGallery(f)}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gallery-grid">
            {visibleGallery.slice(0, 8).map((item, i) => (
              <div key={i} className="group rounded-xl overflow-hidden bg-muted aspect-square relative cursor-pointer">
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover block" />
                <div className="absolute inset-0 bg-black/50 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="font-heading font-bold text-[13px] text-foreground">{item.cat}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link 
              href={categoryUrlMap[activeGallery] || '/dtf-printing'} 
              className="ghost-btn inline-flex items-center gap-2 px-8 py-3 rounded-full text-[14px] cursor-pointer"
            >
              View full catalogue <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive DTF Gang Sheet Builder Showcase Section */}
      <section className="bg-background py-[72px] px-6 pb-20 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center hero-grid">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2CFF05]/15 dark:bg-[#2CFF05]/10 rounded-full px-[14px] py-[6px] mb-6 border border-[#2CFF05]/30">
              <div className="w-[6px] h-[6px] rounded-full bg-[#2CFF05]" />
              <span className="font-heading font-semibold text-[13px] text-[#2CFF05]">Professional DTF Printing</span>
            </div>

            <h2 className="hero-title font-heading font-black text-[clamp(32px,4.5vw,52px)] leading-[1.05] text-foreground mb-5">
              Custom <span className="text-[#2CFF05]">DTF</span> Transfers<br />Made Simple.
            </h2>

            <p className="hero-text text-[16px] text-muted-foreground dark:text-muted-foreground leading-[1.65] mb-9 max-w-[460px]">
              Upload your artwork, arrange your gang sheet, preview your final print in 3D, and order professional-quality transfers in minutes.
            </p>

            <div className="hero-buttons flex gap-3 flex-wrap mb-10">
              <Link href="/canvas" className="lime-btn flex items-center gap-[10px] px-7 py-3.5 rounded-full text-[15px] border-none cursor-pointer">
                Create Your DTF Sheet
                <ArrowRight size={16} />
              </Link>
              <Link href="/stencil" className="ghost-btn flex items-center gap-[10px] px-7 py-3.5 rounded-full text-[15px] cursor-pointer">
                Browse Products
              </Link>
            </div>

          </div>

          {/* Right – Product Mockup */}
          <div className="relative flex justify-center mt-10 lg:mt-0">
            {/* Main browser card */}
            <div className="bg-card rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.12)] border border-border overflow-hidden w-full max-w-[520px] flex flex-col">
              {/* Browser bar */}
              <div className="bg-muted border-b border-border py-2.5 px-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                </div>
                <div className="flex-1 bg-background rounded-md py-1 px-3 border border-border flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">🔒</span>
                  <span className="font-sans text-[11px] text-muted-foreground dark:text-muted-foreground">bitiumtechnology.com/builder</span>
                </div>
                <Link href="/3d-customizer" className="bg-[#2CFF05] hover:bg-[#7ce000] border-none rounded-md py-1.5 px-3 font-heading font-bold text-[10px] cursor-pointer text-[#0a0a0a] transition-colors decoration-none flex items-center justify-center">Preview in 3D</Link>
              </div>

              {/* App content */}
              <div className="flex min-h-[280px]">
                {/* Sidebar toolbar */}
                <div className="w-[42px] bg-muted border-r border-border flex flex-col items-center pt-3 gap-3.5">
                  {['✏️','🔲','📐','🔡','🖼️','⚙️'].map((emoji, i) => (
                    <div key={i} className={`w-7 h-7 rounded-md flex items-center justify-center text-[13px] cursor-pointer ${i === 0 ? 'bg-[#2CFF05] text-black' : 'bg-transparent text-[#0a0a0a] dark:text-[#f8fafc]'}`}>
                      {emoji}
                    </div>
                  ))}
                </div>

                {/* Canvas area */}
                <div className="flex-1 bg-zinc-50 dark:bg-background/50 relative p-3 grid grid-cols-3 gap-2 content-start">
                  {/* Design cards */}
                  {traditionalDesigns.map((d, i) => (
                    <div 
                      key={d.id} 
                      onClick={() => setSelectedDesign(d)}
                      className={`relative aspect-square flex items-center justify-center cursor-pointer transition-all hover:scale-110 rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.2)] ${selectedDesign?.id === d.id ? 'scale-110 opacity-100 z-10 ring-2 ring-[#2CFF05]/50' : 'opacity-65 hover:opacity-100'}`}
                    >
                      <Image 
                        src={d.motifImage} 
                        alt={d.title} 
                        fill 
                        className="object-contain p-2.5" 
                      />
                    </div>
                  ))}
                </div>

                {/* Hoodie preview */}
                <div className="w-[140px] bg-zinc-100 dark:bg-[#0c101b] border-l border-border flex flex-col items-center justify-between py-4 select-none">
                  <div className="text-[11px] font-heading font-semibold text-muted-foreground uppercase tracking-wider">Preview</div>
                  
                  {/* Realistic Hoodie Preview */}
                  <div className="relative w-full h-[180px] flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/images/products/black_hoodie_uploaded_fitted.png" 
                      alt="Black Hoodie Preview" 
                      fill 
                      className="object-contain" 
                    />
                    
                   {selectedDesign && (
                      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px]">
                        <div className="relative w-full h-full">
                          <Image
                            src={selectedDesign.motifImage}
                            alt="Printed motif"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-[10px] text-muted-foreground text-center font-sans font-bold">Black Hoodie</div>
                </div>
              </div>
            </div>

            {/* Floating 3D Preview card */}
            <div className="float-anim absolute -bottom-4 -right-2 bg-card rounded-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-border py-3 px-4 flex items-center gap-3 z-20">
              <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center text-[18px]">🎨</div>
              <div>
                <div className="font-heading font-bold text-[12px] text-foreground">3D Preview Ready</div>
                <div className="text-[11px] text-muted-foreground">6 designs on sheet</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Reviews) */}
      <section className="py-20 px-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-heading font-bold text-[13px] text-[#2CFF05] uppercase tracking-widest">Reviews</span>
            <h2 className="font-heading font-black text-[clamp(28px,4vw,42px)] text-foreground mt-2">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 testi-grid">
            {testimonials.map((t, i) => (
              <div key={t.name} className="bg-zinc-50 dark:bg-card rounded-[20px] p-8 border-[1.5px] border-border">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => <StarIcon key={s} filled={s < t.rating} />)}
                </div>
                <p className="text-[15px] text-muted-foreground dark:text-foreground leading-[1.7] mb-6 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-heading font-extrabold text-[14px] text-[#0a0a0a] shrink-0" style={{ background: avatarColors[i] }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-heading font-bold text-[14px] text-foreground">{t.name}</div>
                    <div className="text-[12px] text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (Placed between Reviews and Ready to get started) */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-card/20 border-b border-border overflow-hidden relative">
        {/* Decorative subtle gradient background glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-[#2CFF05] rounded-full opacity-[0.03] blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1.7fr] gap-16 items-start">
            
            {/* Left side: Heading & CTA */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 bg-[#2CFF05]/10 border border-[#2CFF05]/25 rounded-full px-3.5 py-1.5">
                <Sparkles size={12} className="text-[#2CFF05]" />
                <span className="font-heading font-semibold text-[11px] text-[#2CFF05] tracking-wider uppercase">SUPPORT HUB</span>
              </div>
              <h2 className="font-heading font-black text-[clamp(32px,4.5vw,48px)] text-foreground leading-[1.1]">
                Frequently Asked <span className="text-[#2CFF05]">Questions</span>
              </h2>
              <p className="text-[15px] text-muted-foreground leading-[1.65] max-w-md">
                Need help with your design, files, or custom sheets? Find answers to commonly asked questions here, or reach out directly to our printing experts.
              </p>
              <div className="pt-2">
                <Link href="/contact" className="lime-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-[#2CFF05]/10 hover:shadow-[#2CFF05]/25 cursor-pointer">
                  <MessageSquareHeart size={14} /> Contact Support
                </Link>
              </div>
            </div>
            
            {/* Right side: Accordion list */}
            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className={`border border-border rounded-[20px] bg-card/30 dark:bg-[#0f172a]/20 hover:border-[#2CFF05]/40 transition-all duration-300 p-5 cursor-pointer ${
                    openFaq === i ? 'border-[#2CFF05]/40 bg-card/65 dark:bg-[#0f172a]/45 shadow-[0_8px_30px_rgba(141,255,0,0.04)]' : ''
                  }`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <button 
                    className="w-full bg-transparent border-none cursor-pointer flex items-center justify-between gap-4 text-left p-0 focus:outline-none group"
                  >
                    <span className="font-heading font-bold text-[16px] text-foreground group-hover:text-[#2CFF05] transition-colors">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground group-hover:border-[#2CFF05]/40 group-hover:text-[#2CFF05] transition-all duration-300 shrink-0 ${
                      openFaq === i ? 'bg-[#2CFF05] border-[#2CFF05] text-[#0a0a0a] rotate-180' : ''
                    }`}>
                      <ChevronDown />
                    </div>
                  </button>
                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}>
                    <div className="overflow-hidden">
                      <p className="pt-4 text-[14px] text-muted-foreground leading-[1.7] border-t border-border/40 mt-4">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 pb-20 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0a0a0a] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-[1.2fr_auto] gap-10 lg:gap-14 items-center overflow-hidden relative border border-slate-800/80 shadow-2xl cta-grid">
            {/* Background accent */}
            <div className="absolute -top-[60px] right-[300px] w-[280px] h-[280px] bg-[#2CFF05] rounded-full opacity-[0.08] blur-[60px] pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#2CFF05]/15 rounded-full px-3.5 py-1.5 mb-5 border border-[#2CFF05]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2CFF05] animate-pulse" />
                <span className="font-heading font-semibold text-[12px] text-[#2CFF05]">Ready to get started?</span>
              </div>
              <h2 className="font-heading font-black text-[clamp(30px,4.5vw,52px)] text-white leading-[1.08] mb-4">
                Ready to Print<br />Your Design?
              </h2>
              <p className="text-[15px] sm:text-[16px] text-slate-300 leading-[1.65] mb-8 max-w-[460px]">
                Create your DTF sheet now and see your design come to life before printing. No minimums, 24-hour turnaround.
              </p>
              <Link href="/canvas" className="lime-btn inline-flex items-center gap-[10px] px-8 py-4 rounded-full text-[15px] font-bold border-none cursor-pointer shadow-lg shadow-[#2CFF05]/20 hover:scale-105 transition-all">
                Start Your Design Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mockup images - Enlarged to match left text height */}
            <div className="flex gap-3 sm:gap-4 items-center justify-center relative z-10 w-full sm:max-w-none mx-auto lg:mx-0 mt-6 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1601754664414-aa3e4f42e6d4?w=400&h=600&fit=crop&auto=format" 
                alt="Custom printed shirt" 
                className="w-[110px] sm:w-[145px] lg:w-[165px] h-[190px] sm:h-[240px] lg:h-[270px] object-cover rounded-2xl sm:rounded-3xl -rotate-6 shadow-2xl border border-white/10 shrink-0 hover:rotate-0 transition-transform duration-300" 
              />
              <img 
                src="https://images.unsplash.com/photo-1680292783974-a9a336c10366?w=400&h=600&fit=crop&auto=format" 
                alt="Custom hoodie" 
                className="w-[125px] sm:w-[165px] lg:w-[190px] h-[220px] sm:h-[275px] lg:h-[305px] object-cover rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 z-10 shrink-0 hover:scale-105 transition-transform duration-300" 
              />
              <img 
                src="https://images.unsplash.com/photo-1615397587950-3cbb55f95b77?w=400&h=600&fit=crop&auto=format" 
                alt="White hoodie" 
                className="w-[110px] sm:w-[145px] lg:w-[165px] h-[190px] sm:h-[240px] lg:h-[270px] object-cover rounded-2xl sm:rounded-3xl rotate-6 shadow-2xl border border-white/10 shrink-0 hover:rotate-0 transition-transform duration-300" 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePageClient() {
  return <HomeContent />;
}
