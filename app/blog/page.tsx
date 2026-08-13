'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Calendar, 
  Clock, 
  Tag, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Flame,
  Layers,
  Filter
} from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '@/lib/blogs';

const categories = [
  'All Articles',
  'Screen Printing',
  'Batik Craft',
  'Laser Cutting',
  'DTF Printing',
  'Stencils & Fabric'
];

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered list
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchCategory =
        selectedCategory === 'All Articles' || post.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#2CFF05]/30 selection:text-[#0a0a0a] pb-24">
      
      {/* ── JSON-LD Structured Data ────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Bitium Technology Printing & Craft Knowledge Hub',
            description: 'Industry insights, master guides, and technical tutorials on DTF printing, screen printing, custom stencils, batik stamps, and precision laser cutting.',
            url: 'https://www.bitiumtechnology.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Bitium Technology',
              logo: 'https://www.bitiumtechnology.com/images/bitium-logo.webp'
            },
            blogPost: BLOG_POSTS.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              description: p.metaDescription,
              url: `https://www.bitiumtechnology.com/blog/${p.slug}`,
              datePublished: p.publishedAt,
              author: {
                '@type': 'Person',
                name: p.author.name
              }
            }))
          })
        }}
      />

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 border-b border-border overflow-hidden bg-gradient-to-b from-card/40 via-background to-background">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* Ambient neon backdrop glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2CFF05]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2CFF05]/10 border border-[#2CFF05]/30 text-lime-400 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles size={13} className="text-[#2CFF05]" />
            <span>Official Knowledge Hub & Insights</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground">
            Printing & Craft <span className="text-[#2CFF05] drop-shadow-[0_0_20px_rgba(141,255,0,0.3)]">Mastery</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            In-depth guides, trade secrets, and technical tutorials on custom DTF transfers, laser cutting, traditional batik stamping, screen exposure, and fabric stencils.
          </p>

          {/* Search Bar in Hero */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search articles, guides, mesh counts, DTF hacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-card/60 backdrop-blur-md text-sm text-foreground placeholder-zinc-500 focus:outline-none focus:border-[#2CFF05] focus:ring-2 focus:ring-[#2CFF05]/20 transition-all shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg bg-muted"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Container ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* ── Featured Article Spotlight (Only shown on "All Articles" without active search) */}
        {selectedCategory === 'All Articles' && !searchQuery && featuredPost && (
          <div className="relative rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl overflow-hidden hover:border-[#2CFF05]/40 transition-all duration-300 shadow-2xl group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Featured Image */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 w-full overflow-hidden bg-background">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.coverAlt}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-background" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-[#2CFF05] text-[#0a0a0a] text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <Flame size={13} /> Featured Post
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              {/* Featured Details */}
              <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-[#2CFF05]" />
                    {featuredPost.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-[#2CFF05]" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <Link href={`/blog/${featuredPost.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground hover:text-[#2CFF05] transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                {/* Author row */}
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-primary/50">
                      <Image src={featuredPost.author.avatar} alt={featuredPost.author.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-muted-foreground">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2CFF05] hover:bg-[#45ff24] text-[#0a0a0a] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-[#2CFF05]/10"
                  >
                    Read Article
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── Category Filter Pills ──────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mr-2 flex items-center gap-1.5">
              <Filter size={13} /> Topics:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = cat === 'All Articles' 
                ? BLOG_POSTS.length 
                : BLOG_POSTS.filter((p) => p.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#2CFF05] text-[#0a0a0a] shadow-lg shadow-[#2CFF05]/20 scale-105'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-black ${
                    isSelected ? 'bg-black text-[#2CFF05]' : 'bg-muted text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground font-medium">
            Showing <strong className="text-foreground">{filteredPosts.length}</strong> of {BLOG_POSTS.length} articles
          </p>
        </div>

        {/* ── Articles Grid ──────────────────────────────────────────────── */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-bold text-foreground">No articles match your search</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any articles matching "{searchQuery}". Try selecting another category or clear the search.
            </p>
            <button
              onClick={() => { setSelectedCategory('All Articles'); setSearchQuery(''); }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#2CFF05] text-[#0a0a0a] text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group rounded-3xl border border-border bg-card/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#2CFF05]/50 hover:shadow-2xl hover:shadow-[#2CFF05]/5 hover:-translate-y-1"
              >
                <div>
                  {/* Article Card Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-background">
                    <Image
                      src={post.coverImage}
                      alt={post.coverAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-border text-[10px] font-extrabold uppercase tracking-wider text-[#2CFF05]">
                      {post.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/10 text-[10px] font-medium text-white flex items-center gap-1">
                      <Clock size={11} className="text-[#2CFF05]" />
                      {post.readTime}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                      <Calendar size={12} className="text-[#2CFF05]" />
                      <span>{post.publishedAt}</span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-lg font-black text-foreground group-hover:text-[#2CFF05] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Tag chips */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {post.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 rounded-md bg-background border border-border text-muted-foreground flex items-center gap-1">
                          <Tag size={8} /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer link row */}
                <div className="p-6 pt-0 border-t border-border/40 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-primary/50">
                      <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                    </div>
                    <span className="text-[11px] font-bold text-foreground truncate max-w-[120px]">{post.author.name}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-extrabold text-[#2CFF05] group-hover:text-lime-300 flex items-center gap-1 transition-all group-hover:translate-x-1"
                  >
                    Read More &rarr;
                  </Link>
                </div>

              </article>
            ))}
          </div>
        )}

        {/* ── Newsletter / Technical Advisory Banner ─────────────────────── */}
        <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-[#2CFF05]/5 to-card p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#2CFF05]/10 border border-[#2CFF05]/30 text-[#2CFF05] flex items-center justify-center mx-auto">
            <BookOpen size={24} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
            Need Expert Printing Guidance for Your Project?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Whether you are launching a streetwear brand, preparing saree borders, or need CNC laser profiles, Bitium Technology offers 1-on-1 technical advisory.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-[#2CFF05] hover:bg-[#45ff24] text-[#0a0a0a] text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#2CFF05]/15"
            >
              Talk to a Print Specialist
            </Link>
            <Link
              href="/canvas"
              className="px-6 py-3.5 rounded-xl bg-card hover:bg-muted border border-border text-foreground text-xs font-bold uppercase tracking-wider transition-all"
            >
              Launch DTF Canvas Builder
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
