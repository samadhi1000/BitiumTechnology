'use client';

import React from 'react';
import { 
  Target, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Award, 
  Rocket, 
  Globe2, 
  Layers, 
  Cpu, 
  ArrowRight,
  Sparkle,
  Quote,
  Palette,
  Printer,
  Scissors,
  ThumbsUp,
  Tv,
  Truck,
  Video,
  CheckCircle2,
  Users,
  Calendar,
  Building2,
  TrendingUp,
  MessageSquare
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
            "description": "Learn about Bitium Technology, a government-registered creative, printing, and apparel brand partner in Sri Lanka established since 2014.",
            "url": "https://www.bitiumtechnology.com/about",
            "foundingDate": "2014",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Digana",
              "addressCountry": "LK"
            },
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-24">
        
        {/* ── 1. HERO SECTION ── */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 shadow-sm">
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="font-heading font-bold text-[11px] text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">
              {isSinhala ? 'අපගේ කතාව සහ අරමුණ' : 'OUR PURPOSE & HERITAGE'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground font-heading">
            {isSinhala ? (
              <>
                <span className="text-emerald-600 dark:text-emerald-400">බිටියම්</span> ටෙක්නොලොජි ගැන
              </>
            ) : (
              <>
                About <span className="text-emerald-600 dark:text-emerald-400">Bitium</span> Technology
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {isSinhala
              ? '2014 සිට ශ්‍රී ලංකාව පුරා නිර්මාණකරුවන් සහ ව්‍යවසායකයින් සවිබල ගන්වන, රජයේ ලියාපදිංචි පූර්ණ නිර්මාණාත්මක, මුද්‍රණ සහ ඇඟලුම් සන්නාම සහකරු.'
              : 'A government-registered, full-service creative, printing, and apparel brand partner in Sri Lanka—bridging state-of-the-art technology and master craftsmanship since 2014.'}
          </p>
        </div>

        {/* ── 2. OUR JOURNEY SECTION ── */}
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-card/90 via-card/60 to-card/40 border border-border/80 hover:border-emerald-500/40 transition-all duration-300 shadow-2xl backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Story Description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-heading">
                <Calendar size={15} />
                <span>{isSinhala ? 'අපගේ ගමන් මග' : 'Our Story & Evolution'}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-foreground font-heading leading-tight">
                {isSinhala ? (
                  <>අපගේ ගමන් මග: <span className="text-emerald-600 dark:text-emerald-400">2014 සිට</span> ගොඩනැගුණු විශ්වාසය</>
                ) : (
                  <>Our Journey: <span className="text-emerald-600 dark:text-emerald-400">Built on Trust</span> Since 2014</>
                )}
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {isSinhala
                  ? '2014 වසරේදී දිගන ප්‍රදේශයේ කුඩා මුද්‍රණ සහ ඡායා පිටපත් ආයතනයක් ලෙස ආරම්භ වූ බිටියම් ටෙක්නොලොජි (Bitium Technology), වසර 12 කට අධික අඛණ්ඩ කාලයක් තුළ රජයේ ලියාපදිංචි පූර්ණ නිර්මාණාත්මක, මුද්‍රණ හා ඇඟලුම් සන්නාම සහකරුවෙකු දක්වා සාර්ථකව විකාශනය වී ඇත.'
                  : 'Established in 2014 in Digana as a modest print and photocopy shop, Bitium Technology has evolved over 12 years into a government-registered, full-service creative, printing, and apparel brand partner.'}
              </p>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {isSinhala
                  ? 'තනි පුද්ගල ආරම්භක පියවරක සිට දස දෙනෙකුට (10+) අධික දක්ෂ වෘත්තීය කණ්ඩායමක් දක්වා අප ලැබූ වර්ධනය අපගේ කැපවීම, අසීමිත උනන්දුව සහ පාරිභෝගික ඔබ අප කෙරෙහි තැබූ නොසැලෙන විශ්වාසය මනාව පිළිඹිබු කරයි.'
                  : 'From a humble single-person initiative to a dedicated team of over 10 skilled professionals, our growth reflects our passion, hard work, and the continuous trust of our customers.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-background/70 border border-border text-xs font-semibold text-foreground">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{isSinhala ? 'රජයේ ලියාපදිංචි ආයතනයක්' : 'Gov. Registered Enterprise'}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-background/70 border border-border text-xs font-semibold text-foreground">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{isSinhala ? 'දිගන සිට දිවයින පුරා' : 'Originated in Digana'}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-background/70 border border-border text-xs font-semibold text-foreground">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{isSinhala ? 'විශ්වාසනීය පාරිභෝගික සේවය' : 'Customer-Centric Focus'}</span>
                </div>
              </div>
            </div>

            {/* Metric / Milestone Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-background/80 border border-border/80 hover:border-emerald-500/40 transition-colors shadow-lg">
                <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-heading">2014</div>
                <div className="text-xs font-bold text-foreground mt-1">
                  {isSinhala ? 'ආරම්භක වර්ෂය' : 'Established Year'}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {isSinhala ? 'දිගන කුඩා ඇරඹුම' : 'Humble beginnings in Digana'}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-background/80 border border-border/80 hover:border-emerald-500/40 transition-colors shadow-lg">
                <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-heading">12+</div>
                <div className="text-xs font-bold text-foreground mt-1">
                  {isSinhala ? 'වසරක විශිෂ්ටත්වය' : 'Years of Evolution'}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {isSinhala ? 'කර්මාන්ත අත්දැකීම්' : 'Continuous trust & growth'}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-background/80 border border-border/80 hover:border-emerald-500/40 transition-colors shadow-lg">
                <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-heading">10+</div>
                <div className="text-xs font-bold text-foreground mt-1">
                  {isSinhala ? 'දක්ෂ වෘත්තිකයන්' : 'Skilled Professionals'}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {isSinhala ? 'කැපවූ කණ්ඩායම' : 'Dedicated in-house team'}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-background/80 border border-border/80 hover:border-emerald-500/40 transition-colors shadow-lg">
                <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-heading">100%</div>
                <div className="text-xs font-bold text-foreground mt-1">
                  {isSinhala ? 'පූර්ණ විසඳුම්' : 'Full-Service Brand'}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {isSinhala ? 'එකම වහලක් යටින්' : 'Design to production'}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── 3. WHAT WE DO SECTION ── */}
        <div className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase font-heading">
              <Layers size={14} />
              <span>{isSinhala ? 'අපගේ සේවාවන්' : 'Our Capabilities'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground font-heading">
              {isSinhala ? 'අප සිදු කරන්නේ කුමක්ද? (What We Do)' : 'What We Do'}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isSinhala
                ? 'අපි නව්‍ය තාක්ෂණය සහ ශිල්පීය නිර්මාණශීලීත්වය එකම වහලක් යටට ගෙන එන්නෙමු:'
                : 'We bring together innovative technology and artistic craftsmanship under one roof:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Service 1: Graphic Design */}
            <div className="p-8 rounded-3xl bg-card/40 hover:bg-card/70 border border-border/80 hover:border-emerald-500/40 transition-all duration-300 space-y-4 shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Palette size={26} />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase bg-background/60 px-3 py-1 rounded-full border border-border">
                  {isSinhala ? 'නිර්මාණ' : 'Creative Studio'}
                </span>
              </div>

              <h3 className="text-xl font-black text-foreground font-heading group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {isSinhala ? 'ග්‍රැෆික් නිර්මාණ සහ කලා නිර්මාණ' : 'Graphic Design & Artwork'}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {isSinhala
                  ? 'ඔබගේ සන්නාම අවශ්‍යතාවලට සහ වෙළඳපල ප්‍රමිතීන්ට ගැළපෙන පරිදි සකසන ලද ආකර්ෂණීය හා නවීන දෘශ්‍ය නිර්මාණ.'
                  : 'Creative visual designs tailored to your brand needs.'}
              </p>
            </div>

            {/* Service 2: Advanced Printing & DTF */}
            <div className="p-8 rounded-3xl bg-card/40 hover:bg-card/70 border border-border/80 hover:border-emerald-500/40 transition-all duration-300 space-y-4 shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Printer size={26} />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase bg-background/60 px-3 py-1 rounded-full border border-border">
                  {isSinhala ? 'උසස් මුද්‍රණ' : 'Next-Gen Print'}
                </span>
              </div>

              <h3 className="text-xl font-black text-foreground font-heading group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {isSinhala ? 'උසස් මුද්‍රණ සහ DTF තාක්ෂණය' : 'Advanced Printing & DTF Technology'}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {isSinhala
                  ? 'සාමාන්‍ය මුද්‍රණ සහ ඡායා පිටපත් සේවාවල සිට ස්වාධීන ඇඟලුම් සන්නාම සවිබල ගැන්වීම සඳහා වන අති නවීන Direct-to-Film (DTF) ඇඟලුම් මුද්‍රණ තාක්ෂණය.'
                  : 'Standard printing/photocopying alongside cutting-edge Direct-to-Film (DTF) apparel printing designed to support independent clothing brands.'}
              </p>
            </div>

            {/* Service 3: Precision Crafting */}
            <div className="p-8 rounded-3xl bg-card/40 hover:bg-card/70 border border-border/80 hover:border-emerald-500/40 transition-all duration-300 space-y-4 shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Scissors size={26} />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase bg-background/60 px-3 py-1 rounded-full border border-border">
                  {isSinhala ? 'නිරවද්‍ය කැටයම්' : 'Laser & Screen'}
                </span>
              </div>

              <h3 className="text-xl font-black text-foreground font-heading group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {isSinhala ? 'නිරවද්‍ය කැටයම් සහ නිමාවන්' : 'Precision Crafting'}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {isSinhala
                  ? 'අභිරුචි ලේසර් කැපීම් (Custom Laser Cutting), තිර මුද්‍රණ (Screen Printing) සහ අත්පින්තාරු සඳහා වන විශේෂිත ස්ටෙන්සිල් (Specialized Stencils).'
                  : 'Custom laser cutting, screen printing, and specialized stencils for hand painting.'}
              </p>
            </div>

            {/* Service 4: Traditional Arts */}
            <div className="p-8 rounded-3xl bg-card/40 hover:bg-card/70 border border-border/80 hover:border-emerald-500/40 transition-all duration-300 space-y-4 shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Sparkle size={26} />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase bg-background/60 px-3 py-1 rounded-full border border-border">
                  {isSinhala ? 'සාම්ප්‍රදායික කලා' : 'Heritage Craft'}
                </span>
              </div>

              <h3 className="text-xl font-black text-foreground font-heading group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {isSinhala ? 'සාම්ප්‍රදායික කලා ශිල්ප' : 'Traditional Arts'}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {isSinhala
                  ? 'පාරම්පරික තඹ මුද්‍රා තාක්ෂණය සහ නවීන ශිල්පීයත්වය එක් කළ උසස් තත්ත්වයේ කැප් බතික් (Cap Batik) නිර්මාණ සහ නිෂ්පාදනය.'
                  : 'Premium Cap Batik design and production.'}
              </p>
            </div>

          </div>
        </div>

        {/* ── 4. WHY BITIUM TECHNOLOGY SECTION ── */}
        <div className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase font-heading">
              <Award size={14} />
              <span>{isSinhala ? 'අපව සුවිශේෂී වන්නේ ඇයි' : 'Our Competitive Edge'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground font-heading">
              {isSinhala ? (
                <>ඇයි <span className="text-emerald-600 dark:text-emerald-400">බිටියම් ටෙක්නොලොජි?</span></>
              ) : (
                <>Why <span className="text-emerald-600 dark:text-emerald-400">Bitium Technology?</span></>
              )}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isSinhala
                ? 'ශ්‍රී ලංකාවේ ප්‍රමුඛතම සන්නාම සහ ව්‍යවසායකයින් අපව විශ්වාස කිරීමට හේතු මෙන්න:'
                : 'Proven performance, verified quality, and seamless service delivery across Sri Lanka.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: 99% Positive Feedback */}
            <div className="p-8 rounded-3xl bg-card/30 hover:bg-card/60 border border-border/80 hover:border-emerald-500/40 transition-all duration-300 space-y-5 shadow-lg group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <ThumbsUp size={26} />
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
                    99%
                  </div>
                  <h3 className="font-bold text-lg text-foreground font-heading">
                    {isSinhala ? 'ධනාත්මක පාරිභෝගික ප්‍රතිචාර' : 'Positive Customer Feedback'}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isSinhala
                    ? 'අපගේ සුවිශේෂී ගුණාත්මකභාවය සහ සේවා කැපවීම නිසා අපගේ ෆේස්බුක් පිටුව සහ අන්තර්ජාල නාලිකා ඔස්සේ 99% ක විශිෂ්ට ධනාත්මක ප්‍රතිචාරයක් දිනා ගැනීමට අප සමත් වී ඇත.'
                    : 'Our dedication to quality has earned us an outstanding 99% positive feedback score across our Facebook page and online channels.'}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  {isSinhala ? 'සත්‍යාපිත සමාලෝචන' : 'Verified Social Proof'}
                </span>
              </div>
            </div>

            {/* Feature 2: Media Recognition */}
            <div className="p-8 rounded-3xl bg-card/30 hover:bg-card/60 border border-border/80 hover:border-emerald-500/40 transition-all duration-300 space-y-5 shadow-lg group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <Tv size={26} />
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
                    National TV
                  </div>
                  <h3 className="font-bold text-lg text-foreground font-heading">
                    {isSinhala ? 'ජාතික මාධ්‍ය ඇගයීම' : 'Media Recognition'}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isSinhala
                    ? 'අප සපයන සේවාවන්හි උසස් ප්‍රමිතිය, විශ්වාසනීයත්වය සහ සමාජයීය බලපෑම ජාතික රූපවාහිනී වැඩසටහන් ඔස්සේ විශේෂ ඇගයීමට සහ ප්‍රශංසාවට ලක්ව ඇත.'
                    : 'The quality and impact of our services have been featured and recognized on national television programs.'}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Award size={13} />
                  {isSinhala ? 'ජාතික මට්ටමේ පිළිගැනීම' : 'Nationally Highlighted'}
                </span>
              </div>
            </div>

            {/* Feature 3: Online Ordering & Island-Wide Delivery */}
            <div className="p-8 rounded-3xl bg-card/30 hover:bg-card/60 border border-border/80 hover:border-emerald-500/40 transition-all duration-300 space-y-5 shadow-lg group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <Truck size={26} />
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
                    Island-Wide
                  </div>
                  <h3 className="font-bold text-lg text-foreground font-heading">
                    {isSinhala ? 'අන්තර්ජාල ඇණවුම් සහ දිවයින පුරා බෙදාහැරීම' : 'Seamless Online Ordering & Delivery'}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isSinhala
                    ? 'වේගවත්, පහසු සහ විශ්වාසනීය දිවයින පුරා බෙදාහැරීමේ ක්‍රමවේද සමඟින් ශ්‍රී ලංකාවේ ඕනෑම ප්‍රදේශයක සිටින පාරිභෝගිකයින්ට අපි කඩිනම් සේවාවක් සලසන්නෙමු.'
                    : 'We serve customers across Sri Lanka with fast, reliable island-wide delivery options.'}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Globe2 size={13} />
                  {isSinhala ? 'ශ්‍රී ලංකාව පුරා ආවරණය' : 'All 9 Provinces Covered'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ── 5. EMPOWERING BUSINESSES ACROSS SRI LANKA ── */}
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-card/90 via-card/70 to-card/90 border-2 border-emerald-500/30 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-8 text-center sm:text-left">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-full px-4 py-1.5">
                <TrendingUp size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span className="font-heading font-bold text-xs text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                  {isSinhala ? 'ව්‍යවසායක සවිබල ගැන්වීම' : 'CLIENT-FIRST MISSION'}
                </span>
              </div>

              <div className="text-xs text-muted-foreground font-mono">
                #EmpoweringEntrepreneurs
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground font-heading leading-tight">
                {isSinhala ? (
                  <>ශ්‍රී ලංකාව පුරා <span className="text-emerald-600 dark:text-emerald-400">ව්‍යාපාර සවිබල ගැන්වීම</span></>
                ) : (
                  <>Empowering Businesses <span className="text-emerald-600 dark:text-emerald-400">Across Sri Lanka</span></>
                )}
              </h2>

              <div className="p-6 sm:p-8 rounded-2xl bg-background/80 border border-border/80 shadow-inner relative">
                <Quote size={28} className="text-emerald-600/20 dark:text-emerald-400/20 absolute top-4 right-4 pointer-events-none" />
                <p className="text-sm sm:text-base text-foreground/95 leading-relaxed font-medium">
                  {isSinhala ? (
                    '“බිටියම් ටෙක්නොලොජි (Bitium Technology) හි අපගේ අරමුණ අපගේම ආයතනය වර්ධනය කරගැනීමෙන් ඔබ්බට යයි — අපගේ සේවාදායකයින්ගේ ව්‍යාපාර දියුණු කිරීමට සහාය වීමට අපි හදවතින්ම කැපවී සිටිමු. නොමිලේ ව්‍යාපාරික මගපෙන්වීමේ වීඩියෝ (Free Business Guidance Videos), ප්‍රවීණ උපදෙස් සහ උසස් තත්ත්වයේ නිෂ්පාදන සහාය ලබා දෙමින් අපි නව ව්‍යවසායකයින් සහ සුළු පරිමාණ ව්‍යාපාර නිරතුරුව සවිබල ගන්වන්නෙමු. සෑම විටම නිවැරදි විසඳුම්, නිවැරදි ආකාරයෙන්ම ලබා දෙමින් එක්ව ඉදිරියට යාම අපගේ ඒකායන විශ්වාසයයි.”'
                  ) : (
                    '“At Bitium Technology, our goal goes beyond growing our own enterprise—we are deeply committed to helping our clients grow theirs. We actively empower entrepreneurs and small businesses by offering free business guidance videos, expert advice, and high-quality production support. We believe in moving forward together by delivering the right solutions, the right way, every single time.”'
                  )}
                </p>
              </div>
            </div>

            {/* 3 Pillars of Support */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-card/60 border border-border/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Video size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    {isSinhala ? 'නොමිලේ මගපෙන්වීමේ වීඩියෝ' : 'Business Guidance Videos'}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {isSinhala ? 'ව්‍යාපාර දැනුම හා ඉඟි' : 'Free practical tutorials'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card/60 border border-border/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    {isSinhala ? 'විශේෂඥ ව්‍යාපාරික උපදෙස්' : 'Expert Industry Advice'}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {isSinhala ? 'නිවැරදි තීරණ සඳහා මග' : '1-on-1 consultations'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card/60 border border-border/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    {isSinhala ? 'උසස් නිෂ්පාදන සහාය' : 'High-Quality Production'}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {isSinhala ? 'ඉහළම ප්‍රමිතියේ නිමාව' : 'Industrial-grade support'}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── 6. VISION & MISSION SECTION ── */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase font-heading">
              {isSinhala ? 'ප්‍රධාන මූලධර්ම' : 'Guiding Principles'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
              {isSinhala ? 'අපගේ දැක්ම සහ මෙහෙවර' : 'Our Vision & Mission'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* VISION CARD */}
            <div className="relative group rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-card/85 via-card/50 to-card/30 border border-border/80 hover:border-emerald-500/50 transition-all duration-300 shadow-xl backdrop-blur-sm flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-105 transition-transform">
                      <Eye size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {isSinhala ? 'අනාගත දිශානතිය' : 'Future Horizon'}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
                        {isSinhala ? 'දැක්ම (Vision)' : 'Our Vision'}
                      </h3>
                    </div>
                  </div>
                  <Globe2 size={28} className="text-emerald-600/30 dark:text-emerald-400/30 group-hover:text-emerald-600/60 dark:group-hover:text-emerald-400/60 transition-colors" />
                </div>

                <div className="p-6 sm:p-7 rounded-2xl bg-background/65 border border-border/70 relative shadow-inner">
                  <Quote size={24} className="text-emerald-600/25 dark:text-emerald-400/25 absolute top-4 right-4 pointer-events-none" />
                  <p className="text-sm sm:text-[15px] text-foreground/95 font-medium leading-relaxed pr-6">
                    {isSinhala ? (
                      '“දේශීය හා ජාත්‍යන්තර ඇඳුම්, මුද්‍රණ හා නිර්මාණ ක්ෂේත්‍රයේ නවීන තාක්ෂණය, නිර්මාණශීලීත්වය සහ ගුණාත්මකභාවය එකට ගෙන එමින්, සාර්ථක හා ස්වාධීන ව්‍යවසායකයන් බිහිකරන ශ්‍රී ලංකාවේ සහ ලෝකයේ විශ්වාසනීය ප්‍රමුඛතම ආයතනයක් බවට පත්වීම”'
                    ) : (
                      '“To become a trusted global leader in apparel, printing, and creative design solutions by integrating modern technology, innovation, and quality craftsmanship while empowering a successful and independent generation of entrepreneurs.”'
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border/60 grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-background/40 border border-border/50 hover:border-emerald-500/30 transition-colors">
                  <div className="text-[11px] font-bold text-foreground">
                    {isSinhala ? 'ගෝලීය ප්‍රමුඛතාව' : 'Global Leadership'}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {isSinhala ? 'විශ්වාසනීය නායකත්වය' : 'Industry Forefront'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-background/40 border border-border/50 hover:border-emerald-500/30 transition-colors">
                  <div className="text-[11px] font-bold text-foreground">
                    {isSinhala ? 'නවීන තාක්ෂණය' : 'Tech & Innovation'}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {isSinhala ? 'නිර්මාණශීලී විසඳුම්' : 'Modern Craftsmanship'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-background/40 border border-border/50 hover:border-emerald-500/30 transition-colors">
                  <div className="text-[11px] font-bold text-foreground">
                    {isSinhala ? 'ව්‍යවසායක සවිය' : 'Empowered Future'}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {isSinhala ? 'ස්වාධීන පරපුරක්' : 'Independent Creators'}
                  </div>
                </div>
              </div>
            </div>

            {/* MISSION CARD */}
            <div className="relative group rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-card/85 via-card/50 to-card/30 border border-border/80 hover:border-emerald-500/50 transition-all duration-300 shadow-xl backdrop-blur-sm flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-105 transition-transform">
                      <Target size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {isSinhala ? 'ක්‍රියාකාරී මෙහෙයුම' : 'Core Mission'}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
                        {isSinhala ? 'මෙහෙවර (Mission)' : 'Our Mission'}
                      </h3>
                    </div>
                  </div>
                  <Rocket size={28} className="text-emerald-600/30 dark:text-emerald-400/30 group-hover:text-emerald-600/60 dark:group-hover:text-emerald-400/60 transition-colors" />
                </div>

                <div className="p-6 sm:p-7 rounded-2xl bg-background/65 border border-border/70 relative shadow-inner">
                  <Quote size={24} className="text-emerald-600/25 dark:text-emerald-400/25 absolute top-4 right-4 pointer-events-none" />
                  <p className="text-sm sm:text-[15px] text-foreground/95 font-medium leading-relaxed pr-6">
                    {isSinhala ? (
                      '“දැනට ව්‍යාපාරවල නිරත සහ නව ව්‍යාපාර ආරම්භ කිරීමට බලාපොරොත්තු වන ව්‍යවසායකයන්ට උසස් තත්ත්වයේ මුද්‍රණ සේවා, නිර්මාණ විසඳුම්, අමුද්‍රව්‍ය සහ නවීන තාක්ෂණික සහාය එකම වහලක් යටින් සපයමින්, ඔවුන්ගේ ව්‍යාපාරික සිහින යථාර්ථයක් බවට පත් කිරීමට විශ්වාසනීය සහකරුවකු වීම.”'
                    ) : (
                      '“To be a reliable partner for existing and aspiring entrepreneurs by providing high-quality printing services, creative design solutions, raw materials, and innovative technological support under one roof, helping transform business ideas into successful realities.”'
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border/60 grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-background/40 border border-border/50 hover:border-emerald-500/30 transition-colors">
                  <div className="text-[11px] font-bold text-foreground">
                    {isSinhala ? 'එකම වහලක් යටින්' : 'One-Stop Hub'}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {isSinhala ? 'සියලු මුද්‍රණ විසඳුම්' : 'Printing & Materials'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-background/40 border border-border/50 hover:border-emerald-500/30 transition-colors">
                  <div className="text-[11px] font-bold text-foreground">
                    {isSinhala ? 'විශ්වාසනීය සහකරු' : 'Reliable Partner'}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {isSinhala ? 'තාක්ෂණික මගපෙන්වීම' : 'End-to-End Support'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-background/40 border border-border/50 hover:border-emerald-500/30 transition-colors">
                  <div className="text-[11px] font-bold text-foreground">
                    {isSinhala ? 'යථාර්ථයක් වූ සිහින' : 'Realizing Dreams'}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {isSinhala ? 'සාර්ථක ව්‍යාපාරිකයන්' : 'Business Growth'}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── 7. CALL TO ACTION ── */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-card/60 via-card/40 to-card/60 border border-emerald-500/30 text-center space-y-6 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black text-foreground font-heading">
              {isSinhala ? 'ඔබේ ව්‍යාපාරික සිහිනය යථාර්ථයක් කරගන්න සූදානම්ද?' : 'Ready to Bring Your Vision to Life?'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {isSinhala
                ? 'අපගේ අන්තර්ජාල Gang Sheet Builder මෙවලම භාවිතයෙන් දැන්ම ඔබේ නිර්මාණ සකසා ගන්න, නැතහොත් අපගේ කණ්ඩායම අමතා ව්‍යාපාරික මගපෙන්වීම් සහ සහාය ලබාගන්න.'
                : 'Start designing your custom gang sheets online, or connect directly with our expert team for dedicated production and business support.'}
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap pt-2 relative z-10">
            <Link 
              href="/canvas" 
              className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs font-black shadow-lg shadow-emerald-600/25 text-white transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>{isSinhala ? 'Gang Sheet Builder අරඹන්න' : 'Launch Sheet Builder'}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact" 
              className="px-7 py-3.5 rounded-full border border-border bg-background/60 hover:bg-card text-xs font-bold text-foreground transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{isSinhala ? 'සම්බන්ධ වන්න' : 'Contact Our Team'}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
