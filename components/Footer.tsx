"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
  const { t } = useLanguage();
  const f = t.footer;

  const servicesLinks = [
    { label: f?.stencil || "Stencil", href: "/stencil" },
    { label: f?.screenPrinting || "Screen Printing", href: "/screen-printing" },
    { label: f?.dtfPrinting || "DTF Printing", href: "/dtf-printing" },
    { label: f?.batikStamp || "Batik Stamp", href: "/batik-stamp" },
    { label: f?.laserCutting || "Laser Cutting", href: "/laser-cutting" },
    { label: f?.materials || "Materials / Consumables", href: "/materials" },
    { label: t.subNav?.productCatalog || "Product Catalog", href: "/product-catalog" },
  ];

  const toolsLinks = [
    { label: f?.customizer3D || "3D Mockup Studio", href: "/3d-customizer", highlight: true },
    { label: f?.gangSheetCanvas || "DTF Gang Sheet Canvas", href: "/canvas", highlight: true },
    { label: f?.sizeGuide || "Apparel Size Guide", href: "/size-guide" },
    { label: f?.orderForm || "Quick Order Form", href: "/order-form" },
    { label: f?.downloads || "Digital downloads", href: "/downloads" },
  ];

  const communityLinks = [
    { label: f?.blog || "Blog & Master Guides", href: "/blog" },
    { label: f?.community || "Community Hub", href: "/community" },
    { label: f?.about || "About Us", href: "/about" },
    { label: f?.contact || "Contact Us", href: "/contact" },
  ];

  const legalLinks = [
    { label: f?.privacy || "Privacy Policy", href: "/privacy" },
    { label: f?.terms || "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="relative border-t border-border bg-[#0F172A] text-white" role="contentinfo">
      {/* Main Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* 1. Logo / Brand Column */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 space-y-3">
            <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group relative py-0.5 hover:opacity-90 transition-opacity">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_15px_rgba(255,26,60,0.25)] group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/images/bitium-logo.webp"
                  alt="Bitium Technology"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-white flex items-center gap-0.5 leading-none font-heading">
                  B<span className="text-[#ff1a3c] drop-shadow-[0_0_12px_#ff1a3c]">!</span>T<span className="text-[#ff1a3c] drop-shadow-[0_0_12px_#ff1a3c]">!</span>UM
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] text-white uppercase leading-tight mt-0.5">
                  Technology
                </span>
              </div>
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs" style={{ fontFamily: "var(--font-body)" }}>
              {f?.brandDesc || "Sri Lanka's leading custom printing partner. Saturated DTF transfers, stencils, and custom apparel prints delivered in 24 hours."}
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[#2CFF05] text-[10px] font-bold tracking-wider uppercase">
                <Sparkles size={11} /> 24-Hour Turnaround
              </span>
            </div>
          </div>

          {/* 2. Links: Services & Catalogs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {f?.servicesTitle || "Services"}
            </h4>
            <ul className="space-y-2">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-slate-400 hover:text-[#2CFF05] hover:translate-x-0.5 transition-all duration-200 inline-block" style={{ fontFamily: "var(--font-body)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Links: Interactive Tools & Studios (NEW DEDICATED COLUMN) */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2CFF05]"></span>
              {f?.toolsTitle || "Interactive Tools"}
            </h4>
            <ul className="space-y-2">
              {toolsLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-slate-400 hover:text-[#2CFF05] hover:translate-x-0.5 transition-all duration-200 inline-flex items-center gap-1.5" style={{ fontFamily: "var(--font-body)" }}>
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#2CFF05]/15 text-[#2CFF05] border border-[#2CFF05]/30">
                        Pro
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Links: Community & Guides */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              {f?.toolkitTitle || "Community & Guides"}
            </h4>
            <ul className="space-y-2">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-slate-400 hover:text-[#2CFF05] hover:translate-x-0.5 transition-all duration-200 inline-block" style={{ fontFamily: "var(--font-body)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Links: Contact & Socials */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {f?.contactTitle || "Contact info"}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:hello@bitiumtechnology.com" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors duration-200" style={{ fontFamily: "var(--font-body)" }}>
                  <Mail className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span className="truncate">hello@bitiumtechnology.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+94715520897" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors duration-200" style={{ fontFamily: "var(--font-body)" }}>
                  <Phone className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  +94 71 552 0897 {f?.mobileLabel || "(Mobile)"}
                </a>
              </li>
              <li>
                <a href="https://wa.me/94779731097" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-[#2CFF05] transition-colors duration-200" style={{ fontFamily: "var(--font-body)" }}>
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#2CFF05]" />
                  +94 77 973 1097 {f?.whatsappLabel || "(WhatsApp)"}
                </a>
              </li>
              <li className="flex items-start gap-2 text-xs text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
                <span className="leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                  {f?.address || "1391/1 New Town Digana Rajawella, Digana, Sri Lanka, 20180"}
                </span>
              </li>
            </ul>

            {/* Social Buttons */}
            <div className="flex items-center gap-2.5 mt-3.5 pt-1">
              {[
                { icon: FacebookIcon, label: "Facebook", href: "https://web.facebook.com/bitiumtechnology" },
                { icon: YoutubeIcon, label: "YouTube", href: "http://www.youtube.com/@bitiumtechnology2103" },
                { icon: TiktokIcon, label: "Tiktok", href: "https://www.tiktok.com/@bitiumtechnology" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400" style={{ fontFamily: "var(--font-body)" }}>
            © {new Date().getFullYear()} {f?.rights || "Bitium Technology. All rights reserved."}
          </p>
          
          {/* Animated Agency Logo - Powered By Stack Unleash */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                {f?.poweredBy || "POWERED BY -"}
              </span>
              <a href="https://stackunleash.com" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                {/* Metallic Shine Masked Container */}
                <div className="transition-transform duration-300 group-hover:scale-105 flex-shrink-0 logo-shine-container mr-1.5">
                  <img
                    src="/images/stack-unleash-logo.webp"
                    alt="StackUnleash Icon"
                    className="h-[20px] w-auto object-contain logo-fire-glow"
                  />
                </div>
                
                {/* Text Logo with gradients & sweeps */}
                <div className="flex flex-col items-start justify-center">
                  <div className="flex items-center leading-none">
                    <span
                      className="font-black text-[10px] tracking-wider leading-none orange-gradient-text mr-0.5"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      STACK
                    </span>
                    <span
                      className="font-black text-[10px] tracking-wider leading-none gradient-text"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      UNLEASH
                    </span>
                  </div>
                  {/* Tagline */}
                  <div
                    className="w-full flex justify-between text-[3.5px] font-black uppercase mt-0.5 shine-text"
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

            <div className="flex items-center gap-4 border-l border-white/[0.08] pl-4">
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-[11px] text-slate-400 hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--font-body)" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
