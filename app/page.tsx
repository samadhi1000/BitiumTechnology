'use client';

import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import PromoBanner from '@/components/PromoBanner';
import { ArrowRight, Sparkles, Palette, Printer, Layers, Stamp, Flame, CheckCircle2, Scissors, FlaskConical, PlayCircle, MessageSquareHeart, Upload, Grid, Cuboid, Package, Shield, Zap, Phone, ThumbsUp, Activity, Shirt, Feather, Clock, Droplet, PenTool, Crown } from 'lucide-react';
import { HeroSearch } from '@/components/HeroSearch';
import TrustSection from '@/components/TrustSection';

// Icons for How It Works & Why Choose Us
const UploadIcon = () => <Upload size={28} color="#8DFF00" strokeWidth={1.8} />;
const GridIcon = () => <Grid size={28} color="#8DFF00" strokeWidth={1.8} />;
const CubeIcon = () => <Cuboid size={28} color="#8DFF00" strokeWidth={1.8} />;
const PackageIcon = () => <Package size={28} color="#8DFF00" strokeWidth={1.8} />;

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

  const stickers = [
    { bg: '#ff6b35', emoji: '🐯', rotate: '-5deg' },
    { bg: '#7c3aed', emoji: '⚡', rotate: '3deg' },
    { bg: '#059669', emoji: '🌊', rotate: '-2deg' },
    { bg: '#dc2626', emoji: '🔥', rotate: '6deg' },
    { bg: '#d97706', emoji: '😎', rotate: '-4deg' },
    { bg: '#0284c7', emoji: '💎', rotate: '2deg' },
  ];
  const [selectedSticker, setSelectedSticker] = useState(stickers[0]);

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
      icon: Palette,
      badge: '6 Categories'
    },
    {
      title: 'Screen Printing',
      description: 'Exposed screens, vectorized artwork, and positive tracing films, made to your exact specs.',
      href: '/screen-printing',
      icon: Printer,
      badge: 'Professional Grade'
    },
    {
      title: 'DTF Printing',
      description: 'Custom sheet layouts, anime sticker packs, and cloth transfers — our most popular category.',
      href: '/dtf-printing',
      icon: Layers,
      badge: 'Hot Seller'
    },
    {
      title: 'Batik Stamps',
      description: 'Traditional copper and hand-carved wood Cap Batik stamps, made the way they\'ve always been made.',
      href: '/batik-stamp',
      icon: Stamp,
      badge: 'Traditional Art'
    },
    {
      title: 'Laser Cutting',
      description: 'Precision CO2 laser cutting for acrylic, wood, and custom profiles — built to your file, not a template.',
      href: '/laser-cutting',
      icon: Scissors,
      badge: 'CNC Precision'
    },
    {
      title: 'Consumables',
      description: 'Inks, hot melt powder, film rolls, emulsions, and wash chemicals — the supplies that keep your shop running.',
      href: '/materials',
      icon: FlaskConical,
      badge: 'Industrial Grade'
    },
    {
      title: 'Video Tutorials',
      description: 'Learn how to master Screen & DTF printing with our step-by-step video guides.',
      href: '#',
      icon: PlayCircle,
      badge: 'Learn & Master'
    },
    {
      title: 'Customer Feedbacks',
      description: 'See what our existing customers have to say about Bitium Technology Products.',
      href: '#',
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
    { src: 'https://images.unsplash.com/photo-1601754664414-aa3e4f42e6d4?w=500&h=400&fit=crop&auto=format', alt: 'Custom black and white shirt', cat: 'DTF Printing' },
    { src: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&h=400&fit=crop&auto=format', alt: 'Custom gray hoodie', cat: 'DTF Printing' },
    { src: 'https://images.unsplash.com/photo-1680292783974-a9a336c10366?w=500&h=400&fit=crop&auto=format', alt: 'Black hoodie custom', cat: 'DTF Printing' },
    { src: 'https://images.unsplash.com/photo-1663433567177-9f94be0bff4c?w=500&h=400&fit=crop&auto=format', alt: 'Screen printing process', cat: 'Screen Printing' },
    { src: 'https://images.unsplash.com/photo-1663433541063-ddab084d1126?w=500&h=400&fit=crop&auto=format', alt: 'Industrial screen printing', cat: 'Screen Printing' },
    { src: 'https://images.unsplash.com/photo-1738162837451-2041c1418f54?w=500&h=400&fit=crop&auto=format', alt: 'Laser cutting machine', cat: 'Laser Cutting' },
    { src: 'https://images.unsplash.com/photo-1738162837438-92ff852619a1?w=500&h=400&fit=crop&auto=format', alt: 'Precision laser cut metal', cat: 'Laser Cutting' },
    { src: 'https://images.unsplash.com/photo-1615397587950-3cbb55f95b77?w=500&h=400&fit=crop&auto=format', alt: 'White hoodie apparel mockup', cat: 'DTF Printing' },
  ];
  const filters = ['All', 'DTF Printing', 'Screen Printing', 'Laser Cutting', 'Stencils'];
  const [activeGallery, setActiveGallery] = useState('All');
  const visibleGallery = activeGallery === 'All' ? galleryItems : galleryItems.filter(g => g.cat === activeGallery);

  const testimonials = [
    { name: 'Kavinda P.', role: 'Apparel Brand Owner', rating: 5, text: '"Bitium Technology provided the cleanest DTF prints I\'ve ever seen. The colors popped instantly."', avatar: 'KP' },
    { name: 'Design Studio X', role: 'Interior Designers', rating: 5, text: '"The custom laser cut stencils for our mural project were flawless. Exceeded expectations!"', avatar: 'DS' },
    { name: 'Sahan M.', role: 'Local Screen Printer', rating: 5, text: '"Fastest screen exposing service in the city. Really appreciate the quick turnarounds."', avatar: 'SM' },
  ];
  const avatarColors = ['#8DFF00', '#7c3aed', '#0284c7'];
  
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
      {/* Hero Section */}
      <section className="bg-background py-[72px] px-6 pb-20 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center hero-grid">
          {/* Left */}
          <div>
            <div className="hero-badge inline-flex items-center gap-2 bg-[#f0ffd6] dark:bg-[#f0ffd6]/10 rounded-full px-[14px] py-[6px] mb-6 border border-[#8DFF00]/20">
              <div className="w-[6px] h-[6px] rounded-full bg-[#8DFF00]" />
              <span className="font-heading font-semibold text-[13px] text-[#3a6600] dark:text-[#8DFF00]">Professional DTF Printing</span>
            </div>

            <h1 className="hero-title font-heading font-black text-[clamp(38px,5vw,58px)] leading-[1.05] text-foreground mb-5">
              Custom <span className="text-[#8DFF00]">DTF</span> Transfers<br />Made Simple.
            </h1>

            <p className="hero-text text-[17px] text-muted-foreground dark:text-muted-foreground leading-[1.65] mb-9 max-w-[460px]">
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

            <div className="flex gap-6 flex-wrap mb-10">
              {[
                { icon: '🎯', label: '99% Print Accuracy', sub: 'Vibrant & Durable' },
                { icon: '⚡', label: '24h Turnaround', sub: 'Fast Production' },
                { icon: '📦', label: '10,000+ Orders', sub: 'Happy Customers' },
                { icon: '⭐', label: '5★ Satisfaction', sub: 'Top Rated Support' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-[18px]">{item.icon}</span>
                  <div>
                    <div className="font-heading font-bold text-[13px] text-foreground">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground dark:text-muted-foreground">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="hero-search w-full max-w-[460px]">
              <HeroSearch />
            </div>
          </div>

          {/* Right – Product Mockup */}
          <div className="relative flex justify-center mt-10 lg:mt-0">
            {/* Main browser card */}
            <div className="bg-card rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.12)] border border-border overflow-hidden w-full max-w-[520px]">
              {/* Browser bar */}
              <div className="bg-muted border-b border-border py-2.5 px-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                </div>
                <div className="flex-1 bg-background rounded-md py-1 px-3 border border-border flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">🔒</span>
                  <span className="font-sans text-[11px] text-muted-foreground dark:text-muted-foreground">app.bitiumtechnology.com/builder</span>
                </div>
                <button className="bg-[#8DFF00] border-none rounded-md py-1 px-2.5 font-heading font-bold text-[10px] cursor-pointer text-[#0a0a0a]">Preview in 3D</button>
              </div>

              {/* App content */}
              <div className="flex min-h-[280px]">
                {/* Sidebar toolbar */}
                <div className="w-[42px] bg-muted border-r border-border flex flex-col items-center pt-3 gap-3.5">
                  {['✏️','🔲','📐','🔡','🖼️','⚙️'].map((emoji, i) => (
                    <div key={i} className={`w-7 h-7 rounded-md flex items-center justify-center text-[13px] cursor-pointer ${i === 0 ? 'bg-[#8DFF00] text-black' : 'bg-transparent text-[#0a0a0a]'}`}>
                      {emoji}
                    </div>
                  ))}
                </div>

                {/* Canvas area */}
                <div className="flex-1 bg-zinc-50 dark:bg-background/50 relative p-3 grid grid-cols-3 gap-2 content-start">
                  {/* Sticker designs */}
                  {stickers.map((s, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedSticker(s)}
                      className={`rounded-[10px] aspect-square flex items-center justify-center text-[28px] shadow-[0_4px_12px_rgba(0,0,0,0.2)] cursor-pointer transition-all hover:scale-105 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] ${selectedSticker.emoji === s.emoji ? 'ring-2 ring-white scale-110 z-10' : ''}`} 
                      style={{ background: s.bg, transform: selectedSticker.emoji === s.emoji ? `rotate(0deg) scale(1.1)` : `rotate(${s.rotate})` }}
                    >
                      {s.emoji}
                    </div>
                  ))}
                </div>

                {/* Hoodie preview */}
                <div className="w-[140px] bg-card border-l border-border flex flex-col items-center justify-center gap-2 py-4 px-2">
                  <div className="text-[11px] font-heading font-semibold text-muted-foreground uppercase tracking-wider">Preview</div>
                  {/* Hoodie SVG illustration */}
                  <svg viewBox="0 0 100 120" className="w-[100px] h-[120px]">
                    <path d="M25 15 L15 35 L5 40 L12 50 L22 45 L22 110 L78 110 L78 45 L88 50 L95 40 L85 35 L75 15 C70 12 65 10 50 10 C35 10 30 12 25 15Z" fill="currentColor" className="text-foreground dark:text-zinc-800" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M35 15 C35 20 40 25 50 25 C60 25 65 20 65 15" fill="none" stroke="currentColor" className="text-foreground dark:text-muted-foreground" strokeWidth="1"/>
                    {/* Design on hoodie */}
                    <rect x="38" y="50" width="24" height="24" rx="4" fill={selectedSticker.bg} opacity="0.9"/>
                    <text x="50" y="66" textAnchor="middle" fontSize="14" fill="#0a0a0a">{selectedSticker.emoji}</text>
                  </svg>
                  <div className="text-[10px] text-muted-foreground text-center font-sans">White Hoodie</div>
                </div>
              </div>
            </div>

            {/* Floating 3D Preview card */}
            <div className="float-anim absolute -bottom-4 -right-2 bg-card rounded-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-border py-3 px-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-[#8DFF00] rounded-[10px] flex items-center justify-center text-[18px]">🎨</div>
              <div>
                <div className="font-heading font-bold text-[12px] text-foreground">3D Preview Ready</div>
                <div className="text-[11px] text-muted-foreground">6 designs on sheet</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="bg-zinc-50 dark:bg-card border-b border-border py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center px-6">
          <p className="text-[13px] font-heading font-semibold text-muted-foreground tracking-wider uppercase mb-6">Trusted by 1,000+ Brands & Businesses</p>
        </div>
        
        {/* Infinite Carousel Marquee */}
        <div className="w-full flex overflow-hidden relative">
          {/* Gradient Fades for Marquee Edges */}
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-zinc-50 dark:from-zinc-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-zinc-50 dark:from-zinc-900 to-transparent z-10 pointer-events-none" />
          
          <div className="animate-marquee gap-8 items-center px-4">
            {/* We duplicate the array to make the infinite scroll seamless */}
            {[
              { name: 'Sneaker Lab', icon: Activity },
              { name: 'Urban Threads', icon: Shirt },
              { name: 'Print Raven', icon: Feather },
              { name: 'Overtime Co.', icon: Clock },
              { name: 'InkFlow', icon: Droplet },
              { name: 'Dezign Studio', icon: PenTool },
              { name: 'Custom Kings', icon: Crown },
              // Duplicate once
              { name: 'Sneaker Lab', icon: Activity },
              { name: 'Urban Threads', icon: Shirt },
              { name: 'Print Raven', icon: Feather },
              { name: 'Overtime Co.', icon: Clock },
              { name: 'InkFlow', icon: Droplet },
              { name: 'Dezign Studio', icon: PenTool },
              { name: 'Custom Kings', icon: Crown },
              // Duplicate twice for wider screens
              { name: 'Sneaker Lab', icon: Activity },
              { name: 'Urban Threads', icon: Shirt },
              { name: 'Print Raven', icon: Feather },
              { name: 'Overtime Co.', icon: Clock },
              { name: 'InkFlow', icon: Droplet },
              { name: 'Dezign Studio', icon: PenTool },
              { name: 'Custom Kings', icon: Crown },
            ].map((brand, i) => {
              const Icon = brand.icon;
              return (
                <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card whitespace-nowrap group hover:border-[#8DFF00] hover:shadow-[0_4px_12px_rgba(141,255,0,0.1)] transition-all cursor-pointer">
                  <Icon size={16} className="text-[#8DFF00]" />
                  <span className="font-heading font-bold text-[14px] text-muted-foreground group-hover:text-foreground tracking-wide transition-colors">{brand.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="font-heading font-bold text-[13px] text-[#8DFF00] uppercase tracking-widest">Process</span>
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
                <div className="w-7 h-7 rounded-full bg-[#8DFF00] flex items-center justify-center font-heading font-extrabold text-[12px] text-[#0a0a0a] mb-4">
                  {step.num}
                </div>
                <div className="w-[68px] h-[68px] rounded-[18px] bg-[#f0ffd6] dark:bg-[#f0ffd6]/10 border border-[#8DFF00]/20 flex items-center justify-center mb-5">
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
      <section className="py-20 px-6 bg-zinc-50 dark:bg-card/40 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-heading font-bold text-[13px] text-[#8DFF00] uppercase tracking-widest">Catalog</span>
            <h2 className="font-heading font-black text-[clamp(28px,4vw,42px)] text-foreground mt-2">Shop Our Printing Solutions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 products-grid">
            {categories.map(c => {
                const Icon = c.icon;
                return (
                  <Link key={c.title} href={c.href} className="product-card block bg-card rounded-[16px] overflow-hidden border border-border group">
                    <div className="relative overflow-hidden bg-muted dark:bg-background p-6 flex justify-center items-center h-[160px]">
                        <div className="p-4 rounded-2xl bg-background border border-border text-[#8DFF00] group-hover:scale-110 transition-transform">
                            <Icon size={48} strokeWidth={1.5} />
                        </div>
                        {c.badge && (
                            <div className="absolute top-3 left-3 bg-[#8DFF00] rounded-full px-2.5 py-[3px] font-heading font-bold text-[10px] text-[#0a0a0a]">
                                {c.badge}
                            </div>
                        )}
                    </div>
                    <div className="p-5 bg-card">
                        <h3 className="font-heading font-extrabold text-[16px] text-foreground mb-2 group-hover:text-[#8DFF00] transition-colors">{c.title}</h3>
                        <p className="text-[13px] text-muted-foreground dark:text-muted-foreground leading-[1.55] mb-4 h-[60px] overflow-hidden">{c.description}</p>
                        <div className="inline-flex items-center gap-1.5 font-heading font-bold text-[13px] text-foreground border-b-[1.5px] border-[#8DFF00] pb-[1px]">
                            Browse Products <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                  </Link>
                );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-heading font-bold text-[13px] text-[#8DFF00] uppercase tracking-widest">Benefits</span>
            <h2 className="font-heading font-black text-[clamp(28px,4vw,42px)] text-foreground mt-2">The Bitium Advantage</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 benefits-grid">
            {benefits.map(b => (
              <div key={b.title} className="text-center py-8 px-5 rounded-[16px] border-[1.5px] border-border bg-card transition-all duration-200 hover:border-[#8DFF00] hover:shadow-[0_8px_32px_rgba(141,255,0,0.12)]">
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
      
      {/* Trust Section */}
      <TrustSection />

      {/* Portfolio Section */}
      <section className="py-20 px-6 bg-zinc-50 dark:bg-card/40 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-9">
            <span className="font-heading font-bold text-[13px] text-[#8DFF00] uppercase tracking-widest">Gallery</span>
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
            <button className="ghost-btn inline-flex items-center gap-2 px-8 py-3 rounded-full text-[14px] cursor-pointer">
              View Full Portfolio <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-heading font-bold text-[13px] text-[#8DFF00] uppercase tracking-widest">Reviews</span>
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

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-card/20 border-y border-border overflow-hidden relative">
        {/* Decorative subtle gradient background glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-[#8DFF00] rounded-full opacity-[0.03] blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1.7fr] gap-16 items-start">
            
            {/* Left side: Heading & CTA */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 bg-[#8DFF00]/10 border border-[#8DFF00]/25 rounded-full px-3.5 py-1.5">
                <Sparkles size={12} className="text-[#8DFF00]" />
                <span className="font-heading font-semibold text-[11px] text-[#8DFF00] tracking-wider uppercase">SUPPORT HUB</span>
              </div>
              <h2 className="font-heading font-black text-[clamp(32px,4.5vw,48px)] text-foreground leading-[1.1]">
                Frequently Asked <span className="text-[#8DFF00]">Questions</span>
              </h2>
              <p className="text-[15px] text-muted-foreground leading-[1.65] max-w-md">
                Need help with your design, files, or custom sheets? Find answers to commonly asked questions here, or reach out directly to our printing experts.
              </p>
              <div className="pt-2">
                <Link href="/contact" className="lime-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-[#8DFF00]/10 hover:shadow-[#8DFF00]/25 cursor-pointer">
                  <MessageSquareHeart size={14} /> Contact Support
                </Link>
              </div>
            </div>
            
            {/* Right side: Accordion list */}
            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className={`border border-border rounded-[20px] bg-card/30 dark:bg-[#0f172a]/20 hover:border-[#8DFF00]/40 transition-all duration-300 p-5 cursor-pointer ${
                    openFaq === i ? 'border-[#8DFF00]/40 bg-card/65 dark:bg-[#0f172a]/45 shadow-[0_8px_30px_rgba(141,255,0,0.04)]' : ''
                  }`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <button 
                    className="w-full bg-transparent border-none cursor-pointer flex items-center justify-between gap-4 text-left p-0 focus:outline-none group"
                  >
                    <span className="font-heading font-bold text-[16px] text-foreground group-hover:text-[#8DFF00] transition-colors">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground group-hover:border-[#8DFF00]/40 group-hover:text-[#8DFF00] transition-all duration-300 shrink-0 ${
                      openFaq === i ? 'bg-[#8DFF00] border-[#8DFF00] text-[#0a0a0a] rotate-180' : ''
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
      <section className="py-12 px-6 pb-20 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card dark:bg-[#0a0a0a] rounded-[24px] p-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center overflow-hidden relative border border-border shadow-xl cta-grid">
            {/* Background accent */}
            <div className="absolute -top-[60px] right-[300px] w-[200px] h-[200px] bg-[#8DFF00] rounded-full opacity-[0.08] blur-[40px]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#8DFF00]/15 rounded-full px-3.5 py-1.5 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8DFF00]" />
                <span className="font-heading font-semibold text-[12px] text-[#8DFF00]">Ready to get started?</span>
              </div>
              <h2 className="font-heading font-black text-[clamp(28px,4vw,48px)] text-foreground dark:text-foreground leading-[1.1] mb-4">
                Ready to Print<br />Your Design?
              </h2>
              <p className="text-[16px] text-muted-foreground dark:text-muted-foreground leading-[1.65] mb-8 max-w-[440px]">
                Create your DTF sheet now and see your design come to life before printing. No minimums, 24-hour turnaround.
              </p>
              <Link href="/canvas" className="lime-btn inline-flex items-center gap-[10px] px-8 py-4 rounded-full text-[15px] border-none cursor-pointer">
                Start Your Design Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mockup images */}
            <div className="flex gap-3 items-end relative z-10">
              <img src="https://images.unsplash.com/photo-1601754664414-aa3e4f42e6d4?w=200&h=260&fit=crop&auto=format" alt="Custom printed shirt" className="w-[120px] h-[160px] object-cover rounded-2xl -rotate-6 shadow-lg" />
              <img src="https://images.unsplash.com/photo-1680292783974-a9a336c10366?w=200&h=280&fit=crop&auto=format" alt="Custom hoodie" className="w-[130px] h-[180px] object-cover rounded-2xl shadow-xl z-10" />
              <img src="https://images.unsplash.com/photo-1615397587950-3cbb55f95b77?w=200&h=260&fit=crop&auto=format" alt="White hoodie" className="w-[120px] h-[160px] object-cover rounded-2xl rotate-6 shadow-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8DFF00]"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
