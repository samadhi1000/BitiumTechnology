'use client';

import React from 'react';
import { Layers, Shield, Heart, Award, Sparkles, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* AboutPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Bitium Technology",
            "description": "Learn about Bitium Technology, a premium custom printing studio specializing in DTF transfers, stencils, and custom apparel printing in Sri Lanka.",
            "url": "https://www.bitiumtechnology.com/about",
            "publisher": {
              "@type": "LocalBusiness",
              "name": "Bitium Technology",
              "telephone": "+94779731097",
              "email": "info@bitium.lk"
            }
          })
        }}
      />

      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2CFF05]/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2CFF05]/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#2CFF05]/10 border border-[#2CFF05]/25 rounded-full px-3.5 py-1.5 mb-2">
            <Sparkles size={12} className="text-[#2CFF05]" />
            <span className="font-heading font-semibold text-[11px] text-[#2CFF05] tracking-wider uppercase">OUR STORY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
            About <span className="text-[#2CFF05]">Bitium</span> Technology
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Redefining professional custom printing with cutting-edge technology, precision laser crafting, and custom gang sheet builders.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#2CFF05] font-heading">Our Journey</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Established with a vision to make high-performance apparel customization accessible to everyone, Bitium Technology has grown from a local printing workshop in Sri Lanka to a leading tech-driven print studio.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We recognized the friction creators faced when designing custom apparel: complex software requirements, setup fee barriers, high minimum order limits, and long turnaround times. By building our own virtual gang sheet canvas builder and 3D mockup tools, we eliminated those hurdles. Today, we empower design studios, clothing brands, and DIY hobbyists alike.
            </p>
          </div>
          
          <div className="p-8 rounded-3xl border border-border bg-card/35 backdrop-blur space-y-6">
            <div className="flex items-center gap-3">
              <Award className="text-[#2CFF05] shrink-0" size={24} />
              <h3 className="font-bold text-lg text-foreground font-heading">Our Quality Standard</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We never cut corners. Our stencils are crafted using high-grade, laser-cut Mylar. Our screen exposed files are chemically balanced for sharp positive outcomes. And our DTF (Direct-to-Film) transfers use premium, high-stretch elastic inks and hot melt adhesives that ensure unmatched color vibrancy and crack-proof durability on all fabrics.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-background/50 rounded-xl border border-border/60">
                <div className="text-[#2CFF05] font-bold text-lg">24h</div>
                <div className="text-[10px] text-muted-foreground">Standard Turnaround</div>
              </div>
              <div className="p-3 bg-background/50 rounded-xl border border-border/60">
                <div className="text-[#2CFF05] font-bold text-lg">0 Min</div>
                <div className="text-[10px] text-muted-foreground">No Minimum Orders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Work Ethic & Values */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground font-heading">Our Values & Ethic</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card/20 rounded-2xl border border-border hover:border-[#2CFF05]/40 transition-colors space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#2CFF05]/10 flex items-center justify-center text-[#2CFF05]">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-base text-foreground font-heading">Reliability First</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Whether you need a single stencil or thousands of DTF prints, we deliver accurate prints, exact measurements, and consistent colors, every single time.
              </p>
            </div>

            <div className="p-6 bg-card/20 rounded-2xl border border-border hover:border-[#2CFF05]/40 transition-colors space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#2CFF05]/10 flex items-center justify-center text-[#2CFF05]">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-base text-foreground font-heading">Continuous Innovation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We actively incorporate state-of-the-art software customizers and industrial printer upgrades to make your design-to-print workflow seamless.
              </p>
            </div>

            <div className="p-6 bg-card/20 rounded-2xl border border-border hover:border-[#2CFF05]/40 transition-colors space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#2CFF05]/10 flex items-center justify-center text-[#2CFF05]">
                <Heart size={20} />
              </div>
              <h3 className="font-bold text-base text-foreground font-heading">Artisan Respect</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We preserve traditional methods (like Cap Batik copper stamps) while empowering modern digital artists, treating both with premium craftsmanship.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-card/20 border border-border text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">Ready to see our work in action?</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Start building your custom gang sheets online with our dynamic canvas editor, or customize stencils directly in our Catalog.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-2">
            <Link href="/canvas" className="px-6 py-3 rounded-full bg-[#2CFF05] hover:bg-[#45ff24] text-xs font-black shadow-lg shadow-[#2CFF05]/20 text-[#0a0a0a] transition-all">
              Launch Sheet Builder
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-full border border-border bg-transparent hover:bg-card text-xs font-bold text-foreground transition-all">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
