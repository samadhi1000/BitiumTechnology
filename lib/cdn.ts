/**
 * lib/cdn.ts
 *
 * Utility for constructing Cloudflare CDN-prefixed asset URLs.
 *
 * Usage:
 *   import { cdnUrl } from '@/lib/cdn';
 *   const src = cdnUrl('images/hero.webp');
 *   // -> "https://cdn.bitiumtechnology.com/images/hero.webp"  (when CDN is set)
 *   // -> "images/hero.webp"  (fallback when NEXT_PUBLIC_CLOUDFLARE_CDN_URL is not set)
 */

const CDN_BASE = process.env.NEXT_PUBLIC_CLOUDFLARE_CDN_URL ?? '';

/**
 * Prepends the Cloudflare CDN base URL to the given asset path.
 * - If the path is already an absolute URL (starts with http/https), it is returned as-is.
 * - If NEXT_PUBLIC_CLOUDFLARE_CDN_URL is not set, the original path is returned unchanged.
 */
export function cdnUrl(path: string): string {
  if (!CDN_BASE || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }
  // Normalise: ensure no double slashes between base and path
  const normalizedPath = path.replace(/^\/+/, '');
  return `${CDN_BASE.replace(/\/+$/, '')}/${normalizedPath}`;
}

export default cdnUrl;
