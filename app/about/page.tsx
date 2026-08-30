'use client';

import React from 'react';
import { 
  Target, 
  Eye, 
  Sparkles, 
  Shield, 
  Heart, 
  Award, 
  Rocket, 
  Globe2, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Sparkle
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function AboutPage() {
  const { isSinhala } = useLanguage();

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

      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2CFF05]/10 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#2CFF05]/10 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2CFF05]/10 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-20">
        
        {/* ── HERO SECTION ── */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#2CFF05]/10 border border-[#2CFF05]/25 rounded-full px-4 py-1.5 shadow-sm">
            <Sparkles size={13} className="text-[#2CFF05] animate-pulse" />
            <span className="font-heading font-semibold text-[11px] text-[#2CFF05] tracking-wider uppercase">
              {isSinhala ? 'අපගේ කතාව සහ අරමුණ' : 'OUR PURPOSE & STORY'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground font-heading">
            {isSinhala ? (
              <>
                <span className="text-[#2CFF05]">බිටියම්</span> ටෙක්නොලොජි ගැන
              </>
            ) : (
              <>
                About <span className="text-[#2CFF05]">Bitium</span> Technology
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {isSinhala
              ? 'නවීන තාක්ෂණය, නිරවද්‍ය ලේසර් නිමාව සහ නව්‍ය මුද්‍රණ විසඳුම් සමඟින් ශ්‍රී ලාංකේය හා ගෝලීය ව්‍යවසායකයින්ගේ සිහින යථාර්ථයක් කරන විශ්වාසනීය සහකරු.'
              : 'Redefining professional apparel customization and custom printing with cutting-edge DTF technology, precision laser engineering, and turnkey solutions for creators.'}
          </p>
        </div>

        {/* ── INDUSTRY-STANDARD VISION & MISSION CARDS ── */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-[#2CFF05] tracking-widest uppercase font-heading">
              {isSinhala ? 'ප්‍රධාන මූලධර්ම' : 'Guiding Principles'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
              {isSinhala ? 'අපගේ දැක්ම සහ මෙහෙවර' : 'Our Vision & Mission'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* ── VISION CARD ── */}
            <div className="relative group rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-card/80 to-card/30 border border-border/80 hover:border-[#2CFF05]/50 transition-all duration-300 shadow-xl backdrop-blur-sm flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2CFF05]/10 rounded-full blur-3xl group-hover:bg-[#2CFF05]/20 transition-all duration-500 pointer-events-none" />
              
              <div className="space-y-6">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#2CFF05]/10 border border-[#2CFF05]/30 flex items-center justify-center text-[#2CFF05] shadow-inner group-hover:scale-105 transition-transform">
                      <Eye size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2CFF05]">
                        {isSinhala ? 'අනාගත දිශානතිය' : 'Future Horizon'}
                      </span>
                      <h3 className="text-2xl font-black text-foreground font-heading flex items-center gap-2">
                        Vision <span className="text-muted-foreground font-normal text-lg">| දැක්ම</span>
                      </h3>
                    </div>
                  </div>
                  <Globe2 size={28} className="text-[#2CFF05]/30 group-hover:text-[#2CFF05]/60 transition-colors" />
                </div>

                {/* Vision Sinhala Statement */}
                <div className="p-5 rounded-2xl bg-background/60 border border-border/60 relative">
                  <span className="text-xs font-semibold text-[#2CFF05] uppercase tracking-wider block mb-2">
                    සිංහල මාධ්‍යයෙන්
                  </span>
                  <p className="text-sm sm:text-base text-foreground/90 font-medium leading-relaxed">
                    &ldquo;දේශීය හා ජාත්‍යන්තර ඇඳුම්, මුද්‍රණ හා නිර්මාණ ක්ෂේත්‍රයේ නවීන තාක්ෂණය, නිර්මාණශීලීත්වය සහ ගුණාත්මකභාවය එකට ගෙන එමින්, සාර්ථක හා ස්වාධීන ව්‍යවසායකයන් බිහිකරන ශ්‍රී ලංකාවේ සහ ලෝකයේ විශ්වාසනීය ප්‍රමුඛතම ආයතනයක් බවට පත්වීම&rdquo;
                  </p>
                </div>

                {/* Vision English Statement */}
                <div className="p-5 rounded-2xl bg-background/40 border border-border/40">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                    English Translation
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;To become a trusted global leader in apparel, printing, and creative design solutions by integrating modern technology, innovation, and quality craftsmanship while empowering a successful and independent generation of entrepreneurs.&rdquo;
                  </p>
                </div>
              </div>

              {/* Vision Pillars */}
              <div className="pt-6 mt-6 border-t border-border/60 grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-background/30 border border-border/40">
                  <div className="text-[11px] font-bold text-foreground">Global Leadership</div>
                  <div className="text-[9px] text-[#2CFF05] mt-0.5">ප්‍රමුඛතම ආයතනය</div>
                </div>
                <div className="p-2.5 rounded-xl bg-background/30 border border-border/40">
                  <div className="text-[11px] font-bold text-foreground">Tech & Innovation</div>
                  <div className="text-[9px] text-[#2CFF05] mt-0.5">නවීන තාක්ෂණය</div>
                </div>
                <div className="p-2.5 rounded-xl bg-background/30 border border-border/40">
                  <div className="text-[11px] font-bold text-foreground">Empowered Future</div>
                  <div className="text-[9px] text-[#2CFF05] mt-0.5">ස්වාධීන ව්‍යවසායකයින්</div>
                </div>
              </div>
            </div>

            {/* ── MISSION CARD ── */}
            <div className="relative group rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-card/80 to-card/30 border border-border/80 hover:border-[#2CFF05]/50 transition-all duration-300 shadow-xl backdrop-blur-sm flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2CFF05]/10 rounded-full blur-3xl group-hover:bg-[#2CFF05]/20 transition-all duration-500 pointer-events-none" />
              
              <div className="space-y-6">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#2CFF05]/10 border border-[#2CFF05]/30 flex items-center justify-center text-[#2CFF05] shadow-inner group-hover:scale-105 transition-transform">
                      <Target size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2CFF05]">
                        {isSinhala ? 'ක්‍රියාකාරී මෙහෙයුම' : 'Core Mission'}
                      </span>
                      <h3 className="text-2xl font-black text-foreground font-heading flex items-center gap-2">
                        Mission <span className="text-muted-foreground font-normal text-lg">| මෙහෙවර</span>
                      </h3>
                    </div>
                  </div>
                  <Rocket size={28} className="text-[#2CFF05]/30 group-hover:text-[#2CFF05]/60 transition-colors" />
                </div>

                {/* Mission Sinhala Statement */}
                <div className="p-5 rounded-2xl bg-background/60 border border-border/60 relative">
                  <span className="text-xs font-semibold text-[#2CFF05] uppercase tracking-wider block mb-2">
                    සිංහල මාධ්‍යයෙන්
                  </span>
                  <p className="text-sm sm:text-base text-foreground/90 font-medium leading-relaxed">
                    &ldquo;දැනට ව්‍යාපාරවල නිරත සහ නව ව්‍යාපාර ආරම්භ කිරීමට බලාපොරොත්තු වන ව්‍යවසායකයන්ට උසස් තත්ත්වයේ මුද්‍රණ සේවා, නිර්මාණ විසඳුම්, අමුද්‍රව්‍ය සහ නවීන තාක්ෂණික සහාය එකම වහලක් යටින් සපයමින්, ඔවුන්ගේ ව්‍යාපාරික සිහින යථාර්ථයක් බවට පත් කිරීමට විශ්වාසනීය සහකරුවකු වීම.&rdquo;
                  </p>
                </div>

                {/* Mission English Statement */}
                <div className="p-5 rounded-2xl bg-background/40 border border-border/40">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                    English Translation
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;To be a reliable partner for existing and aspiring entrepreneurs by providing high-quality printing services, creative design solutions, raw materials, and innovative technological support under one roof, helping transform business ideas into successful realities.&rdquo;
                  </p>
                </div>
              </div>

              {/* Mission Pillars */}
              <div className="pt-6 mt-6 border-t border-border/60 grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-background/30 border border-border/40">
                  <div className="text-[11px] font-bold text-foreground">One-Stop Solution</div>
                  <div className="text-[9px] text-[#2CFF05] mt-0.5">එකම වහලක් යටින්</div>
                </div>
                <div className="p-2.5 rounded-xl bg-background/30 border border-border/40">
                  <div className="text-[11px] font-bold text-foreground">Reliable Partner</div>
                  <div className="text-[9px] text-[#2CFF05] mt-0.5">විශ්වාසනීය සහකරු</div>
                </div>
                <div className="p-2.5 rounded-xl bg-background/30 border border-border/40">
                  <div className="text-[11px] font-bold text-foreground">Real Results</div>
                  <div className="text-[9px] text-[#2CFF05] mt-0.5">යථාර්ථයක් වූ සිහින</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── OUR JOURNEY & QUALITY STANDARD ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-6">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2CFF05] uppercase tracking-wider font-heading">
              <Sparkle size={14} />
              {isSinhala ? 'අපගේ ගමන් මග' : 'Our Story & Heritage'}
            </div>
            <h2 className="text-3xl font-black text-foreground font-heading">
              {isSinhala ? 'සුළු පරිමාණයේ සිට කර්මාන්ත ප්‍රමුඛතාව දක්වා' : 'Empowering Creators with Tech-Driven Precision'}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isSinhala
                ? 'ශ්‍රී ලංකාවේ ඇඟලුම් හා මුද්‍රණ ක්ෂේත්‍රයේ නිර්මාණකරුවන්ට සහ ව්‍යවසායකයින්ට උසස් ප්‍රමිතියෙන් යුත් සේවාවන් පහසුවෙන් ලබාදීමේ දැක්මෙන් ඇරඹි බිටියම් ටෙක්නොලොජි, අද වන විට නවීන ඩිජිටල් තාක්ෂණය පෙරදැරි කරගත් ප්‍රමුඛ පෙළේ ආයතනයක් බවට පත්ව ඇත.'
                : 'Established with a vision to make high-performance apparel customization accessible to everyone, Bitium Technology has grown from a specialized printing workshop in Sri Lanka to a leading tech-driven print studio.'}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isSinhala
                ? 'අධික වියදම්, දිගු කාලීන ප්‍රමාදයන් සහ තාක්ෂණික බාධක ඉවත් කරමින්, අපගේම අන්තර්ජාල Gang Sheet Builder සහ 3D Mockup මෙවලම් හරහා කුඩා මෙන්ම මහා පරිමාණ ව්‍යාපාරිකයන්ටද පහසුවෙන් සිය නිර්මාණ එළිදැක්වීමට අපි මග සලසන්නෙමු.'
                : 'We recognized the friction creators faced: complex software requirements, setup fee barriers, high minimum order limits, and long turnaround times. By developing our proprietary virtual gang sheet builder and automated tools, we eliminated those hurdles for clothing brands and makers.'}
            </p>
          </div>
          
          <div className="p-8 rounded-3xl border border-border bg-card/40 backdrop-blur-md space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#2CFF05]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2CFF05]/10 text-[#2CFF05]">
                <Award size={24} />
              </div>
              <h3 className="font-bold text-lg text-foreground font-heading">
                {isSinhala ? 'අපගේ ගුණාත්මක ප්‍රමිතිය' : 'Our Quality Standard'}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isSinhala
                ? 'අපගේ සියලුම DTF මුද්‍රණ, ලේසර් ස්ටෙන්සිල් සහ තිර මුද්‍රණ උපාංග නිෂ්පාදනය කෙරෙන්නේ ඉහළම තත්ත්වයේ අමුද්‍රව්‍ය හා නවීන යන්ත්‍රෝපකරණ යොදාගනිමිනි. වර්ණවල දීප්තිමත්භාවය, ඇදෙන සුළු බව සහ දිගුකල් පැවැත්ම අපි සහතික කරමු.'
                : 'We never compromise on standards. Our stencils use high-grade laser-cut Mylar, screen positive films are chemically balanced, and our DTF transfers employ premium high-stretch elastic inks with industrial hot-melt adhesives for cracked-proof durability.'}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-background/60 rounded-2xl border border-border/70">
                <div className="text-[#2CFF05] font-black text-2xl font-heading">24h</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {isSinhala ? 'වේගවත් නිමාව' : 'Express Turnaround'}
                </div>
              </div>
              <div className="p-4 bg-background/60 rounded-2xl border border-border/70">
                <div className="text-[#2CFF05] font-black text-2xl font-heading">0 Min</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {isSinhala ? 'අවම ඇණවුම් සීමා නැත' : 'No Minimum Order Limits'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CORE VALUES & ETHICS ── */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-[#2CFF05] tracking-widest uppercase font-heading">
              {isSinhala ? 'අපව වෙනස් කරන්නේ කුමක්ද' : 'What Drives Us'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
              {isSinhala ? 'අපගේ මූලික වටිනාකම්' : 'Our Values & Ethics'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card/25 hover:bg-card/45 rounded-3xl border border-border hover:border-[#2CFF05]/40 transition-all space-y-4 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-[#2CFF05]/10 flex items-center justify-center text-[#2CFF05] group-hover:scale-105 transition-transform">
                <Shield size={22} />
              </div>
              <h3 className="font-bold text-base text-foreground font-heading">
                {isSinhala ? 'විශ්වාසනීයත්වය (Reliability First)' : 'Reliability First'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isSinhala
                  ? 'තනි මුද්‍රණයක සිට මහා පරිමාණ ඇණවුම් දක්වා, සෑම විටම නියමිත මිමි, නිවැරදි වර්ණ සහ ඉහළ ප්‍රමිතියෙන් යුතු නිමාවක් අපි ලබා දෙන්නෙමු.'
                  : 'Whether you need a single stencil or thousands of DTF prints, we deliver accurate dimensions, vivid colors, and consistent quality every single time.'}
              </p>
            </div>

            <div className="p-6 bg-card/25 hover:bg-card/45 rounded-3xl border border-border hover:border-[#2CFF05]/40 transition-all space-y-4 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-[#2CFF05]/10 flex items-center justify-center text-[#2CFF05] group-hover:scale-105 transition-transform">
                <Cpu size={22} />
              </div>
              <h3 className="font-bold text-base text-foreground font-heading">
                {isSinhala ? 'නිරන්තර නවෝත්පාදනය' : 'Continuous Innovation'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isSinhala
                  ? 'නවීන මුද්‍රණ යන්ත්‍ර, ඩිජිටල් මෘදුකාංග සහ ස්වයංක්‍රීය මෙවලම් භාවිතයෙන් පාරිභෝගික ඔබට වඩාත් පහසු සහ වේගවත් සේවාවක් ලබාදීමට නිරතුරුව කටයුතු කරමු.'
                  : 'We constantly integrate state-of-the-art customizers and industrial print upgrades to streamline your design-to-print workflow seamlessly.'}
              </p>
            </div>

            <div className="p-6 bg-card/25 hover:bg-card/45 rounded-3xl border border-border hover:border-[#2CFF05]/40 transition-all space-y-4 shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-[#2CFF05]/10 flex items-center justify-center text-[#2CFF05] group-hover:scale-105 transition-transform">
                <Heart size={22} />
              </div>
              <h3 className="font-bold text-base text-foreground font-heading">
                {isSinhala ? 'ශිල්පීය ගෞරවය (Artisan Respect)' : 'Artisan Respect'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isSinhala
                  ? 'පාරම්පරික බතික් තඹ මුද්‍රා වැනි සාම්ප්‍රදායික කලා ශිල්පයන් සුරකිමින්, නවීන ඩිජිටල් නිර්මාණකරුවන්ද ඉහළම ගුණාත්මකභාවයකින් සවිබල ගන්වන්නෙමු.'
                  : 'We preserve traditional textile crafts like Cap Batik copper blocks while empowering modern digital artists with equal dedication.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── CALL TO ACTION ── */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-card/60 via-card/40 to-card/60 border border-[#2CFF05]/20 text-center space-y-6 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[#2CFF05]/5 pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
            {isSinhala ? 'ඔබේ ව්‍යාපාරික සිහිනය යථාර්ථයක් කරගන්න සූදානම්ද?' : 'Ready to Bring Your Print Ideas to Life?'}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {isSinhala
              ? 'අපගේ අන්තර්ජාල Gang Sheet Builder මෙවලම භාවිතයෙන් දැන්ම ඔබේ නිර්මාණ සකසා ගන්න, නැතහොත් අපගේ කණ්ඩායම අමතා සහාය ලබාගන්න.'
              : 'Start building custom gang sheets online with our dynamic canvas editor, or talk with our team for personalized industrial support.'}
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-2 relative z-10">
            <Link 
              href="/canvas" 
              className="px-6 py-3 rounded-full bg-[#2CFF05] hover:bg-[#45ff24] text-xs font-black shadow-lg shadow-[#2CFF05]/20 text-[#0a0a0a] transition-all flex items-center gap-2 group"
            >
              <span>{isSinhala ? 'Gang Sheet Builder අරඹන්න' : 'Launch Sheet Builder'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-3 rounded-full border border-border bg-background/50 hover:bg-card text-xs font-bold text-foreground transition-all"
            >
              {isSinhala ? 'සම්බන්ධ වන්න' : 'Get in Touch'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
