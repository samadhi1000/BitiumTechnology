'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuth } from '@/lib/context/AuthContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { 
  ShoppingBag, 
  User, 
  LayoutGrid, 
  LogOut, 
  Shirt, 
  ChevronDown, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Layers, 
  Sparkles, 
  ChevronRight,
  Palette,
  Printer,
  Stamp,
  PackageCheck,
  Download,
  Scissors
} from 'lucide-react';

export default function Navbar() {
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);
  const { user, profile, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [fromAdmin, setFromAdmin] = useState(false);

  // Detect if currently on admin page, or if user navigated here from admin panel.
  useEffect(() => {
    if (pathname === '/admin') {
      setFromAdmin(true);
    } else if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setFromAdmin(params.get('from') === 'admin');
    }
  }, [pathname]);

  const profileHref = fromAdmin ? '/admin' : '/profile';

  // Helper: appends ?from=admin to any URL when user is on or came from admin page.
  const adminLink = (href: string) => {
    if (!fromAdmin) return href;
    const separator = href.includes('?') ? '&' : '?';
    return `${href}${separator}from=admin`;
  };
  
  // Desktop Dropdown hover states
  const [stencilHovered, setStencilHovered] = useState(false);
  const [screenPrintingHovered, setScreenPrintingHovered] = useState(false);
  const [dtfPrintingHovered, setDtfPrintingHovered] = useState(false);
  const [batikStampHovered, setBatikStampHovered] = useState(false);
  const [laserCuttingHovered, setLaserCuttingHovered] = useState(false);
  const [toolkitHovered, setToolkitHovered] = useState(false);

  // Mobile menu open state & mobile accordion states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);

  const toggleMobileSub = (name: string) => {
    setMobileSubOpen((prev) => (prev === name ? null : name));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileSubOpen(null);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Desktop Language Toggle (between Logo and Stencil) */}
          <div className="flex-shrink-0 flex items-center gap-3 xl:gap-4">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-2.5 sm:space-x-3 group relative py-1 hover:opacity-90 transition-opacity">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
                <Image
                  src="/images/bitium-logo.jpg"
                  alt="Bitium Technology"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black tracking-wider text-slate-900 dark:text-white flex items-center gap-0.5 leading-none">
                  B<span className="text-[#ff1a3c] drop-shadow-[0_0_12px_#ff1a3c]">!</span>T<span className="text-[#ff1a3c] drop-shadow-[0_0_12px_#ff1a3c]">!</span>UM
                </span>
                <span className="text-xs sm:text-[13px] font-extrabold tracking-[0.25em] text-slate-900 dark:text-white uppercase leading-tight mt-0.5 sm:mt-1 transition-colors">
                  Technology
                </span>
              </div>
            </Link>

            {/* Language toggle switch placed right between Logo and Stencil tab on Desktop */}
            <div className="hidden lg:flex items-center pl-1">
              <LanguageToggle />
            </div>
          </div>

          {/* Desktop Navigation Links (Tidy & Cleanly Spaced) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3 h-full">
            {/* 02. Stencil Page Dropdown */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setStencilHovered(true)}
              onMouseLeave={() => setStencilHovered(false)}
            >
              <Link href={adminLink('/stencil')} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:text-[#2CFF05] hover:bg-card/50 transition-all flex items-center gap-1 cursor-pointer text-foreground whitespace-nowrap">
                <span>{t.nav.stencil || 'Stencil'}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${stencilHovered ? 'rotate-180' : ''}`} />
              </Link>
              {stencilHovered && (
                <div className="absolute top-[60px] left-0 w-48 rounded-xl border border-border bg-background p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href={adminLink('/stencil')} className="px-3 py-2 rounded-lg text-[11px] font-bold text-primary hover:bg-card transition-colors">
                    All Stencils
                  </Link>
                  <hr className="border-border my-0.5" />
                  {[
                    { sub: 'hand-painting', label: 'Hand Painting' },
                    { sub: 'saree', label: 'Saree' },
                    { sub: 'tote-bags', label: 'Tote Bags' },
                    { sub: 'batik', label: 'Batik' },
                    { sub: 'wall-decoration', label: 'Wall Decoration' },
                    { sub: 'titanium', label: 'Titanium' }
                  ].map((item) => (
                    <Link 
                      key={item.sub} 
                      href={adminLink(`/stencil?sub=${item.sub}`)} 
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-card transition-colors text-foreground hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 03. Screen Printing Dropdown */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setScreenPrintingHovered(true)}
              onMouseLeave={() => setScreenPrintingHovered(false)}
            >
              <Link href={adminLink('/screen-printing')} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:text-[#2CFF05] hover:bg-card/50 transition-all flex items-center gap-1 cursor-pointer text-foreground whitespace-nowrap">
                <span>{t.subNav.screenPrinting}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${screenPrintingHovered ? 'rotate-180' : ''}`} />
              </Link>
              {screenPrintingHovered && (
                <div className="absolute top-[60px] left-0 w-52 rounded-xl border border-border bg-background p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href={adminLink('/screen-printing')} className="px-3 py-2 rounded-lg text-[11px] font-bold text-primary hover:bg-card transition-colors">
                    All Screen Printing
                  </Link>
                  <hr className="border-border my-0.5" />
                  {[
                    { sub: 'screen-exposed', label: 'Screen Exposed' },
                    { sub: 'tracing-printouts', label: 'Tracing Printouts' },
                    { sub: 'positive-printouts', label: 'Positive Printouts' }
                  ].map((item) => (
                    <Link 
                      key={item.sub} 
                      href={adminLink(`/screen-printing?sub=${item.sub}`)} 
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-card transition-colors text-foreground hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 04. DTF Printing Dropdown */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setDtfPrintingHovered(true)}
              onMouseLeave={() => setDtfPrintingHovered(false)}
            >
              <Link href={adminLink('/dtf-printing')} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:text-[#2CFF05] hover:bg-card/50 transition-all flex items-center gap-1 cursor-pointer text-foreground whitespace-nowrap">
                <span>{t.subNav.dtfPrinting}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${dtfPrintingHovered ? 'rotate-180' : ''}`} />
              </Link>
              {dtfPrintingHovered && (
                <div className="absolute top-[60px] left-0 w-48 rounded-xl border border-border bg-background p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href={adminLink('/dtf-printing')} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-primary hover:bg-card transition-colors">
                    All DTF Printing
                  </Link>
                  <hr className="border-border my-0.5" />
                  {[
                    { sub: 'tshirt-design', label: 'T-Shirt Design' },
                    { sub: 'dtf-sticker', label: 'DTF Sticker' },
                    { sub: 'dtf-cloth', label: 'DTF Cloth' }
                  ].map((item) => (
                    <Link 
                      key={item.sub} 
                      href={adminLink(`/dtf-printing?sub=${item.sub}`)} 
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-card transition-colors text-foreground hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 05. Batik Stamp Dropdown */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setBatikStampHovered(true)}
              onMouseLeave={() => setBatikStampHovered(false)}
            >
              <Link href={adminLink('/batik-stamp')} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:text-[#2CFF05] hover:bg-card/50 transition-all flex items-center gap-1 cursor-pointer text-foreground whitespace-nowrap">
                <span>{t.nav.batikStamp || 'Batik Stamp'}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${batikStampHovered ? 'rotate-180' : ''}`} />
              </Link>
              {batikStampHovered && (
                <div className="absolute top-[60px] left-0 w-44 rounded-xl border border-border bg-background p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link 
                    href={adminLink('/batik-stamp')} 
                    className="px-3 py-2 rounded-lg text-[11px] font-semibold hover:bg-card transition-colors text-foreground hover:text-foreground"
                  >
                    Cap Batik
                  </Link>
                </div>
              )}
            </div>

            {/* 06. Laser Cutting Dropdown */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setLaserCuttingHovered(true)}
              onMouseLeave={() => setLaserCuttingHovered(false)}
            >
              <Link href={adminLink('/laser-cutting')} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:text-[#2CFF05] hover:bg-card/50 transition-all flex items-center gap-1 cursor-pointer text-foreground whitespace-nowrap">
                <span>{t.subNav.laserCutting}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${laserCuttingHovered ? 'rotate-180' : ''}`} />
              </Link>
              {laserCuttingHovered && (
                <div className="absolute top-[60px] left-0 w-48 rounded-xl border border-border bg-background p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href={adminLink('/laser-cutting')} className="px-3 py-2 rounded-lg text-[11px] font-bold text-primary hover:bg-card transition-colors">
                    All Laser Cutting
                  </Link>
                  <hr className="border-border my-0.5" />
                  {[
                    { sub: 'acrylic', label: 'Acrylic Cut & Engrave' },
                    { sub: 'wood', label: 'Wood Engraving' },
                    { sub: 'custom-profile', label: 'Custom Profiles' }
                  ].map((item) => (
                    <Link 
                      key={item.sub} 
                      href={adminLink(`/laser-cutting?sub=${item.sub}`)} 
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-card transition-colors text-foreground hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Toolkit Dropdown */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setToolkitHovered(true)}
              onMouseLeave={() => setToolkitHovered(false)}
            >
              <span className="px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:text-[#2CFF05] hover:bg-card/50 transition-all flex items-center gap-1 cursor-pointer text-foreground whitespace-nowrap">
                <span>{t.nav.toolkit || 'Toolkit'}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${toolkitHovered ? 'rotate-180' : ''}`} />
              </span>
              {toolkitHovered && (
                <div className="absolute top-[60px] left-0 w-56 rounded-xl border border-border bg-background p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href={adminLink('/3d-customizer')} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#2CFF05] hover:bg-card transition-colors flex items-center gap-1">
                    <Shirt size={11} /> {t.subNav.mockupStudio}
                  </Link>
                  <Link href={adminLink('/canvas')} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#45ff24] hover:bg-card transition-colors flex items-center gap-1">
                    <LayoutGrid size={11} /> {t.subNav.canvasBuilder}
                  </Link>
                  <Link href={adminLink('/size-guide')} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-400 hover:bg-card transition-colors flex items-center gap-1">
                    <Layers size={11} /> {t.subNav.sizeGuide}
                  </Link>
                </div>
              )}
            </div>

            {/* 07. Digital downloads */}
            <Link href={adminLink('/downloads')} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:text-[#2CFF05] hover:bg-card/50 transition-all text-foreground whitespace-nowrap">
              {t.nav.downloads || 'Downloads'}
            </Link>

            {/* 08. Materials / Consumables */}
            <Link href={adminLink('/materials')} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:text-[#2CFF05] hover:bg-card/50 transition-all text-foreground whitespace-nowrap">
              {t.nav.materials || 'Materials / Consumables'}
            </Link>
          </div>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* 🌙 Light / Dark Mode Toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle light/dark mode"
              className="relative flex items-center justify-center w-12 h-6 sm:w-14 sm:h-7 rounded-full border border-zinc-700 bg-card hover:border-[#2CFF05] transition-all duration-300 group overflow-hidden"
            >
              <span className={`absolute inset-0 rounded-full transition-all duration-500 ${
                theme === 'light' ? 'bg-[#2CFF05]/10' : 'bg-muted'
              }`} />
              <span className={`absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-sm flex items-center justify-center transition-all duration-500 ${
                theme === 'light'
                  ? 'translate-x-2.5 sm:translate-x-3.5 bg-[#45ff24]'
                  : '-translate-x-2.5 sm:-translate-x-3.5 bg-zinc-600'
              }`}>
                {theme === 'light'
                  ? <Sun size={10} className="text-foreground" />
                  : <Moon size={10} className="text-foreground" />}
              </span>
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => {
                closeMobileMenu();
                openCart();
              }}
              className="relative p-2 rounded-full hover:bg-muted text-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#2CFF05] text-[9px] sm:text-[10px] font-bold text-[#0a0a0a] ring-2 ring-zinc-950 animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Desktop Auth */}
            {user && (
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  href={profileHref}
                  title={fromAdmin ? 'Back to Admin Panel' : 'Profile'}
                  className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <User size={18} className={fromAdmin ? 'text-[#2CFF05]' : 'text-muted-foreground'} />
                  <span className="max-w-[100px] truncate">
                    {profile?.full_name || user.email}
                  </span>
                  {fromAdmin && (
                    <span className="text-[10px] font-bold text-[#2CFF05] bg-[#2CFF05]/10 border border-[#2CFF05]/30 px-1.5 py-0.5 rounded-full leading-none">
                      ADMIN
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-full hover:bg-red-950/30 text-muted-foreground hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-card border border-border text-foreground hover:text-foreground hover:border-[#2CFF05]/50 transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER / BAR */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-background/95 border-t border-border shadow-2xl backdrop-blur-xl max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-3 pb-8 space-y-2">
            
            {/* Mobile Language Switcher Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border mb-3">
              <span className="text-xs font-bold text-foreground">Language / භාෂාව</span>
              <LanguageToggle />
            </div>

            {/* Quick Studio Bar */}
            <div className="mb-4">
              <Link
                href="/3d-customizer"
                onClick={closeMobileMenu}
                className="w-full p-3 rounded-xl bg-[#2CFF05]/20 border border-[#2CFF05]/40 text-[#2CFF05] flex items-center justify-center gap-2 font-bold text-xs hover:bg-[#2CFF05]/30 transition-all"
              >
                <Shirt size={15} />
                <span>3D Mockup</span>
              </Link>
            </div>

            {/* Navigation Accordion Items */}
            {/* 2. Stencil */}
            <div className="rounded-xl bg-card/50 border border-border overflow-hidden">
              <div
                onClick={() => toggleMobileSub('stencil')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-bold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-primary" />
                  <span>{t.nav.stencil || 'Stencil'}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    mobileSubOpen === 'stencil' ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileSubOpen === 'stencil' && (
                <div className="px-4 pb-3 space-y-1.5 bg-background/60 pt-1 border-t border-border/50">
                  <Link
                    href={adminLink('/stencil')}
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-primary bg-[#45ff24]/10"
                  >
                    View All Stencils →
                  </Link>
                  {[
                    { sub: 'hand-painting', label: 'Hand Painting' },
                    { sub: 'saree', label: 'Saree' },
                    { sub: 'tote-bags', label: 'Tote Bags' },
                    { sub: 'batik', label: 'Batik' },
                    { sub: 'wall-decoration', label: 'Wall Decoration' },
                    { sub: 'titanium', label: 'Titanium' }
                  ].map((item) => (
                    <Link
                      key={item.sub}
                      href={adminLink(`/stencil?sub=${item.sub}`)}
                      onClick={closeMobileMenu}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-card hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Screen Printing */}
            <div className="rounded-xl bg-card/50 border border-border overflow-hidden">
              <div
                onClick={() => toggleMobileSub('screen')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-bold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Printer size={16} className="text-primary" />
                  <span>{t.subNav.screenPrinting}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    mobileSubOpen === 'screen' ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileSubOpen === 'screen' && (
                <div className="px-4 pb-3 space-y-1.5 bg-background/60 pt-1 border-t border-border/50">
                  <Link
                    href={adminLink('/screen-printing')}
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-primary bg-[#45ff24]/10"
                  >
                    View All Screen Printing →
                  </Link>
                  {[
                    { sub: 'screen-exposed', label: 'Screen Exposed' },
                    { sub: 'tracing-printouts', label: 'Tracing Printouts' },
                    { sub: 'positive-printouts', label: 'Positive Printouts' }
                  ].map((item) => (
                    <Link
                      key={item.sub}
                      href={adminLink(`/screen-printing?sub=${item.sub}`)}
                      onClick={closeMobileMenu}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-card hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 4. DTF Printing */}
            <div className="rounded-xl bg-card/50 border border-border overflow-hidden">
              <div
                onClick={() => toggleMobileSub('dtf')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-bold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-primary" />
                  <span>{t.subNav.dtfPrinting}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    mobileSubOpen === 'dtf' ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileSubOpen === 'dtf' && (
                <div className="px-4 pb-3 space-y-1.5 bg-background/60 pt-1 border-t border-border/50">
                  <Link
                    href={adminLink('/dtf-printing')}
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-primary bg-[#45ff24]/10"
                  >
                    View All DTF Printing →
                  </Link>
                  {[
                    { sub: 'tshirt-design', label: 'T-Shirt Design' },
                    { sub: 'dtf-sticker', label: 'DTF Sticker' },
                    { sub: 'dtf-cloth', label: 'DTF Cloth' }
                  ].map((item) => (
                    <Link
                      key={item.sub}
                      href={adminLink(`/dtf-printing?sub=${item.sub}`)}
                      onClick={closeMobileMenu}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-card hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Batik Stamp */}
            <div className="rounded-xl bg-card/50 border border-border overflow-hidden">
              <div
                onClick={() => toggleMobileSub('batik')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-bold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Stamp size={16} className="text-primary" />
                  <span>{t.nav.batikStamp || 'Batik Stamp'}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    mobileSubOpen === 'batik' ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileSubOpen === 'batik' && (
                <div className="px-4 pb-3 space-y-1.5 bg-background/60 pt-1 border-t border-border/50">
                  <Link
                    href={adminLink('/batik-stamp')}
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-primary bg-[#45ff24]/10"
                  >
                    View All Batik Stamps →
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Laser Cutting */}
            <div className="rounded-xl bg-card/50 border border-border overflow-hidden">
              <div
                onClick={() => toggleMobileSub('laser')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-bold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Scissors size={16} className="text-primary" />
                  <span>{t.subNav.laserCutting}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    mobileSubOpen === 'laser' ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileSubOpen === 'laser' && (
                <div className="px-4 pb-3 space-y-1.5 bg-background/60 pt-1 border-t border-border/50">
                  <Link
                    href={adminLink('/laser-cutting')}
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-primary bg-[#45ff24]/10"
                  >
                    View All Laser Cutting →
                  </Link>
                  {[
                    { sub: 'acrylic', label: 'Acrylic Cut & Engrave' },
                    { sub: 'wood', label: 'Wood Engraving' },
                    { sub: 'custom-profile', label: 'Custom Profiles' }
                  ].map((item) => (
                    <Link
                      key={item.sub}
                      href={adminLink(`/laser-cutting?sub=${item.sub}`)}
                      onClick={closeMobileMenu}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-card hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Toolkit Accordion */}
            <div className="rounded-xl bg-card/50 border border-border overflow-hidden">
              <div
                onClick={() => toggleMobileSub('toolkit')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-bold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  <span>{t.nav.toolkit || 'Toolkit'}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    mobileSubOpen === 'toolkit' ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileSubOpen === 'toolkit' && (
                <div className="px-4 pb-3 space-y-1.5 bg-background/60 pt-1 border-t border-border/50">
                  <Link
                    href={adminLink('/3d-customizer')}
                    onClick={closeMobileMenu}
                    className="block px-3 py-1.5 rounded-lg text-xs font-semibold text-[#45ff24] hover:bg-card hover:text-foreground"
                  >
                    {t.subNav.mockupStudio}
                  </Link>
                  <Link
                    href={adminLink('/canvas')}
                    onClick={closeMobileMenu}
                    className="block px-3 py-1.5 rounded-lg text-xs font-semibold text-[#45ff24] hover:bg-card hover:text-foreground"
                  >
                    {t.subNav.canvasBuilder}
                  </Link>
                  <Link
                    href={adminLink('/size-guide')}
                    onClick={closeMobileMenu}
                    className="block px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:bg-card hover:text-foreground"
                  >
                    {t.subNav.sizeGuide}
                  </Link>
                </div>
              )}
            </div>

            {/* 06. Digital downloads */}
            <Link
              href={adminLink('/downloads')}
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-card/50 hover:bg-card border border-border text-sm font-bold text-foreground"
            >
              <div className="flex items-center gap-2">
                <Download size={16} className="text-primary" />
                <span>{t.nav.downloads || 'Digital downloads'}</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>

            {/* 6. Materials / Consumables */}
            <Link
              href={adminLink('/materials')}
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-card/50 hover:bg-card border border-border text-sm font-bold text-foreground"
            >
              <div className="flex items-center gap-2">
                <PackageCheck size={16} className="text-primary" />
                <span>{t.nav.materials || 'Materials / Consumables'}</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>

            {/* User Auth Footer in Mobile Menu */}
            {user && (
              <div className="pt-4 border-t border-border mt-4">
                <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border">
                  <Link
                    href={profileHref}
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 text-sm font-medium text-foreground"
                  >
                    <User size={18} className={fromAdmin ? 'text-[#2CFF05]' : 'text-primary'} />
                    <span className="max-w-[150px] truncate">
                      {profile?.full_name || user.email}
                    </span>
                    {fromAdmin && (
                      <span className="text-[10px] font-bold text-[#2CFF05] bg-[#2CFF05]/10 border border-[#2CFF05]/30 px-1.5 py-0.5 rounded-full leading-none">
                        ADMIN
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/50 transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}
