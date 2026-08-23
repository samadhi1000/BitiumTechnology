import React from 'react';
import { Metadata } from 'next';
import FlipbookIndex from '@/components/FlipbookViewer';

export const metadata: Metadata = {
  title: 'Interactive Product Catalog | Bitium Technology',
  description: 'Flip through our premium realistic digital catalog. Explore screen-printing samples, laser-cutting profiles, DTF-transfers, and artwork portfolios.',
  openGraph: {
    title: 'Interactive Product & Print Catalog | Bitium Technology',
    description: 'An ultra-realistic 3D digital book experience of our premium printing services.',
  }
};

export default function ProductCatalogPage() {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-foreground flex flex-col relative">
      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Interactive Product & Print Catalog | Bitium Technology",
            "description": "Browse our 120-page premium printed sample book featuring stencils, screen printing, DTF transfers, and laser cuts.",
            "url": "https://www.bitiumtechnology.com/product-catalog"
          })
        }}
      />

      {/* Decorative top border glow */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#2CFF05]/30 to-transparent" />

      {/* Main content area */}
      <div className="flex-grow w-full flex flex-col items-center justify-center relative">
        <FlipbookIndex pdfUrl="/api/catalog/signed-url" />
      </div>
    </div>
  );
}
