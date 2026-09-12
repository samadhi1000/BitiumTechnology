import { supabase } from './supabase';

/**
 * Uploads a local image File to Supabase Storage ('public-previews' bucket).
 * Follows the exact same storage structure and bucket as Storefront Product images.
 *
 * @param file - The image File selected by the user
 * @param folder - Destination folder within bucket (default: 'community')
 * @returns Public CDN URL of the uploaded image
 */
export async function uploadImageToStorage(
  file: File,
  folder: string = 'community'
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${cleanExt}`;
  const filePath = `${folder}/${fileName}`;

  // 1. Attempt direct client-side Supabase upload
  try {
    const { error } = await supabase.storage
      .from('public-previews')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (!error) {
      const { data } = supabase.storage.from('public-previews').getPublicUrl(filePath);
      if (data?.publicUrl) {
        return data.publicUrl;
      }
    }
  } catch (clientErr) {
    console.warn('[Storage] Client-side upload attempt failed, trying API route fallback:', clientErr);
  }

  // 2. Fallback to server-side API route /api/upload
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      if (result.url) {
        return result.url;
      }
    }
  } catch (apiErr) {
    console.error('[Storage] API route upload fallback failed:', apiErr);
  }

  throw new Error('Image upload failed. Please verify your internet connection or try a smaller image.');
}
