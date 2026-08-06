import { NextResponse } from 'next/server';
import { getDigitalArtworks } from '@/lib/digital';
import fs from 'fs';
import path from 'path';
import catalogData from '@/lib/digital-catalog.json';

const catalogPath = path.join(process.cwd(), 'lib', 'digital-catalog.json');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const artworks = await getDigitalArtworks(category, search);
    return NextResponse.json(artworks);
  } catch (err: any) {
    console.error('Error fetching digital artworks catalog:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const artworks = await request.json();
    
    // Bypassed in production (read-only environment)
    if (process.env.NODE_ENV !== 'production') {
      fs.writeFileSync(catalogPath, JSON.stringify(artworks, null, 2), 'utf8');
      console.log('Successfully synced digital catalog changes to lib/digital-catalog.json');
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error writing digital-catalog.json:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
