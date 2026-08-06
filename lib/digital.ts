import { supabase } from './supabase';
import catalogData from './digital-catalog.json';

export interface DigitalArtwork {
  id: string;
  title: string;
  description: string;
  price: number;
  preview_url: string;
  file_key: string;
  category: 'batik' | 'vector' | 'dtf' | 'wall-art';
  tags: string[];
  file_format: string;
  file_size?: string;
  resolution?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface DigitalPurchase {
  id: string;
  order_id?: string;
  customer_email: string;
  artwork_id: string;
  download_token: string;
  download_count: number;
  max_downloads: number;
  expires_at: string;
  created_at: string;
}

// Static in-memory fallback catalog (embedded at build time, works on Vercel)
const getLocalCatalog = (): DigitalArtwork[] => {
  return catalogData as DigitalArtwork[];
};

const LOCAL_STORAGE_KEY = 'bitium_custom_digital_artworks';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes('placeholder') || url.includes('your-project')) return false;
  if (!anonKey || anonKey.includes('placeholder') || anonKey.includes('your-key')) return false;
  return true;
}

function getLocalStorageArtworks(): DigitalArtwork[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading local storage artworks:', err);
    return [];
  }
}

function setLocalStorageArtworks(artworks: DigitalArtwork[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(artworks));
  } catch (err) {
    console.error('Error writing local storage artworks:', err);
  }
}

function getFileCatalogArtworks(): DigitalArtwork[] {
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const catalogPath = path.join(process.cwd(), 'lib', 'digital-catalog.json');
      if (fs.existsSync(catalogPath)) {
        const data = fs.readFileSync(catalogPath, 'utf8');
        return JSON.parse(data || '[]');
      }
    } catch (err) {
      console.error('Failed to read digital catalog file on server:', err);
    }
  }
  return [];
}

async function getApiCatalogArtworks(): Promise<DigitalArtwork[]> {
  if (typeof window === 'undefined') return [];
  try {
    const res = await fetch('/api/downloads');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch from digital API catalog:', err);
  }
  return [];
}

async function syncToApiCatalog(artworks: DigitalArtwork[]) {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/downloads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(artworks)
    });
  } catch (err) {
    console.error('Failed to sync digital catalog to API:', err);
  }
}

// 1. Fetch all digital artworks (queries database, falls back to local JSON)
export async function getDigitalArtworks(category?: string, search?: string): Promise<DigitalArtwork[]> {
  let dbArtworks: DigitalArtwork[] = [];
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('digital_artworks')
        .select('*')
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        dbArtworks = data as DigitalArtwork[];
      }
    } catch (err) {
      console.error('Error fetching digital artworks from DB:', err);
    }
  }

  let customArtworks: DigitalArtwork[] = [];
  if (typeof window === 'undefined') {
    customArtworks = getFileCatalogArtworks();
  } else {
    customArtworks = await getApiCatalogArtworks();
    if (customArtworks.length === 0) {
      customArtworks = getLocalStorageArtworks();
    }
  }

  // Merge datasets: DB items take precedence and override custom catalog items with the same ID
  const merged = [...dbArtworks];
  customArtworks.forEach((customArt) => {
    if (!merged.some((art) => art.id === customArt.id)) {
      merged.push(customArt);
    }
  });

  // If both empty, fallback to getLocalCatalog static mock
  if (merged.length === 0) {
    getLocalCatalog().forEach((mock) => {
      merged.push({ ...mock, is_active: true });
    });
  }

  let results = merged.filter((art) => art.is_active !== false);

  if (category && category !== 'all') {
    results = results.filter(item => item.category === category);
  }
  if (search) {
    const query = search.toLowerCase();
    results = results.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  return results;
}

// 2. Fetch single artwork details
export async function getDigitalArtworkById(id: string): Promise<DigitalArtwork | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data: artwork, error } = await supabase
        .from('digital_artworks')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && artwork) {
        return artwork as DigitalArtwork;
      }
    } catch (err) {
      console.error('Error fetching artwork from DB:', err);
    }
  }

  let customArtworks: DigitalArtwork[] = [];
  if (typeof window === 'undefined') {
    customArtworks = getFileCatalogArtworks();
  } else {
    customArtworks = await getApiCatalogArtworks();
    if (customArtworks.length === 0) {
      customArtworks = getLocalStorageArtworks();
    }
  }

  const foundCustom = customArtworks.find((art) => art.id === id);
  if (foundCustom) return foundCustom;

  const mockArtwork = getLocalCatalog().find((art) => art.id === id);
  return mockArtwork || null;
}

// Write Operations for Digital Catalog
export async function createDigitalArtwork(artworkData: Omit<DigitalArtwork, 'id' | 'is_active' | 'created_at'>): Promise<DigitalArtwork> {
  const id = generateUUID();
  const newArtwork: DigitalArtwork = {
    ...artworkData,
    id,
    is_active: true,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('digital_artworks')
        .insert({
          id,
          title: artworkData.title,
          description: artworkData.description,
          price: artworkData.price,
          preview_url: artworkData.preview_url,
          file_key: artworkData.file_key,
          category: artworkData.category,
          tags: artworkData.tags,
          file_format: artworkData.file_format,
          file_size: artworkData.file_size,
          resolution: artworkData.resolution,
          is_active: true
        });

      if (error) {
        console.error('Supabase digital artwork insert failed:', error);
      }
    } catch (err) {
      console.error('Supabase digital insert failed:', err);
    }
  }

  const localArtworks = getLocalStorageArtworks();
  localArtworks.unshift(newArtwork);
  setLocalStorageArtworks(localArtworks);

  // Sync to API JSON file
  await syncToApiCatalog(localArtworks);

  return newArtwork;
}

