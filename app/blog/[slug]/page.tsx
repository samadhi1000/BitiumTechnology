import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  getBlogPostBySlug, 
  getRelatedBlogPosts, 
  BLOG_POSTS 
} from '@/lib/blogs';
import BlogArticleClient from './BlogArticleClient';

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Dynamic Next.js 16 Metadata Generation ─────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Bitium Technology',
      description: 'The requested blog article could not be located.'
    };
  }

  const articleUrl = `https://www.bitiumtechnology.com/blog/${post.slug}`;

  return {
    title: `${post.metaTitle} | Bitium Technology`,
    description: post.metaDescription,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: articleUrl,
      siteName: 'Bitium Technology',
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.coverAlt,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.coverImage],
    },
  };
}

// ─── Static Parameters for High-Speed SSG ───────────────────────────────────
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.slug, post.category, 3);

  // ── JSON-LD Structured Data Schema for Google Search ──
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.bitiumtechnology.com/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.metaDescription,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bitium Technology',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bitiumtechnology.com/images/bitium-logo.webp',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogArticleClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
