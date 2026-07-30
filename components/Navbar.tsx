'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuth } from '@/lib/context/AuthContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { ShoppingBag, User, LayoutGrid, LogOut, Shirt, ChevronDown, Sun, Moon } from 'lucide-react';
import BitiumLogo from './BitiumLogo';

export default function Navbar() {
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const { user, profile, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  
  // Dropdown hover states
  const [stencilHovered, setStencilHovered] = useState(false);
  const [screenPrintingHovered, setScreenPrintingHovered] = useState(false);
  const [dtfPrintingHovered, setDtfPrintingHovered] = useState(false);
  const [batikStampHovered, setBatikStampHovered] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group relative px-1 py-1 hover:opacity-80 transition-opacity">
              <div className="origin-left" style={{ transform: 'scale(1.65)' }}>
                <BitiumLogo scale={0.28} withParticles={false} />
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex space-x-6 h-full items-center">
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
              <button className="text-xs font-semibold hover:text-violet-400 transition-colors flex items-center gap-1 cursor-pointer text-zinc-300">
                <span>Stencil</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${stencilHovered ? 'rotate-180' : ''}`} />
              </button>
              {stencilHovered && (
                <div className="absolute top-[60px] left-0 w-44 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href="/?category=stencil#catalog" className="px-3 py-2 rounded-lg text-[11px] font-bold text-violet-400 hover:bg-zinc-900 transition-colors">
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
                      href={`/?category=stencil&sub=${item.sub}#catalog`} 
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
              <button className="text-xs font-semibold hover:text-violet-400 transition-colors flex items-center gap-1 cursor-pointer text-zinc-300">
                <span>Screen Printing</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${screenPrintingHovered ? 'rotate-180' : ''}`} />
              </button>
              {screenPrintingHovered && (
                <div className="absolute top-[60px] left-0 w-48 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href="/?category=screen-printing#catalog" className="px-3 py-2 rounded-lg text-[11px] font-bold text-violet-400 hover:bg-zinc-900 transition-colors">
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
                      href={`/?category=screen-printing&sub=${item.sub}#catalog`} 
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
              <button className="text-xs font-semibold hover:text-violet-400 transition-colors flex items-center gap-1 cursor-pointer text-zinc-300">
                <span>DTF Printing</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${dtfPrintingHovered ? 'rotate-180' : ''}`} />
              </button>
              {dtfPrintingHovered && (
                <div className="absolute top-[60px] left-0 w-44 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href="/canvas" className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-violet-400 hover:bg-zinc-900 transition-colors flex items-center gap-1">
                    <LayoutGrid size={11} /> Canvas Builder
                  </Link>
                  <Link href="/3d-customizer" className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-fuchsia-400 hover:bg-zinc-900 transition-colors flex items-center gap-1">
                    <Shirt size={11} /> Mockup Studio
                  </Link>
                  <hr className="border-zinc-800 my-0.5" />
                  {[
                    { sub: 'tshirt-design', label: 'T Shirt Design' },
                    { sub: 'dtf-sticker', label: 'DTF Sticker' },
                    { sub: 'dtf-cloth', label: 'DTF Cloth' }
                  ].map((item) => (
                    <Link 
                      key={item.sub} 
                      href={`/?category=dtf_sheet&sub=${item.sub}#catalog`} 
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
              <button className="text-xs font-semibold hover:text-violet-400 transition-colors flex items-center gap-1 cursor-pointer text-zinc-300">
                <span>Batik Stamp</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${batikStampHovered ? 'rotate-180' : ''}`} />
              </button>
              {batikStampHovered && (
                <div className="absolute top-[60px] left-0 w-40 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link 
                    href="/?category=batik-stamp&sub=cap-batik#catalog" 
                    className="px-3 py-2 rounded-lg text-[11px] font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white"
                  >
                    Cap Batik
                  </Link>
                </div>
              )}
            </div>

            {/* 06. Printing Materials & Ink */}
            <Link href="/?category=materials#catalog" className="text-xs font-semibold hover:text-violet-400 transition-colors h-full flex items-center text-zinc-300">
              Materials & Ink
            </Link>

            {/* 07. Contact Us */}
            <Link href="/contact" className="text-xs font-semibold hover:text-violet-400 transition-colors h-full flex items-center text-zinc-300">
              Contact Us
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Link href="/canvas" className="md:hidden text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-600/30 border border-violet-500/50 hover:bg-violet-600/50 text-violet-200 transition-all flex items-center gap-1">
              <LayoutGrid size={14} />
              Canvas
            </Link>

            {/* 🌙 Light / Dark Mode Toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle light/dark mode"
              className="relative flex items-center justify-center w-14 h-7 rounded-full border border-zinc-700 bg-zinc-900 hover:border-violet-500 transition-all duration-300 group overflow-hidden"
            >
              {/* Track fill */}
              <span className={`absolute inset-0 rounded-full transition-all duration-500 ${
                theme === 'light' ? 'bg-violet-100' : 'bg-zinc-800'
              }`} />
              {/* Thumb */}
              <span className={`absolute w-5 h-5 rounded-full shadow-sm flex items-center justify-center transition-all duration-500 ${
                theme === 'light'
                  ? 'translate-x-3.5 bg-violet-500'
                  : '-translate-x-3.5 bg-zinc-600'
              }`}>
                {theme === 'light'
                  ? <Sun size={10} className="text-white" />
                  : <Moon size={10} className="text-zinc-300" />}
              </span>
            </button>

            <Link href="/cart" className="relative p-2 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white ring-2 ring-zinc-950 animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors">
                  <User size={18} className="text-zinc-400" />
                  <span className="hidden sm:inline-block max-w-[120px] truncate">
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
                className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-all"
              >
                <User size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