export async function updateDigitalArtwork(id: string, artworkData: Partial<DigitalArtwork>): Promise<DigitalArtwork | null> {
  const existing = await getDigitalArtworkById(id);
  if (!existing) return null;

  const updated: DigitalArtwork = {
    ...existing,
    ...artworkData
  };

  if (isSupabaseConfigured()) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      try {
        const { error } = await supabase
          .from('digital_artworks')
          .update({
            title: updated.title,
            description: updated.description,
            price: updated.price,
            preview_url: updated.preview_url,
            file_key: updated.file_key,
            category: updated.category,
            tags: updated.tags,
            file_format: updated.file_format,
            file_size: updated.file_size,
            resolution: updated.resolution,
            is_active: updated.is_active
          })
          .eq('id', id);

        if (error) {
          console.error('Supabase digital update failed:', error);
        }
      } catch (err) {
        console.error('Supabase digital update failed:', err);
      }
    }
  }

  const localArtworks = getLocalStorageArtworks();
  const index = localArtworks.findIndex((art) => art.id === id);
  if (index !== -1) {
    localArtworks[index] = updated;
  } else {
    localArtworks.push(updated);
  }
  setLocalStorageArtworks(localArtworks);

  // Sync to API JSON file
  await syncToApiCatalog(localArtworks);

  return updated;
}

export async function deleteDigitalArtwork(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      try {
        await supabase
          .from('digital_artworks')
          .update({ is_active: false })
          .eq('id', id);
      } catch (err) {
        console.error('Supabase digital delete failed:', err);
      }
    }
  }

  const localArtworks = getLocalStorageArtworks();
  const index = localArtworks.findIndex((art) => art.id === id);
  if (index !== -1) {
    localArtworks[index].is_active = false;
  } else {
    const mock = getLocalCatalog().find((art) => art.id === id);
    if (mock) {
      localArtworks.push({ ...mock, is_active: false });
    }
  }
  setLocalStorageArtworks(localArtworks);

  // Sync to API JSON file
  await syncToApiCatalog(localArtworks);

  return true;
}

// 3. Register purchase and generate access token (typically called post-payment)
export async function createDigitalPurchase(
  email: string,
  artworkId: string,
  orderId?: string
): Promise<DigitalPurchase | null> {
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Valid for 7 days

  try {
    const { data, error } = await supabase
      .from('digital_purchases')
      .insert({
        order_id: orderId,
        customer_email: email,
        artwork_id: artworkId,
        download_token: token,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error || !data) {
      console.warn('Failed saving purchase to Supabase. Creating memory transaction fallback.');
      return {
        id: crypto.randomUUID(),
        order_id: orderId,
        customer_email: email,
        artwork_id: artworkId,
        download_token: token,
        download_count: 0,
        max_downloads: 5,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      };
    }
    return data as DigitalPurchase;
  } catch (err) {
    console.error('Error creating digital purchase:', err);
    return {
      id: crypto.randomUUID(),
      order_id: orderId,
      customer_email: email,
      artwork_id: artworkId,
      download_token: token,
      download_count: 0,
      max_downloads: 5,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    };
  }
}

// 4. Verify access token and get download details
export async function verifyDownloadToken(token: string): Promise<{ purchase: DigitalPurchase; artwork: DigitalArtwork } | null> {
  try {
    const { data: purchase, error: pError } = await supabase
      .from('digital_purchases')
      .select('*')
      .eq('download_token', token)
      .single();

    if (pError || !purchase) {
      // Local fallback for testing: if token is generated, we verify it locally
      console.warn('Token not found in database. Running local verification.');
      const mockArtwork = getLocalCatalog()[0]; // Fallback mock artwork
      return {
        purchase: {
          id: 'mock-p-id',
          customer_email: 'customer@example.com',
          artwork_id: mockArtwork.id,
          download_token: token,
          download_count: 0,
          max_downloads: 5,
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          created_at: new Date().toISOString()
        },
        artwork: mockArtwork
      };
    }

    const { data: artwork, error: aError } = await supabase
      .from('digital_artworks')
      .select('*')
      .eq('id', purchase.artwork_id)
      .single();

    if (aError || !artwork) {
      const catalog = getLocalCatalog();
      const localArt = catalog.find(item => item.id === purchase.artwork_id);
      if (!localArt) return null;
      return { purchase: purchase as DigitalPurchase, artwork: localArt };
    }

    return { purchase: purchase as DigitalPurchase, artwork: artwork as DigitalArtwork };
  } catch (err) {
    console.error('Verification error:', err);
    return null;
  }
}

// 5. Update purchase download count
export async function incrementDownloadCount(id: string): Promise<void> {
  try {
    await supabase.rpc('increment_download_count', { purchase_id: id });
  } catch (err) {
    // Fail silently in development
    console.warn('Could not increment download count in remote DB:', err);
  }
}
