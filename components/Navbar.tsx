'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuth } from '@/lib/context/AuthContext';
import CartDrawer from '@/components/CartDrawer';
import { useTheme } from '@/lib/context/ThemeContext';
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
  PackageCheck
} from 'lucide-react';

export default function Navbar() {
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);
  const { user, profile, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  
  // Desktop Dropdown hover states
  const [stencilHovered, setStencilHovered] = useState(false);
  const [screenPrintingHovered, setScreenPrintingHovered] = useState(false);
  const [dtfPrintingHovered, setDtfPrintingHovered] = useState(false);
  const [batikStampHovered, setBatikStampHovered] = useState(false);

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
    <nav className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-2.5 sm:space-x-3 group relative py-1 hover:opacity-90 transition-opacity">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform">
                <Image
                  src="/images/bitium-logo.jpg"
                  alt="Bitium Technology"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black tracking-wider text-white flex items-center gap-0.5 leading-none">
                  B<span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]">!</span>T<span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]">!</span>UM
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.25em] text-violet-400 uppercase leading-tight mt-0.5 sm:mt-1">
                  Technology
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-5 xl:space-x-6 h-full items-center">
            {/* 01. Home Page */}
            <Link href="/" className="text-xs font-semibold hover:text-violet-400 transition-colors h-full flex items-center text-zinc-300">
              Home
            </Link>

            {/* 02. Stencil Page Dropdown */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setStencilHovered(true)}
              onMouseLeave={() => setStencilHovered(false)}
            >
              <Link href="/stencil" className="text-xs font-semibold hover:text-violet-400 transition-colors flex items-center gap-1 cursor-pointer text-zinc-300">
                <span>Stencil</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${stencilHovered ? 'rotate-180' : ''}`} />
              </Link>
              {stencilHovered && (
                <div className="absolute top-[60px] left-0 w-48 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href="/stencil" className="px-3 py-2 rounded-lg text-[11px] font-bold text-violet-400 hover:bg-zinc-900 transition-colors">
                    All Stencils
                  </Link>
                  <hr className="border-zinc-800 my-0.5" />
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
                      href={`/stencil?sub=${item.sub}`} 
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white"
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
              <Link href="/screen-printing" className="text-xs font-semibold hover:text-violet-400 transition-colors flex items-center gap-1 cursor-pointer text-zinc-300">
                <span>Screen Printing</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${screenPrintingHovered ? 'rotate-180' : ''}`} />
              </Link>
              {screenPrintingHovered && (
                <div className="absolute top-[60px] left-0 w-52 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href="/screen-printing" className="px-3 py-2 rounded-lg text-[11px] font-bold text-violet-400 hover:bg-zinc-900 transition-colors">
                    All Screen Printing
                  </Link>
                  <hr className="border-zinc-800 my-0.5" />
                  {[
                    { sub: 'screen-exposed', label: 'Screen Exposed' },
                    { sub: 'artwork', label: 'Artwork' },
                    { sub: 'tracing-printouts', label: 'Tracing Printouts' },
                    { sub: 'positive-printouts', label: 'Positive Printouts' }
                  ].map((item) => (
                    <Link 
                      key={item.sub} 
                      href={`/screen-printing?sub=${item.sub}`} 
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white"
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
              <Link href="/dtf-printing" className="text-xs font-semibold hover:text-violet-400 transition-colors flex items-center gap-1 cursor-pointer text-zinc-300">
                <span>DTF Printing</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${dtfPrintingHovered ? 'rotate-180' : ''}`} />
              </Link>
              {dtfPrintingHovered && (
                <div className="absolute top-[60px] left-0 w-48 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href="/dtf-printing" className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-violet-400 hover:bg-zinc-900 transition-colors">
                    All DTF Printing
                  </Link>
                  <Link href="/canvas" className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-violet-300 hover:bg-zinc-900 transition-colors flex items-center gap-1">
                    <LayoutGrid size={11} /> Canvas Builder
                  </Link>
                  <Link href="/3d-customizer" className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-fuchsia-400 hover:bg-zinc-900 transition-colors flex items-center gap-1">
                    <Shirt size={11} /> Mockup Studio
                  </Link>
                  <hr className="border-zinc-800 my-0.5" />
                  {[
                    { sub: 'tshirt-design', label: 'T-Shirt Design' },
                    { sub: 'dtf-sticker', label: 'DTF Sticker' },
                    { sub: 'dtf-cloth', label: 'DTF Cloth' }
                  ].map((item) => (
                    <Link 
                      key={item.sub} 
                      href={`/dtf-printing?sub=${item.sub}`} 
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white"
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
              <Link href="/batik-stamp" className="text-xs font-semibold hover:text-violet-400 transition-colors flex items-center gap-1 cursor-pointer text-zinc-300">
                <span>Batik Stamp</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${batikStampHovered ? 'rotate-180' : ''}`} />
              </Link>
              {batikStampHovered && (
                <div className="absolute top-[60px] left-0 w-44 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link 
                    href="/batik-stamp" 
                    className="px-3 py-2 rounded-lg text-[11px] font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white"
                  >
                    Cap Batik
                  </Link>
                </div>
              )}
            </div>

            {/* 06. DTF Printing Consumables */}
            <Link href="/materials" className="text-xs font-semibold hover:text-violet-400 transition-colors h-full flex items-center text-zinc-300">
              DTF Printing Consumables
            </Link>

            {/* 07. Size Guide */}
            <Link href="/size-guide" className="text-xs font-semibold hover:text-violet-400 transition-colors h-full flex items-center text-zinc-300">
              Size Guide
            </Link>

            {/* 08. Contact Us */}
            <Link href="/contact" className="text-xs font-semibold hover:text-violet-400 transition-colors h-full flex items-center text-zinc-300">
              Contact Us
            </Link>
          </div>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Canvas Link */}
            <Link href="/canvas" className="hidden sm:flex text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-600/30 border border-violet-500/50 hover:bg-violet-600/50 text-violet-200 transition-all items-center gap-1">
              <LayoutGrid size={13} />
              Canvas
            </Link>

            {/* 🌙 Light / Dark Mode Toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle light/dark mode"
              className="relative flex items-center justify-center w-12 h-6 sm:w-14 sm:h-7 rounded-full border border-zinc-700 bg-zinc-900 hover:border-violet-500 transition-all duration-300 group overflow-hidden"
            >
              <span className={`absolute inset-0 rounded-full transition-all duration-500 ${
                theme === 'light' ? 'bg-violet-100' : 'bg-zinc-800'
              }`} />
              <span className={`absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-sm flex items-center justify-center transition-all duration-500 ${
                theme === 'light'
                  ? 'translate-x-2.5 sm:translate-x-3.5 bg-violet-500'
                  : '-translate-x-2.5 sm:-translate-x-3.5 bg-zinc-600'
              }`}>
                {theme === 'light'
                  ? <Sun size={10} className="text-white" />
                  : <Moon size={10} className="text-zinc-300" />}
              </span>
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => {
                closeMobileMenu();
                openCart();
              }}
              className="relative p-2 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-violet-600 text-[9px] sm:text-[10px] font-bold text-white ring-2 ring-zinc-950 animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Desktop Auth */}
            {user ? (
              <div className="hidden lg:flex items-center space-x-3">
                <Link href="/profile" className="flex items-center space-x-2 text-sm font-medium hover:text-violet-400 transition-colors">
                  <User size={18} className="text-zinc-400" />
                  <span className="max-w-[100px] truncate">
                    {profile?.full_name || user.email}
                  </span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-full hover:bg-red-950/30 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-all"
              >
                <User size={15} />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-violet-500/50 transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER / BAR */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-zinc-950/95 border-t border-zinc-800 shadow-2xl backdrop-blur-xl max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-3 pb-8 space-y-2">
            
            {/* Quick Canvas & Studio Bar */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Link
                href="/canvas"
                onClick={closeMobileMenu}
                className="p-3 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-200 flex items-center justify-center gap-2 font-bold text-xs hover:bg-violet-600/30 transition-all"
              >
                <LayoutGrid size={15} />
                <span>DTF Canvas</span>
              </Link>
              <Link
                href="/3d-customizer"
                onClick={closeMobileMenu}
                className="p-3 rounded-xl bg-fuchsia-600/20 border border-fuchsia-500/40 text-fuchsia-200 flex items-center justify-center gap-2 font-bold text-xs hover:bg-fuchsia-600/30 transition-all"
              >
                <Shirt size={15} />
                <span>3D Mockup</span>
              </Link>
            </div>

            {/* Navigation Accordion Items */}
            {/* 1. Home */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 text-sm font-bold text-zinc-100"
            >
              <span>Home</span>
              <ChevronRight size={16} className="text-zinc-500" />
            </Link>

            {/* 2. Stencil */}
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-850 overflow-hidden">
              <div
                onClick={() => toggleMobileSub('stencil')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-bold text-zinc-100"
              >
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-violet-400" />
                  <span>Stencil</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-zinc-400 transition-transform duration-200 ${
                    mobileSubOpen === 'stencil' ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileSubOpen === 'stencil' && (
                <div className="px-4 pb-3 space-y-1.5 bg-zinc-950/60 pt-1 border-t border-zinc-850/50">
                  <Link
                    href="/stencil"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-violet-400 bg-violet-500/10"
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
                      href={`/stencil?sub=${item.sub}`}
                      onClick={closeMobileMenu}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Screen Printing */}
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-850 overflow-hidden">
              <div
                onClick={() => toggleMobileSub('screen')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-bold text-zinc-100"
              >
                <div className="flex items-center gap-2">
                  <Printer size={16} className="text-violet-400" />
                  <span>Screen Printing</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-zinc-400 transition-transform duration-200 ${
                    mobileSubOpen === 'screen' ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileSubOpen === 'screen' && (
                <div className="px-4 pb-3 space-y-1.5 bg-zinc-950/60 pt-1 border-t border-zinc-850/50">
                  <Link
                    href="/screen-printing"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-violet-400 bg-violet-500/10"
                  >
                    View All Screen Printing →
                  </Link>
                  {[
                    { sub: 'screen-exposed', label: 'Screen Exposed' },
                    { sub: 'artwork', label: 'Artwork' },
                    { sub: 'tracing-printouts', label: 'Tracing Printouts' },
                    { sub: 'positive-printouts', label: 'Positive Printouts' }
                  ].map((item) => (
                    <Link
                      key={item.sub}
                      href={`/screen-printing?sub=${item.sub}`}
                      onClick={closeMobileMenu}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 4. DTF Printing */}
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-850 overflow-hidden">
              <div
                onClick={() => toggleMobileSub('dtf')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-bold text-zinc-100"
              >
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-violet-400" />
                  <span>DTF Printing</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-zinc-400 transition-transform duration-200 ${
                    mobileSubOpen === 'dtf' ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileSubOpen === 'dtf' && (
                <div className="px-4 pb-3 space-y-1.5 bg-zinc-950/60 pt-1 border-t border-zinc-850/50">
                  <Link
                    href="/dtf-printing"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-violet-400 bg-violet-500/10"
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
                      href={`/dtf-printing?sub=${item.sub}`}
                      onClick={closeMobileMenu}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Batik Stamp */}
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-850 overflow-hidden">
              <div
                onClick={() => toggleMobileSub('batik')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-bold text-zinc-100"
              >
                <div className="flex items-center gap-2">
                  <Stamp size={16} className="text-violet-400" />
                  <span>Batik Stamp</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-zinc-400 transition-transform duration-200 ${
                    mobileSubOpen === 'batik' ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileSubOpen === 'batik' && (
                <div className="px-4 pb-3 space-y-1.5 bg-zinc-950/60 pt-1 border-t border-zinc-850/50">
                  <Link
                    href="/batik-stamp"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-violet-400 bg-violet-500/10"
                  >
                    View All Batik Stamps →
                  </Link>
                </div>
              )}
            </div>

            {/* 6. DTF Printing Consumables */}
            <Link
              href="/materials"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 text-sm font-bold text-zinc-100"
            >
              <div className="flex items-center gap-2">
                <PackageCheck size={16} className="text-violet-400" />
                <span>DTF Printing Consumables</span>
              </div>
              <ChevronRight size={16} className="text-zinc-500" />
            </Link>

            {/* 7. Size Guide */}
            <Link
              href="/size-guide"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 text-sm font-bold text-zinc-100"
            >
              <span>Size Guide</span>
              <ChevronRight size={16} className="text-zinc-500" />
            </Link>

            {/* 8. Contact Us */}
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 text-sm font-bold text-zinc-100"
            >
              <span>Contact Us</span>
              <ChevronRight size={16} className="text-zinc-500" />
            </Link>

            {/* User Auth Footer in Mobile Menu */}
            <div className="pt-4 border-t border-zinc-800 mt-4">
              {user ? (
                <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <Link href="/profile" onClick={closeMobileMenu} className="flex items-center space-x-2 text-sm font-medium text-zinc-200">
                    <User size={18} className="text-violet-400" />
                    <span className="max-w-[150px] truncate">
                      {profile?.full_name || user.email}
                    </span>
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
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center justify-center space-x-2 text-sm font-bold py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20"
                >
                  <User size={16} />
                  <span>Login to Account</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
      <CartDrawer />
    </nav>
  );
}
