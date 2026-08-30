import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.payhere.lk https://sandbox.payhere.lk;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com https://*.supabase.co https://*.r2.dev https://*.cloudflarestorage.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.cloudinary.com https://*.supabase.co wss://*.supabase.co https://www.payhere.lk https://sandbox.payhere.lk https://*.r2.dev https://*.cloudflarestorage.com;
  frame-src 'self' https://www.payhere.lk https://sandbox.payhere.lk;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://wa.me https://www.payhere.lk https://sandbox.payhere.lk;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();


const nextConfig: NextConfig = {
  images: {
    // Disable Vercel image optimizer entirely — images are served directly from
    // Cloudinary / Cloudflare CDN which handle their own optimized delivery.
    // This eliminates image-related "Fast Origin Transfer" consumption on Vercel.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
