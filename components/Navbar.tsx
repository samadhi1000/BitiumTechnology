'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuth } from '@/lib/context/AuthContext';
import { ShoppingBag, User, LayoutGrid, LogOut, Shirt } from 'lucide-react';

export default function Navbar() {
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const { user, profile, signOut } = useAuth();

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
              <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground border-l border-zinc-700 pl-2">
                powered by Bitium
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Apparel Catalog
            </Link>
            <Link href="/canvas" className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
              <LayoutGrid size={16} />
              DTF Sheet Builder
            </Link>
            <Link href="/3d-customizer" className="text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors flex items-center gap-1">
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
