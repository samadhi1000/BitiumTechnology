/**
 * app/page.tsx - Server Component (no 'use client')
 *
 * This file renders the landing page as a Next.js Server Component so that:
 *  1. The <h1> heading is present in the raw HTML SSR payload (curl / view-source),
 *     which search engine crawlers and SEO audit tools parse immediately.
 *  2. The interactive client-side content (GSAP animations, language context,
 *     state, etc.) is hydrated via <HomePageClient />.
 *
 * SEO audit tools (Ahrefs, Semrush, Screaming Frog, Google Lighthouse) will
 * now detect exactly ONE valid <h1> tag in the server-rendered HTML.
 */

import { Suspense } from 'react';
import HomePageClient from '@/components/HomePageClient';

export default function Home() {
  return (
    <>
      {/*
       * ── SSR H1 TAG ────────────────────────────────────────────────────────────
       * This <h1> is rendered inside the static server HTML payload.
       * It is visually hidden with sr-only so it does not double-render on screen
       * (HomePageClient renders an identical-looking <p aria-hidden> for the visual).
       * However, it is FULLY READABLE by search engine crawlers and screen readers.
       * ─────────────────────────────────────────────────────────────────────────
       */}
      <h1 className="sr-only">
        High-Definition Print Solutions &amp; Equipment - Bitium Technology
      </h1>

      {/* Client-side interactive content */}
      <Suspense
        fallback={
          <div className="w-full min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CFF05]" />
          </div>
        }
      >
        <HomePageClient />
      </Suspense>
    </>
  );
}
