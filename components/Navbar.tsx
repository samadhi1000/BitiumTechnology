'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuth } from '@/lib/context/AuthContext';
import { ShoppingBag, User, LayoutGrid, LogOut, Shirt, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const { user, profile, signOut } = useAuth();
  
  // Dropdown hover states
  const [apparelHovered, setApparelHovered] = useState(false);
  const [dtfHovered, setDtfHovered] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                PrintGrid
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold text-zinc-500 border-l border-zinc-700 pl-2">
                powered by Bitium
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 h-full items-center">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors h-full flex items-center">
              Home
            </Link>

            {/* Dropdown: T-Shirt Collection */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setApparelHovered(true)}
              onMouseLeave={() => setApparelHovered(false)}
            >
              <button className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                <span>T-Shirt Collection</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${apparelHovered ? 'rotate-180' : ''}`} />
              </button>
              
              {apparelHovered && (
                <div className="absolute top-[60px] left-0 w-48 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href="/?category=apparel" className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white">
                    All Collection
                  </Link>
                  <Link href="/?category=apparel&sub=anime" className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white">
                    Anime Oversized Tees
                  </Link>
                  <Link href="/?category=apparel&sub=black" className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white">
                    Black Blanks
                  </Link>
                  <Link href="/?category=apparel&sub=white" className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white">
                    White Blanks
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown: DTF Print Sheet */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setDtfHovered(true)}
              onMouseLeave={() => setDtfHovered(false)}
            >
              <button className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                <span>DTF Print Sheets</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${dtfHovered ? 'rotate-180' : ''}`} />
              </button>

              {dtfHovered && (
                <div className="absolute top-[60px] left-0 w-52 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl animate-fade-in flex flex-col gap-1 z-50">
                  <Link href="/canvas" className="px-3 py-2 rounded-lg text-xs font-bold text-violet-400 hover:bg-zinc-900 transition-colors flex items-center gap-1.5">
                    <LayoutGrid size={12} /> Live Canvas Builder
                  </Link>
                  <hr className="border-zinc-800 my-1" />
                  <Link href="/?category=dtf_sheet&sub=12x23" className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white">
                    12" x 23" Sheet
                  </Link>
                  <Link href="/?category=dtf_sheet&sub=12x12" className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white">
                    12" x 12" Sheet
                  </Link>
                  <Link href="/?category=dtf_sheet&sub=cute-girls" className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white">
                    Cute Girls Packs
                  </Link>
                  <Link href="/?category=dtf_sheet&sub=23x60" className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white">
                    23" x 60" (5 Feet Roll)
                  </Link>
                  <Link href="/?category=dtf_sheet&sub=saree-border" className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-white">
                    Saree Borders
                  </Link>
                </div>
              )}
            </div>

            <Link href="/3d-customizer" className="text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors flex items-center gap-1 h-full">
              <Shirt size={16} />
              3D Customizer
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/canvas" className="md:hidden text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-600/30 border border-violet-500/50 hover:bg-violet-600/50 text-violet-200 transition-all flex items-center gap-1">
              <LayoutGrid size={14} />
              Canvas
            </Link>

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
