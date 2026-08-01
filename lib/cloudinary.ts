/**
 * lib/cloudinary.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cloudinary Upload Helper for Bitium Technology PrintGrid
 *
 * Usage:
 *   import { uploadCanvasToCloudinary, getCloudinaryThumbnail } from '@/lib/cloudinary';
 *
 *   // 1. Export the canvas to a Data URL
 *   const dataUrl = canvas.toDataURL('image/png');
 *
 *   // 2. Upload to Cloudinary BEFORE dispatching addItem()
 *   const result = await uploadCanvasToCloudinary(dataUrl, 'bitium/mockups');
 *
 *   // 3. Use the permanent CDN URL in cart metadata — never store base64
 *   addItem({ customization: { frontPreviewCloudinaryUrl: result.secureUrl, source: 'mockup_studio' } });
 *
 * Required .env.local keys:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 *
 * ⚠️  The upload preset MUST be set to "Unsigned" in your Cloudinary dashboard:
 *     Settings → Upload → Upload Presets → Mode: Unsigned
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Return type ──────────────────────────────────────────────────────────────

import { validateDataUrl, sanitizeCloudName } from '@/lib/security/sanitize';

// ─── Return type ──────────────────────────────────────────────────────────────

export interface CloudinaryUploadResult {
  /** Cloudinary public ID, e.g. "bitium/mockups/abc123" */
  publicId: string;
  /** Full HTTPS CDN URL — store this in the cart, not the base64 blob */
  secureUrl: string;
  /** Image pixel width */
  width: number;
  /** Image pixel height */
  height: number;
  /** File format returned by Cloudinary, e.g. "png" or "jpg" */
  format: string;
  /** File size in bytes after Cloudinary processing */
  bytes: number;
  /** ISO 8601 creation timestamp */
  createdAt: string;
}

// ─── Upload helper ────────────────────────────────────────────────────────────

/**
 * Uploads an HTML5 Canvas Data URL to Cloudinary via an Unsigned Upload Preset.
 *
 * Why Unsigned?  Signed uploads require a server-side API route to generate a
 * signature, adding a round-trip. For customer-facing mockup previews, unsigned
 * is the right tradeoff — images are public-read CDN assets anyway.
 *
 * @param dataUrl - Output of canvas.toDataURL() — must start with "data:"
 * @param folder  - Cloudinary folder to organise uploads, e.g. 'bitium/mockups'
 *                  or 'bitium/canvas-sheets'. Defaults to 'bitium/uploads'.
 * @returns CloudinaryUploadResult containing the permanent secureUrl
 * @throws Error if env vars are missing, input is invalid, or upload fails
 */
export async function uploadCanvasToCloudinary(
  dataUrl: string,
  folder: string = 'bitium/uploads'
): Promise<CloudinaryUploadResult> {
  // ── Env var guard ──────────────────────────────────────────────────────────
  const rawCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!rawCloudName || !uploadPreset) {
    throw new Error(
      '[Cloudinary] Missing environment variables.\n' +
      'Add these to your .env.local file:\n' +
      '  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name\n' +
      '  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset\n' +
      'The upload preset must be set to "Unsigned" in Cloudinary dashboard.'
    );
  }

  const cloudName = sanitizeCloudName(rawCloudName);

  // ── Input validation (MIME + Size Check) ───────────────────────────────────
  const validation = validateDataUrl(dataUrl);
  if (!validation.valid) {
    throw new Error(`[Cloudinary] Input validation failed: ${validation.error}`);
  }

  // ── Build FormData ─────────────────────────────────────────────────────────
  // Cloudinary accepts base64 Data URIs directly in the "file" field — no
  // manual Blob conversion needed.
  const formData = new FormData();
  formData.append('file', dataUrl);
  formData.append('upload_preset', uploadPreset); // Must be Unsigned preset
  formData.append('folder', folder);
  formData.append('resource_type', 'image');
  // Tags help filter/organize uploads in the Cloudinary Media Library
  formData.append('tags', 'bitium,custom-print,order-preview');

  // ── POST to Cloudinary ─────────────────────────────────────────────────────
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
  } catch (networkError) {
    throw new Error(
      `[Cloudinary] Network error — could not reach Cloudinary. ` +
      `Check your internet connection. Original error: ${String(networkError)}`
    );
  }

  // ── Parse response ─────────────────────────────────────────────────────────
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `[Cloudinary] Upload failed (HTTP ${response.status}). ` +
      `Cloudinary error: ${JSON.stringify(data?.error ?? data)}`
    );
  }

  return {
    publicId: data.public_id as string,
    secureUrl: data.secure_url as string,
    width: data.width as number,
    height: data.height as number,
    format: data.format as string,
    bytes: data.bytes as number,
    createdAt: data.created_at as string,
  };
}

// ─── Thumbnail utility ────────────────────────────────────────────────────────

/**
 * Generates a Cloudinary auto-crop thumbnail URL from an existing CDN URL.
 *
 * Uses c_fill (center-crop) + q_auto (auto quality) + f_auto (WebP/AVIF where
 * supported) to serve the smallest file the browser can handle.
 *
 * Example:
 *   // Original: https://res.cloudinary.com/demo/image/upload/v1/bitium/mockups/abc123.png
 *   // Thumbnail: https://res.cloudinary.com/demo/image/upload/c_fill,w_200,h_200,q_auto,f_auto/v1/bitium/...
 *   const thumb = getCloudinaryThumbnail(result.secureUrl, 200, 200);
 *
 * @param secureUrl - A Cloudinary secure_url from CloudinaryUploadResult
 * @param width     - Thumbnail width in px (default 400)
 * @param height    - Thumbnail height in px (default 400)
 * @returns Transformed CDN URL
 */
export function getCloudinaryThumbnail(
  secureUrl: string,
  width: number = 400,
  height: number = 400
): string {
  if (!secureUrl || !secureUrl.includes('/upload/')) {
    console.warn('[Cloudinary] getCloudinaryThumbnail: not a valid Cloudinary URL:', secureUrl);
    return secureUrl;
  }

  return secureUrl.replace(
    '/upload/',
    `/upload/c_fill,w_${width},h_${height},q_auto,f_auto/`
  );
}
