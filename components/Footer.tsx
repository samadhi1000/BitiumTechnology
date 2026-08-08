"use client";

import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Stencil", href: "/stencil" },
    { label: "Screen Printing", href: "/screen-printing" },
    { label: "DTF Printing", href: "/dtf-printing" },
    { label: "Batik Stamp", href: "/batik-stamp" },
    { label: "Laser Cutting", href: "/laser-cutting" },
  ],
  toolkit: [
    { label: "Online Order Form (A6)", href: "/order-form" },
    { label: "Blog & Master Guides", href: "/blog" },
    { label: "Digital downloads", href: "/downloads" },
    { label: "Materials / Consumables", href: "/materials" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.41-.43-.61-.65-.02 4.11.01 8.22-.02 12.33-.18 2.44-1.46 4.88-3.76 5.75-2.28.87-4.96.48-6.84-1.01-2.02-1.61-2.88-4.38-2.12-6.89.6-1.93 2.13-3.61 4.14-4.14 1.25-.33 2.59-.14 3.73.43V4.07c-1.95-.59-3.75-1.9-4.73-3.66C7.5.39 7.4.37 7.3.35v11.23c-1.3-.9-3.05-1.12-4.52-.53-1.61.64-2.8 2.21-3.05 3.93-.3 2.05.61 4.22 2.29 5.27 1.68 1.05 3.96.93 5.48-.3 1.25-1.02 1.83-2.65 1.78-4.24.03-5.23-.01-10.46.02-15.69z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-[#0F172A] text-white" role="contentinfo">
      {/* Main Columns */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Logo / Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex flex-col items-start space-y-1">
              <span className="text-2xl font-black tracking-wider text-[#8DFF00] font-heading">
                Bitium Technology
              </span>
              <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
                Premium Custom Printing & Laser Studio
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs" style={{ fontFamily: "var(--font-body)" }}>
              Sri Lanka's leading custom printing partner. Saturated DTF transfers, stencils, and custom apparel prints delivered in 24 hours.
            </p>
          </div>

          {/* Links: Services */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--font-body)" }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Toolkit */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Toolkit
            </h4>
            <ul className="space-y-3">
              {footerLinks.toolkit.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--font-body)" }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Contact & Socials */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Contact info
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:indrajith105@gmail.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--font-body)" }}>
                  <Mail className="w-4 h-4" />
                  indrajith105@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+94715520897" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--font-body)" }}>
                  <Phone className="w-4 h-4" />
                  +94 71 552 0897 (Mobile)
                </a>
              </li>
              <li>
                <a href="https://wa.me/94779731097" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--font-body)" }}>
                  <Phone className="w-4 h-4" />
                  +94 77 973 1097 (WhatsApp)
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  1391/1 New Town Digana Rajawella, <br />
                  Digana, Sri Lanka, 20180
                </span>
              </li>
            </ul>

            {/* Social Buttons */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: TiktokIcon, label: "Tiktok", href: "https://www.tiktok.com/@Raid07072" },
                { icon: FacebookIcon, label: "Facebook", href: "https://web.facebook.com/bitiumtechnology" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Bottom Credits */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-400" style={{ fontFamily: "var(--font-body)" }}>
            © {new Date().getFullYear()} Bitium Technology. All rights reserved.
          </p>
          
          {/* Animated Agency Logo - Powered By Stack Unleash */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                Powered By -
              </span>
              <a href="https://stackunleash.com" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                {/* Metallic Shine Masked Container */}
                <div className="transition-transform duration-300 group-hover:scale-105 flex-shrink-0 logo-shine-container mr-1.5">
                  <img
                    src="/images/stack-unleash-logo.png"
                    alt="StackUnleash Icon"
                    className="h-[28px] w-auto object-contain logo-fire-glow"
                  />
                </div>
                
                {/* Text Logo with gradients & sweeps */}
                <div className="flex flex-col items-start justify-center">
                  <div className="flex items-center leading-none">
                    <span
                      className="font-black text-[12px] tracking-wider leading-none orange-gradient-text mr-0.5"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      STACK
                    </span>
                    <span
                      className="font-black text-[12px] tracking-wider leading-none gradient-text"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      UNLEASH
                    </span>
                  </div>
                  {/* Tagline */}
                  <div
                    className="w-full flex justify-between text-[4px] font-black uppercase mt-0.5 shine-text"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span>BUILD</span>
                    <span>&bull;</span>
                    <span>AUTOMATE</span>
                    <span>&bull;</span>
                    <span>SCALE</span>
                  </div>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-6 border-l border-white/[0.08] pl-6">
              {footerLinks.legal.map((link) => (
                <a key={link.label} href={link.href} className="text-xs text-slate-400 hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--font-body)" }}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
