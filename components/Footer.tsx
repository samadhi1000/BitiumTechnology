import React from 'react';
import Link from 'next/link';
import PoweredBy from './PoweredBy';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg font-bold tracking-tight text-[#8DFF00]">
              Bitium Technology
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Premium Custom Printing Studio
            </span>
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Apparel Catalog
            </Link>
            <Link href="/canvas" className="hover:text-foreground transition-colors">
              DTF Sheet Builder
            </Link>
            <Link href="/cart" className="hover:text-foreground transition-colors">
              Cart
            </Link>
          </div>
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Bitium Technology. All rights reserved.
          </div>
        </div>
        
        {/* Animated Agency Logo */}
        <div className="mt-8 pt-6 border-t border-border/50 flex justify-center">
          <PoweredBy theme="brand" />
        </div>
      </div>
    </footer>
  );
}
