'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Check, 
  Copy, 
  Tag, 
  BookOpen, 
  Sparkles, 
  ChevronRight,
  Bookmark,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { BlogPost } from '@/lib/blogs';

export default function BlogArticleClient({
  post,
  relatedPosts
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
}) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // ── Scroll Progress & Active TOC Tracker ──────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Track active heading
      const headings = post.tableOfContents.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 180;

      for (let i = headings.length - 1; i >= 0; i--) {
        const h = headings[i];
        if (h && h.offsetTop <= scrollPos) {
          setActiveSection(post.tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post.tableOfContents]);

  const copyArticleLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareOnWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Read this expert guide: "${post.title}" on Bitium Technology\n`);
      window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
    }
  };

  const shareOnFacebook = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
  };

  const shareOnTwitter = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(post.title);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  // ── Simple Markdown / Structure Parser ────────────────────────────────────
  const renderFormattedContent = (raw: string) => {
    const lines = raw.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = (key: string) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={key} className="space-y-2.5 my-5 pl-2 list-none">
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CFF05] shrink-0 mt-2.5" />
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Check for bullet items
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const itemText = trimmed.replace(/^[\*\-•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-bold">$1</strong>');
        currentList.push(itemText);
        return;
      } else {
        flushList(`list-${idx}`);
      }

      // Check for headings
      if (trimmed.startsWith('### ')) {
        const titleMatch = trimmed.replace('### ', '');
        const idMatch = titleMatch.match(/\{#(.*?)\}$/);
        const headingId = idMatch ? idMatch[1] : `heading-${idx}`;
        const headingText = titleMatch.replace(/\{#(.*?)\}$/, '').trim();

        elements.push(
          <h3
            key={`h3-${idx}`}
            id={headingId}
            className="text-xl sm:text-2xl font-black text-foreground tracking-tight pt-8 pb-2 border-b border-border/40 scroll-mt-28 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#2CFF05]" />
            {headingText}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${idx}`} className="text-2xl sm:text-3xl font-black text-foreground tracking-tight pt-10 pb-3 scroll-mt-28">
            {trimmed.replace('## ', '')}
          </h2>
        );
        return;
      }

      if (trimmed === '---') {
        elements.push(<hr key={`hr-${idx}`} className="border-border/60 my-8" />);
        return;
      }

      if (trimmed.length > 0) {
        const formatted = trimmed
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-extrabold">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic text-foreground">$1</em>')
          .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-lime-400">$1</code>');

        elements.push(
          <p
            key={`p-${idx}`}
            className="text-sm sm:text-base text-muted-foreground leading-relaxed my-4"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      }
    });

    flushList('list-end');
    return elements;
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#2CFF05]/30 selection:text-[#0a0a0a] pb-24">
      
      {/* ── Viewport Reading Progress Bar ───────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border/40 z-50">
        <div 
          className="h-full bg-gradient-to-r from-lime-500 via-[#2CFF05] to-emerald-400 transition-all duration-150 shadow-[0_0_10px_rgba(141,255,0,0.8)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* ── Top Breadcrumbs & Back ───────────────────────────────────────── */}
      <div className="border-b border-border/80 bg-card/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-foreground font-bold truncate max-w-[200px] sm:max-w-[320px]">
              {post.title}
            </span>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-400 hover:text-lime-300 transition-colors"
          >
            <ArrowLeft size={13} /> Back to All Articles
          </Link>
        </div>
      </div>

      {/* ── Article Header ───────────────────────────────────────────────── */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 space-y-6">
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#2CFF05]/15 border border-[#2CFF05]/30 text-lime-400 text-xs font-extrabold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Calendar size={13} className="text-[#2CFF05]" />
            Published on {post.publishedAt}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Clock size={13} className="text-[#2CFF05]" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>

        {/* Author & Share strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/60">
          
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-primary/50 shadow-md">
              <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.author.role}</p>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-bold mr-1 flex items-center gap-1">
              <Share2 size={13} /> Share:
            </span>
            <button
              onClick={shareOnWhatsApp}
              className="p-2 rounded-xl bg-card border border-border hover:border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
              title="Share on WhatsApp"
            >
              <MessageCircle size={15} />
            </button>
            <button
              onClick={shareOnFacebook}
              className="p-2 rounded-xl bg-card border border-border hover:border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer text-xs font-bold px-2.5"
              title="Share on Facebook"
            >
              f
            </button>
            <button
              onClick={shareOnTwitter}
              className="p-2 rounded-xl bg-card border border-border hover:border-sky-500/50 text-sky-400 hover:bg-sky-500/10 transition-all cursor-pointer text-xs font-bold px-2.5"
              title="Share on X / Twitter"
            >
              𝕏
            </button>
            <button
              onClick={copyArticleLink}
              className="p-2 rounded-xl bg-card border border-border hover:border-[#2CFF05]/50 text-foreground hover:bg-muted transition-all cursor-pointer flex items-center gap-1 text-xs font-bold px-3"
              title="Copy Link"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

        </div>

      </header>

      {/* ── Hero Cover Image ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-2.5 italic">
          Alt tag - {post.coverAlt}
        </p>
      </div>

      {/* ── Article Body + Sticky Sidebar Layout ─────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article Content Column */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Executive Summary Callout Box */}
            <div className="p-5 sm:p-6 rounded-2xl border border-lime-500/30 bg-gradient-to-br from-lime-500/10 via-card to-card space-y-2.5 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-lime-400">
                <Sparkles size={16} />
                <span>Executive Summary & Quick Takeaways</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Rendered Prose Content */}
            <div className="prose prose-invert max-w-none">
              {renderFormattedContent(post.content)}
            </div>

            {/* Tags section */}
            <div className="pt-8 border-t border-border/80 space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                Related Tags & Keywords
              </span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-card border border-border text-xs font-semibold text-muted-foreground flex items-center gap-1.5 hover:border-[#2CFF05]/40 transition-colors"
                  >
                    <Tag size={10} className="text-[#2CFF05]" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Contextual Service Call To Action Box */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#2CFF05]/40 bg-gradient-to-r from-card via-[#2CFF05]/10 to-card space-y-4 shadow-xl mt-10">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#2CFF05]">
                <Bookmark size={16} />
                <span>Official Bitium Technology Service</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                {post.relatedService.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {post.relatedService.description}
              </p>
              <Link
                href={post.relatedService.linkUrl}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2CFF05] hover:bg-[#45ff24] text-[#0a0a0a] text-xs font-black uppercase tracking-wider shadow-lg shadow-[#2CFF05]/15 transition-all"
              >
                {post.relatedService.linkText}
                <ExternalLink size={13} />
              </Link>
            </div>

          </main>

          {/* Sticky Right Sidebar (Table of Contents & Quick Contact) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Table of Contents */}
            <div className="sticky top-24 p-6 rounded-3xl border border-border bg-card/60 backdrop-blur-md space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-foreground pb-2 border-b border-border/60">
                <BookOpen size={15} className="text-[#2CFF05]" />
                <span>Table of Contents</span>
              </div>

              <nav className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
                {post.tableOfContents.map((item, idx) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block py-1.5 px-3 rounded-xl text-xs transition-all leading-snug ${
                        isActive
                          ? 'bg-[#2CFF05]/15 text-[#2CFF05] font-bold border border-[#2CFF05]/30 translate-x-1'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-60 mr-1.5">0{idx + 1}.</span>
                      {item.title}
                    </a>
                  );
                })}
              </nav>

              {/* Need Custom Work Box */}
              <div className="pt-4 border-t border-border/60 text-xs space-y-2">
                <p className="font-bold text-foreground">Have Questions?</p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Speak directly with our technical team via WhatsApp for instant inquiries.
                </p>
                <a
                  href="https://wa.me/94779731097"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <MessageCircle size={14} />
                  WhatsApp Direct Inquiry
                </a>
              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* ── Related Articles Section ─────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-border/80 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">
                Related Articles & Guides
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Continue learning with more guides in {post.category}.
              </p>
            </div>
            <Link
              href="/blog"
              className="text-xs font-bold text-[#2CFF05] hover:underline flex items-center gap-1"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                href={`/blog/${rel.slug}`}
                className="group rounded-2xl border border-border bg-card/40 overflow-hidden flex flex-col justify-between hover:border-[#2CFF05]/40 transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-background">
                  <Image
                    src={rel.coverImage}
                    alt={rel.coverAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-border text-[9px] font-bold text-[#2CFF05]">
                    {rel.category}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-foreground group-hover:text-[#2CFF05] transition-colors line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {rel.excerpt}
                  </p>
                  <p className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1 font-medium">
                    <Clock size={10} className="text-[#2CFF05]" /> {rel.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
