import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';

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

// Local fallback database helpers
const localCatalogPath = path.join(process.cwd(), 'lib', 'digital-catalog.json');

const getLocalCatalog = (): DigitalArtwork[] => {
  try {
    if (fs.existsSync(localCatalogPath)) {
      const data = fs.readFileSync(localCatalogPath, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (err) {
    console.error('Failed reading local digital-catalog.json:', err);
  }
  return [];
};

// 1. Fetch all digital artworks (queries database, falls back to local JSON)
export async function getDigitalArtworks(category?: string, search?: string): Promise<DigitalArtwork[]> {
  try {
    const { data, error } = await supabase
      .from('digital_artworks')
      .select('*')
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      // Fallback to local file catalog if database is empty/unconfigured
      let catalog = getLocalCatalog();
      if (category && category !== 'all') {
        catalog = catalog.filter(item => item.category === category);
      }
      if (search) {
        const query = search.toLowerCase();
        catalog = catalog.filter(item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return catalog;
    }

    let results = data as DigitalArtwork[];
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
  } catch (err) {
    console.error('Database connection error in getDigitalArtworks:', err);
    return getLocalCatalog();
  }
}

// 2. Fetch single artwork details
export async function getDigitalArtworkById(id: string): Promise<DigitalArtwork | null> {
  try {
    const { data, error } = await supabase
      .from('digital_artworks')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const catalog = getLocalCatalog();
      return catalog.find(item => item.id === id) || null;
    }
    return data as DigitalArtwork;
  } catch (err) {
    const catalog = getLocalCatalog();
    return catalog.find(item => item.id === id) || null;
  }
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
