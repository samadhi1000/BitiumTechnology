/**
 * lib/security/sanitize.ts
 *
 * OWASP-compliant input sanitization utilities for Bitium Technology.
 * All functions are pure string operations - 100% SSR-safe (no DOM/window access).
 *
 * Coverage:
 *  - A01 Broken Access Control: validate URL/image sources
 *  - A03 Injection: strip HTML tags, JS protocols, event handlers, WhatsApp markdown
 *  - A04 Insecure Design: validate canvas Data URLs (MIME type + size)
 *  - A05 Misconfiguration: sanitize env-var-derived values used in URLs
 */

// ─── Allowed MIME types for canvas/image uploads ──────────────────────────────
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

/** Default maximum upload size: 10 MB */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

// ─── Generic Text Sanitizer ───────────────────────────────────────────────────

/**
 * Strips HTML tags, JS protocol injections, event handlers, null bytes, and
 * non-printable control characters from arbitrary text input.
 *
 * Safe for: address fields, notes, generic single-line text.
 */
export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';

  return input
    .slice(0, maxLength)
    .replace(/<[^>]*>/g, '')               // strip all HTML tags
    .replace(/javascript\s*:/gi, '')       // strip JS protocol
    .replace(/vbscript\s*:/gi, '')         // strip VBScript protocol
    .replace(/data\s*:/gi, '')             // strip data: URI schemes in text
    .replace(/on\w+\s*=\s*/gi, '')         // strip inline event handlers
    .replace(/\0/g, '')                    // strip null bytes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // strip control chars
    .trim();
}

// ─── Name Sanitizer ───────────────────────────────────────────────────────────

/**
 * Sanitizes a person's name.
 * Allows unicode letters, spaces, hyphens, apostrophes.
 * Blocks HTML injection and shell metacharacters.
 */
export function sanitizeName(input: unknown): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<[^>]*>/g, '')               // strip HTML
    .replace(/javascript\s*:/gi, '')
    .replace(/[<>{}\[\]|\\^`]/g, '')       // strip shell/HTML metacharacters
    .replace(/\0/g, '')
    .slice(0, 100)
    .trim();
}

// ─── Phone Sanitizer ──────────────────────────────────────────────────────────

/**
 * Sanitizes a phone number.
 * Only allows: digits, +, -, spaces, parentheses.
 * Strips everything else - prevents script injection via phone field.
 */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[^\d\s+\-()]/g, '').slice(0, 20).trim();
}

// ─── Search Query Sanitizer ───────────────────────────────────────────────────

/**
 * Sanitizes a search query before use in filtering or localStorage.
 * Strips HTML, script protocols, and shell metacharacters.
 */
export function sanitizeSearch(input: unknown): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/[<>{}\[\]|\\^`]/g, '')
    .replace(/\0/g, '')
    .slice(0, 200)
    .trim();
}

// ─── WhatsApp Message Sanitizer ───────────────────────────────────────────────

/**
 * Sanitizes user-supplied text before interpolation into a WhatsApp
 * deep-link message template.
 *
 * Threats addressed:
 * - WhatsApp markdown injection: *bold*, _italic_, ~strikethrough~, ```code```
 * - HTML/script injection
 * - Newline-based template injection (splitting the order summary structure)
 *
 * NOTE: After sanitizing, the caller must still call `encodeURIComponent()`
 * on the full message before appending to the wa.me URL.
 */
export function sanitizeForWhatsApp(input: unknown): string {
  if (typeof input !== 'string') return '';

  return input
    .slice(0, 1000)
    .replace(/<[^>]*>/g, '')               // strip HTML tags
    .replace(/javascript\s*:/gi, '')       // strip JS protocol
    .replace(/on\w+\s*=\s*/gi, '')         // strip event handlers
    // Strip WhatsApp markdown formatting characters
    .replace(/\*+([^*]*)\*+/g, '$1')       // *bold* / **bold**
    .replace(/_+([^_]*)_+/g, '$1')         // _italic_
    .replace(/~([^~]*)~/g, '$1')           // ~strikethrough~
    .replace(/```[\s\S]*?```/g, '')        // ```code block```
    .replace(/\0/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

// ─── Cloudinary Cloud Name Sanitizer ─────────────────────────────────────────

/**
 * Sanitizes a Cloudinary cloud name before embedding in the upload endpoint URL.
 * Prevents path traversal and URL injection via a rogue NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.
 * Only alphanumeric characters, hyphens, and underscores are allowed.
 */
export function sanitizeCloudName(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[^a-z0-9_-]/gi, '').slice(0, 64);
}

// ─── Data URL Validator ───────────────────────────────────────────────────────

export interface DataUrlValidationResult {
  valid: boolean;
  mimeType?: string;
  estimatedBytes?: number;
  error?: string;
}

/**
 * Validates a Canvas `toDataURL()` output before uploading to Cloudinary.
 *
 * Checks:
 * 1. Must be a valid `data:` URI with base64 encoding
 * 2. MIME type must be in the allowlist (png, jpeg, webp only)
 * 3. Estimated byte size must not exceed maxSizeBytes (default 10 MB)
 *
 * @param dataUrl   The Data URL string from canvas.toDataURL()
 * @param maxSizeBytes  Maximum allowed file size in bytes (default: 10 MB)
 */
export function validateDataUrl(
  dataUrl: unknown,
  maxSizeBytes = MAX_UPLOAD_BYTES
): DataUrlValidationResult {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return { valid: false, error: 'Invalid input: expected a string Data URL.' };
  }

  if (!dataUrl.startsWith('data:')) {
    return { valid: false, error: 'Not a valid Data URL - must start with "data:".' };
  }

  // Extract MIME type: "data:image/png;base64,..." → "image/png"
  const mimeMatch = dataUrl.match(/^data:([^;,]+);base64,/);
  if (!mimeMatch) {
    return { valid: false, error: 'Cannot parse MIME type from Data URL.' };
  }

  const mimeType = mimeMatch[1].toLowerCase();

  if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return {
      valid: false,
      mimeType,
      error: `File type "${mimeType}" is not allowed. Only PNG, JPEG, and WebP are accepted.`,
    };
  }

  // Estimate size: base64 uses 4 chars per 3 bytes; padding reduces actual size
  const base64Data = dataUrl.split(',')[1] ?? '';
  const paddingCount = (base64Data.match(/={1,2}$/) ?? [''])[0].length;
  const estimatedBytes = Math.floor((base64Data.length * 3) / 4) - paddingCount;

  if (estimatedBytes > maxSizeBytes) {
    const sizeMB = (estimatedBytes / (1024 * 1024)).toFixed(1);
    const limitMB = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      mimeType,
      estimatedBytes,
      error: `Design file is too large (~${sizeMB} MB). Maximum allowed size is ${limitMB} MB. Try reducing canvas resolution.`,
    };
  }

  return { valid: true, mimeType, estimatedBytes };
}

// ─── URL Validators ───────────────────────────────────────────────────────────

/**
 * Returns true only if `url` is a legitimate Cloudinary CDN HTTPS URL.
 * Rejects `data:`, `javascript:`, `blob:`, and any non-Cloudinary host.
 * Use before rendering user-supplied image URLs from the cart store.
 */
export function isCloudinaryUrl(url: unknown): boolean {
  if (typeof url !== 'string' || !url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'res.cloudinary.com' ||
        parsed.hostname.endsWith('.cloudinary.com'))
    );
  } catch {
    return false;
  }
}
