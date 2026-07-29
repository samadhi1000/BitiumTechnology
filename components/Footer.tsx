import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              PrintGrid
            </span>
            <span className="text-xs text-zinc-500 mt-1">
              powered by Bitium Technology
            </span>
          </div>
          <div className="flex space-x-6 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              Apparel Catalog
            </Link>
            <Link href="/canvas" className="hover:text-white transition-colors">
              DTF Sheet Builder
            </Link>
            <Link href="/cart" className="hover:text-white transition-colors">
              Cart
            </Link>
          </div>
          <div className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} PrintGrid. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
