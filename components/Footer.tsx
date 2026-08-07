import React from 'react';
import Link from 'next/link';
import PoweredBy from './PoweredBy';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-border/50 pb-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5">
            <span className="text-xl font-black tracking-wider text-[#8DFF00] font-heading">
              Bitium Technology
            </span>
            <span className="text-xs text-muted-foreground">
              Premium Custom Printing & Laser Studio
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground">
            <Link href="/" className="hover:text-[#8DFF00] transition-colors">
              Apparel Catalog
            </Link>
            <Link href="/canvas" className="hover:text-[#8DFF00] transition-colors">
              DTF Sheet Builder
            </Link>
            <Link href="/about" className="hover:text-[#8DFF00] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-[#8DFF00] transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Socials & Copyright */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/bitiumtechnology"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8DFF00] hover:scale-110 transition-all flex items-center justify-center"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/bitiumtechnology"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8DFF00] hover:scale-110 transition-all flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@bitiumtechnology"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8DFF00] hover:scale-110 transition-all flex items-center justify-center"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/bitiumtechnology"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8DFF00] hover:scale-110 transition-all flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <span className="text-[10px] text-muted-foreground">
              &copy; {new Date().getFullYear()} Bitium Technology. All rights reserved.
            </span>
          </div>
        </div>

        {/* Animated Agency Logo */}
        <div className="mt-8 flex justify-center">
          <PoweredBy theme="brand" />
        </div>
      </div>
    </footer>
  );
}
