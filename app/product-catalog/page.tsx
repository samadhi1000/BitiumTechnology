import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import FlipbookIndex from '@/components/FlipbookViewer';

export const metadata: Metadata = {
  title: 'Interactive Product Catalog | Bitium Technology',
  description: 'Flip through our premium realistic digital catalog. Explore screen-printing samples, laser-cutting profiles, DTF-transfers, and artwork portfolios.',
  openGraph: {
    title: 'Interactive Product & Print Catalog | Bitium Technology',
    description: 'An ultra-realistic 3D digital book experience of our premium printing services.',
  }
};

const TRACING_FILE = 'Tracing Catlog.pdf';
const STENCIL_FILE = 'Stencil Catlog New pdf CUSTOMER File with water mark.pdf';

export default async function ProductCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const isStencil = params?.type === 'stencil';
  const currentFile = isStencil ? STENCIL_FILE : TRACING_FILE;
  
  // Use the PDF proxy route — Vercel server fetches from R2, browser never touches R2 directly
  // This completely avoids CORS issues with Cloudflare R2
  const apiUrl = `/api/catalog/pdf?type=${isStencil ? 'stencil' : 'tracing'}`;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-foreground flex flex-col relative pb-10">
      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Interactive Product & Print Catalog | Bitium Technology",
            "description": "Browse our premium printed sample books featuring stencils, screen printing, DTF transfers, and laser cuts.",
            "url": "https://www.bitiumtechnology.com/product-catalog"
          })
        }}
      />

      {/* Decorative top border glow */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#2CFF05]/30 to-transparent" />

      {/* Catalog Switcher Tabs */}
      <div className="w-full flex justify-center pt-8 pb-2 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-md p-1.5 rounded-full border border-slate-800 flex gap-2 shadow-xl">
          <Link 
            href="/product-catalog?type=tracing"
            scroll={false}
            className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${!isStencil ? 'bg-[#2CFF05] text-slate-950 shadow-[0_0_20px_rgba(44,255,5,0.4)]' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}
          >
            TRACING CATALOG
          </Link>
          <Link 
            href="/product-catalog?type=stencil"
            scroll={false}
            className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${isStencil ? 'bg-[#2CFF05] text-slate-950 shadow-[0_0_20px_rgba(44,255,5,0.4)]' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}
          >
            STENCIL CATALOG
          </Link>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-grow w-full flex flex-col items-center justify-center relative">
        {/* No key prop — component stays mounted when switching catalogs so the PDF cache works */}
        <FlipbookIndex pdfUrl={apiUrl} />
      </div>
    </div>
  );
}
